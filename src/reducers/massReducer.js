import { getMapForMass } from '../util/seatFunctions';

import {
    SET_MASS,
    GET_MASS_ERROR,
    SELECT_SEAT,
    CONFIRM,
    BACK,
    DISPLAY_FORM_ERRORS,
    DISPLAY_RECEIPT,
    RESERVE_PENDING
} from '../actions/massTypes';

const initialState = {
    mass: null,
    seats: null,
    errorMessage: null,
    stage: 'selection',
    postError: null,
    posting: false
};


const massReducer = (state = initialState, action) => {
    if (action.type === SET_MASS) {
        return {
            ...state,
            mass: action.payload,
            seats: getMapForMass(action.payload)
        }
    }
    else if (action.type === GET_MASS_ERROR) {
        return {
            ...state,
            errorMessage: action.payload
        };
    }
    else if (action.type === SELECT_SEAT) {
        let seats = state.seats.slice();
        if (seats[action.payload] === 'available') {
            seats[action.payload] = 'selected';
        }
        else if (seats[action.payload] === 'selected') {
            seats[action.payload] = 'available';
        }
        return {
            ...state,
            seats: seats
        }
    }
    else if (action.type === CONFIRM) {
        return {
            ...state,
            stage: 'input'
        }
    }
    else if (action.type === BACK) {
        return {
            ...state,
            stage: 'selection'
        };
    }
    else if (action.type === DISPLAY_FORM_ERRORS) {        
        return {
            ...state,
            postError: action.payload,
            posting: false
        };
    }
    else if (action.type === DISPLAY_RECEIPT) {
        return {
            ...state,
            stage: 'receipt',
            posting: false
        };
    }
    else if (action.type === RESERVE_PENDING) {
        return {
            ...state,
            posting: true
        };
    }
    return state;
};

export default massReducer;