import { dateService } from '../date.service.js'

const GUEST_KEYS = ['adults', 'children', 'infants', 'pets']

export function getStaySearchFilter(searchParams) {
    const filterBy = {
        destination: searchParams.get('destination')?.trim() || '',
        checkIn: getValidDateKey(searchParams.get('checkIn')),
        checkOut: getValidDateKey(searchParams.get('checkOut')),
    }

    for (const key of GUEST_KEYS) {
        const rawValue = searchParams.get(key) || ''
        const value = Number(rawValue)
        filterBy[key] = /^\d+$/.test(rawValue) && Number.isSafeInteger(value) && value > 0
            ? Math.min(value, key === 'adults' || key === 'children' ? 16 : 5)
            : 0
    }

    if (filterBy.children && !filterBy.adults) filterBy.adults = 1
    if (filterBy.adults + filterBy.children > 16) filterBy.children = 16 - filterBy.adults
    if (!filterBy.checkIn) filterBy.checkOut = ''
    else if (!filterBy.checkOut || filterBy.checkOut <= filterBy.checkIn) {
        filterBy.checkOut = dateService.getDateKey(dateService.addDays(dateService.getDate(filterBy.checkIn), 1))
    }

    return filterBy
}

export function getStaySearchParams(filterBy) {
    const searchParams = new URLSearchParams()
    if (filterBy.destination.trim()) searchParams.set('destination', filterBy.destination.trim())

    const checkIn = getValidDateKey(filterBy.checkIn)
    if (checkIn) {
        const checkOut = getValidDateKey(filterBy.checkOut)
        searchParams.set('checkIn', checkIn)
        searchParams.set('checkOut', checkOut > checkIn
            ? checkOut
            : dateService.getDateKey(dateService.addDays(dateService.getDate(checkIn), 1)))
    }

    for (const key of GUEST_KEYS) {
        if (filterBy[key] > 0) searchParams.set(key, String(filterBy[key]))
    }
    return searchParams
}

export function changeGuestCount(guests, key, change) {
    const next = { ...guests }
    if (!GUEST_KEYS.includes(key) || ![-1, 1].includes(change)) return next
    const limit = key === 'adults' || key === 'children' ? 16 : 5
    const count = next[key] + change
    if (count < 0 || count > limit) return next
    if (key === 'adults' && count === 0 && next.children > 0) return next
    if (change > 0 && (key === 'adults' || key === 'children')) {
        const extraAdult = key === 'children' && next.adults === 0 ? 1 : 0
        if (next.adults + next.children + change + extraAdult > 16) return next
        if (extraAdult) next.adults = 1
    }
    next[key] = count
    return next
}

export function filterLocalStays(stays, filterBy) {
    const destination = filterBy.destination?.trim().toLocaleLowerCase() || ''
    const guestCount = (filterBy.adults || 0) + (filterBy.children || 0)

    return stays.filter(stay => {
        if (destination && ![stay.loc?.city, stay.loc?.country].some(value => value?.toLocaleLowerCase().includes(destination))) return false
        if (guestCount && (!Number.isFinite(stay.capacity) || stay.capacity < guestCount)) return false
        if (filterBy.pets > 0 && !stay.amenities?.includes('Pets allowed')) return false
        if (filterBy.checkIn && filterBy.checkOut && stay.blockedDates?.some(range =>
            range.checkIn <= filterBy.checkOut && range.checkOut >= filterBy.checkIn)) return false
        return true
    })
}

function getValidDateKey(key) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key || '')) return ''
    const date = dateService.getDate(key)
    return dateService.getDateKey(date) === key ? key : ''
}
