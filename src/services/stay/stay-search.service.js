import { dateService } from '../date.service.js'

const GUEST_KEYS = ['adults', 'children', 'infants', 'pets']

export function getFilterFromSearchParams(searchParams) {
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

export function getSearchParamsFromFilter(filterBy) {
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

export function getStayDateLabel({ checkIn, checkOut }, today = new Date()) {
    if (!checkIn) return 'Add dates'

    const formatDate = key => {
        const date = dateService.getDate(key)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            ...(date.getFullYear() !== today.getFullYear() ? { year: 'numeric' } : {}),
        })
    }

    const label = formatDate(checkIn)
    if (!checkOut) return label

    const start = dateService.getDate(checkIn)
    const end = dateService.getDate(checkOut)
    const isSameMonth = start.getFullYear() === end.getFullYear() && start.getMonth() === end.getMonth()
    return isSameMonth
        ? `${start.toLocaleDateString('en-US', { month: 'short' })} ${start.getDate()} - ${end.getDate()}${start.getFullYear() !== today.getFullYear() ? `, ${start.getFullYear()}` : ''}`
        : `${label} - ${formatDate(checkOut)}`
}

export function getStayGuestLabel(guests) {
    const guestCount = guests.adults + guests.children
    return [
        guestCount && `${guestCount} guest${guestCount === 1 ? '' : 's'}`,
        guests.infants && `${guests.infants} infant${guests.infants === 1 ? '' : 's'}`,
        guests.pets && `${guests.pets} pet${guests.pets === 1 ? '' : 's'}`,
    ].filter(Boolean).join(', ') || 'Add guests'
}

export function getStaySearchLabels(filterBy, today = new Date()) {
    return {
        destination: filterBy.destination.trim() || 'Anywhere',
        dates: filterBy.checkIn ? getStayDateLabel(filterBy, today) : 'Anytime',
        guests: getStayGuestLabel(filterBy),
    }
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

function getValidDateKey(key) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(key || '')) return ''
    const date = dateService.getDate(key)
    return dateService.getDateKey(date) === key ? key : ''
}
