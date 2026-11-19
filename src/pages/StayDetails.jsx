import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStay, addStayReview } from '../store/actions/stay.actions'

export function StayDetails() {
    const { stayId } = useParams()
    const stay = useSelector(storeState => storeState.stayModule.stay)

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

    async function onAddStayReview() {
        try {
            await addStayReview(stayId, 'bla bla ' + Math.floor(Math.random() * 10))
            showSuccessMsg('Stay review added')
        } catch (err) {
            showErrorMsg('Cannot add stay review')
        }
    }

    return (
        <section className="stay-details">
            <Link to="/stay">Back to list</Link>
            <h1>Stay Details</h1>
            {stay?._id === stayId && <div>
                <h3>{stay.name}</h3>
                <h4>${stay.price}</h4>
                <pre>{JSON.stringify(stay, null, 2)}</pre>
            </div>}
            <button disabled={stay?._id !== stayId} onClick={onAddStayReview}>Add stay review</button>
        </section>
    )
}
