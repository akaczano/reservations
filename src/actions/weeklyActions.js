import client from '../api/defaultClient';
import { tokenConfig } from './authActions';

export const WEEKLY_LIST_LOADED = 'WEEKLY_LIST_LOADED';
export const WEEKLY_LIST_ERROR = 'WEEKLY_LIST_ERROR';
export const WEEKLY_SELECTED = 'WEEKLY_SELECTED';
export const WEEKLY_SAVING = 'WEEKLY_SAVING';
export const WEEKLY_SAVED = 'WEEKLY_SAVED';
export const WEEKLY_SAVE_ERROR = 'WEEKLY_SAVE_ERROR';
export const WEEKLY_BACK = 'WEEKLY_BACK';
export const WEEKLY_SET_DAY = 'WEEKLY_SET_DAY';
export const WEEKLY_SET_HOUR = 'WEEKLY_SET_HOUR';
export const WEEKLY_SET_MINUTE = 'WEEKLY_SET_MINUTE';
export const WEEKLY_SET_CONFIG = 'WEEKLY_SET_CONFIG';
export const WEEKLY_SET_AMPM = 'WEEKLY_SET_AMPM';
export const WEEKLY_DELETING = 'WEEKLY_DELETING';
export const WEEKLY_SET_DELETED = 'WEEKLY_SET_DELETED';
export const WEEKLY_DELETE_ERROR = 'WEEKLY_DELETE_ERROR';
export const WEEKLY_SUCCESS = 'WEEKLY_SUCCESS';
export const WEEKLY_RES_SELECT = 'WEEKLY_RES_SELECT';
export const WEEKLY_SET_FIRST = 'WEEKLY_SET_FIRST';
export const WEEKLY_SET_LAST = 'WEEKLY_SET_LAST';
export const WEEKLY_SELECT_SEAT = 'WEEKLY_SELECT_SEAT';
export const WEEKLY_CLOSE_SELECT = 'WEEKLY_CLOSE_SELECT';
export const WEEKLY_SAVE_RESERVATION = 'WEEKLY_SAVE_RESERVATION';
export const WEEKLY_DELETE_RESERVATION = 'WEEKLY_DELETE_RESERVATION';

export const loadList = () => (dispatch, getState) => {
    client
        .get('/weeklymass/', tokenConfig(getState))
        .then(result => {
            dispatch(setList(result.data))
        })
        .catch(() => {
            dispatch({ type: WEEKLY_LIST_ERROR });
        });
};

export const saveItem = () => (dispatch, getState) => {
    dispatch({ type: WEEKLY_SAVING });      
    if (getState().admin.weeklyMassForm.saving) {      
        let body = getState().admin.weeklyMassForm.selected;  
        console.log(body);        
        if (body._id) {
            body.id = body._id;
        }  
        
        client
            .post('/weeklymass', body, tokenConfig(getState))
            .then(() => {                
                dispatch({ type: WEEKLY_SAVED });
            })
            .catch(err => {                
                dispatch(displayError(err.response.data.errorMessage));
            });
    }
};

export const deleteItem = item => (dispatch, getState) => {
    dispatch(setDeleting(item));
    client
        .delete(`/weeklymass/${item._id}`, tokenConfig(getState))
        .then(() => {
            dispatch(setDeleted(item));
        })
        .catch(() => {
            dispatch({type: WEEKLY_DELETE_ERROR});
        });
};

export const setList = list => {
    return {
        type: WEEKLY_LIST_LOADED,
        payload: list
    };
};

export const selectItem = item => {
    return {
        type: WEEKLY_SELECTED,
        payload: item
    };
};

export const displayError = error => {
    return {
        type: WEEKLY_SAVE_ERROR,
        payload: error
    };
};

export const goBack = () => {
    return {
        type: WEEKLY_BACK
    };
};

export const setDay = day => {
    return {
        type: WEEKLY_SET_DAY,
        payload: day
    };
};

export const setHour = hour => {
    return {
        type: WEEKLY_SET_HOUR,
        payload: hour
    };
};

export const setMinute = minute => {
    return {
        type: WEEKLY_SET_MINUTE,
        payload: minute
    };
};

export const setConfig = config => {
    console.log(config);
    return {
        type: WEEKLY_SET_CONFIG,
        payload: config
    };
};

export const setPM = pm => {
    return {
        type: WEEKLY_SET_AMPM,
        payload: pm
    };
};

export const setDeleting = item => {
    return {
        type: WEEKLY_DELETING,
        payload: item._id
    };
};

export const setDeleted = item => {
    return {
        type: WEEKLY_SET_DELETED,
        payload: item._id
    };
};

export const setFirstName = name => {
    return {
        type: WEEKLY_SET_FIRST,
        payload: name
    };
};

export const setLastName = name => {
    return {
        type: WEEKLY_SET_LAST,
        payload: name
    };
};

export const selectSeat = seat => {
    return {
        type: WEEKLY_SELECT_SEAT,
        payload: seat
    };
};

export const newReservation = config  => {    
    return {
        type: WEEKLY_RES_SELECT,
        payload: config
    };
};

export const closeSelect = () => {
    return {
        type: WEEKLY_CLOSE_SELECT
    };
};

export const saveReservation = config => {
    return {
         type: WEEKLY_SAVE_RESERVATION,
         payload: config
     };
};

export const deleteReservation = index => {
    return {
        type: WEEKLY_DELETE_RESERVATION,
        payload: index
    };
};
