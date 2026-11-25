import { useEffect } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStay, addStayReview } from '../store/actions/stay.actions'
import { StayGallery } from '../cmps/StayGallery'
import { StayAmenities } from '../cmps/StayAmenities'
import { StayOrder } from '../cmps/StayOrder'
import { getHostingDuration } from '../services/util.service'
import { StayHighlights } from '../cmps/StayHighlights'

export function StayDetails() {
    const { stayId } = useParams()
    const { search } = useLocation()
    const backTo = `/stay${search}`
    const stay = useSelector(storeState => storeState.stayModule.stay)
    const hostingDuration = getHostingDuration(stay?.host?.hostingSince)

    const reviews = stay?.reviews || []
    const reviewCount = reviews.length

    const ratedReviews = reviews.filter(review =>
        Number.isFinite(review.rate)
    )

    const avgRate = ratedReviews.length > 0
        ? (
            ratedReviews.reduce((sum, review) => sum + review.rate, 0) /
            ratedReviews.length
        ).toFixed(2)
        : null

    useEffect(() => {
        async function onLoadStay() {
            try {
                await loadStay(stayId)
            } catch (err) {
                showErrorMsg('Cannot load stay')
            }
        }
        onLoadStay()
    }, [stayId])

    async function onAddStayReview(stayId) {
        try {
            await addStayReview(stayId, 'bla bla ' + Math.floor(Math.random() * 10))
            showSuccessMsg('Stay review added')
        } catch (err) {
            showErrorMsg('Cannot add stay review')
        }
    }

    return (
        <>
            <section className="stay-details">
                <Link to={backTo} className="back-to-list">Back to list</Link>

                {stay?._id === stayId && <div>
                    <header className="stay-details-header">
                        <h1>{stay.name}</h1>
                    </header>

                    <StayGallery imgUrls={stay.imgUrls} stayName={stay.name} backTo={backTo} />

                    <div className="stay-details-content">
                        <div className="stay-details-info">
                            <section className="stay-overview">
                                <h2>
                                    {stay.type} in {stay.loc.city}, {stay.loc.country}
                                </h2>

                                <p>
                                    {stay.capacity} guests
                                    {' · '}
                                    {stay.bedrooms} {stay.bedrooms === 1 ? 'bedroom' : 'bedrooms'}
                                    {' · '}
                                    {stay.beds} {stay.beds === 1 ? 'bed' : 'beds'}
                                    {' · '}
                                    {stay.bathrooms} {stay.bathrooms === 1 ? 'bath' : 'baths'}
                                </p>

                                <p className="stay-rating">
                                    {avgRate !== null && (
                                        <>
                                            <img
                                                className="stay-rating-icon"
                                                src="/icons/star.svg"
                                                alt=""
                                            />

                                            <span>{avgRate}</span>
                                            <span aria-hidden="true">·</span>
                                        </>
                                    )}

                                    <span>
                                        {reviewCount > 0
                                            ? `${reviewCount} ${reviewCount === 1 ? 'review' : 'reviews'}`
                                            : 'No reviews yet'}
                                    </span>
                                </p>
                            </section>

                            <section className="stay-host">
                                <img src={stay.host.imgUrl} alt="" />

                                <div>
                                    <h3>Hosted by {stay.host.fullname}</h3>

                                    {(stay.host.isSuperhost || hostingDuration) && (
                                        <p className="stay-host-meta">
                                            {stay.host.isSuperhost && <span>Superhost</span>}

                                            {stay.host.isSuperhost && hostingDuration && (
                                                <span aria-hidden="true">·</span>
                                            )}

                                            {hostingDuration && <span>{hostingDuration}</span>}
                                        </p>
                                    )}
                                </div>
                            </section>

                            <StayHighlights highlights={stay.highlights} />

                            <section className="stay-description" aria-label="About this space">
                                <p>{stay.summary}</p>
                            </section>

                            <StayAmenities amenities={stay.amenities} />
                        </div>

                        <StayOrder />
                    </div>

                    <button onClick={() => onAddStayReview(stay._id)}>
                        Add stay review
                    </button>
                </div>}
            </section>
        </>
    )
}
