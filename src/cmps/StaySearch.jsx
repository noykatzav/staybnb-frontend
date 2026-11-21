import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { getStaySearchFilter, getStaySearchParams } from '../services/stay/stay-search.service'
import { StayDateField } from './StayDateField'

export function StaySearch({ filterBy, onSearch }) {
    const [searchToEdit, setSearchToEdit] = useState(() => structuredClone(filterBy))
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    useEffect(() => {
        setSearchToEdit(structuredClone(filterBy))
        setIsCalendarOpen(false)
    }, [filterBy])

    function onSubmitSearch(ev) {
        ev.preventDefault()
        const searchParams = getStaySearchParams(searchToEdit)
        setSearchToEdit(getStaySearchFilter(searchParams))
        setIsCalendarOpen(false)
        onSearch(searchParams)
    }

    return (
        <form className={`stay-search${isCalendarOpen ? ' open' : ''}`} role="search" aria-label="Find a stay" onSubmit={onSubmitSearch}>
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
                setIsCalendarOpen={setIsCalendarOpen}
            />
            <button type="button" className="guests">
                <span>Who</span>
                <span>Add guests</span>
            </button>
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
