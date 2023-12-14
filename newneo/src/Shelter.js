import React from 'react';
import './Shelter.css';

const Shelter = () => {
    return (
        <div>
            <div className='landing-BG'>
                <h2>Welcome to Your Shelter!</h2>
                <p>
                    This is where you can see and interact with your adopted pets!
                </p>
            </div>

            <div className='shelter-container'>
                <div className='shelter-background'>
                    <div className='pet-container'>
                        <p>Pet 1 Name</p>
                        <img src='https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/aisha.gif?v=1702338038022' alt="Pet 1" />
                    </div>
                    <div className='pet-container'>
                        <p>Pet 2 Name</p>
                        <img src='https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/flotsam.gif?v=1702341566583' alt="Pet 2" />
                    </div>
                    <div className='pet-container'>
                        <p>Pet 3 Name</p>
                        <img src='https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/kacheek.gif?v=1702341629158' alt="Pet 3" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Shelter;