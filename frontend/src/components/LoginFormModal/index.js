import React, { useState } from "react";
import { useHistory } from "react-router";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";

function LoginFormModal() {
    const dispatch = useDispatch();
    const history = useHistory();
    const [credential, setCredential] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors({});
        dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .then(() => history.push('/'))
            .catch(async (res) => {
                const data = await res.json();
                if (data && data.message) {
                    setErrors({ message: data.message });
                }
            });
    };

    return (
        <>
            <h2>Log In</h2>
            <form onSubmit={handleSubmit}>
                {errors.message && (
                    <p className="error-msg">{errors.message}</p>
                )}
                <label>
                    Username or Email
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                    />
                </label>
                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </label>
                <button type="submit" disabled={credential.length < 4 || password.length < 6}>Log In</button>
                <button onClick={(e) => {
                    // dispatch(sessionActions.login({ credential: 'Demo-lition', password: 'passwordDemo' }))
                    //     .then(closeModal)
                    //     .then(() => history.push('/'));
                    setCredential('Demo-lition');
                    setPassword('passwordDemo');
                }}>Log In as Demo User</button>
            </form>
        </>
    );
}

export default LoginFormModal;
