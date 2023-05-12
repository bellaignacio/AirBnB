import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as spotsActions from '../../store/spots';
import SpotsIndex from "../SpotsIndex";

function ManageSpots() {
    const history = useHistory();
    const dispatch = useDispatch();
    const spots = useSelector(state => Object.values(state.spots.userSpots));
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        dispatch(spotsActions.getUserSpots())
            .then(() => setIsLoaded(true));
    }, [dispatch]);

    return (
        <>
            <h1>Manage Spots</h1>
            <button className='accent' onClick={() => history.push('/spots/new')}>Create a New Spot</button>
            {isLoaded && <SpotsIndex spots={spots} userOnly={true} />}
        </>
    );
}

export default ManageSpots;
