import PropTypes from 'prop-types'
import { useId } from 'react'
import { dateService } from '../../services/date.service'

const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export function StayCalendarMonth({ month, todayKey, dateRange, previewDate, focusedDate, onFocusDate, onPreviewDate, onSelectDate, onNavigateDate }) {
    const headingId = useId()
    const { getDateKey } = dateService
    const monthLabel = month.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    const offset = month.getDay()
    const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate()
    const rowCount = Math.ceil((offset + daysInMonth) / 7)
    const rangeEnd = dateRange.checkOut || (previewDate > dateRange.checkIn ? previewDate : '')

    return (
        <section className="stay-calendar-month">
            <h3 id={headingId}>{monthLabel}</h3>
            <table role="grid" aria-labelledby={headingId} onMouseLeave={() => onPreviewDate('')}>
                <thead>
                    <tr>{weekdays.map(day => <th key={day} scope="col" aria-label={day}>{day[0]}</th>)}</tr>
                </thead>
                <tbody>
                    {Array.from({ length: rowCount }, (_, row) => (
                        <tr key={row}>
                            {Array.from({ length: 7 }, (_, column) => {
                                const day = row * 7 + column - offset + 1
                                const date = new Date(month.getFullYear(), month.getMonth(), day)
                                const key = getDateKey(date)
                                const isInRange = Boolean(dateRange.checkIn && rangeEnd && key >= dateRange.checkIn && key <= rangeEnd)
                                if (day < 1 || day > daysInMonth) {
                                    const fade = day === 0 ? 'fade-in' : day === daysInMonth + 1 ? 'fade-out' : ''
                                    return <td key={column} className={isInRange && fade ? `range ${fade}` : ''} />
                                }
                                const isDisabled = key < todayKey
                                const isSelected = key === dateRange.checkIn || key === dateRange.checkOut || (!dateRange.checkOut && isInRange && key === previewDate)
                                const classes = [
                                    isSelected ? 'selected' : '',
                                    isInRange ? 'range' : '',
                                    isInRange && key === dateRange.checkIn ? 'start' : '',
                                    isInRange && key === rangeEnd ? 'end' : '',
                                ].filter(Boolean).join(' ')

                                return (
                                    <td key={column} className={classes} aria-selected={isSelected}>
                                        <button
                                            type="button"
                                            data-date={key}
                                            disabled={isDisabled}
                                            tabIndex={key === focusedDate ? 0 : -1}
                                            aria-label={`${date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}${key === dateRange.checkIn ? ', check-in' : key === dateRange.checkOut ? ', check-out' : ''}`}
                                            aria-current={key === todayKey ? 'date' : undefined}
                                            onClick={() => onSelectDate(key)}
                                            onFocus={() => onFocusDate(key)}
                                            onMouseEnter={() => onPreviewDate(key)}
                                            onKeyDown={ev => onNavigateDate(ev, date)}
                                        >{day}</button>
                                    </td>
                                )
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    )
}

StayCalendarMonth.propTypes = {
    month: PropTypes.instanceOf(Date).isRequired,
    todayKey: PropTypes.string.isRequired,
    dateRange: PropTypes.shape({ checkIn: PropTypes.string.isRequired, checkOut: PropTypes.string.isRequired }).isRequired,
    previewDate: PropTypes.string.isRequired,
    focusedDate: PropTypes.string.isRequired,
    onFocusDate: PropTypes.func.isRequired,
    onPreviewDate: PropTypes.func.isRequired,
    onSelectDate: PropTypes.func.isRequired,
    onNavigateDate: PropTypes.func.isRequired,
}
