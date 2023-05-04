import { useEffect, useState } from 'react';
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import OpenModalButton from '../OpenModalButton';
import CreateReviewModal from '../CreateReviewModal';
import * as spotsActions from "../../store/spots";
import * as reviewsActions from "../../store/reviews";
import './SpotDetails.css';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function SpotDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const spot = useSelector(state => state.spots.currentSpot);
    const spotReviews = useSelector(state => Object.values(state.reviews.spotReviews));
    const [isSpotLoaded, setIsSpotLoaded] = useState(false);
    const [isReviewsLoaded, setIsReviewsLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        dispatch(spotsActions.getSpot(id))
            .then(() => setIsSpotLoaded(true));
        dispatch(reviewsActions.getSpotReviews(id))
            .then(() => setIsReviewsLoaded(true));
        if (!sessionUser) setIsVisible(false);
        else if (sessionUser.id === spot.Owner.id) setIsVisible(false);
    }, [dispatch]);

    return (
        <>
            <h2>SpotDetails</h2>
            {isSpotLoaded &&
                <div>
                    <ul>
                        <li>Name: {spot?.name}</li>
                        <li>Price: {spot?.price}</li>
                        <button onClick={() => window.alert('Feature Coming Soon...')}>Reserve</button>
                        <li>Location: {spot?.city}, {spot?.state}, {spot?.country}</li>
                        {spot?.SpotImages?.map(imgObj => (
                            <li key={imgObj.id}>{imgObj.preview ? 'Preview ' : ''}Image URL: {imgObj.url}</li>
                        ))}
                        <li>Average Rating: {spot?.avgStarRating}</li>
                        <li>Review Count: {spot?.numReviews}</li>
                        <li>Owner: {spot?.Owner?.firstName} {spot?.Owner?.lastName}</li>
                    </ul>
                </div>
            }
            {isReviewsLoaded &&
                <div>
                    <ul>
                        {isVisible &&
                            <OpenModalButton
                                modalComponent={<CreateReviewModal id={spot.id}/>}
                                buttonText="Post Your Review"
                            />
                        }
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
            }
        </>
    );
}

export default SpotDetails;
