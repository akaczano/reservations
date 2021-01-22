import { getMapForMass } from '../util/seatFunctions';
import {
    MASS_LOADED,    
    MASS_ERROR,
    CANCELING,
    CANCELLED,
    CANCEL_FAILED,
    CANCEL_PENDING,
    CANCEL_CANCELED
} from '../actions/viewActions';

const initialState = {
    mass: null,
    canceling: null,
    error: false,
    seatMap: null,    
    staged: null    
};

const viewReducer = (state=initialState, action) => {
    if (action.type === MASS_LOADED) {
        return {
            ...state,
            error: false,
            mass: action.payload,
            seatMap: getMapForMass(action.payload)
        };
    }
    else if (action.type === MASS_ERROR) {
        return {
            ...state,
            error: true
        }
    }
    else if (action.type === CANCELING) {
        return {
            ...state,
            canceling: action.payload,
            staged: null
        };
    }
    else if (action.type === CANCELLED) {
        let mass = {
            ...state.mass,
            reservations: state.mass.reservations.filter(r => r._id !== action.payload._id)
        }
        return {
            seatMap: getMapForMass(mass), 
            mass,
            canceling: null,
            staged: null           
        };
    }
    else if (action.type === CANCEL_FAILED) {
        return {
            ...state,
            canceling: null
        };
    }    
    else if (action.type === CANCEL_PENDING) {
        return {
            ...state,
            staged: action.payload,            
        };
    }
    else if (action.type === CANCEL_CANCELED) {
        return {
            ...state,
            staged: null            
        };
    }
    return state;
};

export default viewReducer;