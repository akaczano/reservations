import {
    MASS_SAVE_ERROR,
    MASS_SAVED,
    MASS_SAVING,
    MASS_SET_CONFIG,
    MASS_SET_DATE,
    MASS_SET_PUBLISHED,
    MASS_DONE
} from '../actions/massDataActions';

export const initialMassState = {
    mass: {
        date: null,
        published: false,
        configurationId: ''
    },
    posting: false,
    errorMessage: null,
    successful: false
};

const massDataReducer = (state, action) => {
    if (action.type === MASS_SAVING) {
        return {
            ...state,
            posting: true
        };
    }
    else if (action.type === MASS_SAVE_ERROR) {
        return {
            ...state,
            posting: false,
            errorMessage: action.payload
        };
    }
    else if (action.type === MASS_SAVED) {
        return {
            ...initialMassState,
            successful: true
        };
    }
    else if (action.type === MASS_SET_DATE) {        
        return {
            ...state,
            mass: {
                ...state.mass,
                date: action.payload
            }
        };
    }
    else if (action.type === MASS_SET_CONFIG) {        
        return {
            ...state,
            mass: {
                ...state.mass,
                configurationId: action.payload
            }
        };
    }
    else if (action.type === MASS_SET_PUBLISHED) {
        return {
            ...state,
            mass: {
                ...state.mass,
                published: !state.mass.published
            }
        };
    }
    else if (action.type === MASS_DONE) {
        return {
            ...state,
            successful: false
        }
    }
    return state;
}

export default massDataReducer;