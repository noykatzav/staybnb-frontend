import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, it } from 'node:test'
import { storageService } from '../src/services/async-storage.service.js'

describe('local storage service', () => {
    let originalStorage

    beforeEach(() => {
        originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
        const data = new Map()
        Object.defineProperty(globalThis, 'localStorage', {
            configurable: true,
            value: {
                getItem(key) { return data.get(key) ?? null },
                setItem(key, value) { data.set(key, String(value)) },
            },
        })
    })

    afterEach(() => {
        if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage)
        else delete globalThis.localStorage
    })

    it('returns an empty list for an unused entity type', async () => {
        assert.deepEqual(await storageService.query('stay', 0), [])
    })

    it('persists a new entity with an id and retrieves it', async () => {
        const savedStay = await storageService.post('stay', { name: 'Beach house', price: 120 })
        assert.equal(typeof savedStay._id, 'string')
        assert.ok(savedStay._id.length > 0)
        assert.deepEqual(await storageService.get('stay', savedStay._id), savedStay)
        assert.deepEqual(await storageService.query('stay', 0), [savedStay])
    })

    it('merges an update and preserves other records and unspecified fields', async () => {
        globalThis.localStorage.setItem('stay', JSON.stringify([
            { _id: 'a', name: 'Beach house', price: 120 },
            { _id: 'b', name: 'Cabin', price: 90 },
        ]))
        const savedStay = await storageService.put('stay', { _id: 'a', price: 150 })
        assert.deepEqual(savedStay, { _id: 'a', name: 'Beach house', price: 150 })
        assert.deepEqual(await storageService.query('stay', 0), [
            savedStay, { _id: 'b', name: 'Cabin', price: 90 },
        ])
    })

    it('removes only the requested record and keeps entity types separate', async () => {
        globalThis.localStorage.setItem('stay', JSON.stringify([{ _id: 'a' }, { _id: 'b' }]))
        globalThis.localStorage.setItem('review', JSON.stringify([{ _id: 'a', txt: 'Great' }]))
        await storageService.remove('stay', 'a')
        assert.deepEqual(await storageService.query('stay', 0), [{ _id: 'b' }])
        assert.deepEqual(await storageService.query('review', 0), [{ _id: 'a', txt: 'Great' }])
    })

    for (const method of ['get', 'put', 'remove']) {
        it(`${method} rejects a missing id without changing saved data`, async () => {
            const stays = [{ _id: 'a', name: 'Cabin' }]
            globalThis.localStorage.setItem('stay', JSON.stringify(stays))
            const argument = method === 'put' ? { _id: 'missing', name: 'Changed' } : 'missing'
            await assert.rejects(storageService[method]('stay', argument), /cannot find entity with id: missing/)
            assert.deepEqual(await storageService.query('stay', 0), stays)
        })
    }
})
