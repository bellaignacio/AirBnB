import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as spotsActions from "../../store/spots";
import SpotForm from "../SpotForm";

function UpdateSpotForm() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const spot = useSelector(state => state.spots.currentSpot);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(spotsActions.getSpot(id))
            .then(() => setIsLoaded(true));
    }, [dispatch]);

    if (isLoaded) {
        const previewImages = spot.SpotImages.filter(imgObj => imgObj.preview === true);
        const spotImages = spot.SpotImages.filter(imgObj => imgObj.preview === false);

        if (previewImages.length) spot.previewImage = previewImages[0].url;
        if (spotImages[0]) spot.imageOne = spotImages[0].url;
        if (spotImages[1]) spot.imageTwo = spotImages[1].url;
        if (spotImages[2]) spot.imageThree = spotImages[2].url;
        if (spotImages[3]) spot.imageFour = spotImages[3].url;

        return (
            <SpotForm spot={spot} formType="Update Spot" />
        );
    } else {
        return null;
    }
}

export default UpdateSpotForm;
