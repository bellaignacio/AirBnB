import SpotTile from "./SpotTile";
import './SpotsIndex.css'

function SpotsIndex({ spots, userOnly }) {
    return (
        <div className='spots-container'>
            {spots?.map(spotObj => (
                <SpotTile key={spotObj.id} spot={spotObj} userOnly={userOnly} />
            ))}
        </div>
    );
}

export default SpotsIndex;
