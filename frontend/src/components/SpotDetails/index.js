import { useEffect } from 'react';
import { useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import * as spotsActions from "../../store/spots";

function SpotDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots.currentSpot);

    useEffect(() => {
        dispatch(spotsActions.getSpot(id));
    }, [dispatch]);

    return (
        <>
            <h2>SpotDetails: {spot?.name}</h2>
            <ul>
                <li>Price: {spot?.price}</li>
                <li>Location: {spot?.city}, {spot?.state}, {spot?.country}</li>
                {spot?.SpotImages.map(imgObj => (
                    <li key={imgObj.id}>Image URL: {imgObj.url}</li>
                ))}
                <li>Average Rating: {spot?.avgStarRating}</li>
            </ul>
        </>
    );
}

export default SpotDetails;
