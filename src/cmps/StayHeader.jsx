import PropTypes from 'prop-types'
import { useEffect, useId, useRef, useState } from 'react'
import { StayCalendar } from './StayCalendar'
import { dateService } from '../services/date.service'
import { NavLink } from 'react-router-dom'
import { userService } from '../services/user'

export function StayHeader({ onAddStay }) {
    const [dateRange, setDateRange] = useState({ checkIn: '', checkOut: '' })
    const [isCalendarOpen, setIsCalendarOpen] = useState(false)
    const datesRef = useRef(null)
    const calendarRef = useRef(null)
    const triggerRef = useRef(null)
    const calendarId = useId()

    useEffect(() => {
        if (!isCalendarOpen) return
        function onDismissCalendar(ev) {
            if (datesRef.current?.contains(ev.target) || calendarRef.current?.contains(ev.target)) return
            setIsCalendarOpen(false)
        }
        document.addEventListener('pointerdown', onDismissCalendar)
        document.addEventListener('focusin', onDismissCalendar)
        return () => {
            document.removeEventListener('pointerdown', onDismissCalendar)
            document.removeEventListener('focusin', onDismissCalendar)
        }
    }, [isCalendarOpen])

    function onCloseCalendar() {
        setIsCalendarOpen(false)
        triggerRef.current?.focus()
    }

    function onClearDateRange() {
        setDateRange({ checkIn: '', checkOut: '' })
        setIsCalendarOpen(true)
        triggerRef.current?.focus()
    }

    function formatDate(key) {
        const date = dateService.getDate(key)
        const shouldShowYear = date.getFullYear() !== new Date().getFullYear()
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            ...(shouldShowYear ? { year: 'numeric' } : {}),
        })
    }

    let dateLabel = 'Add dates'
    if (dateRange.checkIn) {
        dateLabel = formatDate(dateRange.checkIn)
        if (dateRange.checkOut) {
            const checkIn = dateService.getDate(dateRange.checkIn)
            const checkOut = dateService.getDate(dateRange.checkOut)
            const isSameMonth = checkIn.getFullYear() === checkOut.getFullYear() && checkIn.getMonth() === checkOut.getMonth()
            dateLabel = isSameMonth
                ? `${checkIn.toLocaleDateString('en-US', { month: 'short' })} ${checkIn.getDate()} - ${checkOut.getDate()}${checkIn.getFullYear() !== new Date().getFullYear() ? `, ${checkIn.getFullYear()}` : ''}`
                : `${dateLabel} - ${formatDate(dateRange.checkOut)}`
        }
    }

    return (
        <header className="stay-header">
            <div className="header-content">
                <NavLink to="/" className="logo" aria-label="Staybnb homepage">
                    <img src="/icons/airbnb-mark.svg" alt="" />
                    <span>Staybnb</span>
                </NavLink>
                <nav className="categories" aria-label="Explore categories">
                    <button type="button" aria-pressed="false">
                        <img src="/icons/navigation-all-poster.avif" alt="" />
                        <span>All</span>
                    </button>
                    <button type="button" className="selected" aria-pressed="true">
                        <img src="/icons/navigation-homes-poster.avif" alt="" />
                        <span>Homes</span>
                    </button>
                    <button type="button" aria-pressed="false">
                        <img src="/icons/navigation-experiences-poster.avif" alt="" />
                        <span>Experiences</span>
                    </button>
                    <button type="button" aria-pressed="false">
                        <img src="/icons/navigation-services-poster.avif" alt="" />
                        <span>Services</span>
                    </button>
                </nav>
                <nav className="profile" aria-label="Profile">
                    <button type="button" className="btn-host">Become a host</button>
                    <NavLink to="/auth/login" aria-label="Log in or sign up">
                        <img src="/icons/user-circle.svg" alt="" />
                    </NavLink>
                    <details className="navigation-menu">
                        <summary aria-label="Main navigation menu">
                            <img src="/icons/menu.svg" alt="" />
                        </summary>
                        <div className="menu-content">
                            <button type="button">
                                <img src="/icons/language-globe.svg" alt="" />
                                <span>Languages &amp; currency</span>
                            </button>
                            <a href="https://www.airbnb.com/help">Help Center</a>
                            <button type="button" className="btn-host">
                                <span>Become a host</span>
                                <span>It&apos;s easy to start hosting and earn extra income.</span>
                            </button>
                            <a href="https://www.airbnb.com/refer">Refer a Host</a>
                            <a href="https://www.airbnb.com/co-hosts/home">Find a co-host</a>
                            <a href="https://www.airbnb.com/giftcards">Gift cards</a>
                            <NavLink to="/auth/login">Log in or sign up</NavLink>
                        </div>
                    </details>
                </nav>
                <div className={`search${isCalendarOpen ? ' open' : ''}`} role="search" aria-label="Find a stay">
                    <label className="destination">
                        <span>Where</span>
                        <input type="search" name="destination" placeholder="Search destinations" />
                    </label>
                    <div
                        ref={datesRef}
                        className={`date-field${isCalendarOpen ? ' active' : ''}${dateRange.checkIn ? ' selected' : ''}`}
                        onKeyDown={ev => {
                            if (ev.key === 'Escape') onCloseCalendar()
                        }}
                    >
                        <button
                            ref={triggerRef}
                            type="button"
                            className="dates"
                            aria-expanded={isCalendarOpen}
                            aria-controls={calendarId}
                            aria-haspopup="dialog"
                            onClick={() => setIsCalendarOpen(isOpen => !isOpen)}
                        >
                            <span>When</span>
                            <span>{dateLabel}</span>
                        </button>
                        {dateRange.checkIn && (
                            <button type="button" className="btn-clear-dates" onClick={onClearDateRange} aria-label="Clear dates">
                                <img src="/icons/close.svg" alt="" />
                            </button>
                        )}
                    </div>
                    <button type="button" className="guests">
                        <span>Who</span>
                        <span>Add guests</span>
                    </button>
                    <button type="button" className="btn-search" aria-label="Search">
                        <img src="/icons/search-white.svg" alt="" />
                        <span>Search</span>
                    </button>
                    {isCalendarOpen && (
                        <div ref={calendarRef} id={calendarId} className="calendar-panel">
                            <StayCalendar dateRange={dateRange} onSelectDateRange={setDateRange} onCloseCalendar={onCloseCalendar} />
                        </div>
                    )}
                </div>
            </div>
            <div className="heading">
                <h2>Stays</h2>
                {userService.getLoggedinUser() && <button onClick={onAddStay}>Add a Stay</button>}
            </div>
        </header>
    )
}

StayHeader.propTypes = {
    onAddStay: PropTypes.func.isRequired,
}
