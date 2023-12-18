// LoginForm.js
// front end to back end for user log in
import React, { useState } from "react";
import "./index.css";

const LoginForm = ({ onLogin }) => {
  //react states
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // routes to backend
      const response = await fetch("http://34.215.164.92:5000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include", // important for sending cookies (keep user logged in across pages)
      });

      const data = await response.json();
      // success and error messages
      if (response.ok) {
        console.log("Login successful:", data);
        setSuccessMessage("Login successful!");
        setErrorMessage("");

        // call the callback user prop
        if (onLogin) {
          onLogin(data.user);
        }
      } else {
        console.error("Login failed:", data.error);
        setErrorMessage(
          "Login failed. Please check your credentials and try again."
        );
        setSuccessMessage("");
      }
    } catch (error) {
      console.error("Error during login:", error.message);
      setErrorMessage("An error occurred. Please try again.");
      setSuccessMessage("");
    }
  };

  // print results to webpage
  return (
    <form onSubmit={handleSubmit}>
      <img
        alt="login"
        className="formImg"
        src={
          "https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/login.gif?v=1702431752703"
        }
      ></img>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}
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
      <button type="submit">LOGIN</button>
    </form>
  );
};

export default LoginForm;
