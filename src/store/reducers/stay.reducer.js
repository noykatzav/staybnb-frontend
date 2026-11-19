export const SET_STAYS = 'SET_STAYS'
export const SET_STAY = 'SET_STAY'
export const REMOVE_STAY = 'REMOVE_STAY'
export const ADD_STAY = 'ADD_STAY'
export const UPDATE_STAY = 'UPDATE_STAY'
export const ADD_STAY_REVIEW = 'ADD_STAY_REVIEW'

const initialState = {
    stays: [],
    stay: null,
}

export function stayReducer(state = initialState, action = {}) {
    switch (action.type) {
        case SET_STAYS:
            return { ...state, stays: action.stays }
        case SET_STAY:
            return { ...state, stay: action.stay }
        case REMOVE_STAY:
            return {
                ...state,
                stays: state.stays.filter(stay => stay._id !== action.stayId),
                lastRemovedStay: state.stays.find(stay => stay._id === action.stayId),
            }
        case ADD_STAY:
            return { ...state, stays: [...state.stays, action.stay] }
        case UPDATE_STAY:
            return { ...state, stays: state.stays.map(stay => stay._id === action.stay._id ? action.stay : stay) }
        case ADD_STAY_REVIEW:
            if (!action.review || !state.stay) return state
            return { ...state, stay: { ...state.stay, reviews: [...(state.stay.reviews || []), action.review] } }
        default:
            return state
    }
}
