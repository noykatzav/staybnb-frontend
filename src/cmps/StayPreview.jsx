import { StayCarousel } from './StayCarousel'
import { Link } from 'react-router-dom'

export function StayPreview({ stay }) {
    return <Link to={`/stay/${stay._id}`} className="stay-preview">
                <StayCarousel imgUrls={stay.imgUrls} />
                <h1 className="stay-preview-location">{`${stay.type} in ${stay.loc.city}`}</h1>
                <p className="stay-preview-rating">{`★ ${4.2.toLocaleString()}`}</p>
                <p className="stay-preview-name">{stay.name}</p>
                <p className="stay-preview-capacity">
                    {stay.bedrooms && (<span>{stay.bedrooms} {stay.bedrooms === 1 ? 'bedroom' : 'bedrooms'}</span>)}
                    {stay.beds && (<span>{' · '}{stay.beds} {stay.beds === 1 ? 'bed' : 'beds'}</span>)}
                    {stay.bathrooms && (<span>{' · '}{stay.bathrooms} {stay.bathrooms === 1 ? 'bath' : 'baths'}</span>)}
                </p>
                <p className="stay-preview-price">$<span>{stay.price.toLocaleString()}</span> per night</p>
        </Link> 
}