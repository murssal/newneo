//front end react
import React, { useState } from 'react';
import './index.css'

const RegisterForm = () => {
  // State variables for user registration form
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Send user registration data to the server
      const response = await fetch('https://newneobe.onrender.com/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      // Check server response
      if (response.ok) {
        console.log('User added successfully!');
        setSuccessMessage('User registered successfully!');
        setErrorMessage('');
      } else {
        console.error(`Failed to add user. Server responded with ${response.status}`);
        setErrorMessage('A user with that name or email already exists!');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('An error occurred while connecting to the server:', error.message);
      setErrorMessage('An error occurred. Please try again.');
      setSuccessMessage('');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <form className="register-form" onSubmit={handleSubmit} >
          <div className="form-container">
              <img
                  className="signup-image"
                  src="https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/sign_up_aisha.png?v=1702428952415"
                  alt="Signup"
              />
              <div className="form-fields">
              {errorMessage && <div className="error-message">{errorMessage}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}
            <label>
            Username:
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
          </label>
          <br />
          <label>
            Password:
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <br />
          <label>
            Email:
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <br />
          <button type="submit" disabled={loading}>Submit</button>
          </div>
          </div>
        </form>
    </div>
  );
};

export default RegisterForm;
