import { csrfFetch } from "./csrf";

const LOAD_ALL_SPOTS = 'spots/loadAllSpots';
const LOAD_CURRENT_SPOT = 'spots/loadCurrentSpot';

const loadAllSpots = (spots) => {
    return {
        type: LOAD_ALL_SPOTS,
        spots
    };
};

const loadCurrentSpot = (spot) => {
    return {
        type: LOAD_CURRENT_SPOT,
        spot
    };
};

export const getAllSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots');
    const data = await response.json();
    dispatch(loadAllSpots(data.Spots));
    return response;
};

export const getSpot = (id) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${id}`);
    const data = await response.json();
    dispatch(loadCurrentSpot(data));
    return response;
};

const spotsReducer = (state = { allSpots: {}, currentSpot: {} }, action) => {
    let newState;
    switch (action.type) {
        case LOAD_ALL_SPOTS:
            newState = { ...state, allSpots: {} };
            action.spots.forEach(spotObj => {
                newState.allSpots[spotObj.id] = spotObj;
            });
            return newState;
        case LOAD_CURRENT_SPOT:
            newState = { ...state, currentSpot: action.spot };
            return newState;
        default:
            return state;
    }
};

export default spotsReducer;
