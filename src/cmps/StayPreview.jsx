import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export function StayPreview({ stay }) {
    return <article className="stay-preview">
        <header>
            <Link to={`/stay/${stay._id}`}>{stay.name}</Link>
        </header>

        <p>Price: <span>{stay.price.toLocaleString()} $</span></p>
        {stay.host && <p>Host: <span>{stay.host.fullname}</span></p>}
        
    </article>
}

StayPreview.propTypes = {
    stay: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        host: PropTypes.shape({ fullname: PropTypes.string.isRequired }),
    }).isRequired,
}
