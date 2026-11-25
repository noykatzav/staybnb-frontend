import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export function StayGallery({ imgUrls, stayName, backTo }) {
    return (
        <section className="stay-gallery">
            <Link to={backTo} className="back-link" aria-label="Back to stays">
                <img src="/icons/arrow-left.svg" alt="" />
            </Link>
            {imgUrls.slice(0, 5).map((url, idx) => (
                <img
                    key={url}
                    src={url}
                    alt={`${stayName} - photo ${idx + 1}`}
                />
            ))}
        </section>
    )
}

StayGallery.propTypes = {
    imgUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    stayName: PropTypes.string.isRequired,
    backTo: PropTypes.string.isRequired,
}
