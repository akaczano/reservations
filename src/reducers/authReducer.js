import { SET_USER, AUTH_FAILURE, LOGOUT } from '../actions/authTypes';


const initialState = {
    token: localStorage.getItem('jwtToken'),
    isAuthenticated: null,
    user: null,
    loading: false,
    errorMessage: null
};

const authReducer = (state=initialState, action) => {
    if (action.type === SET_USER) {        
        return {
            token: action.payload.token,
            isAuthenticated: true,
            user: action.payload.user
        };
    }
    else if (action.type === AUTH_FAILURE) {
        return {
            token: null,
            user: null,
            isAuthenticated: false,
            loading: false,
            errorMessage: action.payload
        }
    }
    else if (action.type === LOGOUT) {
        localStorage.removeItem('jwtToken');
        return {
            token: null,
            user: null,
            isAuthenticated: false,
            loading: false
        };
    }
    return state;
};

export default authReducer;