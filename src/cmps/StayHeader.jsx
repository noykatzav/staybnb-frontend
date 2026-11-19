import { NavLink } from 'react-router-dom'
import { userService } from '../services/user'
import { StayFilter } from './StayFilter'

export function StayHeader({ filterBy, setFilterBy, onAddStay }) {
    return (
        <header className="stay-header">
            <div className="header-content">
                <NavLink to="/" className="logo" aria-label="Staybnb homepage">
                    <img src="/icons/airbnb-mark.svg" alt="" />
                    <span>Staybnb</span>
                </NavLink>
                <nav className="categories" aria-label="Explore categories">
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
                <nav className="profile" aria-label="Profile">
                    <button type="button" className="btn-host">Become a host</button>
                    <NavLink to="/auth/login" aria-label="Log in or sign up">
                        <img src="/icons/user-circle.svg" alt="" />
                    </NavLink>
                    <details className="navigation-menu">
                        <summary aria-label="Main navigation menu">
                            <img src="/icons/menu.svg" alt="" />
                        </summary>
                        <div className="menu-content">
                            <button type="button">
                                <img src="/icons/language-globe.svg" alt="" />
                                <span>Languages &amp; currency</span>
                            </button>
                            <a href="https://www.airbnb.com/help">Help Center</a>
                            <button type="button" className="btn-host">
                                <span>Become a host</span>
                                <span>It&apos;s easy to start hosting and earn extra income.</span>
                            </button>
                            <a href="https://www.airbnb.com/refer">Refer a Host</a>
                            <a href="https://www.airbnb.com/co-hosts/home">Find a co-host</a>
                            <a href="https://www.airbnb.com/giftcards">Gift cards</a>
                            <NavLink to="/auth/login">Log in or sign up</NavLink>
                        </div>
                    </details>
                </nav>
                <div className="search" role="search" aria-label="Find a stay">
                    <label className="destination">
                        <span>Where</span>
                        <input type="search" name="destination" placeholder="Search destinations" />
                    </label>
                    <button type="button" className="dates">
                        <span>When</span>
                        <span>Add dates</span>
                    </button>
                    <button type="button" className="guests">
                        <span>Who</span>
                        <span>Add guests</span>
                    </button>
                    <button type="button" className="btn-search" aria-label="Search">
                        <img src="/icons/search-white.svg" alt="" />
                    </button>
                </div>
            </div>
            <div className="heading">
                <h2>Stays</h2>
                {userService.getLoggedinUser() && <button onClick={onAddStay}>Add a Stay</button>}
            </div>
            <StayFilter filterBy={filterBy} setFilterBy={setFilterBy} />
        </header>
    )
}
