import { useHistory } from 'react-router-dom';

function SpotTile({ spot }) {
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
            <button onClick={() => history.push(`/spots/${spot.id}`)}>Go to SpotDetails</button>
        </div>
    );
}

export default SpotTile;
