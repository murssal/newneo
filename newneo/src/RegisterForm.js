// RegisterForm.js
// register form for new users, inserts into database
import React, { useState } from "react";
import "./index.css";

const RegisterForm = () => {
  // react states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // backend call
    // adds users + makes sure user doesn't already exist in database
    try {
      setLoading(true);

      const response = await fetch("http://34.215.164.92:5000/api/users", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, email }),
      });
      // success and error messages
      if (response.ok) {
        console.log("User added successfully!");
        setSuccessMessage("User registered successfully!");
        setErrorMessage("");
      } else {
        console.error(
          `Failed to add user. Server responded with ${response.status}`
        );
        setErrorMessage(`A user with that name or email already exists!`);
        setSuccessMessage("");
      }
    } catch (error) {
      console.error(
        "An error occurred while connecting to the server:",
        error.message
      );
      setErrorMessage("An error occurred. Please try again.");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  // displays register form + success and error messages
  return (
    <div>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-container">
          <img
            className="signup-image"
            src="https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/sign_up_aisha.png?v=1702428952415"
            alt="Signup"
          />
          <div className="form-fields">
            {errorMessage && (
              <div className="error-message">{errorMessage}</div>
            )}
            {successMessage && (
              <div className="success-message">{successMessage}</div>
            )}
            <label>
              Username:
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Password:
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </label>
            <br />
            <label>
              Email:
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
            <br />
            <button type="submit" disabled={loading}>
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
