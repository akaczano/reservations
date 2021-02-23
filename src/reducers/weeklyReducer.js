import { getInitialMap, getMapForMass, SEATS_PER_ROW } from '../util/seatFunctions';

import {
    WEEKLY_LIST_LOADED,
    WEEKLY_LIST_ERROR,
    WEEKLY_SELECTED,
    WEEKLY_SAVING,
    WEEKLY_SAVED,
    WEEKLY_SAVE_ERROR,
    WEEKLY_BACK,
    WEEKLY_SET_DAY,
    WEEKLY_SET_HOUR,
    WEEKLY_SET_MINUTE,
    WEEKLY_SET_CONFIG,
    WEEKLY_SET_AMPM,
    WEEKLY_SET_DELETED,
    WEEKLY_DELETING,
    WEEKLY_DELETE_ERROR,
    WEEKLY_RES_SELECT,
    WEEKLY_SET_FIRST,
    WEEKLY_SET_LAST,
    WEEKLY_SELECT_SEAT,
    WEEKLY_CLOSE_SELECT,
    WEEKLY_SAVE_RESERVATION,    
    WEEKLY_DELETE_RESERVATION
} from '../actions/weeklyActions'


export const initialWeeklyState = {
    list: null,
    listError: false,
    selected: null,
    saving: false,
    deleting: null,
    saved: false,
    errorMessage: null,
    hourInvalid: false,
    minuteInvalid: false,
    configInvalid: false,
    rawHour: '',
    rawMinute: '',
    pm: false,
    success: false,    
    selection: {
        firstName: '',
        lastName: '',
        seats: [],
        seatMap: getInitialMap(),
        deleting: null,
        saving: false,
        modalVisible: false,
        firstInvalid: false,
        lastInvalid: false,        
        config: null,
        configurationId: ""
    },
    publish: {
        visible: false,
        wm: null
    }
};

