import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStay, addStayReview } from '../store/actions/stay.actions'
import { StayGallery } from '../cmps/StayGallery'
import { StayAmenities } from '../cmps/StayAmenities'
import { StayOrder } from '../cmps/StayOrder'
import { getHostingDuration } from '../services/util.service'
import { StayHighlights } from '../cmps/StayHighlights'
import { getFilterFromSearchParams } from '../services/stay/stay-search.service'
import { addOrder } from '../store/actions/order.actions'

export function StayDetails() {
    const { stayId } = useParams()
    const [searchParams, setSearchParams] = useSearchParams()
    const filterBy = getFilterFromSearchParams(searchParams)

    const dateRange = {
        checkIn: filterBy.checkIn,
        checkOut: searchParams.get('checkOut') ? filterBy.checkOut : '',
    }

    const guests = {
        adults: filterBy.adults || 1,
        children: filterBy.children,
        infants: filterBy.infants,
        pets: filterBy.pets,
    }
    const search = searchParams.toString()
    const backTo = search ? `/stay?${search}` : '/stay'
    const stay = useSelector(storeState => storeState.stayModule.stay)
    const hostingDuration = getHostingDuration(stay?.host?.hostingSince)

    const reviews = stay?.reviews || []
    const reviewCount = reviews.length
    const [isSavingOrder, setIsSavingOrder] = useState(false)

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

    function onUpdateDateRange(nextDateRange) {
        setSearchParams(currentParams => {
            const nextParams = new URLSearchParams(currentParams)

            if (nextDateRange.checkIn) {
                nextParams.set('checkIn', nextDateRange.checkIn)
            } else {
                nextParams.delete('checkIn')
            }

            if (nextDateRange.checkOut) {
                nextParams.set('checkOut', nextDateRange.checkOut)
            } else {
                nextParams.delete('checkOut')
            }

            return nextParams
        }, { replace: true, preventScrollReset: true })
    }

    async function onReserve(selectedGuests) {
        if (isSavingOrder) return

        const nightCount = (
            Date.parse(dateRange.checkOut) -
            Date.parse(dateRange.checkIn)
        ) / (1000 * 60 * 60 * 24)

        if (!Number.isFinite(nightCount) || nightCount <= 0) {
            showErrorMsg('Please select valid dates')
            return
        }

        if (selectedGuests.adults < 1) {
            showErrorMsg('Please select at least one adult')
            return
        }

        const guestCount = selectedGuests.adults + selectedGuests.children

        if (guestCount > stay.capacity) {
            showErrorMsg(`This stay allows up to ${stay.capacity} guests`)
            return
        }

        const orderToAdd = {
            hostId: stay.host._id,
            stay: {
                _id: stay._id,
                name: stay.name,
                imgUrl: stay.imgUrls[0],
                price: stay.price,
            },
            checkIn: dateRange.checkIn,
            checkOut: dateRange.checkOut,
            guests: { ...selectedGuests },
            totalPrice: stay.price * nightCount,
        }

        try {
            setIsSavingOrder(true)
            await addOrder(orderToAdd)
            showSuccessMsg('Reservation request sent')
        } catch (err) {
            showErrorMsg(err.message || 'Cannot create order')
        } finally {
            setIsSavingOrder(false)
        }
    }

    return (
        <>
            <section className="stay-details">
                {stay?._id === stayId && <div>
                    <header className="stay-details-header">
                        <Link to={backTo} className="back-to-list" aria-label="Back to list">
                            <img src="/icons/chevron-down.svg" alt="" />
                        </Link>
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

                        <StayOrder
                            price={stay.price}
                            dateRange={dateRange}
                            guests={guests}
                            onUpdateDateRange={onUpdateDateRange}
                            onReserve={onReserve}
                            isSaving={isSavingOrder}
                        />
                    </div>

                    <button onClick={() => onAddStayReview(stay._id)}>
                        Add stay review
                    </button>
                </div>}
            </section>
        </>
    )
}
