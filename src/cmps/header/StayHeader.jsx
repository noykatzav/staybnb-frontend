import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { StayCategories } from './StayCategories'
import { StayProfile } from './StayProfile'
import { StaySearch } from './StaySearch'
import { StayMobileNav } from './StayMobileNav'

const DESKTOP_QUERY = '(min-width: 46.5rem)'

export function StayHeader({ filterBy, onSearch, isCompact = false, isDetailsPage = false }) {
    const [isScrolled, setIsScrolled] = useState(() => window.matchMedia(DESKTOP_QUERY).matches && window.scrollY > 1)
    const [isMobile, setIsMobile] = useState(() => !window.matchMedia(DESKTOP_QUERY).matches)

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
        <header className={`stay-header${isDetailsPage ? ' details' : ''}`}>
            <div className="header-content">
                <NavLink to="/stay" className="logo" aria-label="Stays homepage">
                    <img src="/icons/airbnb-mark.svg" alt="" />
                    <span>staybnb</span>
                </NavLink>
                <StayCategories isMobile={isMobile} />
                <StayProfile />
                <StaySearch filterBy={filterBy} onSearch={onSearch} isScrolled={isCompact || isScrolled} isMobile={isMobile} />
            </div>
            {!isDetailsPage && <StayMobileNav />}
        </header>
    )
}

StayHeader.propTypes = {
    filterBy: PropTypes.object.isRequired,
    onSearch: PropTypes.func.isRequired,
    isCompact: PropTypes.bool,
    isDetailsPage: PropTypes.bool,
}
