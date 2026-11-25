import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { StayCategories } from './StayCategories'
import { StayProfile } from './StayProfile'
import { StaySearch } from './StaySearch'
import { StayMobileNav } from './StayMobileNav'

const DESKTOP_QUERY = '(min-width: 46.5rem)'

export function StayHeader({ variant = 'default', filterBy, onSearch, isCompact = false }) {
    const [isScrolled, setIsScrolled] = useState(() => window.matchMedia(DESKTOP_QUERY).matches && window.scrollY > 1)
    const [isMobile, setIsMobile] = useState(() => !window.matchMedia(DESKTOP_QUERY).matches)
    const hasSearch = variant === 'browse' || variant === 'details'

    useEffect(() => {
        const mediaQuery = window.matchMedia(DESKTOP_QUERY)
        const onUpdateScroll = () => {
            setIsMobile(!mediaQuery.matches)
            setIsScrolled(mediaQuery.matches && window.scrollY > 1)
        }

        onUpdateScroll()
        window.addEventListener('scroll', onUpdateScroll, { passive: true })
        mediaQuery.addEventListener('change', onUpdateScroll)
        return () => {
            window.removeEventListener('scroll', onUpdateScroll)
            mediaQuery.removeEventListener('change', onUpdateScroll)
        }
    }, [])

    return (
        <header className={`stay-header full ${variant}`}>
            <div className="header-content">
                <NavLink to="/stay" className="logo" aria-label="Stays homepage">
                    <img src="/icons/airbnb-mark.svg" alt="" />
                    <span>staybnb</span>
                </NavLink>
                {variant === 'browse' && <StayCategories isMobile={isMobile} />}
                <StayProfile />
                {hasSearch && (
                    <StaySearch
                        filterBy={filterBy}
                        onSearch={onSearch}
                        isScrolled={variant === 'details' || isCompact || isScrolled}
                        isMobile={isMobile}
                    />
                )}
            </div>
            {variant === 'browse' && <StayMobileNav />}
        </header>
    )
}

StayHeader.propTypes = {
    variant: PropTypes.oneOf(['default', 'browse', 'details']),
    filterBy: PropTypes.object,
    onSearch: PropTypes.func,
    isCompact: PropTypes.bool,
}
