// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./Header";
import RegisterForm from "./RegisterForm";
import LoginForm from "./LoginForm";
import Home from "./Home";
import PetForm from "./PetForm";
import { UserProvider } from "./UserContext";
import ItemShop from "./itemShop";
import MiniGame from "./MiniGame";
import LogoutConfirmation from "./LogoutConfirmation";
import Shelter from "./Shelter";
import PetPage from "./PetPage";
import Account from "./Account";

// main App component
const App = () => {
  // state to manage user information
  const [user, setUser] = useState(null);

  // function to log registration form submission
  const handleRegisterSubmit = (formData) => {
    console.log("Form Data:", formData);
  };

  // function to handle user login submission
  const handleLoginSubmit = (user) => {
    console.log("User logged in:", user);
    // Add logic to handle user login
    setUser(user);
  };

  // function to log pet form submission
  const handlePetSubmit = (petName) => {
    console.log("Pet entered:", petName);
  };

  return (
    <UserProvider>
      <Router>
        <div>
          {/* Header component for navigation across all pages*/}
          <Header />

          {/* Routes for different pages in the app */}
          <Routes>
            {/* Default path when the website is loaded (Home)*/}
            <Route path="/" element={<Home />} />

            {/* Other routes */}
            <Route
              path="/register"
              element={<RegisterForm onSubmit={handleRegisterSubmit} />}
            />
            <Route
              path="/login"
              element={<LoginForm onLogin={handleLoginSubmit} />}
            />
            <Route
              path="/pets"
              element={<PetForm onSubmit={handlePetSubmit} />}
            />
            <Route path="/minigame" element={<MiniGame user={user} />} />
            <Route
              path="/logout-confirmation"
              element={<LogoutConfirmation />}
            />
            <Route path="/itemshop" element={<ItemShop user={user} />} />
            <Route path="/shelter" element={<Shelter user={user} />} />
            <Route path="/PetPage" element={<PetPage user={user} />} />
            <Route path="/Account" element={<Account user={user} />} />
          </Routes>
        </div>
      </Router>
    </UserProvider>
  );
};

export default App;
