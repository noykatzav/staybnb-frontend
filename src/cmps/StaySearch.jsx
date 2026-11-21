import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { getStaySearchFilter, getStaySearchParams } from '../services/stay/stay-search.service'
import { StayDateField } from './StayDateField'
import { StayGuestField } from './StayGuestField'

export function StaySearch({ filterBy, onSearch }) {
    const [searchToEdit, setSearchToEdit] = useState(() => structuredClone(filterBy))
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [isGuestsOpen, setIsGuestsOpen] = useState(false)

    useEffect(() => {
        setSearchToEdit(structuredClone(filterBy))
        setIsCalendarOpen(false)
        setIsGuestsOpen(false)
    }, [filterBy])

    function onToggleCalendar(nextOpen) {
        setIsCalendarOpen(nextOpen)
        if (typeof nextOpen === 'function' || nextOpen) setIsGuestsOpen(false)
    }

    function onToggleGuests(nextOpen) {
        setIsGuestsOpen(nextOpen)
        if (typeof nextOpen === 'function' || nextOpen) setIsCalendarOpen(false)
    }

    function onSubmitSearch(ev) {
        ev.preventDefault()
        const searchParams = getStaySearchParams(searchToEdit)
        setSearchToEdit(getStaySearchFilter(searchParams))
        setIsCalendarOpen(false)
        setIsGuestsOpen(false)
        onSearch(searchParams)
    }

    return (
        <form className={`stay-search${isCalendarOpen || isGuestsOpen ? ' open' : ''}`} role="search" aria-label="Find a stay" onSubmit={onSubmitSearch}>
            <label className="destination">
                <span>Where</span>
                <input
                    type="search"
                    name="destination"
                    value={searchToEdit.destination}
                    onChange={ev => setSearchToEdit(current => ({ ...current, destination: ev.target.value }))}
                    placeholder="Search destinations"
                />
            </label>
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
}
