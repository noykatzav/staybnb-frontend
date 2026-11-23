import PropTypes from 'prop-types'
import { useEffect, useId, useRef, useState } from 'react'
import { dateService } from '../services/date.service'
import { StayCalendar } from './header/StayCalendar'

export function StayOrder({
  price,
  dateRange,
  guestCount,
  onUpdateDateRange,
}) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const [activeDateField, setActiveDateField] = useState('checkIn')
  const [dateRangeToEdit, setDateRangeToEdit] = useState(
    () => structuredClone(dateRange)
  )

  const orderRef = useRef(null)
  const checkInRef = useRef(null)
  const triggerRef = useRef(null)
  const calendarId = useId()

  const displayedRange = isCalendarOpen ? dateRangeToEdit : dateRange

  const nightCount = dateRange.checkIn && dateRange.checkOut
    ? (
      Date.parse(dateRange.checkOut) -
      Date.parse(dateRange.checkIn)
    ) / (1000 * 60 * 60 * 24)
    : 0

  const hasDates = Number.isFinite(nightCount) && nightCount > 0
  const totalPrice = hasDates ? price * nightCount : 0
  const calendarNightCount = displayedRange.checkIn && displayedRange.checkOut
    ? (
      Date.parse(displayedRange.checkOut) -
      Date.parse(displayedRange.checkIn)
    ) / (1000 * 60 * 60 * 24)
    : 0

  const calendarTitle = calendarNightCount > 0
    ? `${calendarNightCount} ${calendarNightCount === 1 ? 'night' : 'nights'}`
    : 'Select dates'

  const calendarSubtitle = calendarNightCount > 0
    ? `${formatCalendarDate(displayedRange.checkIn)} - ${formatCalendarDate(displayedRange.checkOut)}`
    : 'Add your travel dates for exact pricing'

  useEffect(() => {
    if (!isCalendarOpen) return

    function onDismissCalendar(ev) {
      if (orderRef.current?.contains(ev.target)) return
      setIsCalendarOpen(false)
    }

    document.addEventListener('pointerdown', onDismissCalendar)
    document.addEventListener('focusin', onDismissCalendar)

    return () => {
      document.removeEventListener('pointerdown', onDismissCalendar)
      document.removeEventListener('focusin', onDismissCalendar)
    }
  }, [isCalendarOpen])

  function onOpenCalendar(ev, field = 'checkIn') {
    triggerRef.current = ev.currentTarget
    const nextField = field === 'checkOut' && !displayedRange.checkIn
      ? 'checkIn'
      : field

    setActiveDateField(nextField)

    if (!isCalendarOpen) {
      setDateRangeToEdit(structuredClone(dateRange))
    }

    setIsCalendarOpen(true)
  }

  function onCloseCalendar() {
    setIsCalendarOpen(false)
    triggerRef.current?.focus()
  }

  function onSelectDateRange(nextDateRange) {
    setDateRangeToEdit(nextDateRange)

    if (!nextDateRange.checkIn || !nextDateRange.checkOut) {
      setActiveDateField('checkOut')
      return
    }

    onUpdateDateRange(nextDateRange)

    if (activeDateField === 'checkOut') {
      onCloseCalendar()
    } else {
      setActiveDateField('checkOut')
    }
  }
  function onClearDateRange() {
    const emptyDateRange = { checkIn: '', checkOut: '' }

    setDateRangeToEdit(emptyDateRange)
    onUpdateDateRange(emptyDateRange)
    setActiveDateField('checkIn')

    triggerRef.current = checkInRef.current
    checkInRef.current?.focus()
  }

  function formatDate(key) {
    if (!key) return 'Add date'

    return dateService.getDate(key).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    })
  }

  function formatCalendarDate(key) {
    return dateService.getDate(key).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <aside
      ref={orderRef}
      className="stay-order"
      aria-label="Booking"
      onKeyDown={ev => {
        if (ev.key === 'Escape' && isCalendarOpen) {
          onCloseCalendar()
        }
      }}
    >
      <h2>
        {hasDates
          ? `$${totalPrice.toLocaleString('en-US')} total`
          : 'Add dates for prices'}
      </h2>

      <div className={`calendar-anchor${isCalendarOpen ? ' open' : ''}`}>
        <div className="stay-order-fields">
          <div className="stay-order-dates">
            <button
              type="button"
              className={`stay-order-field btn-date${activeDateField === 'checkIn' ? ' active' : ''}`}
              aria-expanded={isCalendarOpen}
              aria-controls={calendarId}
              aria-haspopup="dialog"
              onClick={ev => onOpenCalendar(ev, 'checkIn')}
              ref={checkInRef}
            >
              <span className="stay-order-label">CHECK-IN</span>
              <span
                className={`stay-order-value${displayedRange.checkIn
                  ? ''
                  : ' stay-order-placeholder'}`}
              >
                {formatDate(displayedRange.checkIn)}
              </span>
            </button>

            <button
              type="button"
              className={`stay-order-field stay-order-checkout btn-date${activeDateField === 'checkOut' ? ' active' : ''}`} aria-expanded={isCalendarOpen}
              aria-controls={calendarId}
              aria-haspopup="dialog"
              onClick={ev => onOpenCalendar(ev, 'checkOut')}
              disabled={isCalendarOpen && !displayedRange.checkIn}
            >
              <span className="stay-order-label">CHECKOUT</span>
              <span
                className={`stay-order-value${displayedRange.checkOut
                  ? ''
                  : ' stay-order-placeholder'}`}
              >
                {formatDate(displayedRange.checkOut)}
              </span>
            </button>
          </div>

          <div className="stay-order-field stay-order-guests">
            <div>
              <span className="stay-order-label">GUESTS</span>
              <span className="stay-order-value">
                {guestCount} {guestCount === 1 ? 'guest' : 'guests'}
              </span>
            </div>

            <img src="/icons/chevron-down.svg" alt="" />
          </div>
        </div>

        {isCalendarOpen && (
          <div id={calendarId} className="calendar-panel">
            <div className="order-calendar-heading">
              <h2>{calendarTitle}</h2>
              <p>{calendarSubtitle}</p>
            </div>

            <StayCalendar
              dateRange={dateRangeToEdit}
              onSelectDateRange={onSelectDateRange}
              onCloseCalendar={onCloseCalendar}
              activeDateField={activeDateField}
            />

            <div className="calendar-actions">
              <button
                type="button"
                className="btn-clear"
                onClick={onClearDateRange}
              >
                Clear dates
              </button>

              <button
                type="button"
                className="btn-close-calendar"
                onClick={onCloseCalendar}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        type="button"
        className="stay-order-button"
        onClick={hasDates ? undefined : onOpenCalendar}
      >
        {hasDates ? 'Reserve' : 'Check availability'}
      </button>

      {hasDates && (
        <p className="charge-note">
          You won&apos;t be charged yet
        </p>
      )}
    </aside>
  )
}

StayOrder.propTypes = {
  price: PropTypes.number.isRequired,
  dateRange: PropTypes.shape({
    checkIn: PropTypes.string.isRequired,
    checkOut: PropTypes.string.isRequired,
  }).isRequired,
  guestCount: PropTypes.number.isRequired,
  onUpdateDateRange: PropTypes.func.isRequired,
}