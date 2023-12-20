// LogoutConfirmation.js
import React from 'react';
import './index.css';

const LogoutConfirmation = () => {
    return (
        // Confirmation message
        <div className={"homeBG"}>
            {/* Logout image */}
            <img
                alt="oopsies! logged out"
                src="https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/oops.gif?v=1702428952995"
            />
        
            <h2>Logout Confirmation</h2>
            
            {/* Logout success message */}
            <p>You have successfully logged out. Thank you for checking us out!</p>
        </div>
    );
};

export default LogoutConfirmation;
