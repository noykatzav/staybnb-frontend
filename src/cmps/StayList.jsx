import PropTypes from 'prop-types'
import { userService } from '../services/user'
import { StayPreview } from './StayPreview'

export function StayList({ stays, onRemoveStay, onUpdateStay }) {
    
    function shouldShowActionBtns(stay) {
        const user = userService.getLoggedinUser()
        
        if (!user) return false
        if (user.isAdmin) return true
        return stay.owner?._id === user._id
    }

    return <section>
        <ul className="stay-list">
            {stays.map(stay =>
                <li key={stay._id}>
                    <StayPreview stay={stay}/>
                    {shouldShowActionBtns(stay) && <div className="actions">
                        <button onClick={() => onUpdateStay(stay)}>Edit</button>
                        <button onClick={() => onRemoveStay(stay._id)}>x</button>
                    </div>}
                </li>)
            }
        </ul>
    </section>
}

StayList.propTypes = {
    stays: PropTypes.arrayOf(PropTypes.shape({ _id: PropTypes.string.isRequired })).isRequired,
    onRemoveStay: PropTypes.func.isRequired,
    onUpdateStay: PropTypes.func.isRequired,
}
