import PropTypes from 'prop-types'
import { NavLink } from 'react-router-dom'
import { userService } from '../services/user'
import { StayCategories } from './StayCategories'
import { StayProfile } from './StayProfile'
import { StaySearch } from './StaySearch'

export function StayHeader({ onAddStay }) {
    return (
        <header className="stay-header">
            <div className="header-content">
                <NavLink to="/" className="logo" aria-label="Staybnb homepage">
                    <img src="/icons/airbnb-mark.svg" alt="" />
                    <span>Staybnb</span>
                </NavLink>
                <StayCategories />
                <StayProfile />
                <StaySearch />
            </div>
            <div className="heading">
                <h2>Stays</h2>
                {userService.getLoggedinUser() && <button onClick={onAddStay}>Add a Stay</button>}
            </div>
        </header>
    )
}

StayHeader.propTypes = {
    onAddStay: PropTypes.func.isRequired,
}
