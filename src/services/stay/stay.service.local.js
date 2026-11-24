
import { storageService } from '../async-storage.service'
import { makeId, saveToStorage } from '../util.service'
import { userService } from '../user'
import demoStays from '../../data/demo-stays.json'

const STORAGE_KEY = 'stay'

export const stayService = {
    query,
    getById,
    save,
    remove,
    addStayReview
}

const seedStaysPromise = _createStays()


async function query(filterBy = {}) {
    await seedStaysPromise
    var stays = await storageService.query(STORAGE_KEY)
    const { txt, maxPrice, sortField, sortDir } = filterBy

    stays = _filterStays(stays, filterBy)

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

    stays = stays.map(({ _id, name, type, summary, price, bedrooms, beds, bathrooms, loc, imgUrls, reviews }) => ({ _id, name, type, summary, price, bedrooms, beds, bathrooms, loc, imgUrls, reviews }))
    return stays
}

function _filterStays(stays, filterBy) {
    const destination = filterBy.destination?.trim().toLocaleLowerCase() || ''
    const guestCount = (filterBy.adults || 0) + (filterBy.children || 0)

    return stays.filter(stay => {
        if (destination && ![stay.loc?.city, stay.loc?.country].some(value => value?.toLocaleLowerCase().includes(destination))) return false
        if (guestCount && (!Number.isFinite(stay.capacity) || stay.capacity < guestCount)) return false
        if (filterBy.pets > 0 && !stay.amenities?.includes('Pets allowed')) return false
        if (filterBy.checkIn && filterBy.checkOut && stay.blockedDates?.some(range =>
            range.checkIn <= filterBy.checkOut && range.checkOut >= filterBy.checkIn)) return false
        return true
    })
}

async function getById(stayId) {
    await seedStaysPromise
    return storageService.get(STORAGE_KEY, stayId)
}

async function remove(stayId) {
    await seedStaysPromise
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, stayId)
}

async function save(stay) {
    await seedStaysPromise
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
            blockedDates: [],
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
    const stays = await storageService.query(STORAGE_KEY)
    if (stays.length) return

    saveToStorage(STORAGE_KEY, demoStays)
}
