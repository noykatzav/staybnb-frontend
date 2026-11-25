import { NavLink } from 'react-router-dom'
import { useRef } from 'react'
import { useSelector } from 'react-redux'

export function StayProfile() {
    const menuRef = useRef(null)

    const user = useSelector(storeState => storeState.userModule.user)

    return (
        <nav className="stay-profile" aria-label="Profile">
            <button type="button" className="btn-host">Become a host</button>
            <NavLink to="/auth/login" aria-label="Log in or sign up">
                {user ? (
                    <img className="user-avatar" src={user.imgUrl} alt="" />
                ) : (
                    <img src="/icons/user-circle.svg" alt="" />
                )}
            </NavLink>
            <details className="navigation-menu" ref={menuRef}>
                <summary aria-label="Main navigation menu">
                    <img src="/icons/menu.svg" alt="" />
                </summary>
                <div className="menu-content">
                    <button type="button">
                        <img src="/icons/language-globe.svg" alt="" />
                        <span>Languages &amp; currency</span>
                    </button>
                    <a href="https://www.airbnb.com/help">Help Center</a>
                    <NavLink to="/hosting" className="btn-host">
                        <span>Switch to hosting</span>
                        <span>It&apos;s easy to start hosting and earn extra income.</span>
                    </NavLink>
                    <a href="https://www.airbnb.com/refer">Refer a Host</a>
                    <a href="https://www.airbnb.com/co-hosts/home">Find a co-host</a>
                    <a href="https://www.airbnb.com/giftcards">Gift cards</a>
                    <NavLink to="/auth/login" onClick={() => menuRef.current.open = false}>
                        {user ? 'Log out' : 'Log in or sign up'}
                    </NavLink>
                </div>
            </details>
        </nav>
    )
}
