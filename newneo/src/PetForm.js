import React, { useState } from 'react';

const PetForm = ({ userId, onPetAdded }) => {
  const [petType, setPetType] = useState('');
  const [petName, setPetName] = useState('');

  const handlePetTypeChange = (event) => {
    const selectedPetType = event.target.value;
    // You can set image_data based on the selected pet type
    let imageData = '';
    if (selectedPetType === 'cat') {
      imageData = 'https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/aisha.gif?v=1702338038022';
    } else if (selectedPetType === 'dog') {
      imageData = 'https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/flotsam.gif?v=1702341566583';
    } else if (selectedPetType === 'bunny') {
      imageData = 'bunny_image_url';
    } else if (selectedPetType === 'frog') {
      imageData = 'frog_image_url';
    }
    setPetType(selectedPetType);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/user-pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          pet_name: petName,
          pet_type: petType,
          // health and happiness will default to 100
        }),
        credentials: 'include', // Important for sending cookies
      });

      if (response.ok) {
        console.log('Pet added successfully!');
        // You can perform additional actions, like updating the UI
        if (onPetAdded) {
          onPetAdded();
        }
      } else {
        console.error('Failed to add pet.');
      }
    } catch (error) {
      console.error('An error occurred:', error.message);
    }
  };

  return (
    <div>
      <h2>Add a Pet</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Pet Type:
          <select value={petType} onChange={handlePetTypeChange}>
            <option value="cat">Cat</option>
            <option value="dog">Dog</option>
            <option value="bunny">Bunny</option>
            <option value="frog">Frog</option>
          </select>
        </label>
        <br />
        <label>
          Pet Name:
          <input type="text" value={petName} onChange={(e) => setPetName(e.target.value)} required />
        </label>
        <br />
        <button type="submit">Add Pet</button>
      </form>
    </div>
  );
};

export default PetForm;
