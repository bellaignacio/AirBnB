import { useEffect } from 'react';
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import * as spotsActions from "../../store/spots";
import * as reviewsActions from "../../store/reviews";
import './SpotDetails.css';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function SpotDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots.currentSpot);
    const spotReviews = useSelector(state => Object.values(state.reviews.spotReviews));

    useEffect(() => {
        dispatch(spotsActions.getSpot(id));
        dispatch(reviewsActions.getSpotReviews(id));
    }, [dispatch]);

    const loggedIn = useSelector(state => state.session.user);
    const buttonClassName = (loggedIn ? "" : " hidden");

    return (
        <>
            <h2>SpotDetails: {spot?.name}</h2>
            <div>
                <ul>
                    <li>Price: {spot?.price}</li>
                    <button onClick={() => window.alert('Feature Coming Soon...')}>Reserve</button>
                    <li>Location: {spot?.city}, {spot?.state}, {spot?.country}</li>
                    {spot?.SpotImages?.map(imgObj => (
                        <li key={imgObj.id}>Image URL: {imgObj.url}</li>
                    ))}
                    <li>Average Rating: {spot?.avgStarRating}</li>
                    <li>Review Count: {spot?.numReviews}</li>
                    <li>Owner: {spot?.Owner?.firstName} {spot?.Owner?.lastName}</li>
                </ul>
            </div>
            <div>
                <ul>
                    <li>Average Rating: {spot?.avgStarRating}</li>
                    <li>Review Count: {spot?.numReviews}</li>
                    <button
                        onClick={() => window.alert('Clicked Post Your Review')}
                        className={buttonClassName}
                    >
                        Post Your Review
                    </button>
                    {spotReviews?.map(reviewObj => {
                        const reviewMonth = MONTHS[new Date(reviewObj.createdAt).getMonth()];
                        const reviewYear = new Date(reviewObj.createdAt).getFullYear();
                        return (
                            <li key={reviewObj.id}>{reviewObj.stars} stars: "{reviewObj.review}"
                                - {reviewObj.User.firstName}, {reviewMonth} {reviewYear} </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}

export default SpotDetails;
