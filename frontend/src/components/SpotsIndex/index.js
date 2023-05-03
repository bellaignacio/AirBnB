import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SpotTile from "./SpotTile";
import * as spotsActions from '../../store/spots';

function SpotsIndex() {
    const dispatch = useDispatch();
    const spots = useSelector(state => Object.values(state.spots.allSpots));

    useEffect(() => {
        dispatch(spotsActions.getAllSpots());
    }, [dispatch]);

    return (
        <>
            <h1>SpotsIndex</h1>
            {spots?.map(spotObj => (
                <SpotTile key={spotObj.id} spot={spotObj} />
            ))}
        </>
    );
}

export default SpotsIndex;
