import { csrfFetch } from "./csrf";

const LOAD_USER_REVIEWS = 'reviews/loadUserReviews';
const LOAD_SPOT_REVIEWS = 'reviews/loadSpotReviews';

const loadUserReviews = (reviews) => {
    return {
        type: LOAD_USER_REVIEWS,
        reviews
    };
};

const loadSpotReviews = (reviews) => {
    return {
        type: LOAD_SPOT_REVIEWS,
        reviews
    };
};

export const getUserReviews = () => async dispatch => {
    const response = await csrfFetch('/api/reviews/current');
    const data = await response.json();
    dispatch(loadUserReviews(data.Reviews));
    return response;
};

export const getSpotReviews = (id) => async dispatch => {
    const response = await csrfFetch(`/api/spots/${id}/reviews`);
    const data = await response.json();
    dispatch(loadSpotReviews(data.Reviews));
    return response;
};

const reviewsReducer = (state = { userReviews: {}, spotReviews: {} }, action) => {
    let newState;
    switch (action.type) {
        case LOAD_USER_REVIEWS:
            newState = { ...state, userReviews: {} };
            action.reviews.forEach(reviewObj => {
                newState.userReviews[reviewObj.id] = reviewObj;
            });
            return newState;
        case LOAD_SPOT_REVIEWS:
            newState = { ...state, spotReviews: {} };
            action.reviews.forEach(reviewObj => {
                newState.spotReviews[reviewObj.id] = reviewObj;
            });
            return newState;
        default:
            return state;
    }
};

export default reviewsReducer;
