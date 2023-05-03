import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SpotForm from "../SpotForm";

function UpdateSpotForm() {
    const { id } = useParams();
    const spot = useSelector(state => state.spots.allSpots[id]);

    return (
        <SpotForm spot={spot} formType="Update Spot" />
    );
}

export default UpdateSpotForm;
