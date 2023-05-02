function SpotTile({ spot }) {
    return (
        <div>
            <h2>SpotTile: {spot.name}</h2>
            <ul>
                <li>Price: {spot.price}</li>
                <li>Location: {spot.city}, {spot.state}</li>
                <li>Average Rating: {spot.avgRating}</li>
                <li>Preview Image: {spot.previewImage[0]}</li>
            </ul>
        </div>
    );
}

export default SpotTile;
