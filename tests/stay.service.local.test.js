import assert from 'node:assert/strict'
import { after, before, describe, it } from 'node:test'
import { createServer } from 'vite'

const stays = [
    { _id: 'a', loc: { city: 'Lisbon', country: 'Portugal' }, capacity: 3, amenities: ['Pets allowed'], blockedDates: [{ checkIn: '2026-12-10', checkOut: '2026-12-12' }] },
    { _id: 'b', loc: { city: 'Porto', country: 'Portugal' }, capacity: 2, amenities: [], blockedDates: [] },
    { _id: 'c', loc: { city: 'Lisbon', country: 'Portugal' }, capacity: 5, amenities: ['Pets allowed'] },
    { _id: 'd', loc: { city: 'Lisbon', country: 'Portugal' }, amenities: [] },
]

describe('local stay query', () => {
    let vite
    let stayService
    let originalStorage
    let originalWindow

    before(async () => {
        originalStorage = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
        originalWindow = Object.getOwnPropertyDescriptor(globalThis, 'window')
        globalThis.localStorage = {
            getItem: () => JSON.stringify(stays),
            setItem: () => {},
        }
        globalThis.window = {}
        vite = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })
        const serviceModule = await vite.ssrLoadModule('/src/services/stay/stay.service.local.js')
        stayService = serviceModule.stayService
    })

    after(async () => {
        await vite?.close()
        if (originalStorage) Object.defineProperty(globalThis, 'localStorage', originalStorage)
        else delete globalThis.localStorage
        if (originalWindow) Object.defineProperty(globalThis, 'window', originalWindow)
        else delete globalThis.window
    })

    it('returns all stays when no filter is given', async () => {
        assert.deepEqual((await stayService.query()).map(stay => stay._id), ['a', 'b', 'c', 'd'])
    })

    it('matches destination, capacity, and pets', async () => {
        assert.deepEqual((await stayService.query({ destination: 'lIs', adults: 2, children: 1, pets: 1 })).map(stay => stay._id), ['a', 'c'])
        assert.deepEqual((await stayService.query({ destination: 'portugal', adults: 0, children: 0, pets: 0 })).map(stay => stay._id), ['a', 'b', 'c', 'd'])
        assert.deepEqual((await stayService.query({ destination: '', adults: 1, children: 0, pets: 0 })).map(stay => stay._id), ['a', 'b', 'c'])
    })

    it('excludes blocked dates', async () => {
        assert.deepEqual((await stayService.query({ checkIn: '2026-12-12', checkOut: '2026-12-13' })).map(stay => stay._id), ['b', 'c', 'd'])
        assert.deepEqual((await stayService.query({ checkIn: '2026-12-13', checkOut: '2026-12-14' })).map(stay => stay._id), ['a', 'b', 'c', 'd'])
    })
})
