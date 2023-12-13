// Header.js



import React from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useUser } from './UserContext';
import './Header.css'; // Import the CSS file

const Header = () => {
    const { isLoggedIn, logout } = useUser();

    const handleItemClick = (item) => {
        // Handle the click event for each menu item
        console.log(`Clicked on ${item}`);
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                console.log('Logout successful');
                // You can perform additional actions after logout, such as redirecting the user
            } else {
                console.error('Logout failed:', response.statusText);
            }
        } catch (error) {
            console.error('Error during logout:', error.message);
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
                        <>

                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/" onClick={() => handleItemClick('Home')}>home</Link>
                            </li>
                            <li>
                                <Link to="/about" onClick={() => handleItemClick('About')}>about</Link>
                            </li>
                            <li>
                                <Link to="/login" onClick={() => handleItemClick('Login')}>login!</Link>
                            </li>
                            <li>
                                <Link to="/register" onClick={() => handleItemClick('Register')}>register!</Link>
                            </li>
                            <li>
                                <Link to="/shelter" onClick={() => handleItemClick('Shelter')}>shelter</Link>
                            </li>
                            <li>
                                <Link to="/itemshop" onClick={() => handleItemClick('Item Shop')}>item shop</Link>
                            </li>
                            <li>
                                <Link to="/account" onClick={() => handleItemClick('Account')}>account</Link>
                            </li>
                            <li>
                                <Link to="/pets" onClick={() => handleItemClick('CreatePet')}>create a pet</Link>
                            </li>
                            <li>
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