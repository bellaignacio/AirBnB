import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as reviewsActions from "../../store/reviews";

function DeleteReviewModal({ id }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(reviewsActions.deleteReview(id))
            .then(closeModal);
    };

    return (
        <>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to delete this review?</p>
            <form onSubmit={handleSubmit}>
                <button type="submit">Yes (Delete Review)</button>
                <button onClick={closeModal}>No (Keep Review)</button>
            </form>
        </>
    );
}

export default DeleteReviewModal;
