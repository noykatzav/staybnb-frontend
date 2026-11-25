import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { getFilterFromSearchParams, getStaySearchLabels, getSearchParamsFromFilter } from '../../services/stay/stay-search.service'
import { StayDateField } from './StayDateField'
import { StayDestinationField } from './StayDestinationField'
import { StayGuestField } from './StayGuestField'
import { StayMobileSearch } from './StayMobileSearch'

export function StaySearch({ filterBy, onSearch, mode, isMobile = false }) {
    const [filterToEdit, setFilterToEdit] = useState(() => structuredClone(filterBy))
    const [activeField, setActiveField] = useState(null)
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
    const compactRef = useRef(null)
    const mobileTriggerRef = useRef(null)
    const mobileDialogRef = useRef(null)
    const restoreFocusFieldRef = useRef('')
    const displayedMode = activeField ? 'expanded' : mode
    const compactLabels = getStaySearchLabels(filterToEdit)
    const hasGuestFilter = filterToEdit.adults + filterToEdit.children + filterToEdit.infants + filterToEdit.pets > 0
    const hasSearchFilter = Boolean(filterToEdit.destination || filterToEdit.checkIn || hasGuestFilter)

    useEffect(() => {
        setFilterToEdit(structuredClone(filterBy))
        setActiveField(null)
        setIsMobileSearchOpen(false)
    }, [filterBy])

    useEffect(() => {
        if (!isMobileSearchOpen || !isMobile) return
        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = previousOverflow }
    }, [isMobileSearchOpen, isMobile])

    useEffect(() => {
        if (isMobile || !isMobileSearchOpen) return
        setIsMobileSearchOpen(false)
        setActiveField(null)
    }, [isMobile, isMobileSearchOpen])

    useEffect(() => {
        if (displayedMode !== 'compact' || !restoreFocusFieldRef.current) return
        compactRef.current?.querySelector(`[data-field="${restoreFocusFieldRef.current}"]`)?.focus()
        restoreFocusFieldRef.current = ''
    }, [displayedMode])

    function onOpenField(field) {
        restoreFocusFieldRef.current = ''
        setActiveField(field)
    }

    function onCloseField(field) {
        if (mode === 'compact' && !isMobile) restoreFocusFieldRef.current = field
        setActiveField(currentField => currentField === field ? null : currentField)
    }

    function onToggleField(field) {
        if (activeField === field) onCloseField(field)
        else onOpenField(field)
    }

    function onEscapeSearch(ev) {
        if (ev.key !== 'Escape' || !activeField) return
        ev.preventDefault()
        onCloseField(activeField)
    }

    function onSubmitSearch(ev) {
        ev.preventDefault()
        restoreFocusFieldRef.current = ''
        const searchParams = getSearchParamsFromFilter(filterToEdit)
        setFilterToEdit(getFilterFromSearchParams(searchParams))
        setActiveField(null)
        setIsMobileSearchOpen(false)
        onSearch(searchParams)
    }

    function onOpenMobileSearch() {
        setFilterToEdit(structuredClone(filterBy))
        setIsMobileSearchOpen(true)
        setActiveField('destination')
    }

    function onCloseMobileSearch() {
        setFilterToEdit(structuredClone(filterBy))
        setIsMobileSearchOpen(false)
        setActiveField(null)
        mobileTriggerRef.current?.focus()
    }

    function onClearMobileSearch() {
        setFilterToEdit(getFilterFromSearchParams(new URLSearchParams()))
        setActiveField('destination')
    }

    function onMobileDialogKeyDown(ev) {
        if (ev.key === 'Escape') {
            ev.preventDefault()
            onCloseMobileSearch()
            return
        }
        if (ev.key !== 'Tab') return
        const focusable = [...mobileDialogRef.current.querySelectorAll('button:not(:disabled), input:not(:disabled), a[href]')]
            .filter(element => element.getClientRects().length)
        if (!focusable.length) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (ev.shiftKey && document.activeElement === first) {
            ev.preventDefault()
            last.focus()
        } else if (!ev.shiftKey && document.activeElement === last) {
            ev.preventDefault()
            first.focus()
        }
    }

    const destinationField = <StayDestinationField
        destination={filterToEdit.destination}
        setDestination={destination => setFilterToEdit(current => ({ ...current, destination }))}
        isDestinationOpen={activeField === 'destination'}
        onOpenDestination={() => onOpenField('destination')}
        onCloseDestination={() => onCloseField('destination')}
    />
    const dateField = <StayDateField
        dateRange={{ checkIn: filterToEdit.checkIn, checkOut: filterToEdit.checkOut }}
        setDateRange={range => setFilterToEdit(current => ({ ...current, ...range }))}
        isCalendarOpen={activeField === 'dates'}
        onOpenCalendar={() => onOpenField('dates')}
        onCloseCalendar={() => onCloseField('dates')}
        onToggleCalendar={() => onToggleField('dates')}
    />
    const guestField = <StayGuestField
        guests={{ adults: filterToEdit.adults, children: filterToEdit.children, infants: filterToEdit.infants, pets: filterToEdit.pets }}
        setGuests={update => setFilterToEdit(current => ({ ...current, ...(typeof update === 'function' ? update(current) : update) }))}
        isGuestsOpen={activeField === 'guests'}
        onCloseGuests={() => onCloseField('guests')}
        onToggleGuests={() => onToggleField('guests')}
    />

    if (isMobile) return <StayMobileSearch
        compactLabels={compactLabels}
        hasSearchFilter={hasSearchFilter}
        hasGuestFilter={hasGuestFilter}
        activeField={activeField}
        isOpen={isMobileSearchOpen}
        triggerRef={mobileTriggerRef}
        dialogRef={mobileDialogRef}
        destinationField={destinationField}
        dateField={dateField}
        guestField={guestField}
        onOpenSearch={onOpenMobileSearch}
        onCloseSearch={onCloseMobileSearch}
        onClearSearch={onClearMobileSearch}
        onSelectField={onOpenField}
        onSubmitSearch={onSubmitSearch}
        onDialogKeyDown={onMobileDialogKeyDown}
    />

    if (displayedMode === 'compact') return (
        <div ref={compactRef} className="stay-search compact" role="search" aria-label="Find a stay">
            <img src="/icons/navigation-homes-poster.avif" alt="" />
            <button type="button" data-field="destination" aria-label={`Where: ${compactLabels.destination}`} onClick={() => onOpenField('destination')}>{compactLabels.destination}</button>
            <button type="button" data-field="dates" aria-label={`When: ${compactLabels.dates}`} onClick={() => onOpenField('dates')}>{compactLabels.dates}</button>
            <button type="button" data-field="guests" aria-label={`Who: ${compactLabels.guests}`} onClick={() => onOpenField('guests')}>{compactLabels.guests}</button>
            <button type="button" className="btn-search" aria-label="Open search" onClick={() => onOpenField('destination')}>
                <img src="/icons/search-white.svg" alt="" />
            </button>
        </div>
    )

    return (
        <form className={`stay-search${activeField ? ' open' : ''}`} role="search" aria-label="Find a stay" onSubmit={onSubmitSearch} onKeyDown={onEscapeSearch}>
            {destinationField}
            {dateField}
            {guestField}
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
    mode: PropTypes.oneOf(['expanded', 'compact']).isRequired,
    isMobile: PropTypes.bool,
}
