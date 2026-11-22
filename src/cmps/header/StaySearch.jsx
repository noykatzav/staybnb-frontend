import PropTypes from 'prop-types'
import { useEffect, useRef, useState } from 'react'
import { getFilterFromSearchParams, getStaySearchLabels, getSearchParamsFromFilter } from '../../services/stay/stay-search.service'
import { StayDateField } from './StayDateField'
import { StayDestinationField } from './StayDestinationField'
import { StayGuestField } from './StayGuestField'
import { StayCategories } from './StayCategories'

export function StaySearch({ filterBy, onSearch, isScrolled, isMobile = false }) {
    const [filterToEdit, setFilterToEdit] = useState(() => structuredClone(filterBy))
    const [isDestinationOpen, setIsDestinationOpen] = useState(false)
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const [isGuestsOpen, setIsGuestsOpen] = useState(false)
    const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)
    const [activeMobileField, setActiveMobileField] = useState('destination')
    const compactRef = useRef(null)
    const mobileTriggerRef = useRef(null)
    const mobileDialogRef = useRef(null)
    const restoreFocusFieldRef = useRef('')
    const isOpen = isDestinationOpen || isCalendarOpen || isGuestsOpen
    const isCompact = isScrolled && !isOpen
    const compactLabels = getStaySearchLabels(filterToEdit)
    const hasGuestFilter = filterToEdit.adults + filterToEdit.children + filterToEdit.infants + filterToEdit.pets > 0
    const hasSearchFilter = Boolean(filterToEdit.destination || filterToEdit.checkIn || hasGuestFilter)

    useEffect(() => {
        setFilterToEdit(structuredClone(filterBy))
        setIsDestinationOpen(false)
        setIsCalendarOpen(false)
        setIsGuestsOpen(false)
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
        setIsDestinationOpen(false)
        setIsCalendarOpen(false)
        setIsGuestsOpen(false)
    }, [isMobile, isMobileSearchOpen])

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
        const searchParams = getSearchParamsFromFilter(filterToEdit)
        setFilterToEdit(getFilterFromSearchParams(searchParams))
        setIsDestinationOpen(false)
        setIsCalendarOpen(false)
        setIsGuestsOpen(false)
        setIsMobileSearchOpen(false)
        onSearch(searchParams)
    }

    function onOpenMobileField(field) {
        setActiveMobileField(field)
        onToggleDestination(field === 'destination')
        onToggleCalendar(field === 'dates')
        onToggleGuests(field === 'guests')
    }

    function onOpenMobileSearch() {
        setFilterToEdit(structuredClone(filterBy))
        setIsMobileSearchOpen(true)
        onOpenMobileField('destination')
    }

    function onCloseMobileSearch() {
        setFilterToEdit(structuredClone(filterBy))
        setIsMobileSearchOpen(false)
        setIsDestinationOpen(false)
        setIsCalendarOpen(false)
        setIsGuestsOpen(false)
        mobileTriggerRef.current?.focus()
    }

    function onClearMobileSearch() {
        setFilterToEdit(getFilterFromSearchParams(new URLSearchParams()))
        onOpenMobileField('destination')
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

    if (isMobile) return (
        <div className="stay-search-mobile">
            <button ref={mobileTriggerRef} type="button" className="mobile-search-trigger" onClick={onOpenMobileSearch} aria-label="Start your search">
                <img src="/icons/search-filled.svg" alt="" />
                <span>{hasSearchFilter ? [compactLabels.destination, compactLabels.dates, hasGuestFilter && compactLabels.guests].filter(Boolean).join(' · ') : 'Start your search'}</span>
            </button>
            {isMobileSearchOpen && (
                <div ref={mobileDialogRef} className="mobile-search-dialog" role="dialog" aria-modal="true" aria-label="Find a stay" onKeyDownCapture={onMobileDialogKeyDown}>
                    <div className="dialog-top">
                        <StayCategories isMobile isDialog />
                        <button type="button" className="btn-close" onClick={onCloseMobileSearch} aria-label="Close search">
                            <img src="/icons/close.svg" alt="" />
                        </button>
                    </div>
                    <form className="stay-search mobile" role="search" aria-label="Find a stay" onSubmit={onSubmitSearch}>
                        <div className="mobile-fields">
                            <section className={`mobile-field${activeMobileField === 'destination' ? ' active' : ''}`}>
                                {activeMobileField === 'destination' ? (
                                    <>
                                        <h2>Where?</h2>
                                        <StayDestinationField
                                            destination={filterToEdit.destination}
                                            setDestination={destination => setFilterToEdit(current => ({ ...current, destination }))}
                                            isDestinationOpen={isDestinationOpen}
                                            setIsDestinationOpen={onToggleDestination}
                                        />
                                    </>
                                ) : (
                                    <button type="button" className="field-summary" onClick={() => onOpenMobileField('destination')}>
                                        <span>Where</span><strong>{compactLabels.destination}</strong>
                                    </button>
                                )}
                            </section>
                            <section className={`mobile-field${activeMobileField === 'dates' ? ' active' : ''}`}>
                                {activeMobileField === 'dates' ? (
                                    <>
                                        <h2>When?</h2>
                                        <StayDateField
                                            dateRange={{ checkIn: filterToEdit.checkIn, checkOut: filterToEdit.checkOut }}
                                            setDateRange={range => setFilterToEdit(current => ({ ...current, ...range }))}
                                            isCalendarOpen={isCalendarOpen}
                                            setIsCalendarOpen={onToggleCalendar}
                                        />
                                    </>
                                ) : (
                                    <button type="button" className="field-summary" onClick={() => onOpenMobileField('dates')}>
                                        <span>When</span><strong>{compactLabels.dates}</strong>
                                    </button>
                                )}
                            </section>
                            <section className={`mobile-field${activeMobileField === 'guests' ? ' active' : ''}`}>
                                {activeMobileField === 'guests' ? (
                                    <>
                                        <h2>Who?</h2>
                                        <StayGuestField
                                            guests={{ adults: filterToEdit.adults, children: filterToEdit.children, infants: filterToEdit.infants, pets: filterToEdit.pets }}
                                            setGuests={update => setFilterToEdit(current => ({ ...current, ...(typeof update === 'function' ? update(current) : update) }))}
                                            isGuestsOpen={isGuestsOpen}
                                            setIsGuestsOpen={onToggleGuests}
                                        />
                                    </>
                                ) : (
                                    <button type="button" className="field-summary" onClick={() => onOpenMobileField('guests')}>
                                        <span>Who</span><strong>{compactLabels.guests}</strong>
                                    </button>
                                )}
                            </section>
                        </div>
                        <footer className="mobile-search-actions">
                            <button type="button" className="btn-clear" onClick={onClearMobileSearch}>Clear all</button>
                            <button type="submit" className="btn-submit">
                                <img src="/icons/search-white.svg" alt="" />Search
                            </button>
                        </footer>
                    </form>
                </div>
            )}
        </div>
    )

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
                destination={filterToEdit.destination}
                setDestination={destination => setFilterToEdit(current => ({ ...current, destination }))}
                isDestinationOpen={isDestinationOpen}
                setIsDestinationOpen={onToggleDestination}
            />
            <StayDateField
                dateRange={{ checkIn: filterToEdit.checkIn, checkOut: filterToEdit.checkOut }}
                setDateRange={range => setFilterToEdit(current => ({ ...current, ...range }))}
                isCalendarOpen={isCalendarOpen}
                setIsCalendarOpen={onToggleCalendar}
            />
            <StayGuestField
                guests={{ adults: filterToEdit.adults, children: filterToEdit.children, infants: filterToEdit.infants, pets: filterToEdit.pets }}
                setGuests={update => setFilterToEdit(current => ({ ...current, ...(typeof update === 'function' ? update(current) : update) }))}
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
    isMobile: PropTypes.bool,
}
