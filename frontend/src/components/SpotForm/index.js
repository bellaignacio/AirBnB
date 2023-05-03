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
        dispatch(
            spotsActions.createSpot({
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
            })
        )
            .then(res => history.push(`/spots/${res}`))
            .catch(async (res) => {
                console.log(res);
                const data = await res.json();
                if (data && data.errors) {
                    setErrors(data.errors);
                }
            });
    };

    return (
        <>
            <h1>Create a new Spot</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <h2>Where's your place located?</h2>
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
                            placeholder="Address"
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
                            placeholder="STATE"
                        />
                    </label>
                    {errors.state && <p className="error-msg">{errors.state}</p>}
                    <label>
                        Latitude
                        <input
                            type="text"
                            value={lat}
                            onChange={(e) => setLat(e.target.value)}
                            placeholder="Latitude"
                        />
                    </label>
                    {errors.lat && <p className="error-msg">{errors.lat}</p>}
                    <label>
                        Longitude
                        <input
                            type="text"
                            value={lng}
                            onChange={(e) => setLng(e.target.value)}
                            placeholder="Longitude"
                        />
                    </label>
                    {errors.lng && <p className="error-msg">{errors.lng}</p>}
                </div>
                <div>
                    <h2>Describe your place to guests</h2>
                    <p>Mention the best features of your space, any special amenities like
                        fast wifi or parking, and what you love about the neighborhood.
                    </p>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        minLength="30"
                        placeholder="Please write at least 30 characters"
                    />
                    {errors.description && <p className="error-msg">{errors.description}</p>}
                </div>
                <div>
                    <h2>Create a title for your spot</h2>
                    <p>Catch guests' attention with a spot title that highlights what makes your space special.</p>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Name of your spot"
                    />
                    {errors.name && <p className="error-msg">{errors.name}</p>}
                </div>
                <div>
                    <h2>Set a base price for your spot</h2>
                    <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
                    <span>$<input
                        type="text"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price per night (USD)"
                    /></span>
                    {errors.price && <p className="error-msg">{errors.price}</p>}
                </div>
                <div>
                    <h2>Liven up your spot with photos</h2>
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
                    <input
                        type="text"
                        value={imageTwo}
                        onChange={(e) => setImageTwo(e.target.value)}
                        placeholder="Image URL"
                    />
                    <input
                        type="text"
                        value={imageThree}
                        onChange={(e) => setImageThree(e.target.value)}
                        placeholder="Image URL"
                    />
                    <input
                        type="text"
                        value={imageFour}
                        onChange={(e) => setImageFour(e.target.value)}
                        placeholder="Image URL"
                    />
                </div>
                <button type="submit">Create Spot</button>
            </form>
        </>
    );
}

export default SpotForm;
