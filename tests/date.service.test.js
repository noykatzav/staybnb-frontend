import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { dateService } from '../src/services/date.service.js'

const { getDate, getDateKey, addDays, addMonths, getMonthStart } = dateService

describe('calendar dates', () => {
    it('formats a local date with zero-padded month and day', () => {
        assert.equal(getDateKey(new Date(2026, 0, 5, 23, 45)), '2026-01-05')
    })

    it('parses a date key as local midnight', () => {
        const date = getDate('2024-02-29')
        assert.deepEqual(
            [date.getFullYear(), date.getMonth(), date.getDate(), date.getHours()],
            [2024, 1, 29, 0],
        )
        assert.equal(getDateKey(date), '2024-02-29')
    })

    for (const [key, count, expected] of [
        ['2026-12-31', 1, '2027-01-01'],
        ['2026-01-01', -1, '2025-12-31'],
        ['2024-02-28', 1, '2024-02-29'],
        ['2025-02-28', 1, '2025-03-01'],
        ['2026-03-28', 2, '2026-03-30'],
        ['2026-10-24', 2, '2026-10-26'],
    ]) {
        it(`adds ${count} days to ${key} without changing the input`, () => {
            const date = getDate(key)
            const timestamp = date.getTime()
            assert.equal(getDateKey(addDays(date, count)), expected)
            assert.equal(date.getTime(), timestamp)
        })
    }

    for (const [key, count, expected] of [
        ['2024-01-31', 1, '2024-02-29'],
        ['2025-01-31', 1, '2025-02-28'],
        ['2026-03-31', -1, '2026-02-28'],
        ['2026-12-15', 2, '2027-02-15'],
        ['2026-01-15', -2, '2025-11-15'],
        ['2024-02-29', 12, '2025-02-28'],
    ]) {
        it(`moves ${key} by ${count} months and clamps to a valid day`, () => {
            const date = getDate(key)
            const timestamp = date.getTime()
            assert.equal(getDateKey(addMonths(date, count)), expected)
            assert.equal(date.getTime(), timestamp)
        })
    }

    it('finds the month start without changing the selected date', () => {
        const date = new Date(2026, 10, 19, 14, 30)
        const timestamp = date.getTime()
        const month = getMonthStart(date)
        assert.equal(getDateKey(month), '2026-11-01')
        assert.equal(month.getHours(), 0)
        assert.equal(date.getTime(), timestamp)
    })
})
