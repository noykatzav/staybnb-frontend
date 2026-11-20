import { useState } from 'react'
import { StayDateField } from './StayDateField'

export function StaySearch() {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)

    return (
        <div className={`stay-search${isCalendarOpen ? ' open' : ''}`} role="search" aria-label="Find a stay">
            <label className="destination">
                <span>Where</span>
                <input type="search" name="destination" placeholder="Search destinations" />
            </label>
            <StayDateField isCalendarOpen={isCalendarOpen} setIsCalendarOpen={setIsCalendarOpen} />
            <button type="button" className="guests">
                <span>Who</span>
                <span>Add guests</span>
            </button>
            <button type="button" className="btn-search" aria-label="Search">
                <img src="/icons/search-white.svg" alt="" />
                <span>Search</span>
            </button>
        </div>
    )
}
