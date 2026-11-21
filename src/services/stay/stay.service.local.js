
import { storageService } from '../async-storage.service'
import { makeId, saveToStorage, getRandomIntInclusive } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'stay'

export const stayService = {
    query,
    getById,
    save,
    remove,
    addStayReview
}

_createStays()
window.cs = stayService


async function query(filterBy = { txt: '', maxPrice: 100 }) {
    var stays = await storageService.query(STORAGE_KEY)
    const { txt, maxPrice, sortField, sortDir } = filterBy

    if (txt) {
        const regex = new RegExp(filterBy.txt, 'i')
        stays = stays.filter(stay => regex.test(stay.name) || regex.test(stay.summary))
    }

    if (maxPrice) {
        stays = stays.filter(stay => stay.price <= maxPrice)
    }

    if (sortField === 'type') {
        stays.sort((stay1, stay2) =>
            stay1[sortField].localeCompare(stay2[sortField]) * +sortDir)
    }

    if (sortField === 'price') {
        stays.sort((stay1, stay2) =>
            (stay1[sortField] - stay2[sortField]) * +sortDir)
    }

    stays = stays.map(({ _id, name, type, summary, price, bedrooms, beds, bathrooms, loc, imgUrls }) => ({ _id, name, type, summary, price, bedrooms, beds, bathrooms, loc, imgUrls }))
    return stays
}

function getById(stayId) {
    return storageService.get(STORAGE_KEY, stayId)
}

async function remove(stayId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, stayId)
}

async function save(stay) {
    var savedStay
    if (stay._id) {
        const stayToSave = {
            _id: stay._id,
            name: stay.name,
            type: stay.type,
            price: stay.price
        }
        savedStay = await storageService.put(STORAGE_KEY, stayToSave)
    } else {
        const stayToSave = {
            name: stay.name,
            type: stay.type,
            price: stay.price,
            // Later, owner is set by the backend
            host: userService.getLoggedinUser(),
            reviews: []
        }
        savedStay = await storageService.post(STORAGE_KEY, stayToSave)
    }
    return savedStay
}

