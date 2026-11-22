import PropTypes from 'prop-types'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { StayCategories } from './StayCategories'
import { StayProfile } from './StayProfile'
import { StaySearch } from './StaySearch'

const DESKTOP_QUERY = '(min-width: 48.0625rem)'

export function StayHeader({ filterBy, onSearch, isCompact = false }) {
    const [isScrolled, setIsScrolled] = useState(() => window.matchMedia(DESKTOP_QUERY).matches && window.scrollY > 1)

    useEffect(() => {
        const mediaQuery = window.matchMedia(DESKTOP_QUERY)
        const onUpdateScroll = () => setIsScrolled(mediaQuery.matches && window.scrollY > 1)

        onUpdateScroll()
        window.addEventListener('scroll', onUpdateScroll, { passive: true })
        mediaQuery.addEventListener('change', onUpdateScroll)
        return () => {
            window.removeEventListener('scroll', onUpdateScroll)
            mediaQuery.removeEventListener('change', onUpdateScroll)
        }
    }, [])

    return (
        <header className="stay-header">
            <div className="header-content">
                <NavLink to="/stay" className="logo" aria-label="Stays homepage">
                    <img src="/icons/airbnb-mark.svg" alt="" />
                    <span>staybnb</span>
                </NavLink>
                <StayCategories />
                <StayProfile />
                <StaySearch filterBy={filterBy} onSearch={onSearch} isScrolled={isCompact || isScrolled} />
            </div>
        </header>
    )
}

StayHeader.propTypes = {
    filterBy: PropTypes.object.isRequired,
    onSearch: PropTypes.func.isRequired,
    isCompact: PropTypes.bool,
}
