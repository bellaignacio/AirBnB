import { csrfFetch } from "./csrf";

const LOAD_ALL_SPOTS = 'spots/loadAllSpots';
const LOAD_USER_SPOTS = 'spots/loadUserSpots';
const LOAD_CURRENT_SPOT = 'spots/loadCurrentSpot';
const ADD_SPOT = 'spots/addSpot';
const EDIT_SPOT = 'spots/editSpot';
const REMOVE_SPOT = 'spots/removeSpot';

const loadAllSpots = (spots) => {
    return {
        type: LOAD_ALL_SPOTS,
        spots
    };
};

const loadUserSpots = (spots) => {
    return {
        type: LOAD_USER_SPOTS,
        spots
    };
};

const loadCurrentSpot = (spot) => {
    return {
        type: LOAD_CURRENT_SPOT,
        spot
    };
};

const addSpot = (spot) => {
    return {
        type: ADD_SPOT,
        spot
    };
};

const editSpot = (spot) => {
    return {
        type: EDIT_SPOT,
        spot
    };
};

const removeSpot = (id) => {
    return {
        type: REMOVE_SPOT,
        id
    };
};

export const getAllSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots');
    const data = await response.json();
    dispatch(loadAllSpots(data.Spots));
    return response;
};

export const getUserSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots/current');
    const data = await response.json();
    dispatch(loadUserSpots(data.Spots));
    return response;
};

export const getSpot = (id) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${id}`);
    const data = await response.json();
    dispatch(loadCurrentSpot(data));
    return response;
};

export const createSpot = (spot) => async dispatch => {
    const {
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        previewImage,
        imageOne,
        imageTwo,
        imageThree,
        imageFour
    } = spot;
    const spotResponse = await csrfFetch('/api/spots', {
        method: 'POST',
        body: JSON.stringify({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })
    });

    const data = await spotResponse.json();
    dispatch(addSpot(data));

    if (previewImage) await csrfFetch(`/api/spots/${data.id}/images`, {
        method: 'POST',
        body: JSON.stringify({
            url: previewImage,
            preview: true
        })
    });
    if (imageOne) await csrfFetch(`/api/spots/${data.id}/images`, {
        method: 'POST',
        body: JSON.stringify({
            url: imageOne,
            preview: false
        })
    });
    if (imageTwo) await csrfFetch(`/api/spots/${data.id}/images`, {
        method: 'POST',
        body: JSON.stringify({
            url: imageTwo,
            preview: false
        })
    });
    if (imageThree) await csrfFetch(`/api/spots/${data.id}/images`, {
        method: 'POST',
        body: JSON.stringify({
            url: imageThree,
            preview: false
        })
    });
    if (imageFour) await csrfFetch(`/api/spots/${data.id}/images`, {
        method: 'POST',
        body: JSON.stringify({
            url: imageFour,
            preview: false
        })
    });

    return data.id;
};

export const updateSpot = (spot) => async dispatch => {
    const {
        id,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
        // previewImage,
        // imageOne,
        // imageTwo,
        // imageThree,
        // imageFour
    } = spot;
    const spotResponse = await csrfFetch(`/api/spots/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })
    });

    const data = await spotResponse.json();
    dispatch(editSpot(data));

    // if (previewImage) await csrfFetch(`/api/spots/${data.id}/images`, {
    //     method: 'POST',
    //     body: JSON.stringify({
    //         url: previewImage,
    //         preview: true
    //     })
    // });
    // if (imageOne) await csrfFetch(`/api/spots/${data.id}/images`, {
    //     method: 'POST',
    //     body: JSON.stringify({
    //         url: imageOne,
    //         preview: false
    //     })
    // });
    // if (imageTwo) await csrfFetch(`/api/spots/${data.id}/images`, {
    //     method: 'POST',
    //     body: JSON.stringify({
    //         url: imageTwo,
    //         preview: false
    //     })
    // });
    // if (imageThree) await csrfFetch(`/api/spots/${data.id}/images`, {
    //     method: 'POST',
    //     body: JSON.stringify({
    //         url: imageThree,
    //         preview: false
    //     })
    // });
    // if (imageFour) await csrfFetch(`/api/spots/${data.id}/images`, {
    //     method: 'POST',
    //     body: JSON.stringify({
    //         url: imageFour,
    //         preview: false
    //     })
    // });

    return data.id;
};

export const deleteSpot = (id) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${id}`, {
        method: 'DELETE'
    });
    dispatch(removeSpot(id));
    return response;
};

const spotsReducer = (state = { allSpots: {}, userSpots: {}, currentSpot: {} }, action) => {
    let newState;
    switch (action.type) {
        case LOAD_ALL_SPOTS:
            newState = { ...state, allSpots: {} };
            action.spots.forEach(spotObj => {
                newState.allSpots[spotObj.id] = spotObj;
            });
            return newState;
        case LOAD_USER_SPOTS:
            newState = { ...state, userSpots: {} };
            action.spots.forEach(spotObj => {
                newState.userSpots[spotObj.id] = spotObj;
            });
            return newState;
        case LOAD_CURRENT_SPOT:
            newState = { ...state, currentSpot: action.spot };
            return newState;
        case ADD_SPOT:
            newState = { ...state, currentSpot: action.spot };
            newState.allSpots[action.spot.id] = action.spot;
            newState.userSpots[action.spot.id] = action.spot;
            return newState;
        case EDIT_SPOT:
            newState = { ...state, currentSpot: action.spot };
            newState.allSpots[action.spot.id] = { ...state.allSpots[action.spot.id], ...action.spot };
            newState.userSpots[action.spot.id] = { ...state.userSpots[action.spot.id], ...action.spot };
            return newState;
        case REMOVE_SPOT:
            newState = { ...state };
            delete newState.allSpots[action.id];
            delete newState.userSpots[action.id];
            return newState;
        default:
            return state;
    }
};

export default spotsReducer;
