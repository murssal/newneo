//front end react
import React, { useState } from 'react';
import './index.css'

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();


    try {
      setLoading(true);

      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
      });

      if (response.ok) {
        console.log('User added successfully!');
      } else {
        console.error(`Failed to add user. Server responded with ${response.status}`);
      }
    } catch (error) {
      console.error('An error occurred while connecting to the server:', error.message);
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
