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

const App = () => {
  // user react state
  const [user, setUser] = useState(null);
  // regsitration logging
  const handleRegisterSubmit = (formData) => {
    console.log("Form Data:", formData); // log for debugging
  };
  // user, hold for user tracking around site
  const handleLoginSubmit = (user) => {
    console.log("User logged in:", user); // log for debugging
    setUser(user);
  };
  // pet logging
  const handlePetSubmit = (petName) => {
    console.log("Pet entered:", petName); // log for debugging
  };
  // site router routes
  return (
    <UserProvider>
      <Router>
        <div>
          <Header />
          <Routes>
            {/* default path when website is loaded (Home)*/}
            <Route path="/" element={<Home />} />

            {/* other routes */}
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
