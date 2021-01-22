import client from '../api/defaultClient';
import jwt_decode from 'jwt-decode';

import { SET_USER, AUTH_FAILURE, LOGOUT } from './authTypes';

export const loginUser = userData => dispatch => {
    client
    .post('/auth/login', userData)
        .then(res => {
            const { token } = res.data;
            localStorage.setItem("jwtToken", token);    
            const decoded = jwt_decode(token);
            dispatch(setCurrentUser(decoded, token));                    
        })
        .catch(err => {            
            dispatch({
                type: AUTH_FAILURE,
                payload: err.response.data.errorMessage                
            });
        });
}

export const logoutUser = () => {
    console.log('test');    
    return {
        type: LOGOUT
    };
};

export const setCurrentUser = (user, token) => {
    return {
        type: SET_USER,
        payload: {
            user, token
        }
    };
};

export const loadUser = () => (dispatch, getState) => {       
    client
        .get('/auth/user', tokenConfig(getState))    
        .then(res => dispatch({
            type: SET_USER,
            payload: {...res.data, token: localStorage.getItem('jwtToken')}
        }))
        .catch(err => {            
            dispatch({
                type: AUTH_FAILURE
            });
        });
};

export const tokenConfig = getState => {
    const token = getState().auth.token;

    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    };
    if (token) {
        config.headers['auth-token'] = token;
    }
    return config;
}