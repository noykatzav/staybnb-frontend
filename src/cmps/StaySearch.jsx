import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { getStaySearchFilter, getStaySearchParams } from '../services/stay/stay-search.service'
import { StayDateField } from './StayDateField'
import { StayDestinationField } from './StayDestinationField'
import { StayGuestField } from './StayGuestField'

export function StaySearch({ filterBy, onSearch }) {
    const [searchToEdit, setSearchToEdit] = useState(() => structuredClone(filterBy))
    const [isDestinationOpen, setIsDestinationOpen] = useState(false)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [isGuestsOpen, setIsGuestsOpen] = useState(false)

    useEffect(() => {
        setSearchToEdit(structuredClone(filterBy))
        setIsDestinationOpen(false)
        setIsCalendarOpen(false)
        setIsGuestsOpen(false)
    }, [filterBy])

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
        const searchParams = getStaySearchParams(searchToEdit)
        setSearchToEdit(getStaySearchFilter(searchParams))
        setIsDestinationOpen(false)
        setIsCalendarOpen(false)
        setIsGuestsOpen(false)
        onSearch(searchParams)
    }

    return (
        <form className={`stay-search${isDestinationOpen || isCalendarOpen || isGuestsOpen ? ' open' : ''}`} role="search" aria-label="Find a stay" onSubmit={onSubmitSearch}>
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
}
