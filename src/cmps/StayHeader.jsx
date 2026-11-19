import { userService } from '../services/user'
import { StayFilter } from './StayFilter'

export function StayHeader({ filterBy, setFilterBy, onAddStay }) {
    return (
        <header className="stay-header">
            <div className="heading">
                <h2>Stays</h2>
                {userService.getLoggedinUser() && <button onClick={onAddStay}>Add a Stay</button>}
            </div>
            <StayFilter filterBy={filterBy} setFilterBy={setFilterBy} />
        </header>
    )
}
