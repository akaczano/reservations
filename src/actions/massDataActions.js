import client from '../api/defaultClient';
import { tokenConfig } from './authActions'; 

export const MASS_SAVED = 'MASS_SAVED';
export const MASS_SAVE_ERROR = 'MASS_SAVE_ERROR';
export const MASS_SAVING = 'MASS_SAVING';
export const MASS_SET_DATE = 'MASS_SET_DATE';
export const MASS_SET_CONFIG = 'MASS_SET_CONFIG';
export const MASS_SET_PUBLISHED = 'MASS_SET_PUBLISHED';
export const MASS_DONE = 'MASS_DONE';

export const saveMass = mass => (dispatch, getState) => {
    dispatch({type: MASS_SAVING});
    client
        .post('/masses/', mass, tokenConfig(getState))
        .then(() => {
            dispatch({type: MASS_SAVED});
        })
        .catch(err => {
            dispatch({
                type: MASS_SAVE_ERROR,
                payload: err.response.data.errorMessage
            });
        });
};

export const setDate = date => {
    return {
        type: MASS_SET_DATE,
        payload: date
    };
};

export const setConfig = config => {
    return {
        type: MASS_SET_CONFIG,
        payload: config
    };
};

export const setPublished = () => {
    return {
        type: MASS_SET_PUBLISHED        
    };
};

export const setDone = () => {
    return {
        type: MASS_DONE
    };
};