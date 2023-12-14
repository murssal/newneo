import React, { useState, useEffect } from 'react';
import './PetPage.css';

const PetPage = () => {
    const [stats, setStats] = useState({
        name: '',
        type: '',
        health: '',
        happiness: '',
        image_data: '',
    });

    useEffect(() => {
        console.log('Fetching user pets...');
        fetch('http://localhost:5000/api/user-pets')
            .then((response) => response.json())
            .then((data) => {
                console.log('Data from API:', data);
                const pet = data.pets[0];
                console.log('Pet data:', pet);
                setStats({
                    name: pet.pet_name,
                    type: pet.pet_type,
                    health: pet.health,
                    happiness: pet.happiness,
                    image_data: pet.image_data,
                });
            })
            .catch((error) => console.error('Error fetching user pets:', error));
    }, []);


    const updateHunger = () => {
        // Implement logic to update hunger level
        console.log('Updating hunger...');
    };

    const updateHappiness = () => {
        // Implement logic to update happiness level
        console.log('Updating happiness...');
    };

    return (
        <div className="petpageBG">
            <div className="right">
                <h2>{stats.name}</h2>
                <table>
                    <tbody>
                    <tr>
                        <td>Type::</td>
                        <td>{stats.type}</td>
                    </tr>
                    <tr>
                        <td>Health:</td>
                        <td>{stats.health}</td>
                    </tr>
                    <tr>
                        <td>Happiness:</td>
                        <td>{stats.happiness}</td>
                    </tr>
                    </tbody>
                </table>
            </div>
            <div className="center">
                <img src={stats.image_data} alt="Pet" />
            </div>
            <div className="left">
                <button onClick={updateHunger}>Feed</button>
                <button onClick={updateHappiness}>Play</button>
            </div>
        </div>
    );
};

export default PetPage;
