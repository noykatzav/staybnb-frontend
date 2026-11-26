import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { NavLink, useLocation, useMatch } from 'react-router-dom'

export function StayProfile() {
    const menuRef = useRef(null)
    const location = useLocation()
    const user = useSelector(storeState => storeState.userModule.user)
    const isHosting = Boolean(useMatch('/hosting/*'))

    useEffect(() => {
        menuRef.current.open = false
    }, [location])

    useEffect(() => {
        function onDismissMenu(ev) {
            const menu = menuRef.current
            if (menu && !menu.contains(ev.target)) menu.open = false
        }

        document.addEventListener('pointerdown', onDismissMenu)
        document.addEventListener('focusin', onDismissMenu)
        return () => {
            document.removeEventListener('pointerdown', onDismissMenu)
            document.removeEventListener('focusin', onDismissMenu)
        }
    }, [])
    return (
        <nav className="stay-profile" aria-label="Profile">
            <NavLink
                className="btn-host"
                to={isHosting ? '/stay' : '/hosting'}
            >
                {isHosting ? 'Switch to traveling' : 'Switch to hosting'}
            </NavLink>
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
