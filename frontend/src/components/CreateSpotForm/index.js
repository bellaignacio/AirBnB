import SpotForm from "../SpotForm";

function CreateSpotForm() {
    const spot = {
        country: '',
        address: '',
        city: '',
        state: '',
        lat: '',
        lng: '',
        description: '',
        name: '',
        price: '',
        previewImage: ''
    };

    return (
        <SpotForm spot={spot} formType="Create Spot" />
    );
}

export default CreateSpotForm;
