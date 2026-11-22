import PropTypes from 'prop-types'

export function StayHighlights({ highlights = [] }) {
    if (!highlights.length) return null

    return (
        <section className="stay-highlights" aria-label="Listing highlights">
            <ul>
                {highlights.map(highlight => (
                    <li key={highlight.id}>
                        <img
                            src={`/icons/${highlight.icon}.svg`}
                            alt=""
                        />

                        <div>
                            <h3>{highlight.title}</h3>
                            <p>{highlight.description}</p>
                        </div>
                    </li>
                ))}
            </ul>
        </section>
    )
}

StayHighlights.propTypes = {
    highlights: PropTypes.arrayOf(PropTypes.shape({
        id: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        description: PropTypes.string.isRequired,
    })),
}
