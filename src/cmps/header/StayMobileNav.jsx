import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'

export function StayMobileNav() {
    const user = useSelector(storeState => storeState.userModule.user)

    return (
        <nav className="stay-mobile-nav" aria-label="Mobile navigation">
            <NavLink to="/stay" end>
                <img src="/icons/explore-active.svg" alt="" />
                <span>Explore</span>
            </NavLink>
            <button type="button" disabled aria-label="Wishlists unavailable">
                <img src="/icons/heart-outline.svg" alt="" />
                <span>Wishlists</span>
            </button>
            <NavLink to={user ? `/user/${user._id}` : '/auth/login'}>
                <img src="/icons/user-circle-mobile.svg" alt="" />
                <span>{user ? 'Profile' : 'Log in'}</span>
            </NavLink>
        </nav>
    )
}
