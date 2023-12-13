// RegisterForm.js
import React, { useState } from 'react';
import './index.css'

const RegisterForm = ({ onSubmit }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Calling onSubmit:', onSubmit);
        onSubmit({ username, password, email });
    };

    return (
        <form className="register-form" onSubmit={handleSubmit} >
            <div className="form-container">
                <img
                    className="signup-image"
                    src="https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/sign_up_aisha.png?v=1702428952415"
                    alt="Signup"
                />
                <div className="form-fields">
                    <label>
                        Username:
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </label>
                    <br />
                    <label>
                        Password:
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </label>
                    <br />
                    <label>
                        Email:
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>
                    <br />
                    <button type="submit">REGISTER</button>
                </div>
            </div>
        </form>
    );
};

export default RegisterForm;
