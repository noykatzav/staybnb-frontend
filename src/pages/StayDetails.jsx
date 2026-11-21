import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStay, addStayReview } from '../store/actions/stay.actions'
import { StayGallery } from '../cmps/StayGallery'
import { StayAmenities } from '../cmps/StayAmenities'
import { StayOrder } from '../cmps/StayOrder'

export function StayDetails() {
  const { stayId } = useParams()
  const stay = useSelector(storeState => storeState.stayModule.stay)

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
    loadStay(stayId)
  }, [stayId])

  async function onAddStayReview(stayId) {
    try {
      await addStayReview(stayId, 'bla bla ' + parseInt(Math.random() * 10))
      showSuccessMsg('Stay review added')
    } catch (err) {
      showErrorMsg('Cannot add stay review')
    }
  }

  return (
    <section className="stay-details">
      <Link to="/stay">Back to list</Link>

      {stay && <div>
        <header className="stay-details-header">
          <h1>{stay.name}</h1>
        </header>

        <StayGallery imgUrls={stay.imgUrls} stayName={stay.name} />

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
              <h3>Hosted by {stay.host.fullname}</h3>
            </section>

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
  )
}