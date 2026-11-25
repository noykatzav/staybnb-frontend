import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { loadOrders, updateOrderStatus } from '../store/actions/order.actions'
import { getStayGuestLabel } from '../services/stay/stay-search.service'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'

export function HostIndex() {
    const user = useSelector(storeState => storeState.userModule.user)
    const orders = useSelector(storeState => storeState.orderModule.orders)

    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState('')
    const [selectedOrderId, setSelectedOrderId] = useState(null)
    const [isSavingStatus, setIsSavingStatus] = useState(false)
    const [statusFilter, setStatusFilter] = useState('all')

    const userId = user?._id
    const hostOrders = orders.filter(order => order.hostId === userId)

    const approvedOrders = hostOrders.filter(order =>
        order.status === 'approved'
    )

    const pendingCount = hostOrders.filter(order =>
        order.status === 'pending'
    ).length

    const approvedTotal = approvedOrders.reduce((sum, order) =>
        sum + order.totalPrice, 0
    )

    const displayedOrders = statusFilter === 'all'
        ? hostOrders
        : hostOrders.filter(order => order.status === statusFilter)

    const selectedOrder = displayedOrders.find(order =>
        order._id === selectedOrderId
    ) || displayedOrders[0]

    useEffect(() => {
        if (!userId) return

        async function onLoadOrders() {
            try {
                setIsLoading(true)
                setError('')
                await loadOrders({ hostId: userId })
            } catch (err) {
                setError('Cannot load reservations')
            } finally {
                setIsLoading(false)
            }
        }

        onLoadOrders()
    }, [userId])

    async function onUpdateOrderStatus(orderId, status) {
        try {
            setIsSavingStatus(true)
            await updateOrderStatus(orderId, status)
            showSuccessMsg(`Reservation ${status}`)
        } catch (err) {
            showErrorMsg('Cannot update reservation status')
        } finally {
            setIsSavingStatus(false)
        }
    }

    function formatDate(value) {
        if (!value) return '—'

        return new Date(value).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
    }

    return (
        <section className="host-index">
            <header className="host-header">
                <Link to="/stay" className="host-logo">Staybnb</Link>

                <span className="host-nav-active">Reservations</span>

                <div className="host-header-user">
                    <Link to="/stay">Switch to traveling</Link>
                    {user?.imgUrl && (
                        <img src={user.imgUrl} alt="" />
                    )}
                </div>
            </header>

            {!user ? (
                <p>
                    <Link to="/auth/login">Log in</Link>
                    {' '}to view your reservations.
                </p>
            ) : (
                <>
                    <div className="host-stats">
                        <article>
                            <span>Approved reservations total</span>
                            <strong>
                                ${approvedTotal.toLocaleString('en-US')}
                            </strong>
                        </article>

                        <article>
                            <span>Total reservations</span>
                            <strong>{hostOrders.length}</strong>
                        </article>

                        <article>
                            <span>Pending requests</span>
                            <strong>{pendingCount}</strong>
                        </article>

                        <article>
                            <span>Approved reservations</span>
                            <strong>{approvedOrders.length}</strong>
                        </article>
                    </div>

                    <h1>Reservations</h1>
                    <p className="host-subtitle">
                        Manage reservations for your listings.
                    </p>

                    <div className="host-filters">
                        {['all', 'pending', 'approved', 'declined', 'cancelled'].map(status => (
                            <button
                                key={status}
                                type="button"
                                className={statusFilter === status ? 'active' : ''}
                                onClick={() => setStatusFilter(status)}
                            >
                                {status}
                            </button>
                        ))}
                    </div>

                    {error && <p>{error}</p>}

                    <div className="host-table-container">
                        <table className="host-orders-table">
                            <thead>
                                <tr>
                                    <th>Status</th>
                                    <th>Guests</th>
                                    <th>Check-in</th>
                                    <th>Checkout</th>
                                    <th>Booked</th>
                                    <th>Listing</th>
                                    <th>Total price</th>
                                    <th>Action</th>
                                    <th>Details</th>
                                </tr>
                            </thead>

                            <tbody>
                                {isLoading ? (
                                    <tr>
                                        <td colSpan={9} className="host-empty">
                                            Loading reservations...
                                        </td>
                                    </tr>
                                ) : !displayedOrders.length ? (
                                    <tr>
                                        <td colSpan={9} className="host-empty">
                                            {error
                                                ? 'Reservations could not be loaded.'
                                                : 'No reservations found.'}
                                        </td>
                                    </tr>
                                ) : displayedOrders.map(order => {
                                    return (
                                        <tr key={order._id}>
                                            <td>
                                                <span
                                                    className="host-status"
                                                    data-status={order.status}
                                                >
                                                    {order.status}
                                                </span>
                                            </td>

                                            <td>
                                                <div className="host-guest" title={order.buyer.fullname}>
                                                    {order.buyer.imgUrl && (
                                                        <img src={order.buyer.imgUrl} alt="" />
                                                    )}

                                                    <span>{getStayGuestLabel(order.guests)}</span>
                                                </div>
                                            </td>

                                            <td>{formatDate(order.checkIn)}</td>
                                            <td>{formatDate(order.checkOut)}</td>
                                            <td>{formatDate(order.createdAt)}</td>
                                            <td>{order.stay.name}</td>

                                            <td>
                                                ${order.totalPrice.toLocaleString('en-US')}
                                            </td>

                                            <td>
                                                <select
                                                    aria-label={`Action for ${order.stay.name} reservation`}
                                                    value={order.status || 'pending'}
                                                    disabled={isSavingStatus}
                                                    onChange={ev => onUpdateOrderStatus(order._id, ev.target.value)}
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="approved">Approved</option>
                                                    <option value="declined">Declined</option>
                                                    {order.status === 'cancelled' && (
                                                        <option value="cancelled" disabled>Cancelled</option>
                                                    )}
                                                </select>
                                            </td>

                                            <td>
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedOrderId(order._id)}
                                                >
                                                    Details
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>

                    {!isLoading && !error && selectedOrder && (
                        <div className="host-order-details">
                            <h2>Order details</h2>
                            <pre>{JSON.stringify(selectedOrder, null, 2)}</pre>
                        </div>
                    )}
                </>
            )}
        </section>
    )
}
