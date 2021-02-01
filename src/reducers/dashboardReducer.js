import { DASHBOARD_LOADED } from '../actions/dashboardActions';
import { DASHBOARD_LOAD_ERROR } from '../actions/dashboardActions'; 
import { days } from '../util/util';

export const initialDashboardState = {
    totals: null,
    error: false
};

const dashboardReducer = (state, action) => {    
    if (action.type === DASHBOARD_LOADED) {             
        let sums = {};
        for (const mass of action.payload.filter(m => m.date > new Date())) {
            let total =  mass.reservations.reduce((a, b) => a + b.seats.length, 0);
            let day = days[mass.date.getDay()];
            let hour = mass.date.getHours();
            let minutes = mass.date.getMinutes().toString();
            let ampm = hour >= 12 ? "PM" : "AM";
            if (hour > 12) {
                hour -= 12;                
            }            
            if (minutes.length < 2) {
                minutes = "0" + minutes;
            }
            let key =  `${day} ${hour}:${minutes} ${ampm}`;
            if (key in sums) {
                sums[key] += total;
            }
            else {
                sums[key] = total;
            }
        }
        return {
            ...state,
            totals: sums
        };
    }
    else if (action.type === DASHBOARD_LOAD_ERROR) {
        return {
            ...state,
            error: true
        };
    }
    return state;
};

export default dashboardReducer;