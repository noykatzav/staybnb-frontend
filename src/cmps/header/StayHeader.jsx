import { useEffect, useMemo, useState } from 'react'
import { NavLink, useLocation, useMatch, useNavigate } from 'react-router-dom'
import { getFilterFromSearchParams } from '../../services/stay/stay-search.service'
import { StayCategories } from './StayCategories'
import { StayProfile } from './StayProfile'
import { StaySearch } from './StaySearch'
import { StayMobileNav } from './StayMobileNav'

// 744px and up at a 16px browser font size
const DESKTOP_QUERY = '(min-width: 46.5rem)'

export function StayHeader() {
    const isStayList = Boolean(useMatch('/stay'))
    const isStayDetails = Boolean(useMatch('/stay/:stayId'))
    const { pathname, search } = useLocation()
    const navigate = useNavigate()
    const variant = isStayList ? 'list' : isStayDetails ? 'details' : 'default'
    const filterBy = useMemo(() => getFilterFromSearchParams(new URLSearchParams(search)), [search])
    const [isScrolled, setIsScrolled] = useState(() => window.matchMedia(DESKTOP_QUERY).matches && window.scrollY > 1)
    const [isMobile, setIsMobile] = useState(() => !window.matchMedia(DESKTOP_QUERY).matches)
    const hasSearch = variant !== 'default'
    const mode = variant === 'details' || (isStayList && search) || isScrolled ? 'compact' : 'expanded'

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
    }, [pathname])

    function onSearch(searchParams) {
        navigate({ pathname: '/stay', search: searchParams.toString() })
    }

    return (
        <header className={`stay-header full ${variant}`}>
            <div className="header-content">
                <NavLink to="/stay" className="logo" aria-label="Stays homepage">
                    <img src="/icons/airbnb-mark.svg" alt="" />
                    <span>staybnb</span>
                </NavLink>
                {hasSearch && <StayCategories isMobile={isMobile} />}
                <StayProfile />
                {hasSearch && (
                    <StaySearch
                        key={variant}
                        filterBy={filterBy}
                        onSearch={onSearch}
                        mode={mode}
                        isMobile={isMobile}
                    />
                )}
            </div>
            {variant === 'list' && <StayMobileNav />}
        </header>
    )
}
