import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
    changeGuestCount,
    filterLocalStays,
    getStaySearchLabels,
    getStaySearchFilter,
    getStaySearchParams,
} from '../src/services/stay/stay-search.service.js'

const emptyGuests = { adults: 0, children: 0, infants: 0, pets: 0 }
const stays = [
    { _id: 'a', loc: { city: 'Lisbon', country: 'Portugal' }, capacity: 3, amenities: ['Pets allowed'], blockedDates: [{ checkIn: '2026-12-10', checkOut: '2026-12-12' }] },
    { _id: 'b', loc: { city: 'Porto', country: 'Portugal' }, capacity: 2, amenities: [], blockedDates: [] },
    { _id: 'c', loc: { city: 'Lisbon', country: 'Portugal' }, capacity: 5, amenities: ['Pets allowed'] },
    { _id: 'd', loc: { city: 'Lisbon', country: 'Portugal' }, amenities: [] },
]

describe('stay search values', () => {
    it('labels empty and populated compact searches', () => {
        const today = new Date(2026, 10, 22)
        assert.deepEqual(getStaySearchLabels({ destination: '', checkIn: '', checkOut: '', ...emptyGuests }, today), {
            destination: 'Anywhere', dates: 'Anytime', guests: 'Add guests',
        })
        assert.deepEqual(getStaySearchLabels({ destination: ' Lisbon ', checkIn: '2026-12-18', checkOut: '2026-12-20', adults: 2, children: 1, infants: 1, pets: 1 }, today), {
            destination: 'Lisbon', dates: 'Dec 18 - 20', guests: '3 guests, 1 infant, 1 pet',
        })
    })

    it('uses one night when only check-in is selected, including month boundaries', () => {
        const params = getStaySearchParams({ destination: ' Lisbon ', checkIn: '2026-12-31', checkOut: '', ...emptyGuests })
        assert.equal(params.toString(), 'destination=Lisbon&checkIn=2026-12-31&checkOut=2027-01-01')
        assert.deepEqual(getStaySearchFilter(params), {
            destination: 'Lisbon', checkIn: '2026-12-31', checkOut: '2027-01-01', ...emptyGuests,
        })
    })

    it('restores a URL search and normalizes invalid values', () => {
        const filter = getStaySearchFilter(new URLSearchParams('destination=Porto&checkIn=2026-02-30&checkOut=2026-03-04&adults=-2&children=17&infants=9&pets=x'))
        assert.deepEqual(filter, {
            destination: 'Porto', checkIn: '', checkOut: '', adults: 1, children: 15, infants: 5, pets: 0,
        })
    })

    it('preserves submitted guest counts in the URL', () => {
        const params = getStaySearchParams({ destination: '', checkIn: '', checkOut: '', adults: 2, children: 1, infants: 1, pets: 1 })
        assert.equal(params.toString(), 'adults=2&children=1&infants=1&pets=1')
        assert.deepEqual(getStaySearchFilter(params), { destination: '', checkIn: '', checkOut: '', adults: 2, children: 1, infants: 1, pets: 1 })
    })
})

describe('guest counters', () => {
    it('adds an adult when the first child is added and keeps that adult selected', () => {
        const guests = changeGuestCount(emptyGuests, 'children', 1)
        assert.deepEqual(guests, { adults: 1, children: 1, infants: 0, pets: 0 })
        assert.deepEqual(changeGuestCount(guests, 'adults', -1), guests)
        assert.deepEqual(emptyGuests, { adults: 0, children: 0, infants: 0, pets: 0 })
    })

    it('caps capacity guests at 16 and infants and pets at 5', () => {
        assert.deepEqual(changeGuestCount({ adults: 15, children: 1, infants: 0, pets: 0 }, 'adults', 1), { adults: 15, children: 1, infants: 0, pets: 0 })
        assert.equal(changeGuestCount({ ...emptyGuests, infants: 5 }, 'infants', 1).infants, 5)
        assert.equal(changeGuestCount({ ...emptyGuests, pets: 5 }, 'pets', 1).pets, 5)
    })
})

describe('local stay search', () => {
    it('matches destination case-insensitively and checks capacity and pets', () => {
        assert.deepEqual(filterLocalStays(stays, { destination: 'lIs', adults: 2, children: 1, pets: 1 }).map(stay => stay._id), ['a', 'c'])
        assert.deepEqual(filterLocalStays(stays, { destination: 'portugal', adults: 0, children: 0, pets: 0 }).map(stay => stay._id), ['a', 'b', 'c', 'd'])
        assert.deepEqual(filterLocalStays(stays, { destination: '', adults: 1, children: 0, pets: 0 }).map(stay => stay._id), ['a', 'b', 'c'])
    })

    it('treats blocked check-in and check-out dates as occupied', () => {
        assert.deepEqual(filterLocalStays(stays, { checkIn: '2026-12-12', checkOut: '2026-12-13' }).map(stay => stay._id), ['b', 'c', 'd'])
        assert.deepEqual(filterLocalStays(stays, { checkIn: '2026-12-13', checkOut: '2026-12-14' }).map(stay => stay._id), ['a', 'b', 'c', 'd'])
    })
})
