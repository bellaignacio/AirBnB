import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as spotsActions from "../../store/spots";

function DeleteSpotModal({ id }) {
    const { closeModal } = useModal();
    const dispatch = useDispatch();

    const deleteSpot = () => {
        return dispatch(spotsActions.deleteSpot(id))
            .then(closeModal);
    };

    return (
        <>
            <h1>Confirm Delete</h1>
            <p>Are you sure you want to remove this spot from the listings?</p>
            <button onClick={deleteSpot}>Yes (Delete Spot)</button>
            <button onClick={closeModal}>No (Keep Spot)</button>
        </>
    );
}

export default DeleteSpotModal;
