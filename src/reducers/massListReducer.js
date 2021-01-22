import {
    LOAD_LIST,
    LOAD_ERROR,
    MASS_PUBLISHED,
    PUBLISH_FAILED,
    MASS_PUBLISHING,
    DELETE_PENDING,
    DELETE_CANCELED,
    MASS_DELETING,
    DELETE_FAILURE,
    DELETE_SUCCESS,
    SET_FILTER
} from '../actions/massListTypes';


const initialState = {
    massList: null,
    error: false,
    publishing: null,
    deleting: null,
    displayDeleteModal: false,
    filter: {
        startDate: new Date(),
        published: false
    }
};

const massListReducer = (state = initialState, action) => {
    if (action.type === LOAD_LIST) {
        return {
            ...state,
            massList: action.payload,
            error: false
        };
    }
    else if (action.type === LOAD_ERROR) {
        return {
            ...state,
            error: true
        };
    }
    else if (action.type === MASS_PUBLISHED) {
        return {
            ...state,
            massList: state.massList.map(m => {
                if (m._id === action.payload) {
                    m.published = !m.published;
                }
                return m;
            }),
            error: false,
            publishing: null
        };
    }
    else if (action.type === PUBLISH_FAILED) {
        return {
            ...state,
            publishing: null
        };
    }
    else if (action.type === MASS_PUBLISHING) {
        return {
            ...state,
            pubishing: action.payload
        };
    }
    else if (action.type === DELETE_PENDING) {
        return {
            ...state,
            displayDeleteModal: true,
            deleting: action.payload
        };
    }
    else if (action.type === DELETE_CANCELED) {
        return {
            ...state,
            displayDeleteModal: false,
            deleting: false
        };
    }
    else if (action.type === MASS_DELETING) {        
        return {
            ...state,
            displayDeleteModal: false            
        };
    }
    else if (action.type === DELETE_FAILURE) {     
        console.log('delete error');   
        return {
            ...state,
            deleting: null
        };
    }
    else if (action.type === DELETE_SUCCESS) {
        return {
            ...state,
            deleting: null,
            massList: state.massList.filter(m => m._id !== action.payload)
        }
    }
    else if (action.type === SET_FILTER) {
        return {
            ...state,
            filter: action.payload            
        };
    }
    return state;
};

export default massListReducer;