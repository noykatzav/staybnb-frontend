import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

export function ReviewPreview({ review }) {
    const { byUser, aboutUser } = review

    return <article className="review-preview">
        <p>About: <Link to={`/user/${aboutUser._id}`}>{aboutUser.fullname}</Link></p>
        <p className="review-by">By: <Link to={`/user/${byUser._id}`}>{byUser.fullname}</Link></p>
        <p className="review-txt">{review.txt}</p>
    </article>
}

ReviewPreview.propTypes = {
    review: PropTypes.shape({
        txt: PropTypes.string.isRequired,
        byUser: PropTypes.shape({ _id: PropTypes.string.isRequired, fullname: PropTypes.string.isRequired }).isRequired,
        aboutUser: PropTypes.shape({ _id: PropTypes.string.isRequired, fullname: PropTypes.string.isRequired }).isRequired,
    }).isRequired,
}
