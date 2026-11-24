import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { createServer } from 'vite'

const demoStays = JSON.parse(await readFile(new URL('../src/data/demo-stays.json', import.meta.url)))

async function loadLocalStayService(initialStays) {
    const values = new Map()
    if (initialStays) values.set('stay', JSON.stringify(initialStays))

    globalThis.localStorage = {
        getItem: key => values.get(key) ?? null,
        setItem: (key, value) => values.set(key, value),
    }
    globalThis.window = {}

    const vite = await createServer({ configFile: false, server: { middlewareMode: true }, appType: 'custom', logLevel: 'silent' })
    const { stayService } = await vite.ssrLoadModule('/src/services/stay/stay.service.local.js')
    return { stayService, values, vite }
}

test('seeds the complete stays from JSON when storage is empty', async () => {
    const { stayService, values, vite } = await loadLocalStayService()
    try {
        assert.equal(demoStays.length, 100)
        assert.equal(new Set(demoStays.map(stay => stay._id)).size, demoStays.length)
        assert.equal(new Set(demoStays.map(stay => stay.name)).size, demoStays.length)
        assert.ok(demoStays.every(stay =>
            stay._id && stay.name && stay.type && Array.isArray(stay.imgUrls)
            && stay.host && stay.loc && Array.isArray(stay.amenities)
            && Array.isArray(stay.highlights) && Array.isArray(stay.reviews)))
        assert.ok(demoStays.every(stay => stay.blockedDates.length > 0
            && stay.blockedDates.every((range, idx) => range.checkIn < range.checkOut
                && (!idx || stay.blockedDates[idx - 1].checkOut < range.checkIn))))
        assert.ok(demoStays.some(stay => stay.blockedDates.length >= 8))
        assert.deepEqual(await stayService.getById(demoStays[0]._id), demoStays[0])
        assert.deepEqual(JSON.parse(values.get('stay')), demoStays)
        const { checkIn, checkOut } = demoStays[0].blockedDates[0]
        const availableStays = await stayService.query({ checkIn, checkOut })
        assert.ok(availableStays.length > 0 && availableStays.length < demoStays.length)
        assert.ok(!availableStays.some(stay => stay._id === demoStays[0]._id))
    } finally {
        await vite.close()
    }
})

test('preserves existing stored stays', async () => {
    const existingStays = [{ _id: 'existing', name: 'Saved stay' }]
    const { stayService, values, vite } = await loadLocalStayService(existingStays)
    try {
        await stayService.query()
        assert.deepEqual(JSON.parse(values.get('stay')), existingStays)
    } finally {
        await vite.close()
    }
})
