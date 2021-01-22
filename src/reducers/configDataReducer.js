import { getInitialMap } from '../util/seatFunctions';
import { SEATS_PER_ROW } from '../util/seatFunctions';
import {
    CONFIG_LIST_LOADED,
    CONFIG_SELECTED,
    CONFIG_BACK,
    CONFIG_SELECT_SEAT,
    CONFIG_SELECT_ROW,
    CONFIG_POSTING,
    CONFIG_POSTED,
    CONFIG_POST_ERROR,
    CONFIG_SET_NAME,
    CONFIG_DELETING,
    CONFIG_DELETE
} from '../actions/configDataActions';

export const initialConfigState = {
    configList: null,
    selectedConfig: null,
    posting: false,
    seatMap: null,
    errorMessage: null,
    deleting: null
};

const configDataReducer = (state, action) => {
    if (action.type === CONFIG_LIST_LOADED) {
        return {...state, configList: action.payload};
    }
    else if (action.type === CONFIG_SELECTED) {        
        if (!action.payload) {
            action.payload = {
                name: '',
                seats: [],
                rows: []
            }
        }
        let seats = getInitialMap();
        for (const seat of action.payload.seats) {
            seats[seat] = 'unavailable';
        }
        for (const row of action.payload.rows) {
            for (let i = 0; i < seats.length; i++) {
                if (Math.floor(i / SEATS_PER_ROW) === row) {
                    seats[i] = 'unavailable';
                }
            }
        }
        return {
            ...state,
            selectedConfig: action.payload,
            seatMap: seats,
            posting: false,
            errorMessage: null
        };
    }
    else if (action.type === CONFIG_BACK) {
        return {
            ...state,
            selectedConfig: null,
            errorMessage: null
        };
    }
    else if (action.type === CONFIG_SELECT_SEAT) {
        if (state.seatMap[action.payload] === 'available') {
            let newMap = state.seatMap.slice();
            newMap[action.payload] = 'unavailable';            
            return {
                ...state,
                selectedConfig: {
                    ...state.selectedConfig,
                    seats: [...state.selectedConfig.seats, action.payload]
                },
                seatMap: newMap
            };
        }
        else {
            let newMap = state.seatMap.slice();
            newMap[action.payload] = 'available';
            const newSeats = state.selectedConfig.seats.filter(s => s !== action.payload);
            return {
                ...state,
                selectedConfig: {
                    ...state.selectedConfig,
                    seats: newSeats
                },
                seatMap: newMap
            };
        }
    }
    else if (action.type === CONFIG_SELECT_ROW) {
        if (state.seatMap[action.payload] === 'available') {
            let newMap = state.seatMap.slice();
            const row = Math.floor(action.payload / SEATS_PER_ROW);
            for (let i = 0; i < newMap.length; i++) {
                if (Math.floor(i / SEATS_PER_ROW) === row) {
                    newMap[i] = 'unavailable';
                }
            }
            return {
                ...state,
                selectedConfig: {
                    ...state.selectedConfig,
                    rows: [...state.selectedConfig.rows, row]
                },
                seatMap: newMap
            }
        }
        else {
            let newMap = state.seatMap.slice();
            const row = Math.floor(action.payload / SEATS_PER_ROW);
            for (let i = 0; i < newMap.length; i++) {
                if (Math.floor(i / SEATS_PER_ROW) === row) {
                    if (!state.selectedConfig.seats.includes(i)) {
                        newMap[i] = 'available';
                    }                    
                }
            }
            return {
                ...state,
                selectedConfig: {
                    ...state.selectedConfig,
                    rows: state.selectedConfig.rows.filter(r => r !== row)
                },
                seatMap: newMap
            };
        }
    }    
    else if (action.type === CONFIG_POSTING) {
        return {
            ...state,
            posting: true
        };
    }
    else if (action.type === CONFIG_POSTED) {
        return {
            ...state,
            selectedConfig: null,
            posting: false
        };
    } 
    else if (action.type === CONFIG_POST_ERROR) {
        return {
            ...state,
            errorMessage: action.payload,
            posting: false
        };
    }
    else if (action.type === CONFIG_SET_NAME) {
        return {
            ...state,
            selectedConfig: {
                ...state.selectedConfig,
                name: action.payload
            }
        };
    }
    else if (action.type === CONFIG_DELETING) {
        return {
            ...state,
            deleting: action.payload
        }
    }
    else if (action.type === CONFIG_DELETE) {
        return {
            ...state,
            deleting: false,
            configList: state.configList.filter(c => c._id !== action.payload)
        };
    }
    return state;
}
export default configDataReducer;