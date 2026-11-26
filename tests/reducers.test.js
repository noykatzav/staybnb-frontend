import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
    stayReducer, SET_STAYS, SET_STAY, ADD_STAY, UPDATE_STAY,
    REMOVE_STAY, ADD_STAY_REVIEW,
} from '../src/store/reducers/stay.reducer.js'
import {
    orderReducer, SET_ORDERS, ADD_ORDER, UPDATE_ORDER,
} from '../src/store/reducers/order.reducer.js'
import {
    systemReducer, LOADING_START, LOADING_DONE,
} from '../src/store/reducers/system.reducer.js'

describe('stay state', () => {
    it('starts with an empty list and no selected stay', () => {
        assert.deepEqual(stayReducer(), { stays: [], stay: null })
    })

    it('replaces the list while preserving the selected stay', () => {
        const stay = Object.freeze({ _id: 'selected' })
        const state = Object.freeze({ stays: Object.freeze([]), stay })
        const stays = [{ _id: 'new' }]
        assert.deepEqual(stayReducer(state, { type: SET_STAYS, stays }), { stays, stay })
    })

    it('selects and clears a stay without changing the list', () => {
        const stays = Object.freeze([{ _id: 'a' }])
        const state = Object.freeze({ stays, stay: null })
        const selected = stayReducer(state, { type: SET_STAY, stay: stays[0] })
        assert.equal(selected.stay, stays[0])
        assert.equal(selected.stays, stays)
        assert.equal(stayReducer(selected, { type: SET_STAY, stay: null }).stay, null)
    })

    it('adds, updates, and removes stays without mutating previous state', () => {
        const original = Object.freeze({ _id: 'a', name: 'Original' })
        const other = Object.freeze({ _id: 'b', name: 'Other' })
        const state = Object.freeze({ stays: Object.freeze([original]), stay: null })
        const added = stayReducer(state, { type: ADD_STAY, stay: other })
        Object.freeze(added.stays)
        Object.freeze(added)
        assert.deepEqual(added.stays, [original, other])
        const savedStay = Object.freeze({ ...original, name: 'Updated' })
        const updated = stayReducer(added, { type: UPDATE_STAY, stay: savedStay })
        Object.freeze(updated.stays)
        Object.freeze(updated)
        assert.deepEqual(updated.stays, [savedStay, other])
        const removed = stayReducer(updated, { type: REMOVE_STAY, stayId: 'a' })
        assert.deepEqual(removed.stays, [other])
        assert.equal(removed.lastRemovedStay, savedStay)
        assert.deepEqual(state.stays, [original])
        assert.deepEqual(added.stays, [original, other])
        assert.deepEqual(updated.stays, [savedStay, other])
    })

    it('ignores updates and removals for missing ids', () => {
        const state = { stays: [{ _id: 'a' }], stay: null }
        assert.deepEqual(stayReducer(state, { type: UPDATE_STAY, stay: { _id: 'missing' } }).stays, state.stays)
        assert.deepEqual(stayReducer(state, { type: REMOVE_STAY, stayId: 'missing' }).stays, state.stays)
    })

    it('appends a review without changing existing reviews or the listing', () => {
        const existing = Object.freeze({ id: 'old', txt: 'Lovely' })
        const stay = Object.freeze({ _id: 'a', reviews: Object.freeze([existing]) })
        const state = Object.freeze({ stays: Object.freeze([stay]), stay })
        const review = { id: 'new', txt: 'Great' }
        const updated = stayReducer(state, { type: ADD_STAY_REVIEW, review })
        assert.deepEqual(updated.stay.reviews, [existing, review])
        assert.deepEqual(stay.reviews, [existing])
        assert.equal(updated.stays, state.stays)
    })

    it('creates the review list when the selected stay has none', () => {
        const review = { id: 'new' }
        const updated = stayReducer({ stays: [], stay: { _id: 'a' } }, { type: ADD_STAY_REVIEW, review })
        assert.deepEqual(updated.stay.reviews, [review])
    })

    it('ignores a review when there is no selected stay or no review', () => {
        const empty = stayReducer()
        assert.equal(stayReducer(empty, { type: ADD_STAY_REVIEW, review: { id: 'new' } }), empty)
        const selected = { stays: [], stay: { _id: 'a' } }
        assert.equal(stayReducer(selected, { type: ADD_STAY_REVIEW }), selected)
    })
})

describe('order state', () => {
    it('starts with no orders', () => {
        assert.deepEqual(orderReducer(), { orders: [] })
    })

    it('replaces orders while preserving other state', () => {
        const state = Object.freeze({
            orders: Object.freeze([]),
            extra: 'keep',
        })
        const orders = [{ _id: 'a' }]

        assert.deepEqual(
            orderReducer(state, { type: SET_ORDERS, orders }),
            { ...state, orders }
        )
    })

    it('adds an order without mutating previous state', () => {
        const original = Object.freeze({ _id: 'a' })
        const other = Object.freeze({ _id: 'b' })
        const state = Object.freeze({
            orders: Object.freeze([original]),
        })

        const added = orderReducer(state, {
            type: ADD_ORDER,
            order: other,
        })

        assert.deepEqual(added.orders, [other, original])
        assert.deepEqual(state.orders, [original])
        assert.notEqual(added.orders, state.orders)
    })

    it('updates only the matching order without mutating the previous list', () => {
        const pending = Object.freeze({ _id: 'a', status: 'pending' })
        const other = Object.freeze({ _id: 'b', status: 'pending' })
        const state = Object.freeze({ orders: Object.freeze([pending, other]) })
        const approved = { ...pending, status: 'approved' }

        const updated = orderReducer(state, { type: UPDATE_ORDER, order: approved })

        assert.deepEqual(updated.orders, [approved, other])
        assert.deepEqual(state.orders, [pending, other])
    })
})

describe('loading state', () => {
    it('starts idle and transitions through loading back to idle', () => {
        const initial = Object.freeze(systemReducer())
        assert.equal(initial.isLoading, false)
        const loading = Object.freeze(systemReducer(initial, { type: LOADING_START }))
        assert.equal(loading.isLoading, true)
        assert.equal(systemReducer(loading, { type: LOADING_DONE }).isLoading, false)
        assert.equal(initial.isLoading, false)
        assert.equal(loading.isLoading, true)
    })
})

for (const reducer of [stayReducer, orderReducer, systemReducer]) {
    it(`${reducer.name} preserves state for unrelated actions`, () => {
        const state = Object.freeze(reducer())
        assert.equal(reducer(state, { type: 'UNRELATED_ACTION' }), state)
    })
}
