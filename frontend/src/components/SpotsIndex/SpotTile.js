import { useHistory } from 'react-router-dom';
import dummyImage from '../../download.png';
import OpenModalButton from '../OpenModalButton';
import DeleteSpotModal from '../DeleteSpotModal';

function SpotTile({ spot, userOnly }) {
    const history = useHistory();

    return (
        <div title={spot.name} className='spot-tile' onClick={() => history.push(`/spots/${spot.id}`)}>
            <img className='preview-img' src={spot.previewImage[0]} onError={(e) => {
                e.target.src = dummyImage;
                e.onerror = null;
            }} alt={spot.previewImage[0].split('/').pop()} />
            <div className='preview-details'>
                <div className='spot-location'>{spot.city}, {spot.state}</div>
                <div className='spot-rating'>&#9733;   {spot.avgRating === 0 ? "New" : `${spot.avgRating.toFixed(1)}`}</div>
                <div className='spot-price'>${spot.price} night</div>
            </div>
            <div className='spot-btn-container' onClick={(e) => e.stopPropagation()}>
                {userOnly && <button className='update-spot-btn accent' onClick={() => history.push(`/spots/${spot.id}/edit`)}>Update</button>}
                {userOnly &&
                    <OpenModalButton
                        modalComponent={<DeleteSpotModal id={spot.id} />}
                        buttonText="Delete"
                        className='delete-spot-btn'
                    />
                }
            </div>
        </div>
    );
}

export default SpotTile;
