import { storageService } from '../async-storage.service'
import { userService } from '../user'

const STORAGE_KEY = 'order'

export const orderService = {
    add,
    query,
    remove,
}

async function query(filterBy = {}) {
    let orders = await storageService.query(STORAGE_KEY)
    const { hostId, buyerId } = filterBy

    if (hostId) {
        orders = orders.filter(order => order.hostId === hostId)
    }

    if (buyerId) {
        orders = orders.filter(order => order.buyer?._id === buyerId)
    }

    return orders
}

async function remove(orderId) {
    await storageService.remove(STORAGE_KEY, orderId)
}

async function add(order) {
    const user = userService.getLoggedinUser()
    if (!user?._id) throw new Error('Please log in to place an order')

    const orderToAdd = {
        ...order,
        buyer: {
            _id: user._id,
            fullname: user.fullname,
            imgUrl: user.imgUrl,
        },
        status: 'pending',
        createdAt: Date.now(),
    }

    return storageService.post(STORAGE_KEY, orderToAdd)
}