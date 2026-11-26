import { orderService } from '../../services/order'
import { store } from '../store'
import { ADD_ORDER, SET_ORDERS, UPDATE_ORDER } from '../reducers/order.reducer'

export async function loadOrders(filterBy = {}) {
    try {
        const orders = await orderService.query(filterBy)
        store.dispatch(getCmdSetOrders(orders))
        return orders
    } catch (err) {
        console.log('Cannot load orders', err)
        throw err
    }
}

export async function addOrder(order) {
    try {
        const savedOrder = await orderService.add(order)
        store.dispatch(getCmdAddOrder(savedOrder))
        return savedOrder
    } catch (err) {
        console.log('Cannot add order', err)
        throw err
    }
}

export async function updateOrderStatus(orderId, status) {
    try {
        const savedOrder = await orderService.updateStatus(orderId, status)
        store.dispatch(getCmdUpdateOrder(savedOrder))
        return savedOrder
    } catch (err) {
        console.log('Cannot update order status', err)
        throw err
    }
}

// Command Creators:
function getCmdSetOrders(orders) {
    return { type: SET_ORDERS, orders }
}

export function getCmdAddOrder(order) {
    return { type: ADD_ORDER, order }
}

function getCmdUpdateOrder(order) {
    return { type: UPDATE_ORDER, order }
}
