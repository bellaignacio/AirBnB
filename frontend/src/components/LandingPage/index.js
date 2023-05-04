import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import * as spotsActions from '../../store/spots';
import SpotsIndex from "../SpotsIndex";

function LandingPage() {
    const dispatch = useDispatch();
    const spots = useSelector(state => Object.values(state.spots.allSpots));
    const [isLoaded, setIsLoaded] = useState(false)

    useEffect(() => {
        dispatch(spotsActions.getAllSpots())
            .then(() => setIsLoaded(true));
    }, [dispatch]);

    return (
        <>
            <h1>Landing Page</h1>
            {isLoaded && <SpotsIndex spots={spots} userOnly={false}/>}
        </>
    );
}

export default LandingPage;
