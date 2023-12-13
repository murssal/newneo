// Header.js

import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useUser } from './UserContext';
import './index.css'; // Import the CSS file

const Header = () => {
    const { isLoggedIn, logout } = useUser();

    const handleItemClick = (item) => {
        // Handle the click event for each menu item
        console.log(`Clicked on ${item}`);
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
                        <>
                            <li>
                                <Link to="/Shelter" onClick={() => handleItemClick('Shelter')}>Shelter</Link>
                            </li>
                            <li>
                                <Link to="/ItemShop" onClick={() => handleItemClick('Item Shop')}>Item Shop</Link>
                            </li>
                            <li>
                                <Link to="/Account" onClick={() => handleItemClick('Item Shop')}>Item Shop</Link>
                            </li>
                            <li>
                                <button onClick={logout}>Log Out</button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" onClick={() => handleItemClick('Login')}>Login</Link>
                            </li>
                            <li>
                                <Link to="/register" onClick={() => handleItemClick('Register')}>Register</Link>
                            </li>
                            <li>
                                <Link to="/About" onClick={() => handleItemClick('About')}>About</Link>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
