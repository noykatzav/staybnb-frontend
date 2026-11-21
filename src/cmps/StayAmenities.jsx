export function StayAmenities({ amenities }) {
  return (
    <section className="stay-amenities">
      <h2>What this place offers</h2>

      <ul className="stay-amenities-list">
        {amenities.map(amenity => (
          <li key={amenity}>
            {amenity}
          </li>
        ))}
      </ul>
    </section>
  )
}