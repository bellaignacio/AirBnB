import { useState } from 'react';
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as reviewsActions from "../../store/reviews";
import './CreateReview.css';

function CreateReviewModal({ id }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();
    const [review, setReview] = useState('');
    const [stars, setStars] = useState(0);
    const [hover, setHover] = useState(0);
    const [errors, setErrors] = useState({});

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        const payload = {
            id,
            review,
            stars
        };
        console.log(stars);
        dispatch(reviewsActions.createReview(payload))
            .then(closeModal)
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.message) {
                    setErrors({ message: data.message });
                }
            });
    };

    return (
        <>
            <h1>How was your stay?</h1>
            <form onSubmit={handleSubmit}>
            {errors.message && <p className="error-msg">{errors.message}</p>}
                <textarea
                    value={review}
                    onChange={(e) => setReview(e.target.value)}
                    placeholder="Leave your review here..."
                />
                <div className="star-container">
                    {[1, 2, 3, 4, 5].map((star, index) => {
                        index += 1;
                        return (
                            <button
                                type="button"
                                key={index}
                                className={index <= (hover || stars) ? "star-button on" : "star-button off"}
                                onClick={() => setStars(index)}
                                onMouseEnter={() => setHover(index)}
                                onMouseLeave={() => setHover(stars)}
                            >
                                <span className="star">&#9733;</span>
                            </button>
                        );
                    })}
                </div>
                <button type="submit"
                    disabled={review.length < 10 || stars < 1}
                >
                    Submit Your Review
                </button>
            </form>
        </>
    );
}

export default CreateReviewModal;
