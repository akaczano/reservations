import configDataReducer from './configDataReducer';
import massDataReducer from './massDataReducer';
import weeklyReducer from './weeklyReducer';
import dashboardReducer from './dashboardReducer';
import { initialConfigState } from './configDataReducer';
import { initialMassState } from './massDataReducer';
import { initialWeeklyState } from './weeklyReducer';
import { initialDashboardState } from './dashboardReducer';

const initialState = {
    config: initialConfigState,
    massForm: initialMassState,
    weeklyMassForm: initialWeeklyState,
    dashboard: initialDashboardState
};

const adminReducer = (state = initialState, action) => {    
    if (action.type.startsWith('CONFIG')) {
        return { ...state, config: configDataReducer(state.config, action) }
    }
    else if (action.type.startsWith('MASS')) {
        return { ...state, massForm: massDataReducer(state.massForm, action) }
    }
    else if (action.type.startsWith('WEEKLY')) {
        return { ...state, weeklyMassForm: weeklyReducer(state.weeklyMassForm, action) }
    }
    else if (action.type.startsWith('DASHBOARD')) {        
        return { ...state, dashboard: dashboardReducer(state.dashboard, action) };
    }
    return state;
}
export default adminReducer;