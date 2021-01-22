import client from '../api/defaultClient';
import { tokenConfig } from './authActions';
import {
    LOAD_LIST,
    LOAD_ERROR,
    MASS_PUBLISHING,
    PUBLISH_FAILED,
    MASS_PUBLISHED,
    MASS_DELETING,
    DELETE_FAILURE,
    DELETE_SUCCESS,
    DELETE_PENDING,
    DELETE_CANCELED,
    SET_FILTER
} from './massListTypes';

export const loadList = () => (dispatch, getState) => {
    client
        .get('/masses', tokenConfig(getState))
        .then(response => {
            const masses = response.data.map(m => {
                m.date = new Date(m.date);
                return m;
            })
            dispatch(setMassList(masses));
        })
        .catch(err => {
            dispatch({ type: LOAD_ERROR });
        });
}

export const publishMass = mass => (dispatch, getState) => {
    dispatch(setMassPublishing(mass));
    client
        .patch(`/masses/${mass._id}`, { published: !mass.published }, tokenConfig(getState))
        .then(() => {
            dispatch(setMassPublished(mass));
        })
        .catch(() => {
            dispatch({ type: PUBLISH_FAILED });
        });
};

export const deleteMass = id => (dispatch, getState) => {
    dispatch(setMassDeleting(id));
    client
        .delete(`/masses/${id}`, tokenConfig(getState))
        .then(() => {
            dispatch(setMassDeleted(id));
        })
        .catch(() => {
            dispatch({type: DELETE_FAILURE});
        });
}

export const setMassList = massList => {
    return {
        type: LOAD_LIST,
        payload: massList
    }
}

export const setMassPublishing = mass => {
    return {
        type: MASS_PUBLISHING,
        payload: mass._id
    };
}

export const setMassPublished = mass => {
    return {
        type: MASS_PUBLISHED,
        payload: mass._id
    };
}

export const setMassDeleting = id => {
    return {
        type: MASS_DELETING,
        payload: id
    };
};

export const setMassDeleted = id => {
    return {
        type: DELETE_SUCCESS,
        payload: id
    };
};

export const setDeletePending = id => {
    return {
        type: DELETE_PENDING,
        payload: id
    };
};

export const setDeleteCanceled = () => {
    return {
        type: DELETE_CANCELED
    };
};

export const setFilter = filter => {
    return {
        type: SET_FILTER,
        payload: filter
    };
};