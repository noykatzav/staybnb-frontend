export function StayCategories() {
    return (
        <nav className="stay-categories" aria-label="Explore categories">
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
    )
}
