import PropTypes from 'prop-types'
import { useEffect, useId, useRef } from 'react'
import { changeGuestCount, getStayGuestLabel } from '../../services/stay/stay-search.service'

const GUEST_ROWS = [
    { key: 'adults', label: 'Adults', hint: 'Ages 13 or above' },
    { key: 'children', label: 'Children', hint: 'Ages 2–12' },
    { key: 'infants', label: 'Infants', hint: 'Under 2' },
    { key: 'pets', label: 'Pets', hint: 'Bringing a pet?' },
]

export function StayGuestField({ guests, setGuests, isGuestsOpen, setIsGuestsOpen }) {
    const fieldRef = useRef(null)
    const triggerRef = useRef(null)
    const panelId = useId()
    const summary = getStayGuestLabel(guests)
    const hasGuests = Object.values(guests).some(Boolean)

    useEffect(() => {
        if (isGuestsOpen) triggerRef.current?.focus()
    }, [isGuestsOpen])

    useEffect(() => {
        if (!isGuestsOpen) return
        function onDismissGuests(ev) {
            if (!fieldRef.current?.closest('form')?.contains(ev.target)) setIsGuestsOpen(false)
        }
        document.addEventListener('pointerdown', onDismissGuests)
        document.addEventListener('focusin', onDismissGuests)
        return () => {
            document.removeEventListener('pointerdown', onDismissGuests)
            document.removeEventListener('focusin', onDismissGuests)
        }
    }, [isGuestsOpen, setIsGuestsOpen])

    function onChangeGuest(key, change) {
        setGuests(current => changeGuestCount(current, key, change))
    }

    function onCloseGuests() {
        setIsGuestsOpen(false)
        triggerRef.current?.focus()
    }

    return (
        <div
            ref={fieldRef}
            className={`stay-guest-field${isGuestsOpen ? ' active' : ''}${hasGuests ? ' selected' : ''}`}
            onKeyDown={ev => {
                if (ev.key !== 'Escape') return
                ev.stopPropagation()
                onCloseGuests()
            }}
        >
            <button
                ref={triggerRef}
                type="button"
                className="guests"
                aria-expanded={isGuestsOpen}
                aria-controls={panelId}
                aria-haspopup="dialog"
                onClick={() => setIsGuestsOpen(isOpen => !isOpen)}
            >
                <span>Who</span>
                <span>{summary}</span>
            </button>
            {hasGuests && isGuestsOpen && (
                <button
                    type="button"
                    className="btn-clear-guests"
                    aria-label="Clear guests"
                    onClick={() => setGuests({ adults: 0, children: 0, infants: 0, pets: 0 })}
                >
                    <img src="/icons/close.svg" alt="" />
                </button>
            )}
            {isGuestsOpen && (
                <div id={panelId} className="guest-panel" role="dialog" aria-label="Choose guests">
                    {GUEST_ROWS.map(({ key, label, hint }) => {
                        const isDecrementDisabled = guests[key] === 0 || (key === 'adults' && guests.adults === 1 && guests.children > 0)
                        const isIncrementDisabled = key === 'adults' || key === 'children'
                            ? guests.adults + guests.children >= 16 || (key === 'children' && guests.adults === 0 && guests.children === 15)
                            : guests[key] >= 5
                        return (
                            <div className="guest-row" key={key}>
                                <div className="guest-label">
                                    <strong>{label}</strong>
                                    <span>{hint}</span>
                                </div>
                                <div className="counter">
                                    <button type="button" aria-label={`Remove ${label.toLowerCase()}`} disabled={isDecrementDisabled} onClick={() => onChangeGuest(key, -1)}>−</button>
                                    <output aria-label={label}>{guests[key]}</output>
                                    <button type="button" aria-label={`Add ${label.toLowerCase()}`} disabled={isIncrementDisabled} onClick={() => onChangeGuest(key, 1)}>+</button>
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
    )
}

StayGuestField.propTypes = {
    guests: PropTypes.shape({
        adults: PropTypes.number.isRequired,
        children: PropTypes.number.isRequired,
        infants: PropTypes.number.isRequired,
        pets: PropTypes.number.isRequired,
    }).isRequired,
    setGuests: PropTypes.func.isRequired,
    isGuestsOpen: PropTypes.bool.isRequired,
    setIsGuestsOpen: PropTypes.func.isRequired,
}
