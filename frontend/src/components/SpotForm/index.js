import { useState } from 'react';
import { useHistory } from 'react-router';
import { useDispatch } from 'react-redux';
import * as spotsActions from "../../store/spots";
import './SpotForm.css';

function SpotForm({ spot, formType }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const [country, setCountry] = useState(spot.country);
    const [address, setAddress] = useState(spot.address);
    const [city, setCity] = useState(spot.city);
    const [state, setState] = useState(spot.state);
    const [lat, setLat] = useState(spot.lat);
    const [lng, setLng] = useState(spot.lng);
    const [description, setDescription] = useState(spot.description);
    const [name, setName] = useState(spot.name);
    const [price, setPrice] = useState(spot.price);
    const [previewImage, setPreviewImage] = useState(spot.previewImage);
    const [imageOne, setImageOne] = useState(spot.imageOne);
    const [imageTwo, setImageTwo] = useState(spot.imageTwo);
    const [imageThree, setImageThree] = useState(spot.imageThree);
    const [imageFour, setImageFour] = useState(spot.imageFour);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});

        const payload = {
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price,
            previewImage,
            imageOne,
            imageTwo,
            imageThree,
            imageFour
        };

        const frontendErrors = {};
        if (description.length < 30) frontendErrors.description = 'Description needs a minimum of 30 characters';
        if (!previewImage) frontendErrors.previewImage = 'Preview image is required';
        if (previewImage && !previewImage.endsWith('.png') && !previewImage.endsWith('.jpg') && !previewImage.endsWith('.jpeg')) frontendErrors.previewImage = 'Image URL must end in .png, .jpg, .jpeg';
        if (imageOne && !imageOne.endsWith('.png') && !imageOne.endsWith('.jpg') && !imageOne.endsWith('.jpeg')) frontendErrors.imageOne = 'Image URL must end in .png, .jpg, .jpeg';
        if (imageTwo && !imageTwo.endsWith('.png') && !imageTwo.endsWith('.jpg') && !imageTwo.endsWith('.jpeg')) frontendErrors.imageTwo = 'Image URL must end in .png, .jpg, .jpeg';
        if (imageThree && !imageThree.endsWith('.png') && !imageThree.endsWith('.jpg') && !imageThree.endsWith('.jpeg')) frontendErrors.imageThree = 'Image URL must end in .png, .jpg, .jpeg';
        if (imageFour && !imageFour.endsWith('.png') && !imageFour.endsWith('.jpg') && !imageFour.endsWith('.jpeg')) frontendErrors.imageFour = 'Image URL must end in .png, .jpg, .jpeg';
        if (!country) frontendErrors.country = 'Country is required';
        if (!address) frontendErrors.address = 'Street Address is required';
        if (!city) frontendErrors.city = 'City is required';
        if (!state) frontendErrors.state = 'State is required';
        if (!lat) frontendErrors.lat = 'Latitude must be within -90 and 90 degrees';
        if (!lng) frontendErrors.lng = 'Longitude must be within -180 and 180 degrees';
        if (!name) frontendErrors.name = 'Name is required';
        if (!price) frontendErrors.price = 'Price is required';

        if (Object.keys(frontendErrors).length) {
            setErrors(frontendErrors);
        } else if (formType === 'Create Spot') {
            dispatch(spotsActions.createSpot(payload))
                .then(res => history.push(`/spots/${res}`))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) {
                        setErrors(data.errors);
                    }
                });
        } else if (formType === 'Update Spot') {
            dispatch(spotsActions.updateSpot({ ...payload, id: spot.id }))
                .then(res => history.push(`/spots/${res}`))
                .catch(async (res) => {
                    const data = await res.json();
                    if (data && data.errors) {
                        setErrors(data.errors);
                    }
                });
        }
    };

    return (
        <>
            <h1 className='form-header'>{formType === 'Create Spot' ? "Create a New Spot" : "Update your Spot"}</h1>
            <form onSubmit={handleSubmit}>
                <div className='form-section'>
                    <h2 className='form-subheading'>Where's your place located?</h2>
                    <p>Guests will only get your exact address once they booked a reservation.</p>
                    <label>
                        Country
                        <input
                            type="text"
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                            placeholder="Country"
                        />
                    </label>
                    {errors.country && <p className="error-msg">{errors.country}</p>}
                    <label>
                        Street Address
                        <input
                            type="text"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            placeholder="Street Address"
                        />
                    </label>
                    {errors.address && <p className="error-msg">{errors.address}</p>}
                    <label>
                        City
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            placeholder="City"
                        />
                    </label>
                    {errors.city && <p className="error-msg">{errors.city}</p>}
                    <label>
                        State
                        <input
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="State"
                        />
                    </label>
                    {errors.state && <p className="error-msg">{errors.state}</p>}
                    <label>
                        Latitude
                        <input
                            type="number"
                            value={lat}
                            onChange={(e) => setLat(e.target.value)}
                            placeholder="Latitude"
                        />
                    </label>
                    {errors.lat && <p className="error-msg">{errors.lat}</p>}
                    <label>
                        Longitude
                        <input
                            type="number"
                            value={lng}
                            onChange={(e) => setLng(e.target.value)}
                            placeholder="Longitude"
                        />
                    </label>
                    {errors.lng && <p className="error-msg">{errors.lng}</p>}
                </div>
                <div className='form-section'>
                    <h2 className='form-subheading'>Describe your place to guests</h2>
                    <p>Mention the best features of your space, any special amenities like
                        fast wifi or parking, and what you love about the neighborhood.
                    </p>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Please write at least 30 characters"
                    />
                    {errors.description && <p className="error-msg">{errors.description}</p>}
                </div>
                <div className='form-section'>
                    <h2 className='form-subheading'>Create a title for your spot</h2>
                    <p>Catch guests' attention with a spot title that highlights what makes your space special.</p>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name of your spot"
                    />
                    {errors.name && <p className="error-msg">{errors.name}</p>}
                </div>
                <div className='form-section'>
                    <h2 className='form-subheading'>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <span className='price-input'>$<input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price per night (USD)"
                    /></span>
                    {errors.price && <p className="error-msg">{errors.price}</p>}
                </div>
                <div className='form-section'>
                    <h2 className='form-subheading'>Liven up your spot with photos</h2>
                    <p>Submit a link to at least one photo to publish your spot.</p>
                    <input
                        type="text"
                        value={previewImage}
                        onChange={(e) => setPreviewImage(e.target.value)}
                        placeholder="Preview Image URL"
                    />
                    {errors.previewImage && <p className="error-msg">{errors.previewImage}</p>}
                    <input
                        type="text"
                        value={imageOne}
                        onChange={(e) => setImageOne(e.target.value)}
                        placeholder="Image URL"
                    />
                    {errors.imageOne && <p className="error-msg">{errors.imageOne}</p>}
                    <input
                        type="text"
                        value={imageTwo}
                        onChange={(e) => setImageTwo(e.target.value)}
                        placeholder="Image URL"
                    />
                    {errors.imageTwo && <p className="error-msg">{errors.imageTwo}</p>}
                    <input
                        type="text"
                        value={imageThree}
                        onChange={(e) => setImageThree(e.target.value)}
                        placeholder="Image URL"
                    />
                    {errors.imageThree && <p className="error-msg">{errors.imageThree}</p>}
                    <input
                        type="text"
                        value={imageFour}
                        onChange={(e) => setImageFour(e.target.value)}
                        placeholder="Image URL"
                    />
                    {errors.imageFour && <p className="error-msg">{errors.imageFour}</p>}
                </div>
                <button className="primary" type="submit">{formType === 'Create Spot' ? "Create Spot" : "Update your Spot"}</button>
            </form>
        </>
    );
}

export default SpotForm;
