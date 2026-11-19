/* eslint-disable react/prop-types -- This project uses plain JavaScript component props without runtime validators. */
import { useEffect, useRef, useState } from 'react'
import { dateService } from '../services/date.service'
import { StayCalendarMonth } from './StayCalendarMonth'

export function StayCalendar({ dateRange, onSelectDateRange, onCloseCalendar }) {
    const { getDateKey, getDate, addDays, addMonths, getMonthStart } = dateService
    const todayKey = getDateKey(new Date())
    const initialDate = dateRange.checkIn && dateRange.checkIn >= todayKey ? dateRange.checkIn : todayKey
    const [month, setMonth] = useState(() => getMonthStart(getDate(initialDate)))
    const [focusedDate, setFocusedDate] = useState(initialDate)
    const [previewDate, setPreviewDate] = useState('')
    const [isMovingBackward, setIsMovingBackward] = useState(false)
    const [isCompact, setIsCompact] = useState(() => window.matchMedia('(max-width: 48rem)').matches)
    const calendarRef = useRef(null)
    const shouldFocusDate = useRef(true)
    const shouldScrollDate = useRef(false)
    const monthCount = isCompact ? 1 : 2
    const firstMonthKey = getDateKey(month)
    const currentMonthKey = getDateKey(getMonthStart(getDate(todayKey)))
    const monthLabel = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

    useEffect(() => {
        const media = window.matchMedia('(max-width: 48rem)')
        function onResizeCalendar(ev) {
            setIsCompact(ev.matches)
        }
        media.addEventListener('change', onResizeCalendar)
        return () => media.removeEventListener('change', onResizeCalendar)
    }, [])

    useEffect(() => {
        if (!shouldFocusDate.current) return
        const dateBtn = calendarRef.current?.querySelector(`[data-date="${focusedDate}"]`)
        dateBtn?.focus({ preventScroll: true })
        if (shouldScrollDate.current) dateBtn?.scrollIntoView({ block: 'nearest' })
        shouldFocusDate.current = false
        shouldScrollDate.current = false
    }, [focusedDate, month, isCompact])

    useEffect(() => {
        const focusedMonth = getMonthStart(getDate(focusedDate))
        if (focusedMonth < month || focusedMonth >= addMonths(month, monthCount)) {
            setFocusedDate(firstMonthKey < todayKey ? todayKey : firstMonthKey)
        }
    }, [isCompact, month, monthCount, focusedDate, firstMonthKey, todayKey, getDate, getMonthStart, addMonths])

    function onSelectDate(key) {
        setPreviewDate('')
        if (!dateRange.checkIn || dateRange.checkOut || key <= dateRange.checkIn) {
            onSelectDateRange({ checkIn: key, checkOut: '' })
        } else {
            onSelectDateRange({ ...dateRange, checkOut: key })
        }
    }

    function onFocusDate(key) {
        setFocusedDate(key)
        setPreviewDate(key)
    }

    function onChangeMonth(count) {
        const nextMonth = addMonths(month, count)
        setIsMovingBackward(count < 0)
        setMonth(nextMonth)
        setFocusedDate(getDateKey(nextMonth) < todayKey ? todayKey : getDateKey(nextMonth))
        setPreviewDate('')
    }

    function onNavigateDate(ev, date) {
        let nextDate
        switch (ev.key) {
            case 'ArrowLeft': nextDate = addDays(date, -1)
                break
            case 'ArrowRight': nextDate = addDays(date, 1)
                break
            case 'ArrowUp': nextDate = addDays(date, -7)
                break
            case 'ArrowDown': nextDate = addDays(date, 7)
                break
            case 'Home': nextDate = addDays(date, -date.getDay())
                break
            case 'End': nextDate = addDays(date, 6 - date.getDay())
                break
            case 'PageUp': nextDate = addMonths(date, -1)
                break
            case 'PageDown': nextDate = addMonths(date, 1)
                break
            default: return
        }
        ev.preventDefault()
        const nextKey = getDateKey(nextDate) < todayKey ? todayKey : getDateKey(nextDate)
        const nextMonth = getMonthStart(getDate(nextKey))
        if (nextMonth < month || nextMonth >= addMonths(month, monthCount)) {
            setIsMovingBackward(nextMonth < month)
            setMonth(nextMonth)
        }
        shouldFocusDate.current = true
        shouldScrollDate.current = true
        setFocusedDate(nextKey)
    }

    function formatDate(key) {
        return getDate(key).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    }

    const selectionLabel = dateRange.checkOut
        ? `Check-in ${formatDate(dateRange.checkIn)}. Check-out ${formatDate(dateRange.checkOut)}.`
        : dateRange.checkIn ? `Check-in ${formatDate(dateRange.checkIn)}. Choose a check-out date.` : 'Choose your check-in date.'

    return (
        <div
            ref={calendarRef}
            className="stay-calendar"
            role="dialog"
            aria-label="Choose stay dates"
            onKeyDown={ev => {
                if (ev.key !== 'Escape') return
                ev.stopPropagation()
                onCloseCalendar()
            }}
        >
            <div className="calendar-heading">
                <h2>Choose your dates</h2>
                <button type="button" className="btn-close" onClick={onCloseCalendar} aria-label="Close calendar">
                    <img src="/icons/close.svg" alt="" />
                </button>
            </div>
            <div className="calendar-body">
                <div className="month-navigation">
                    <button type="button" className="btn-previous" disabled={firstMonthKey <= currentMonthKey} onClick={() => onChangeMonth(-1)} aria-label="Previous month">
                        <img src="/icons/chevron-right.svg" alt="" />
                    </button>
                    <button type="button" onClick={() => onChangeMonth(1)} aria-label="Next month">
                        <img src="/icons/chevron-right.svg" alt="" />
                    </button>
                </div>
                <div key={firstMonthKey} className={`months${isMovingBackward ? ' backward' : ''}`}>
                    {Array.from({ length: monthCount }, (_, idx) => (
                        <StayCalendarMonth
                            key={getDateKey(addMonths(month, idx))}
                            month={addMonths(month, idx)}
                            todayKey={todayKey}
                            dateRange={dateRange}
                            previewDate={previewDate}
                            focusedDate={focusedDate}
                            onFocusDate={onFocusDate}
                            onPreviewDate={setPreviewDate}
                            onSelectDate={onSelectDate}
                            onNavigateDate={onNavigateDate}
                        />
                    ))}
                </div>
                <p className="selection-hint" aria-live="polite" aria-atomic="true">{selectionLabel}</p>
            </div>
            <span className="announcement" role="status">Showing {monthLabel}{!isCompact && ` and ${addMonths(month, 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`}</span>
        </div>
    )
}
