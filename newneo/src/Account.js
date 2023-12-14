import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import React, { useState, useEffect } from 'react';
import './index.css';

const Account = () => {
  const [pets, setPets] = useState([]);

  const handleItemClick = (item) => {
    // Handle the click event for each menu item
    console.log(`Clicked on ${item}`);
  };

  useEffect(() => {
    // Function to retrieve user pets from the backend
    const getUserPets = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/get-user-pets', {
          method: 'GET',
          credentials: 'include', // Important for sending cookies
        });

        const data = await response.json();

        if (response.ok) {
          console.log('Retrieved pets:', data.pets);
          setPets(data.pets); // Assuming 'data.pets' contains an array of pets
        } else {
          console.error('Error retrieving pets:', data.error);
        }
      } catch (error) {
        console.error('Error retrieving pets:', error.message);
      }
    };

    getUserPets();
  }, []);

  return (
    <div>
      <h1>User Page</h1>
      <h2>Pets</h2>
      <ul>
        {pets.map((pet) => (
          <li key={pet.id}>
            <strong>Name:</strong> {pet.name}, <strong>Type:</strong> {pet.type}
          </li>          
        ))}

        <li>
            <Link to="/petpage" onClick={() => handleItemClick('PetPage')}>pet page</Link>
        </li>
      </ul>
    </div>
  );
};

export default Account;
