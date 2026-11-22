import PropTypes from 'prop-types'

export function StayGallery({ imgUrls, stayName }) {
    return (
        <section className="stay-gallery">
            {imgUrls.slice(0, 5).map((url, idx) => (
                <img
                    key={url}
                    src={url}
                    alt={`${stayName} - photo ${idx + 1}`}
                />
            ))}
        </section>
    )
}

StayGallery.propTypes = {
    imgUrls: PropTypes.arrayOf(PropTypes.string).isRequired,
    stayName: PropTypes.string.isRequired,
}
