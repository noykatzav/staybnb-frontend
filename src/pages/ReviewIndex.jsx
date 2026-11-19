import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { loadReviews, removeReview, getCmdAddReview, getCmdRemoveReview } from '../store/actions/review.actions'
import { loadUsers } from '../store/actions/user.actions'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { socketService, SOCKET_EVENT_REVIEW_ADDED, SOCKET_EVENT_REVIEW_REMOVED } from '../services/socket.service'
import { ReviewList } from '../cmps/ReviewList'
import { ReviewEdit } from '../cmps/ReviewEdit'

export function ReviewIndex() {
    const loggedInUser = useSelector(storeState => storeState.userModule.user)
    const reviews = useSelector(storeState => storeState.reviewModule.reviews)
    const dispatch = useDispatch()

    useEffect(() => {
        async function onLoadReviews() {
            try {
                await loadReviews()
                await loadUsers()
            } catch (err) {
                showErrorMsg('Cannot load reviews or users')
            }
        }
        function onAddReview(review) {
            dispatch(getCmdAddReview(review))
        }
        function onRemoveReview(reviewId) {
            dispatch(getCmdRemoveReview(reviewId))
        }

        onLoadReviews()
        socketService.on(SOCKET_EVENT_REVIEW_ADDED, onAddReview)
        socketService.on(SOCKET_EVENT_REVIEW_REMOVED, onRemoveReview)
        return () => {
            socketService.off(SOCKET_EVENT_REVIEW_ADDED, onAddReview)
            socketService.off(SOCKET_EVENT_REVIEW_REMOVED, onRemoveReview)
        }
    }, [dispatch])

    async function onRemoveReview(reviewId) {
        try {
            await removeReview(reviewId)
            showSuccessMsg('Review removed')
        } catch (err) {
            showErrorMsg('Cannot remove review')
        }
    }

    return (
        <div className="review-index">
            <h2>Reviews and Gossip</h2>
            {loggedInUser && <ReviewEdit />}
            <ReviewList reviews={reviews} onRemoveReview={onRemoveReview} />
        </div>
    )
}
