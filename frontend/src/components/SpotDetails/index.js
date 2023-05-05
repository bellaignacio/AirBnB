import { useEffect, useState } from 'react';
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import OpenModalButton from '../OpenModalButton';
import CreateReviewModal from '../CreateReviewModal';
import DeleteReviewModal from '../DeleteReviewModal';
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
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        async function fetchData() {
            await dispatch(spotsActions.getSpot(id))
                .then(() => setIsSpotLoaded(true));
            await dispatch(reviewsActions.getSpotReviews(id))
                .then(() => setIsReviewsLoaded(true));
        }
        fetchData();
        if (sessionUser) {
            if (sessionUser.id !== spot.ownerId) {
                let target = true;
                spotReviews.forEach(reviewObj => {
                    if (reviewObj.userId === sessionUser.id) target = false;
                });
                setIsVisible(target);
            }
        }
    }, [dispatch]);

    return (
        <>
            <h2>SpotDetails</h2>
            {isSpotLoaded &&
                <div>
                    <ul>
                        <li>Name: {spot?.name}</li>
                        <li>Description: {spot?.description}</li>
                        <li>Price: {spot?.price}</li>
                        <button onClick={() => window.alert('Feature Coming Soon...')}>Reserve</button>
                        <li>Location: {spot?.city}, {spot?.state}, {spot?.country}</li>
                        {spot?.SpotImages?.map(imgObj => {
                            return (
                                <img className={imgObj.preview ? 'preview-img' : 'alt-img'} src={imgObj.url} alt={imgObj.url.split('/').pop()}/>
                            );
                        })}
                        {spot?.avgStarRating > 0 && <li>Average Rating: {spot?.avgStarRating}</li>}
                        {spot?.numReviews === 0 && <li>New (No Reviews Yet)</li>}
                        {spot?.numReviews === 1 && <li>1 Review</li>}
                        {spot?.numReviews > 1 && <li>{spot?.numReviews} Reviews</li>}
                        <li>Owner: {spot?.Owner?.firstName} {spot?.Owner?.lastName}</li>
                    </ul>
                </div>
            }
            {isReviewsLoaded &&
                <div>
                    <ul>
                        {isVisible &&
                            <OpenModalButton
                                modalComponent={<CreateReviewModal id={spot.id} />}
                                buttonText="Post Your Review"
                            />
                        }
                        {spotReviews?.map(reviewObj => {
                            const reviewMonth = MONTHS[new Date(reviewObj.createdAt).getMonth()];
                            const reviewYear = new Date(reviewObj.createdAt).getFullYear();
                            return (
                                <>
                                    <li key={reviewObj.id}>{reviewObj.stars} stars: "{reviewObj.review}"
                                        - {reviewObj.User?.firstName}, {reviewMonth} {reviewYear} </li>
                                    {reviewObj.userId === sessionUser?.id && <OpenModalButton
                                        modalComponent={<DeleteReviewModal id={reviewObj.id} />}
                                        buttonText="Delete"
                                    />}
                                </>
                            );
                        })}
                    </ul>
                </div>
            }
        </>
    );
}

export default SpotDetails;
