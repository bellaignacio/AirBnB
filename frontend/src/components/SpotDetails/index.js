import { useEffect, useState } from 'react';
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import dummyImage from '../../download.png';
import OpenModalButton from '../OpenModalButton';
import CreateReviewModal from '../CreateReviewModal';
import DeleteReviewModal from '../DeleteReviewModal';
import * as spotsActions from "../../store/spots";
import * as reviewsActions from "../../store/reviews";
import './SpotDetails.css';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function SpotDetails() {
    console.log('SPOT DETAILS RERENDERS');
    const { id } = useParams();
    const dispatch = useDispatch();
    const sessionUser = useSelector(state => state.session.user);
    const spot = useSelector(state => state.spots.currentSpot);
    const spotReviews = useSelector(state => Object.values(state.reviews.spotReviews));
    const [isSpotLoaded, setIsSpotLoaded] = useState(false);
    const [isReviewsLoaded, setIsReviewsLoaded] = useState(false);
    const [isVisible, setIsVisible] = useState(false);

    console.log('BEFORE USEEFFECT ISVISIBLE', isVisible);

    useEffect(() => {
        console.log('USEEFFECT START ISVISIBLE', isVisible);
        async function fetchData() {
            await dispatch(spotsActions.getSpot(id))
                .then(() => setIsSpotLoaded(true));
            await dispatch(reviewsActions.getSpotReviews(id))
                .then(() => setIsReviewsLoaded(true));
        }
        fetchData();
        console.log('AFTER FETCH DATA ISVISIBLE', isVisible);
        // if (sessionUser) {
        //     console.log('IN LOGIC USER ID', sessionUser.id);
        //     console.log('IN LOGIC SPOT OWNER ID', spot.ownerId);
        //     if (sessionUser.id !== spot.ownerId) {
        //         let target = true;
        //         console.log('IN LOGIC BEFORE ISVISIBLE', isVisible);
        //         spotReviews.forEach(reviewObj => {
        //             if (reviewObj.userId === sessionUser.id) target = false;
        //         });
        //         setIsVisible(target);
        //         console.log('IN LOGIC AFTER ISVISIBLE', isVisible);
        //     }
        // }
        console.log('USEEFFECT END ISVISIBLE', isVisible);
    }, [dispatch]);

    useEffect(() => {
        if (isSpotLoaded && isReviewsLoaded) {
            console.log('THIS RUNS!!!!')
            if (sessionUser) {
                console.log('IN LOGIC USER ID', sessionUser.id);
                console.log('IN LOGIC SPOT OWNER ID', spot.ownerId);
                if (sessionUser.id !== spot.ownerId) {
                    let target = true;
                    console.log('IN LOGIC BEFORE ISVISIBLE', isVisible);
                    spotReviews.forEach(reviewObj => {
                        if (reviewObj.userId === sessionUser.id) target = false;
                    });
                    console.log('IN LOGIC TARGET', target);
                    if (target === true) setIsVisible(true);
                    console.log('IN LOGIC AFTER ISVISIBLE', isVisible);
                }
            }
        }
    }, [isSpotLoaded, isReviewsLoaded]);
    // if (isSpotLoaded && isReviewsLoaded) {
    //     console.log('THIS RUNS!!!!')
    //     if (sessionUser) {
    //         console.log('IN LOGIC USER ID', sessionUser.id);
    //         console.log('IN LOGIC SPOT OWNER ID', spot.ownerId);
    //         if (sessionUser.id !== spot.ownerId) {
    //             let target = true;
    //             console.log('IN LOGIC BEFORE ISVISIBLE', isVisible);
    //             spotReviews.forEach(reviewObj => {
    //                 if (reviewObj.userId === sessionUser.id) target = false;
    //             });
    //             console.log('IN LOGIC TARGET', target);
    //             if (target === true) setIsVisible(true);
    //             console.log('IN LOGIC AFTER ISVISIBLE', isVisible);
    //         }
    //     }
    // }

    console.log('BEFORE RETURN ISVISIBLE', isVisible);
    return (
        <div className='spot-details-container'>
            {isSpotLoaded &&
                <div className='spot-details'>
                    <div className='spot-details-header'>
                        <h2>{spot?.name}</h2>
                        <div>{spot?.city}, {spot?.state}, {spot?.country}</div>
                    </div>
                    <div className='spot-details-imgs'>
                        {
                            spot?.SpotImages?.map((imgObj, index) => {
                                return (
                                    <img className={imgObj.preview ? 'spot-preview-img' : `spot-alt-img alt-img-${index}`} src={imgObj.url} onError={(e) => {
                                        e.target.src = dummyImage;
                                        e.onerror = null;
                                    }} alt={imgObj.url.split('/').pop()} />
                                );
                            })
                        }
                    </div>
                    <div className='spot-details-info'>
                        <div>
                            <h2>Hosted by {spot?.Owner?.firstName} {spot?.Owner?.lastName}</h2>
                            <p>{spot?.description}</p>
                        </div>
                        <div className='spot-details-reserve'>
                            <div className='spot-details-price'>${spot?.price} night</div>
                            <div className='spot-details-rating'>
                                &#9733;   {spot.avgStarRating === 0 ? "New" : `${spot.avgStarRating.toFixed(1)}`}{spot?.numReviews >= 1 && <span>   &#8231;   {spot?.numReviews} Review{spot?.numReviews > 1 ? 's' : ''}</span>}
                            </div>
                            {/* {spot?.numReviews >= 1 && <span>{spot?.numReviews} Review{spot?.numReviews > 1 ? 's' : ''}</span>} */}
                            <button className="primary reserve-btn" onClick={() => window.alert('Feature Coming Soon')}>Reserve</button>
                        </div>
                    </div>
                    {/* <ul>
                        {spot?.avgStarRating > 0 && <li>Average Rating: {spot?.avgStarRating}</li>}
                        {spot?.numReviews === 0 && <li>New (No Reviews Yet)</li>}
                        {spot?.numReviews === 1 && <li>1 Review</li>}
                        {spot?.numReviews > 1 && <li>{spot?.numReviews} Reviews</li>}
                    </ul> */}
                </div>
            }
            {isReviewsLoaded &&
                <div className='review-details'>
                    <div className='review-details-header'>
                        <div>
                            &#9733;   {spot.avgStarRating === 0 ? "New" : `${spot.avgStarRating.toFixed(1)}`}{spot?.numReviews >= 1 && <span>   &#8231;   {spot?.numReviews} Review{spot?.numReviews > 1 ? 's' : ''}</span>}
                        </div>
                        {isVisible &&
                            <OpenModalButton
                                modalComponent={<CreateReviewModal id={spot.id} setIsVisible={setIsVisible}/>}
                                buttonText="Post Your Review"
                            />
                        }
                        {/* {(spot?.numReviews < 1 && isVisible) && <div>Be the first to post a review!</div>} */}
                    </div>
                    <div className='review-details-list'>
                        {(spot?.numReviews < 1 && isVisible) && <div>Be the first to post a review!</div>}
                        {spotReviews?.map(reviewObj => {
                            const reviewMonth = MONTHS[new Date(reviewObj.createdAt).getMonth()];
                            const reviewYear = new Date(reviewObj.createdAt).getFullYear();
                            return (
                                <>
                                    <div className='review-info'>
                                        <p className='review-name'>{reviewObj.User?.firstName}</p>
                                        <p className='review-date'>{reviewMonth} {reviewYear}</p>
                                        <p className='review-text'>{reviewObj.review}</p>
                                        {reviewObj.userId === sessionUser?.id && <OpenModalButton
                                            modalComponent={<DeleteReviewModal id={reviewObj.id} spotId={reviewObj.spotId} setIsVisible={setIsVisible} />}
                                            buttonText="Delete"
                                        />}
                                    </div>

                                </>
                            );
                        })}
                    </div>
                </div>
            }
        </div>
    );
}

export default SpotDetails;
