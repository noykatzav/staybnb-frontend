import PropTypes from 'prop-types'
import { StayPreview } from './StayPreview'

export function StayList({ stays}) {
    return <section className="stay-list-container">
        <h2 className="stay-list-title">
            {stays.length} stays
        </h2>

        <ul className="stay-list">
            {stays.map(stay =>
                <li key={stay._id} className="stay-list-item">
                    <StayPreview stay={stay}/>
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
