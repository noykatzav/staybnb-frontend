const amenityIcons = {
  Wifi: '/icons/wifi.svg',
  Kitchen: '/icons/kitchen.svg',
  TV: '/icons/tv.svg',
  'Air conditioning': '/icons/air-conditioning.svg',
  'Free parking': '/icons/parking.svg',
  Washer: '/icons/washer.svg',
  Dryer: '/icons/dryer.svg',
  Pool: '/icons/pool.svg',
  'Hot tub': '/icons/hot-tub.svg',
  Gym: '/icons/gym.svg',
  Workspace: '/icons/workspace.svg',
  'Pets allowed': '/icons/pets.svg',
  Balcony: '/icons/balcony.svg',
  Garden: '/icons/garden.svg',
  Heating: '/icons/heating.svg',
  Dishwasher: '/icons/dishwasher.svg',
  'Coffee maker': '/icons/coffee-maker.svg',
  'BBQ grill': '/icons/bbq-grill.svg',
}

export function StayAmenities({ amenities }) {
  return (
    <section className="stay-amenities">
      <h2>What this place offers</h2>

      <ul className="stay-amenities-list">
        {amenities.map(amenity => (
          <li key={amenity}>
            {amenityIcons[amenity] && (
              <img src={amenityIcons[amenity]} alt="" />
            )}

            <span>{amenity}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}