import PropTypes from 'prop-types'

const CATEGORIES = [
    { label: 'All', image: 'navigation-all-poster.avif' },
    { label: 'Homes', image: 'navigation-homes-poster.avif' },
    { label: 'Hotels', image: 'navigation-hotels-poster.avif' },
    { label: 'Experiences', image: 'navigation-experiences-poster.avif' },
    { label: 'Services', image: 'navigation-services-poster.avif' },
]

export function StayCategories({ isMobile = false, isDialog = false }) {
    return (
        <nav className={`stay-categories${isDialog ? ' dialog' : ''}`} aria-label="Explore categories">
            {CATEGORIES.filter(({ label }) => !isDialog || label !== 'All').map(({ label, image }) => (
                <button
                    key={label}
                    type="button"
                    className={label === 'Homes' ? 'selected' : ''}
                    aria-pressed={label === 'Homes'}
                    disabled={(isMobile || isDialog) && label !== 'Homes'}
                >
                    <img src={`/icons/${image}`} alt="" />
                    <span>{label}</span>
                </button>
            ))}
        </nav>
    )
}

StayCategories.propTypes = {
    isMobile: PropTypes.bool,
    isDialog: PropTypes.bool,
}
