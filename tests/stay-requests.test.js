import assert from 'node:assert/strict'
import { after, before, describe, it } from 'node:test'
import { createServer } from 'vite'

describe('stay requests', () => {
    let vite
    let stayService
    let httpService
    let loadStays
    let store
    let originalQuery
    let originalGet
    let originalStorage
    let originalSession
    let originalWindow

    before(async () => {
        originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
        originalSession = Object.getOwnPropertyDescriptor(globalThis, 'sessionStorage')
        originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
        globalThis.localStorage = { getItem: () => '[]', setItem: () => {} }
        globalThis.sessionStorage = { getItem: () => null, setItem: () => {} }
        globalThis.window = {}
        vite = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })
        stayService = (await vite.ssrLoadModule('/src/services/stay/index.js')).stayService
        httpService = (await vite.ssrLoadModule('/src/services/http.service.js')).httpService
        loadStays = (await vite.ssrLoadModule('/src/store/actions/stay.actions.js')).loadStays
        store = (await vite.ssrLoadModule('/src/store/store.js')).store
        originalQuery = stayService.query
        originalGet = httpService.get
    })

    after(async () => {
        stayService.query = originalQuery
        httpService.get = originalGet
        await vite?.close()
        if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage)
        else delete globalThis.localStorage
        if (originalSession) Object.defineProperty(globalThis, 'sessionStorage', originalSession)
        else delete globalThis.sessionStorage
        if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow)
        else delete globalThis.window
    })

    it('forwards filters to the remote GET request', async () => {
        const filterBy = { destination: 'Paris', adults: 2 }
        httpService.get = (endpoint, params) => ({ endpoint, params })
        const remoteService = (await vite.ssrLoadModule('/src/services/stay/stay.service.remote.js')).stayService

        assert.deepEqual(await remoteService.query(filterBy), { endpoint: 'stay', params: filterBy })
    })

    it('keeps the newest results when an older request finishes last', async () => {
        let resolveParis
        let resolveLondon
        stayService.query = ({ destination }) => new Promise(resolve => {
            if (destination === 'Paris') resolveParis = resolve
            else resolveLondon = resolve
        })

        const parisRequest = loadStays({ destination: 'Paris' })
        const londonRequest = loadStays({ destination: 'London' })
        resolveLondon([{ _id: 'london' }])
        await londonRequest
        resolveParis([{ _id: 'paris' }])
        await parisRequest

        assert.deepEqual(store.getState().stayModule.stays, [{ _id: 'london' }])
    })

})
