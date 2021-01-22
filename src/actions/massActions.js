import { tokenConfig } from './authActions';
import client from '../api/defaultClient';

import {
    SET_MASS,
    GET_MASS_ERROR,
    DISPLAY_FORM_ERRORS,
    CONFIRM,
    RESERVE_PENDING,
    DISPLAY_RECEIPT,
    SELECT_SEAT,
    BACK
} from './massTypes';

export const getMass = id => (dispatch, getState) => {
    client
        .get(`/masses/${id}`, tokenConfig(getState))
        .then(response => {
            const mass = response.data;
            mass.date = new Date(mass.date);
            dispatch(setMass(mass));
        })
        .catch(err => {            
            dispatch(setMassError(err.response.data.errorMessage));
        })
};

export const setMass = mass => {
    return {
        type: SET_MASS,
        payload: mass
    };
};

export const saveReservation = (id, reservation) => (dispatch, getState) => {    
    dispatch(reservationPending());
    client
        .post(`/masses/${id}/reserve`, reservation, tokenConfig(getState))
        .then(result => {
            dispatch(displayReceipt());
        })
        .catch(err => {
            dispatch(setPostError(err.response.data.errorMessage));
        })
};

export const setMassError = error => {
    return {
        type: GET_MASS_ERROR,
        payload: error
    };
};

export const setSeatSelected = seat => {
    return {
        type: SELECT_SEAT,
        payload: seat
    };
};

export const confirm = () => {
    return {
        type: CONFIRM
    };
};

export const back = () => {
    return {
        type: BACK
    };
};

export const setPostError = err => {
    return {
        type: DISPLAY_FORM_ERRORS,
        payload: err
    };
};

export const displayReceipt = () => {
    return {
        type: DISPLAY_RECEIPT
    };
};

export const reservationPending = () => {
    return {
        type: RESERVE_PENDING,
    };
};
