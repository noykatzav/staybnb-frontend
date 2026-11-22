import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { getStaySearchFilter, getStaySearchLabels, getStaySearchParams } from '../../services/stay/stay-search.service'
import { StayDateField } from './StayDateField'
import { StayDestinationField } from './StayDestinationField'
import { StayGuestField } from './StayGuestField'

export function StaySearch({ filterBy, onSearch, isScrolled }) {
    const [searchToEdit, setSearchToEdit] = useState(() => structuredClone(filterBy))
    const [isDestinationOpen, setIsDestinationOpen] = useState(false)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [isGuestsOpen, setIsGuestsOpen] = useState(false)
    const compactRef = useRef(null)
    const restoreFocusFieldRef = useRef('')
    const isOpen = isDestinationOpen || isCalendarOpen || isGuestsOpen
    const isCompact = isScrolled && !isOpen
    const compactLabels = getStaySearchLabels(searchToEdit)

    useEffect(() => {
        setSearchToEdit(structuredClone(filterBy))
        setIsDestinationOpen(false)
        setIsCalendarOpen(false)
        setIsGuestsOpen(false)
    }, [filterBy])

    useEffect(() => {
        if (!isCompact || !restoreFocusFieldRef.current) return
        compactRef.current?.querySelector(`[data-field="${restoreFocusFieldRef.current}"]`)?.focus()
        restoreFocusFieldRef.current = ''
    }, [isCompact])

    function onOpenCompactField(field) {
        restoreFocusFieldRef.current = ''
        if (field === 'destination') onToggleDestination(true)
        if (field === 'dates') onToggleCalendar(true)
        if (field === 'guests') onToggleGuests(true)
    }

    function onEscapeSearch(ev) {
        if (ev.key !== 'Escape' || !isOpen) return
        if (isScrolled) restoreFocusFieldRef.current = isDestinationOpen ? 'destination' : isCalendarOpen ? 'dates' : 'guests'
        setIsDestinationOpen(false)
        setIsCalendarOpen(false)
        setIsGuestsOpen(false)
    }

    function onToggleDestination(nextOpen) {
        setIsDestinationOpen(nextOpen)
        if (nextOpen) {
            setIsCalendarOpen(false)
            setIsGuestsOpen(false)
        }
    }

    function onToggleCalendar(nextOpen) {
        setIsCalendarOpen(nextOpen)
        if (typeof nextOpen === 'function' || nextOpen) {
            setIsDestinationOpen(false)
            setIsGuestsOpen(false)
        }
    }

    function onToggleGuests(nextOpen) {
        setIsGuestsOpen(nextOpen)
        if (typeof nextOpen === 'function' || nextOpen) {
            setIsDestinationOpen(false)
            setIsCalendarOpen(false)
        }
    }

    function onSubmitSearch(ev) {
        ev.preventDefault()
        restoreFocusFieldRef.current = ''
        const searchParams = getStaySearchParams(searchToEdit)
        setSearchToEdit(getStaySearchFilter(searchParams))
        setIsDestinationOpen(false)
        setIsCalendarOpen(false)
        setIsGuestsOpen(false)
        onSearch(searchParams)
    }

    if (isCompact) return (
        <div ref={compactRef} className="stay-search compact" role="search" aria-label="Find a stay">
            <img src="/icons/navigation-homes-poster.avif" alt="" />
            <button type="button" data-field="destination" aria-label={`Where: ${compactLabels.destination}`} onClick={() => onOpenCompactField('destination')}>{compactLabels.destination}</button>
            <button type="button" data-field="dates" aria-label={`When: ${compactLabels.dates}`} onClick={() => onOpenCompactField('dates')}>{compactLabels.dates}</button>
            <button type="button" data-field="guests" aria-label={`Who: ${compactLabels.guests}`} onClick={() => onOpenCompactField('guests')}>{compactLabels.guests}</button>
            <button type="button" className="btn-search" aria-label="Open search" onClick={() => onOpenCompactField('destination')}>
                <img src="/icons/search-white.svg" alt="" />
            </button>
        </div>
    )

    return (
        <form className={`stay-search${isOpen ? ' open' : ''}`} role="search" aria-label="Find a stay" onSubmit={onSubmitSearch} onKeyDownCapture={onEscapeSearch}>
            <StayDestinationField
                destination={searchToEdit.destination}
                setDestination={destination => setSearchToEdit(current => ({ ...current, destination }))}
                isDestinationOpen={isDestinationOpen}
                setIsDestinationOpen={onToggleDestination}
            />
            <StayDateField
                dateRange={{ checkIn: searchToEdit.checkIn, checkOut: searchToEdit.checkOut }}
                setDateRange={range => setSearchToEdit(current => ({ ...current, ...range }))}
                isCalendarOpen={isCalendarOpen}
                setIsCalendarOpen={onToggleCalendar}
            />
            <StayGuestField
                guests={{ adults: searchToEdit.adults, children: searchToEdit.children, infants: searchToEdit.infants, pets: searchToEdit.pets }}
                setGuests={update => setSearchToEdit(current => ({ ...current, ...(typeof update === 'function' ? update(current) : update) }))}
                isGuestsOpen={isGuestsOpen}
                setIsGuestsOpen={onToggleGuests}
            />
            <button type="submit" className="btn-search" aria-label="Search">
                <img src="/icons/search-white.svg" alt="" />
                <span>Search</span>
            </button>
        </form>
    )
}

StaySearch.propTypes = {
    filterBy: PropTypes.shape({
        destination: PropTypes.string.isRequired,
        checkIn: PropTypes.string.isRequired,
        checkOut: PropTypes.string.isRequired,
        adults: PropTypes.number.isRequired,
        children: PropTypes.number.isRequired,
        infants: PropTypes.number.isRequired,
        pets: PropTypes.number.isRequired,
    }).isRequired,
    onSearch: PropTypes.func.isRequired,
    isScrolled: PropTypes.bool.isRequired,
}
