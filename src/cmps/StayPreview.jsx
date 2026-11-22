import PropTypes from 'prop-types'
import { StayCarousel } from './StayCarousel'
import { Link } from 'react-router-dom'

export function StayPreview({ stay }) {
    const reviewsCnt = stay.reviews?.length || 0
    const avgRating = stay.reviews?.length
        ? stay.reviews.reduce((sum, review) => sum + review.rate, 0) / reviewsCnt
        : 0

    return <Link to={`/stay/${stay._id}`} className="stay-preview">
                <StayCarousel imgUrls={stay.imgUrls} />
                <h1 className="stay-preview-location">{`${stay.type} in ${stay.loc.city}`}</h1>
                <p className="stay-preview-rating">{avgRating && (<span>{`★ ${avgRating.toFixed(1)} (${reviewsCnt})`}</span>)}</p>
                <p className="stay-preview-name">{stay.name}</p>
                <p className="stay-preview-capacity">
                    {stay.bedrooms && (<span>{`${stay.bedrooms} ${stay.bedrooms === 1 ? 'bedroom' : 'bedrooms'}`}</span>)}
                    {stay.beds && (<span>{` · ${stay.beds} ${stay.beds === 1 ? 'bed' : 'beds'}`}</span>)}
                    {stay.bathrooms && (<span>{` · ${stay.bathrooms} ${stay.bathrooms === 1 ? 'bath' : 'baths'}`}</span>)}
                </p>
                <p className="stay-preview-price">$<span>{stay.price.toLocaleString()}</span> per night</p>
        </Link>
}

StayPreview.propTypes = {
    stay: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        type: PropTypes.string.isRequired,
        imgUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
        loc: PropTypes.shape({
            city: PropTypes.string.isRequired,
        }).isRequired,
        bedrooms: PropTypes.number,
        beds: PropTypes.number,
        bathrooms: PropTypes.number,
        price: PropTypes.number.isRequired,
    }).isRequired,
}
