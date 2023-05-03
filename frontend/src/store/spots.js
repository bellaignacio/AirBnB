import { csrfFetch } from "./csrf";

const LOAD_ALL_SPOTS = 'spots/loadAllSpots';
const LOAD_CURRENT_SPOT = 'spots/loadCurrentSpot';
const ADD_SPOT = 'spots/addSpot';

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

const addSpot = (spot) => {
    return {
        type: ADD_SPOT,
        spot
    };
};

export const getAllSpots = () => async dispatch => {
    const response = await csrfFetch('/api/spots');
    const data = await response.json();
    dispatch(loadAllSpots(data.Spots)); // includes only previewImage, avgRating
    return response;
};

export const getSpot = (id) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${id}`);
    const data = await response.json();
    dispatch(loadCurrentSpot(data)); // includes numReviews, avgStarRating, SpotImages, Owner
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
    dispatch(addSpot(data)); // does not include review info, image info, owner info

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
        case ADD_SPOT:
            newState = { ...state, currentSpot: action.spot };
            return newState;
        default:
            return state;
    }
};

export default spotsReducer;
