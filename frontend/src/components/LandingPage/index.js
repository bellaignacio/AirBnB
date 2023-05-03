import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as spotsActions from '../../store/spots';
import SpotsIndex from "../SpotsIndex";

function LandingPage() {
    const dispatch = useDispatch();
    const spots = useSelector(state => Object.values(state.spots.allSpots));

    useEffect(() => {
        dispatch(spotsActions.getAllSpots());
    }, [dispatch]);

    return (
        <>
            <h1>Landing Page</h1>
            <SpotsIndex spots={spots} userOnly={false}/>
        </>
    );
}

export default LandingPage;
