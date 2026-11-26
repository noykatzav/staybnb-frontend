import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { createServer } from 'vite'

const demoUsers = JSON.parse(await readFile(new URL('../src/data/demo-users.json', import.meta.url)))

async function loadLocalUserService(initialUsers) {
    const values = new Map()
    const session = new Map()
    if (initialUsers) values.set('user', JSON.stringify(initialUsers))

    globalThis.localStorage = {
        getItem: key => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value),
    }
    globalThis.sessionStorage = {
        getItem: key => session.get(key) ?? null,
        setItem: (key, value) => session.set(key, value),
        removeItem: key => session.delete(key),
    }
    globalThis.window = {}

    const vite = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })
    const { userService } = await vite.ssrLoadModule('/src/services/user/user.service.local.js')
    return { userService, values, session, vite }
}

test('seeds demo users and checks credentials without exposing passwords', async () => {
    const { userService, values, session, vite } = await loadLocalUserService()
    const hostUsername = demoUsers.find(user => user._id === 'u103').username
    try {
        assert.equal(demoUsers.length, 7)
        assert.equal(new Set(demoUsers.map(user => user._id)).size, demoUsers.length)
        const publicUsers = await userService.getUsers()
        assert.deepEqual(publicUsers.map(user => user._id), demoUsers.map(user => user._id))
        assert.ok(publicUsers.every(user => !('password' in user)))
        assert.deepEqual(JSON.parse(values.get('user')), demoUsers)
        assert.ok(!('password' in await userService.getById('u103')))

        await assert.rejects(userService.login({ username: hostUsername, password: 'wrong' }), /Invalid username or password/)
        assert.equal(session.has('loggedinUser'), false)

        const loggedinUser = await userService.login({ username: hostUsername, password: '123456' })
        assert.equal(loggedinUser._id, 'u103')
        assert.equal(loggedinUser.isHost, true)
        assert.ok(!('password' in loggedinUser))
        assert.deepEqual(JSON.parse(session.get('loggedinUser')), loggedinUser)

        await assert.rejects(userService.signup({ username: hostUsername, password: 'different', fullname: 'Duplicate' }), /Username already exists/)
        const signedUpUser = await userService.signup({ username: 'newguest', password: 'new-password', fullname: 'New Guest' })
        assert.equal(signedUpUser.isHost, false)
        assert.ok(!('password' in signedUpUser))
    } finally {
        await vite.close()
    }
})

test('preserves users already stored locally', async () => {
    const existingUsers = [{ _id: 'custom', username: 'custom', password: 'secret', fullname: 'Saved User', isHost: false }]
    const { userService, values, vite } = await loadLocalUserService(existingUsers)
    try {
        assert.deepEqual(await userService.getUsers(), [{ _id: 'custom', username: 'custom', fullname: 'Saved User', isHost: false }])
        assert.deepEqual(JSON.parse(values.get('user')), existingUsers)
    } finally {
        await vite.close()
    }
})
