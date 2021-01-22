import client from '../api/defaultClient';
import { tokenConfig } from './authActions';

export const CONFIG_LIST_LOADED = 'CONFIG_LIST_LOADED';
export const CONFIG_LIST_ERROR = 'CONFIG_LIST_ERROR';
export const CONFIG_SELECTED = 'CONFIG_SELECTED';
export const CONFIG_BACK = 'CONFIG_BACK';
export const CONFIG_LOADED = 'CONFIG_LOADED';
export const CONFIG_POSTING = 'CONFIG_POSTING';
export const CONFIG_POSTED = 'CONFIG_POSTED';
export const CONFIG_POST_ERROR = 'CONFIG_POST_ERROR';
export const CONFIG_SELECT_SEAT = 'CONFIG_SELECT_SEAT';
export const CONFIG_SELECT_ROW = 'CONFIG_SELECT_ROW';
export const CONFIG_SET_NAME = 'CONFIG_SET_NAME';
export const CONFIG_DELETING = 'CONFIG_DELETING';
export const CONFIG_DELETE = 'CONFIG_DELETE';

export const loadConfigList = () => (dispatch, getState) => {       
    client
        .get('/config', tokenConfig(getState))
        .then(result => {
            dispatch(setConfigList(result.data));
        })
        .catch(err => {
            dispatch(setConfigListError(err.response.data.errorMessage));
        });
};

export const saveConfig = config => (dispatch, getState) => {
    dispatch({type: CONFIG_POSTING});
    let body = {
        name: config.name,
        rows: config.rows,
        seats: config.seats
    };
    if (config._id) {
        body["id"] = config._id;
    }    
    client
        .put('/config/', body, tokenConfig(getState))
        .then(() => {
            dispatch({ type: CONFIG_POSTED });
        })
        .catch(err => {            
            dispatch(saveError(err.response.data.errorMessage));
        });
};

export const deleteConfig = config => (dispatch, getState) => {
    dispatch(setDeleting(config._id));
    client
        .delete(`/config/${config._id}`, tokenConfig(getState))
        .then(() => {
            dispatch(setDeleted(config._id));
        })
        .catch(err => {
            alert('Could not delete configuration');
        });
};

export const setConfigList = list => {
    return {
        type: CONFIG_LIST_LOADED,
        payload: list
    };
};

export const setConfig = config => {
    return {
        type: CONFIG_SELECTED,
        payload: config
    }
};

export const setConfigListError = error => {
    return {
        type: CONFIG_LIST_ERROR,
        payload: error
    };
};

export const goBack = () => {
    return {
        type: CONFIG_BACK
    }
};

export const selectSeat = seat => {
    return {
        type: CONFIG_SELECT_SEAT,
        payload: seat
    };
};

export const selectRow = seat => {
    return {
        type: CONFIG_SELECT_ROW,
        payload: seat
    };
};

export const saveError = err => {
    return {
        type: CONFIG_POST_ERROR,
        payload: err
    };
}

export const setName = name => {
    return {
        type: CONFIG_SET_NAME,
        payload: name
    };
}

export const setDeleted = id => {
    return {
        type: CONFIG_DELETE,
        payload: id
    };
};

export const setDeleting = id => {
    return {
        type: CONFIG_DELETING,
        payload: id
    };
};