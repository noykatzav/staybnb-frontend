import { reviewService } from '../../services/review'
import { userService } from '../../services/user'
import { store } from '../store'
import { ADD_REVIEW, REMOVE_REVIEW, SET_REVIEWS } from '../reducers/review.reducer'
import { SET_SCORE } from '../reducers/user.reducer'

export async function loadReviews() {
    try {
        const reviews = await reviewService.query()
        store.dispatch(getCmdSetReviews(reviews))
    } catch (err) {
        console.log('Cannot load reviews', err)
        throw err
    }
}

export async function addReview(review) {
    try {
        const savedReview = await reviewService.add(review)
        const { score } = savedReview.byUser
        const user = store.getState().userModule.user
        if (user) userService.saveLoggedinUser({ ...user, score })
        store.dispatch(getCmdAddReview(savedReview))
        store.dispatch(getCmdSetScore(score))
        return savedReview
    } catch (err) {
        console.log('Cannot add review', err)
        throw err
    }
}

export async function removeReview(reviewId) {
    try {
        await reviewService.remove(reviewId)
        store.dispatch(getCmdRemoveReview(reviewId))
    } catch (err) {
        console.log('Cannot remove review', err)
        throw err
    }
}

// Command Creators:
function getCmdSetReviews(reviews) {
    return { type: SET_REVIEWS, reviews }
}

export function getCmdRemoveReview(reviewId) {
    return { type: REMOVE_REVIEW, reviewId }
}

export function getCmdAddReview(review) {
    return { type: ADD_REVIEW, review }
}

function getCmdSetScore(score) {
    return { type: SET_SCORE, score }
}
