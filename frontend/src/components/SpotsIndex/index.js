import SpotTile from "./SpotTile";

function SpotsIndex({ spots, userOnly }) {
    return (
        <>
            {spots?.map(spotObj => (
                <SpotTile key={spotObj.id} spot={spotObj} userOnly={userOnly}/>
            ))}
        </>
    );
}

export default SpotsIndex;
