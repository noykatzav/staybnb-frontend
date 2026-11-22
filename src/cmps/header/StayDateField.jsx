import PropTypes from 'prop-types'
import { useEffect, useId, useRef } from 'react'
import { getStayDateLabel } from '../../services/stay/stay-search.service'
import { StayCalendar } from './StayCalendar'

export function StayDateField({ dateRange, setDateRange, isCalendarOpen, setIsCalendarOpen }) {
    const datesRef = useRef(null)
    const calendarRef = useRef(null)
    const triggerRef = useRef(null)
    const calendarId = useId()

    useEffect(() => {
        if (!isCalendarOpen) return
        function onDismissCalendar(ev) {
            if (datesRef.current?.closest('form')?.contains(ev.target) || calendarRef.current?.contains(ev.target)) return
            setIsCalendarOpen(false)
        }
        document.addEventListener('pointerdown', onDismissCalendar)
        document.addEventListener('focusin', onDismissCalendar)
        return () => {
            document.removeEventListener('pointerdown', onDismissCalendar)
            document.removeEventListener('focusin', onDismissCalendar)
        }
    }, [isCalendarOpen, setIsCalendarOpen])

    function onCloseCalendar() {
        setIsCalendarOpen(false)
        triggerRef.current?.focus()
    }

    function onClearDateRange() {
        setDateRange({ checkIn: '', checkOut: '' })
        setIsCalendarOpen(true)
        triggerRef.current?.focus()
    }

    const dateLabel = getStayDateLabel(dateRange)

    return (
        <div className="stay-date-field">
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
                {dateRange.checkIn && isCalendarOpen && (
                    <button type="button" className="btn-clear-dates" onClick={onClearDateRange} aria-label="Clear dates">
                        <img src="/icons/close.svg" alt="" />
                    </button>
                )}
            </div>
            {isCalendarOpen && (
                <div ref={calendarRef} id={calendarId} className="calendar-panel">
                    <StayCalendar dateRange={dateRange} onSelectDateRange={setDateRange} onCloseCalendar={onCloseCalendar} />
                </div>
            )}
        </div>
    )
}

StayDateField.propTypes = {
    dateRange: PropTypes.shape({ checkIn: PropTypes.string.isRequired, checkOut: PropTypes.string.isRequired }).isRequired,
    setDateRange: PropTypes.func.isRequired,
    isCalendarOpen: PropTypes.bool.isRequired,
    setIsCalendarOpen: PropTypes.func.isRequired,
}
