import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as spotsActions from "../../store/spots";

function DeleteSpotModal({ id }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(spotsActions.deleteSpot(id))
            .then(closeModal);
    };

    return (
        <>
            <h2>Confirm Delete</h2>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <form onSubmit={handleSubmit}>
                <button type="submit">Yes (Delete Spot)</button>
                <button className='accent' onClick={closeModal}>No (Keep Spot)</button>
            </form>
        </>
    );
}

export default DeleteSpotModal;
