import { NavLink, useHistory } from 'react-router-dom';
// import dummyImage from './download.png';
import OpenModalButton from '../OpenModalButton';
import DeleteSpotModal from '../DeleteSpotModal';

function SpotTile({ spot, userOnly }) {
    const history = useHistory();

    return (
        <div>
            <h2>SpotTile: {spot.name}</h2>
            <ul>
                <li>Price: {spot.price}</li>
                <li>Location: {spot.city}, {spot.state}</li>
                <li>Average Rating: {spot.avgRating}</li>
                <li>Preview Image: {spot.previewImage[0]}</li>
            </ul>
            <NavLink to={`/spots/${spot.id}`}>
                <img src={spot.previewImage[0]} alt={spot.previewImage[0].split('/').pop()}/>
            </NavLink>
            {userOnly && <button onClick={() => history.push(`/spots/${spot.id}/edit`)}>Update</button>}
            {userOnly &&
                <OpenModalButton
                    modalComponent={<DeleteSpotModal id={spot.id}/>}
                    buttonText="Delete"
                />
            }
        </div>
    );
}

export default SpotTile;
