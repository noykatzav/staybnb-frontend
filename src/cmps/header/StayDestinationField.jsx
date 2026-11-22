import PropTypes from 'prop-types'
import { useEffect, useId, useRef } from 'react'

const DESTINATIONS = [
    { city: 'Copenhagen', country: 'Denmark', image: 'copenhagen.avif' },
    { city: 'London', country: 'United Kingdom', image: 'london.avif' },
    { city: 'Paris', country: 'France', image: 'paris.avif' },
    { city: 'Berlin', country: 'Germany', image: 'berlin.avif' },
    { city: 'Barcelona', country: 'Spain', image: 'barcelona.avif' },
    { city: 'Lisbon', country: 'Portugal', image: 'lisbon.avif' },
    { city: 'Aalborg', country: 'Denmark', image: 'aalborg.webp' },
    { city: 'Aarhus', country: 'Denmark', image: 'aarhus.avif' },
    { city: 'Athens', country: 'Greece', image: 'athens.avif' },
    { city: 'Bucharest', country: 'Romania', image: 'bucharest.avif' },
    { city: 'Budapest', country: 'Hungary', image: 'budapest.avif' },
    { city: 'Gothenburg', country: 'Sweden', image: 'gothenburg.avif' },
    { city: 'Istanbul', country: 'Turkey', image: 'istanbul.webp' },
    { city: 'Malmo', country: 'Sweden', image: 'malmo.webp' },
    { city: 'Odense', country: 'Denmark', image: 'odense.webp' },
    { city: 'Oslo', country: 'Norway', image: 'oslo.avif' },
    { city: 'Prague', country: 'Czechia', image: 'prague.avif' },
    { city: 'Rome', country: 'Italy', image: 'rome.avif' },
    { city: 'Stockholm', country: 'Sweden', image: 'stockholm.avif' },
    { city: 'Vienna', country: 'Austria', image: 'vienna.avif' },
]

export function StayDestinationField({ destination, setDestination, isDestinationOpen, setIsDestinationOpen }) {
    const fieldRef = useRef(null)
    const inputRef = useRef(null)
    const panelId = useId()
    const query = destination.trim().toLocaleLowerCase()
    const suggestions = (query
        ? DESTINATIONS.filter(({ city, country }) => `${city} ${country}`.toLocaleLowerCase().includes(query))
        : DESTINATIONS).slice(0, 6)

    useEffect(() => {
        if (!isDestinationOpen) return
        function onDismissDestination(ev) {
            if (!fieldRef.current?.contains(ev.target)) setIsDestinationOpen(false)
        }
        document.addEventListener('pointerdown', onDismissDestination)
        document.addEventListener('focusin', onDismissDestination)
        return () => {
            document.removeEventListener('pointerdown', onDismissDestination)
            document.removeEventListener('focusin', onDismissDestination)
        }
    }, [isDestinationOpen, setIsDestinationOpen])

    function onCloseDestination() {
        inputRef.current?.focus()
        setIsDestinationOpen(false)
    }

    function onSelectDestination(city) {
        setDestination(city)
        onCloseDestination()
    }

    function onClearDestination() {
        setDestination('')
        inputRef.current?.focus()
        setIsDestinationOpen(true)
    }

    return (
        <div
            ref={fieldRef}
            className={`stay-destination-field${isDestinationOpen ? ' active' : ''}`}
            onKeyDown={ev => {
                if (ev.key !== 'Escape' || !isDestinationOpen) return
                ev.preventDefault()
                ev.stopPropagation()
                onCloseDestination()
            }}
        >
            <label className={`destination${destination && isDestinationOpen ? ' selected' : ''}`}>
                <span>Where</span>
                <input
                    ref={inputRef}
                    type="search"
                    name="destination"
                    value={destination}
                    onChange={ev => {
                        setDestination(ev.target.value)
                        setIsDestinationOpen(true)
                    }}
                    onFocus={() => setIsDestinationOpen(true)}
                    onClick={() => setIsDestinationOpen(true)}
                    placeholder="Search destinations"
                    autoComplete="off"
                    aria-expanded={isDestinationOpen}
                    aria-controls={isDestinationOpen ? panelId : undefined}
                />
            </label>
            {destination && isDestinationOpen && (
                <button type="button" className="btn-clear-destination" onClick={onClearDestination} aria-label="Clear destination">
                    <img src="/icons/close.svg" alt="" />
                </button>
            )}
            {isDestinationOpen && (
                <div id={panelId} className="destination-panel" role="region" aria-label="Suggested destinations">
                    <h3>Suggested destinations</h3>
                    {suggestions.length ? (
                        <ul>
                            {suggestions.map(({ city, country, image }) => (
                                <li key={city}>
                                    <button type="button" onClick={() => onSelectDestination(city)}>
                                        <img src={`/icons/destination-${image}`} alt="" />
                                        <span className="place">
                                            <strong>{city}</strong>
                                            <span>{country}</span>
                                        </span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : <p>No destinations found</p>}
                </div>
            )}
        </div>
    )
}

StayDestinationField.propTypes = {
    destination: PropTypes.string.isRequired,
    setDestination: PropTypes.func.isRequired,
    isDestinationOpen: PropTypes.bool.isRequired,
    setIsDestinationOpen: PropTypes.func.isRequired,
}
