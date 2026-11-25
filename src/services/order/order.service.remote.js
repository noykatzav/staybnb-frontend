import { httpService } from '../http.service'

export const orderService = {
    add,
    query,
    remove,
}

function query(filterBy = {}) {
    const searchParams = new URLSearchParams()

    if (filterBy.hostId) {
        searchParams.set('hostId', filterBy.hostId)
    }

    if (filterBy.buyerId) {
        searchParams.set('buyerId', filterBy.buyerId)
    }

    const queryStr = searchParams.toString()
    return httpService.get(queryStr ? `order?${queryStr}` : 'order')
}

async function remove(orderId) {
    await httpService.delete(`order/${orderId}`)
}

async function add(order) {
    return await httpService.post('order', order)
}