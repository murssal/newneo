// LoginForm.js
import React, { useState } from 'react';
import './index.css';
const LoginForm = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Update the endpoint URL based on your backend route
            const response = await fetch('http://localhost:5000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();

            if (response.ok) {
                console.log('Login successful:', data);
                
                // Call the callback prop if provided
                if (onLogin) {
                    onLogin();
                }
            } else {
                console.error('Login failed:', data.error);
            }
        } catch (error) {
            console.error('Error during login:', error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <img alt="login" class="formImg" src={"https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/login.gif?v=1702431752703"}>
            </img>
            <label>
                Username:
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
            </label>
            <br />
            <label>
                Password:
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </label>
            <br />
            <button type="submit">LOGIN</button>
        </form>
    );
};

export default LoginForm;
