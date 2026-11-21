import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStay, addStayReview } from '../store/actions/stay.actions'
import { StayGallery } from '../cmps/StayGallery'


export function StayDetails() {

  const { stayId } = useParams()
  const stay = useSelector(storeState => storeState.stayModule.stay)

  useEffect(() => {
    loadStay(stayId)
  }, [stayId])

  async function onAddStayReview(stayId) {
    try {
      await addStayReview(stayId, 'bla bla ' + parseInt(Math.random() * 10))
      showSuccessMsg(`Stay review added`)
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
        <section className="stay-overview">
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
    </section>

    <section className="stay-host">
      <img src={stay.host.imgUrl} alt="" />
      <h3>Hosted by {stay.host.fullname}</h3>
    </section>
  </div>
</div>
        </section>

        <button onClick={() => { onAddStayReview(stay._id) }}>
          Add stay review
        </button>
      </div>
      }

    </section>
  )
}