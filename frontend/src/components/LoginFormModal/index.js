import React, { useState } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
    const dispatch = useDispatch();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        return dispatch(sessionActions.login({ credential, password }))
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
            <h1>Log In</h1>
            {errors.message && (
                <p className="error-msg">{errors.message}</p>
            )}
            <form onSubmit={handleSubmit}>
                <label>
                    Username or Email
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                <button type="submit" disabled={credential.length < 4 || password.length < 6}>Log In</button>
                <button onClick={(e) => {
                    setCredential('Demo-lition');
                    setPassword('passwordDemo');
                    dispatch(sessionActions.login({ credential, password }))
                        .then(closeModal);
                }}>Demo User</button>
            </form>
        </>
    );
}

export default LoginFormModal;
