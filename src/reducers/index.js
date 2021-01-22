import { combineReducers } from 'redux';

import massListReducer from './massListReducer';
import massReducer from './massReducer';
import authReducer from './authReducer';
import adminReducer from './adminReducer';
import viewReducer from './viewReducer';

export default combineReducers({
    massList: massListReducer,
    massView: viewReducer,
    mass: massReducer,
    auth: authReducer,
    admin: adminReducer
});