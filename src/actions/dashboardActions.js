import client from '../api/defaultClient';
import { tokenConfig } from '../actions/authActions';

export const DASHBOARD_LOADED = 'DASHBOARD_LOADED';
export const DASHBOARD_LOAD_ERROR = 'DASHBOARD_LOAD_ERROR';

export const loadMassList = () => (dispatch, getState) => {
    client
        .get('/masses', tokenConfig(getState))
        .then(response => {
            const masses = response.data.map(m => {
                m.date = new Date(m.date);
                return m;
            });            
            dispatch(setMassList(masses));
        })
        .catch(err => {
            console.log(err);
            dispatch({ type: DASHBOARD_LOAD_ERROR });
        });
};

export const setMassList = (masses) => {
    return {
        type: DASHBOARD_LOADED,
        payload: masses
    };
};