async function addStayReview(stayId, txt) {
    // Later, this is all done by the backend
    const stay = await getById(stayId)

    const review = {
        id: makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    stay.reviews.push(review)
    await storageService.put(STORAGE_KEY, stay)

    return review
}

async function _createStays() {
    var stays = await storageService.query(STORAGE_KEY)

    if (stays && stays.length > 0) return

    const stayData = [
        ['Ribeira Charming Duplex', 'Apartment', 'Lisbon', 'Portugal', 'PT', 180, 38.7223, -9.1393, 2, 4, ['Trending', 'Top of the world']],
        ['Ocean View Luxury Villa', 'Villa', 'Mallorca', 'Spain', 'ES', 420, 39.6953, 3.0176, 4, 8, ['Amazing views', 'Luxury', 'Pool']],
        ['Cozy Mountain Cabin', 'Cabin', 'Grindelwald', 'Switzerland', 'CH', 145, 46.6242, 8.0414, 2, 4, ['Countryside', 'Nature']],
        ['Modern Beachfront Apartment', 'Apartment', 'Mykonos', 'Greece', 'GR', 230, 37.4467, 25.3289, 2, 5, ['Beachfront', 'Trending']],
        ['Minimalist City Loft', 'Loft', 'New York', 'United States', 'US', 195, 40.7128, -74.0060, 1, 2, ['City', 'Design']],
        ['Tropical Paradise Bungalow', 'Bungalow', 'Bali', 'Indonesia', 'ID', 125, -8.4095, 115.1889, 2, 4, ['Tropical', 'Nature']],
        ['Historic Parisian Apartment', 'Apartment', 'Paris', 'France', 'FR', 210, 48.8566, 2.3522, 2, 4, ['City', 'Historic']],
        ['Lake Como Dream House', 'House', 'Como', 'Italy', 'IT', 350, 45.8081, 9.0852, 3, 6, ['Amazing views', 'Lakefront']],
        ['Desert Escape Villa', 'Villa', 'Marrakech', 'Morocco', 'MA', 290, 31.6295, -7.9811, 3, 6, ['Pool', 'Luxury']],
        ['Scandinavian Forest Retreat', 'Cabin', 'Oslo', 'Norway', 'NO', 175, 59.9139, 10.7522, 2, 4, ['Countryside', 'Nature']],
        ['Santorini Sunset Suite', 'Apartment', 'Santorini', 'Greece', 'GR', 260, 36.3932, 25.4615, 1, 2, ['Amazing views', 'Romantic']],
        ['Modern Tokyo Hideaway', 'Apartment', 'Tokyo', 'Japan', 'JP', 155, 35.6762, 139.6503, 1, 2, ['City', 'Design']],
        ['Amalfi Coast Seaside Home', 'House', 'Amalfi', 'Italy', 'IT', 310, 40.6340, 14.6027, 3, 6, ['Beachfront', 'Amazing views']],
        ['Alpine Chalet with Fireplace', 'Chalet', 'Zermatt', 'Switzerland', 'CH', 280, 46.0207, 7.7491, 3, 6, ['Mountain', 'Skiing']],
        ['Bright Copenhagen Apartment', 'Apartment', 'Copenhagen', 'Denmark', 'DK', 165, 55.6761, 12.5683, 2, 4, ['City', 'Design']],
        ['Private Pool Garden Villa', 'Villa', 'Phuket', 'Thailand', 'TH', 240, 7.8804, 98.3923, 3, 6, ['Pool', 'Tropical']],
        ['Charming London Townhouse', 'House', 'London', 'United Kingdom', 'GB', 225, 51.5072, -0.1276, 3, 5, ['City', 'Historic']],
        ['Cliffside Ocean Retreat', 'Villa', 'Ubud', 'Indonesia', 'ID', 320, -8.5069, 115.2625, 2, 4, ['Amazing views', 'Nature']],
        ['Rustic Tuscan Farmhouse', 'Farm stay', 'Tuscany', 'Italy', 'IT', 195, 43.7711, 11.2486, 3, 6, ['Countryside', 'Nature']],
        ['Downtown Luxury Penthouse', 'Penthouse', 'Dubai', 'United Arab Emirates', 'AE', 390, 25.2048, 55.2708, 3, 6, ['Luxury', 'City']],
        ['Charming Amsterdam Canal House', 'House', 'Amsterdam', 'Netherlands', 'NL', 205, 52.3676, 4.9041, 2, 4, ['Waterfront', 'Historic']],
        ['Coastal Cottage Escape', 'Cottage', 'Cornwall', 'United Kingdom', 'GB', 150, 50.2660, -5.0527, 2, 4, ['Beachfront', 'Countryside']],
        ['Modern Sydney Harbour Stay', 'Apartment', 'Sydney', 'Australia', 'AU', 260, -33.8688, 151.2093, 2, 4, ['Waterfront', 'City']],
        ['Jungle Treehouse Experience', 'Treehouse', 'La Fortuna', 'Costa Rica', 'CR', 185, 10.4670, -84.6427, 1, 2, ['Nature', 'Adventure']],
        ['Luxury Lakefront Cabin', 'Cabin', 'Lake Tahoe', 'United States', 'US', 275, 39.0968, -120.0324, 3, 6, ['Lakefront', 'Mountain']],
        ['Old Town Prague Apartment', 'Apartment', 'Prague', 'Czech Republic', 'CZ', 135, 50.0755, 14.4378, 2, 4, ['Historic', 'City']],
        ['Ibiza White Stone Villa', 'Villa', 'Ibiza', 'Spain', 'ES', 380, 38.9067, 1.4206, 4, 8, ['Pool', 'Luxury']],
        ['Modern Desert Adobe House', 'House', 'Joshua Tree', 'United States', 'US', 220, 34.1347, -116.3131, 2, 4, ['Desert', 'Design']],
        ['Traditional Kyoto Machiya', 'House', 'Kyoto', 'Japan', 'JP', 190, 35.0116, 135.7681, 2, 4, ['Historic', 'Culture']],
        ['Secluded Beach House', 'House', 'Tulum', 'Mexico', 'MX', 245, 20.2114, -87.4654, 3, 6, ['Beachfront', 'Tropical']],
        ['Mountain View Glass Cabin', 'Cabin', 'Reykjavik', 'Iceland', 'IS', 290, 64.1466, -21.9426, 2, 4, ['Amazing views', 'Nature']],
        ['Elegant Vienna Residence', 'Apartment', 'Vienna', 'Austria', 'AT', 175, 48.2082, 16.3738, 2, 4, ['City', 'Historic']],
        ['Maldives Overwater Bungalow', 'Bungalow', 'Malé', 'Maldives', 'MV', 550, 4.1755, 73.5093, 1, 2, ['Waterfront', 'Luxury']],
        ['Charming Porto Riverside Loft', 'Loft', 'Porto', 'Portugal', 'PT', 155, 41.1579, -8.6291, 1, 2, ['Waterfront', 'Trending']],
        ['Modern Cape Town Villa', 'Villa', 'Cape Town', 'South Africa', 'ZA', 310, -33.9249, 18.4241, 3, 6, ['Amazing views', 'Pool']],
        ['Quiet Provence Country House', 'House', 'Aix-en-Provence', 'France', 'FR', 230, 43.5297, 5.4474, 3, 6, ['Countryside', 'Garden']],
        ['Bright Barcelona City Flat', 'Apartment', 'Barcelona', 'Spain', 'ES', 185, 41.3874, 2.1686, 2, 4, ['City', 'Beachfront']],
        ['Seaside Santorini Villa', 'Villa', 'Oia', 'Greece', 'GR', 440, 36.4618, 25.3753, 3, 6, ['Amazing views', 'Pool']],
        ['Forest Edge Tiny House', 'Tiny house', 'Portland', 'United States', 'US', 115, 45.5152, -122.6784, 1, 2, ['Nature', 'Countryside']],
        ['Luxury Milan Design Apartment', 'Apartment', 'Milan', 'Italy', 'IT', 250, 45.4642, 9.1900, 2, 4, ['Design', 'City']],
        ['Traditional Marrakech Riad', 'Riad', 'Marrakech', 'Morocco', 'MA', 175, 31.6295, -7.9811, 3, 6, ['Historic', 'Pool']],
        ['Lakeside Scandinavian Cabin', 'Cabin', 'Stockholm', 'Sweden', 'SE', 205, 59.3293, 18.0686, 2, 4, ['Lakefront', 'Nature']],
        ['Sunny Tel Aviv Apartment', 'Apartment', 'Tel Aviv', 'Israel', 'IL', 190, 32.0853, 34.7818, 2, 4, ['Beachfront', 'City']],
        ['Galilee Olive Grove Retreat', 'House', 'Rosh Pina', 'Israel', 'IL', 210, 32.9689, 35.5425, 3, 6, ['Countryside', 'Nature']],
        ['Negev Desert Luxury Lodge', 'Lodge', 'Mitzpe Ramon', 'Israel', 'IL', 260, 30.6094, 34.8017, 2, 4, ['Desert', 'Amazing views']],
        ['Modern Rio Beach Apartment', 'Apartment', 'Rio de Janeiro', 'Brazil', 'BR', 175, -22.9068, -43.1729, 2, 4, ['Beachfront', 'City']],
        ['Andes Mountain Lodge', 'Lodge', 'Cusco', 'Peru', 'PE', 160, -13.5320, -71.9675, 2, 4, ['Mountain', 'Adventure']],
        ['Elegant Budapest Residence', 'Apartment', 'Budapest', 'Hungary', 'HU', 140, 47.4979, 19.0402, 2, 4, ['Historic', 'City']],
        ['Private Garden Cottage', 'Cottage', 'Dublin', 'Ireland', 'IE', 165, 53.3498, -6.2603, 2, 3, ['Garden', 'Countryside']],
        ['Modern Vancouver Waterfront', 'Apartment', 'Vancouver', 'Canada', 'CA', 240, 49.2827, -123.1207, 2, 4, ['Waterfront', 'City']],
        ['Whistler Alpine Chalet', 'Chalet', 'Whistler', 'Canada', 'CA', 330, 50.1163, -122.9574, 3, 6, ['Mountain', 'Skiing']],
        ['Luxury Palm Springs Villa', 'Villa', 'Palm Springs', 'United States', 'US', 360, 33.8303, -116.5453, 3, 6, ['Pool', 'Luxury']],
        ['Traditional Greek Island Home', 'House', 'Naxos', 'Greece', 'GR', 195, 37.1036, 25.3764, 2, 4, ['Beachfront', 'Historic']],
        ['Modern Seoul City Studio', 'Studio', 'Seoul', 'South Korea', 'KR', 125, 37.5665, 126.9780, 1, 2, ['City', 'Design']],
        ['Tropical Garden Retreat', 'Villa', 'Koh Samui', 'Thailand', 'TH', 225, 9.5120, 100.0136, 2, 4, ['Tropical', 'Pool']],
        ['Countryside Stone Cottage', 'Cottage', 'Edinburgh', 'United Kingdom', 'GB', 180, 55.9533, -3.1883, 2, 4, ['Countryside', 'Historic']],
        ['Luxury Waterfront Penthouse', 'Penthouse', 'Singapore', 'Singapore', 'SG', 410, 1.3521, 103.8198, 3, 6, ['Luxury', 'Waterfront']],
        ['Charming Bruges Canal House', 'House', 'Bruges', 'Belgium', 'BE', 170, 51.2093, 3.2247, 2, 4, ['Waterfront', 'Historic']],
        ['Oceanfront Surf Cottage', 'Cottage', 'Ericeira', 'Portugal', 'PT', 155, 38.9628, -9.4156, 2, 4, ['Beachfront', 'Adventure']],
        ['Modern Luxury Lake House', 'House', 'Queenstown', 'New Zealand', 'NZ', 340, -45.0312, 168.6626, 3, 6, ['Lakefront', 'Amazing views']],
        ['Cozy Old Town Apartment', 'Apartment', 'Dubrovnik', 'Croatia', 'HR', 205, 42.6507, 18.0944, 2, 4, ['Historic', 'City']],
    ]

    stays = stayData.map(_createStay)

    saveToStorage(STORAGE_KEY, stays)
}

function _createStay(data, idx) {
    const stayImages = [
        'photo-1600210492486-724fe5c67fb0',
        'photo-1600607687939-ce8a6c25118c',
        'photo-1600566753086-00f18fb6b3ea',
        'photo-1600585154340-be6161a56a0c',
        'photo-1600585154526-990dced4db0d',
        'photo-1600047509807-ba8f99d2cdde',
        'photo-1510798831971-661eb04b3739',
        'photo-1449844908441-8829872d2607',
        'photo-1600607687920-4e2a09cf159d',
        'photo-1600566753190-17f0baa2a6c3',
        'photo-1600566752355-35792bedcfea',
        'photo-1600566753190-17f0baa2a6c3',
        'photo-1600607687920-4e2a09cf159d',
        'photo-1600585154526-990dced4db0d',
        'photo-1600607687939-ce8a6c25118c',
        'photo-1600210492486-724fe5c67fb0',
        'photo-1510798831971-661eb04b3739',
        'photo-1600607688969-a5bfcd646154',
        'photo-1600566753086-00f18fb6b3ea',
        'photo-1600607687644-c7171b42498f',
        'photo-1600566753190-17f0baa2a6c3',
        'photo-1600585154340-be6161a56a0c',
        'photo-1600047509807-ba8f99d2cdde',
        'photo-1600566752355-35792bedcfea',
        'photo-1600607687920-4e2a09cf159d',
        'photo-1600607687939-ce8a6c25118c',
        'photo-1600585154526-990dced4db0d',
        'photo-1600210492486-724fe5c67fb0',
        'photo-1510798831971-661eb04b3739',
        'photo-1449844908441-8829872d2607',
    ]

    const stayAmenities = [
        'Wifi',
        'Kitchen',
        'TV',
        'Air conditioning',
        'Free parking',
        'Washer',
        'Dryer',
        'Pool',
        'Hot tub',
        'Gym',
        'Workspace',
        'Pets allowed',
        'Balcony',
        'Garden',
        'Heating',
        'Dishwasher',
        'Coffee maker',
        'BBQ grill',
    ]

    const hosts = [
        {
            _id: 'u101',
            fullname: 'Davit Pok',
            imgUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
            isSuperhost: true,
            hostingSince: '2026-01-01',
        },
        {
            _id: 'u102',
            fullname: 'Sofia Martinez',
            imgUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
            isSuperhost: false,
            hostingSince: '2024-06-05',
        },
        {
            _id: 'u103',
            fullname: 'Lucas Weber',
            imgUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
            isSuperhost: true,
            hostingSince: '2023-10-25',
        },
        {
            _id: 'u104',
            fullname: 'Emily Johnson',
            imgUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
            isSuperhost: true,
            hostingSince: '2022-02-27',
        },
        {
            _id: 'u105',
            fullname: 'Oliver Smith',
            imgUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
            isSuperhost: false,
            hostingSince: '2026-04-15',
        },
    ]

    const guests = [
        {
            _id: 'g101',
            fullname: 'Anna Wilson',
            imgUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200',
        },
        {
            _id: 'g102',
            fullname: 'Michael Brown',
            imgUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
        },
        {
            _id: 'g103',
            fullname: 'Jessica Lee',
            imgUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        },
    ]

    const [
        name, type, city, country, countryCode,
        price, lat, lng, bedrooms, capacity, labels
    ] = data

    const host = hosts[idx % hosts.length]
    const guest = guests[idx % guests.length]

    // amenities
    const amenityCount = getRandomIntInclusive(4, 10)
    const amenities = []

    while (amenities.length < amenityCount) {
        const randomIdx = getRandomIntInclusive(0, stayAmenities.length - 1)
        const amenity = stayAmenities[randomIdx]

        if (!amenities.includes(amenity)) {
            amenities.push(amenity)
        }
    }

    // images
    const imgCount = getRandomIntInclusive(6, 9)
    const imgUrls = []

    while (imgUrls.length < imgCount) {
        const randomIdx = getRandomIntInclusive(0, stayImages.length - 1)
        const img = stayImages[randomIdx]

        const imgUrl = `https://images.unsplash.com/${img}?w=1200`

        if (!imgUrls.includes(imgUrl)) {
            imgUrls.push(imgUrl)
        }
    }

    const stayHighlights = [
        {
            id: 'location',
            icon: 'location-pin',
            title: `In ${city}, ${country}`,
            description: `Explore ${city} during your stay.`,
        },
        {
            id: 'capacity',
            icon: 'user-circle',
            title: `Space for ${capacity} guests`,
            description: `This ${type.toLowerCase()} accommodates up to ${capacity} guests.`,
        },
        {
            id: 'host',
            icon: 'heart-outline',
            title: `Hosted by ${host.fullname}`,
            description: `Your host for this stay is ${host.fullname}.`,
        },
        {
            id: 'kitchen',
            icon: 'kitchen',
            title: 'Cook during your stay',
            description: 'A kitchen is available for preparing your meals.',
            requiredAmenity: 'Kitchen',
        },
        {
            id: 'parking',
            icon: 'parking',
            title: 'Free parking',
            description: 'Parking is available at no extra cost.',
            requiredAmenity: 'Free parking',
        },
        {
            id: 'balcony',
            icon: 'balcony',
            title: 'Enjoy some fresh air',
            description: 'Spend some outdoor time on the balcony.',
            requiredAmenity: 'Balcony',
        },
    ]

    const availableHighlights = stayHighlights.filter(highlight =>
        !highlight.requiredAmenity ||
        amenities.includes(highlight.requiredAmenity)
    )

    const highlightCount = getRandomIntInclusive(
        2,
        Math.min(5, availableHighlights.length)
    )

    const highlights = []

    while (highlights.length < highlightCount) {
        const randomIdx = getRandomIntInclusive(
            0,
            availableHighlights.length - 1
        )

        const highlight = availableHighlights.splice(randomIdx, 1)[0]
        highlights.push(highlight)
    }

    return {
        _id: 's' + makeId(),
        name,
        type,
        imgUrls,
        price,
        summary: `Enjoy this beautiful ${type.toLowerCase()} in ${city}, ${country}. A comfortable and stylish place to stay, perfect for exploring the area and enjoying a memorable getaway.`,
        capacity,
        bedrooms,
        beds: getRandomIntInclusive(1, 4),
        bathrooms: getRandomIntInclusive(1, 3),
        amenities,
        labels,
        highlights,
        host,
        loc: {
            country,
            countryCode,
            city,
            address: `${10 + idx} Main Street`,
            lat,
            lng,
        },
        reviews: [{
            id: `r${101 + idx}`,
            txt: `We had a wonderful stay in ${city}! The place was beautiful, comfortable and exactly as described. Highly recommended!`,
            rate: idx % 5 === 0 ? 4 : 5,
            by: guest,
        }],
        likedByUsers: idx % 3 === 0 ? ['mini-user'] : [],
    }
}
