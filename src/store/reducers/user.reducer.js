import { userService } from '../../services/user'

export const INCREMENT = 'INCREMENT'
export const DECREMENT = 'DECREMENT'
export const CHANGE_COUNT = 'CHANGE_COUNT'
export const SET_USER = 'SET_USER'
export const SET_WATCHED_USER = 'SET_WATCHED_USER'
export const REMOVE_USER = 'REMOVE_USER'
export const SET_USERS = 'SET_USERS'
export const SET_SCORE = 'SET_SCORE'

const initialState = {
    count: 10,
    user: userService.getLoggedinUser(),
    users: [],
    watchedUser: null,
}

export function userReducer(state = initialState, action = {}) {
    switch (action.type) {
        case INCREMENT:
            return { ...state, count: state.count + 1 }
        case DECREMENT:
            return { ...state, count: state.count - 1 }
        case CHANGE_COUNT:
            return { ...state, count: state.count + action.diff }
        case SET_USER:
            return { ...state, user: action.user }
        case SET_WATCHED_USER:
            return { ...state, watchedUser: action.user }
        case REMOVE_USER:
            return { ...state, users: state.users.filter(user => user._id !== action.userId) }
        case SET_USERS:
            return { ...state, users: action.users }
        case SET_SCORE:
            if (!state.user) return state
            return { ...state, user: { ...state.user, score: action.score } }
        default:
            return state
    }
}
