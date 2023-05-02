import { csrfFetch } from "./csrf";

const LOAD_SPOTS = 'spots/loadSpots';

const loadSpots = (spots) => {
    return {
        type: LOAD_SPOTS,
        spots
    };
};

export const getAllSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots');
    const data = await response.json();
    dispatch(loadSpots(data.Spots));
    return response;
};

const spotsReducer = (state = {}, action) => {
    let newState;
    switch (action.type) {
        case LOAD_SPOTS:
            newState = { ...state };
            action.spots.forEach(spotObj => {
                newState[spotObj.id] = spotObj;
            });
            return newState;
        default:
            return state;
    }
};

export default spotsReducer;
