import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import * as spotsActions from '../../store/spots';
import SpotsIndex from "../SpotsIndex";

function ManageSpots() {
    const history = useHistory();
    const dispatch = useDispatch();
    const spots = useSelector(state => Object.values(state.spots.userSpots));

    useEffect(() => {
        dispatch(spotsActions.getUserSpots());
    }, [dispatch]);

    return (
        <>
            <h1>Manage Your Spots</h1>
            <button onClick={() => history.push('/spots/new')}>Create a New Spot</button>
            <SpotsIndex spots={spots} userOnly={true}/>
        </>
    );
}

export default ManageSpots;
