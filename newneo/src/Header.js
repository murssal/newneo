// Header.js

import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import "./Header.css"; // Import the CSS file

// Header component definition
const Header = () => {
  const { isLoggedIn, logout } = useUser();
  const navigate = useNavigate(); // Access the history object

  // Handle click event for each menu item
  const handleItemClick = (item) => {
    console.log(`Clicked on ${item}`);
  };

  // Handle logout event
  const handleLogout = async () => {
    try {
      // Send logout request to the server
      const response = await fetch("https://newneobe.onrender.com/api/logout", {
        method: "POST",
        credentials: "include",
      });

      // Check if logout was successful
      if (response.ok) {
        console.log("Logout successful");
        // Redirect to the logout confirmation page
        navigate("/logout-confirmation");
      } else {
        console.error("Logout failed:", response.statusText);
      }
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  
  return (
    <header>
      <div className="logo-container">
        <img
          src="https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/NeopetsLogo.png?v=1702366985970"
          alt="Neopets Logo"
          className="logo"
        />
      </div>

      <nav>
        <ul>
          {isLoggedIn ? (
            <></>
          ) : (
            <>
              {/* Navigation menu items for users */}
              <li>
                <Link to="/" onClick={() => handleItemClick("Home")}>
                  home
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={() => handleItemClick("Login")}>
                  login!
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  onClick={() => handleItemClick("Register")}
                >
                  register!
                </Link>
              </li>
              <li>
                <Link to="/shelter" onClick={() => handleItemClick("Shelter")}>
                  shelter
                </Link>
              </li>
              <li>
                <Link
                  to="/itemshop"
                  onClick={() => handleItemClick("Item Shop")}
                >
                  item shop
                </Link>
              </li>
              <li>
                <Link
                  to="/account"
                  onClick={() => handleItemClick("Account")}
                >
                  account
                </Link>
              </li>
              <li>
                <Link
                  to="/pets"
                  onClick={() => handleItemClick("CreatePet")}
                >
                  create a pet
                </Link>
              </li>
              <li>
                <Link
                  to="/minigame"
                  onClick={() => handleItemClick("MiniGame")}
                >
                  mini game
                </Link>
              </li>
              <li>
                <Link
                  to="/PetPage"
                  onClick={() => handleItemClick("PetPage")}
                >
                  my pets
                </Link>
              </li>
              <li>
                {/* Logout button for users */}
                <button onClick={handleLogout}>Log Out</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
