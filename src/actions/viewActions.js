import client from '../api/defaultClient';
import { tokenConfig } from './authActions';

export const MASS_LOADED = 'MASS_LOADED';
export const MASS_ERROR = 'MASS_ERROR';
export const CANCELING = 'CANCELING';
export const CANCEL_PENDING = 'CANCEL_PENDING';
export const CANCEL_CANCELED = 'CANCEL_CANCELED';
export const CANCELLED = 'CANCELLED';
export const CANCEL_FAILED = 'CANCEL_FAILED';

export const loadMass = id => (dispatch, getState) => {
    client
        .get(`/masses/${id}`, tokenConfig(getState))
        .then(response => {
            let m = response.data;
            m.date = new Date(m.date);
            dispatch(setMassLoaded(m));
        })
        .catch(() => {
            dispatch({ type: MASS_ERROR });
        });
};

export const cancelReservation = (mass, reservation) => (dispatch, getState) => {
    dispatch(setCancelling(reservation))
    client
        .delete(`/masses/${mass._id}/${reservation._id}`, tokenConfig(getState))
        .then(() => {
            dispatch(setCancelled(reservation));
        })
        .catch(() => {
            dispatch({ type: CANCEL_FAILED });
        })
};

export const setMassLoaded = mass => {
    return {
        type: MASS_LOADED,
        payload: mass
    };
};

export const setCancelling = reservation => {
    return {
        type: CANCELING,
        payload: reservation
    };
};

export const setCancelled = reservation => {
    return {
        type: CANCELLED,
        payload: reservation
    };
};

export const setCancelPending = item => {
    return {
        type: CANCEL_PENDING,        
        payload: item
    };
};

export const setCancelCanceled = () => {
    return {
        type: CANCEL_CANCELED
    };
};
    