const weeklyReducer = (state, action) => {
    if (action.type === WEEKLY_LIST_LOADED) {
        return {
            ...state,
            list: action.payload
        };
    }
    else if (action.type === WEEKLY_LIST_ERROR) {
        return {
            ...state,
            list: null,
            listError: true
        };
    }
    else if (action.type === WEEKLY_SELECTED) {
        if (!action.payload) {
            action.payload = {
                day: 0,
                hour: 1,
                minute: 0,
                configurationId: '',
                recurringReservations: []
            };
        }
        let rawMinute = action.payload.minute.toString();
        rawMinute = rawMinute.length > 1 ? rawMinute : '0' + rawMinute;

        return {
            ...state,
            selected: action.payload,
            pm: action.payload.hour >= 12,
            rawHour: (action.payload.hour > 12 ? action.payload.hour - 12 : action.payload.hour).toString(),
            rawMinute: rawMinute,
            saved: false
        };
    }
    else if (action.type === WEEKLY_SAVING) {
        let hour = parseInt(state.rawHour);
        let minute = parseInt(state.rawMinute);
        let hourValid = !isNaN(hour) && hour > 0 && hour <= 12;
        let minuteValid = !isNaN(minute) && (minute >= 0 && minute < 60);

        let configValid = true;

        for (const r of state.selected.recurringReservations) {
            for (const s of r.seats) {
                if (state.selection.config.seats.includes(s) || 
                    state.selection.config.rows.includes(Math.floor(s / SEATS_PER_ROW))) {
                    configValid = false;
                }
            }
        }

        let saving = hourValid && minuteValid && configValid;

        if (saving) {
            state.selected.hour = hour;
            state.selected.minute = minute;
            if (state.pm && hour !== 12) state.selected.hour += 12;
        }
        return {
            ...state,
            hourInvalid: !hourValid,
            minuteInvalid: !minuteValid,
            configInvalid: !configValid,
            saving: saving,
            success: false
        };
    }
    else if (action.type === WEEKLY_SAVED) {
        return {
            ...state,
            saving: false,
            saved: true
        }
    }
    else if (action.type === WEEKLY_SAVE_ERROR) {
        return {
            ...state,
            saving: false,
            errorMessage: action.payload
        };
    }
    else if (action.type === WEEKLY_BACK) {
        return {
            ...state,
            selected: null
        };
    }
    else if (action.type === WEEKLY_SET_DAY) {
        return {
            ...state,
            selected: {
                ...state.selected,
                day: action.payload
            }
        };
    }
    else if (action.type === WEEKLY_SET_HOUR) {
        return {
            ...state,
            rawHour: action.payload
        };
    }
    else if (action.type === WEEKLY_SET_MINUTE) {
        return {
            ...state,
            rawMinute: action.payload
        };
    }
    else if (action.type === WEEKLY_SET_CONFIG) {
        return {
            ...state,
            selected: {
                ...state.selected,
                configurationId: action.payload._id
            },
            selection: {
                ...state.selection,
                config: action.payload
            }
        };
    }
    else if (action.type === WEEKLY_SET_AMPM) {
        return {
            ...state,
            pm: action.payload
        };
    }
    else if (action.type === WEEKLY_DELETING) {
        return {
            ...state,
            deleting: action.payload
        };
    }
    else if (action.type === WEEKLY_SET_DELETED) {
        return {
            ...state,
            list: state.list.filter(e => e._id !== action.payload),
            deleting: null
        };
    }
    else if (action.type === WEEKLY_DELETE_ERROR) {
        return {
            ...state,
            deleting: null
        };
    }
    else if (action.type === WEEKLY_RES_SELECT) {
        let map = getMapForMass({
            reservations: [
                ...state.selected.recurringReservations
            ],
            configuration: state.selection.config
        });

        
        return {
            ...state,
            selection: {
                firstName: '',
                lastName: '',
                seats: [],
                seatMap: map,
                modalVisible: true,
                firstInvalid: false,
                lastInvalid: false,
                config: state.selection.config
            }
        };
    }
    else if (action.type === WEEKLY_SET_FIRST) {
        return {
            ...state,
            selection: {
                ...state.selection,
                firstName: action.payload
            }
        };
    }
    else if (action.type === WEEKLY_SET_LAST) {
        return {
            ...state,
            selection: {
                ...state.selection,
                lastName: action.payload
            }
        };
    }
    else if (action.type === WEEKLY_SELECT_SEAT) {
        if (state.selection.seatMap[action.payload] === 'available') {
            let newMap = state.selection.seatMap.slice();
            newMap[action.payload] = 'selected';
            return {
                ...state,
                selection: {
                    ...state.selection,
                    seats: [...state.selection.seats, action.payload],
                    seatMap: newMap
                }
            };
        }
        else if (state.selection.seatMap[action.payload] === 'selected') {
            let newMap = state.selection.seatMap.slice();
            newMap[action.payload] = 'available';
            return {
                ...state,
                selection: {
                    ...state.selection,
                    seats: state.selection.seats.filter(s => s !== action.payload),
                    seatMap: newMap
                }
            };
        }
    }
    else if (action.type === WEEKLY_CLOSE_SELECT) {
        return {
            ...state,
            selection: {
                ...state.selection,
                modalVisible: false
            }
        }
    }
    else if (action.type === WEEKLY_SAVE_RESERVATION) {

        let firstNameValid = state.selection.firstName.length > 0;
        let lastNameValid = state.selection.lastName.length > 0;        

        if (firstNameValid && lastNameValid) {
            return {
                ...state,
                selected: {
                    ...state.selected,
                    recurringReservations: [
                        ...state.selected.recurringReservations,
                        {
                            firstName: state.selection.firstName,
                            lastName: state.selection.lastName,
                            seats: state.selection.seats
                        }
                    ]
                },
                selection: {
                    ...state.selection,
                    modalVisible: false
                }
            }
        }
        else {
            return {
                ...state,
                selection: {
                    ...state.selection,
                    firstInvalid: !firstNameValid,
                    lastInvalid: !lastNameValid
                }
            };
        }

    }
    else if (action.type === WEEKLY_DELETE_RESERVATION) {
        return {
            ...state,
            selected: {
                ...state.selected,
                recurringReservations: state.selected.recurringReservations.filter((r, i) => {
                    return i !== action.payload
                })
            }
        };
    }
    return state;
};
export default weeklyReducer;