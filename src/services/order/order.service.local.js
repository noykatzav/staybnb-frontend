import { storageService } from '../async-storage.service'
import { userService } from '../user'
import { saveToStorage } from '../util.service'
import demoOrders from '../../data/demo-orders.json'

const STORAGE_KEY = 'order'
const seedOrdersPromise = _createOrders()

export const orderService = {
    add,
    query,
    remove,
    updateStatus,
}

async function query(filterBy = {}) {
    await seedOrdersPromise
    let orders = await storageService.query(STORAGE_KEY)
    const { hostId, buyerId } = filterBy

    if (hostId) {
        orders = orders.filter(order => order.hostId === hostId)
    }

    if (buyerId) {
        orders = orders.filter(order => order.buyer?._id === buyerId)
    }

    orders.sort((order1, order2) => order2.createdAt - order1.createdAt)
    return orders
}

async function remove(orderId) {
    await _getHostOrder(orderId)
    await storageService.remove(STORAGE_KEY, orderId)
}

async function add(order) {
    await seedOrdersPromise
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

async function updateStatus(orderId, status) {
    const validStatuses = ['pending', 'approved', 'declined']

    if (!validStatuses.includes(status)) {
        throw new Error('Invalid order status')
    }

    const order = await _getHostOrder(orderId)

    return storageService.put(STORAGE_KEY, {
        ...order,
        status,
    })
}

async function _getHostOrder(orderId) {
    await seedOrdersPromise
    const user = userService.getLoggedinUser()

    if (!user?._id) {
        throw new Error('Please log in')
    }

    const order = await storageService.get(STORAGE_KEY, orderId)

    if (order.hostId !== user._id) {
        throw new Error('Only the host can manage this order')
    }

    return order
}

async function _createOrders() {
    const orders = await storageService.query(STORAGE_KEY)
    if (orders.length) return

    saveToStorage(STORAGE_KEY, demoOrders)
}