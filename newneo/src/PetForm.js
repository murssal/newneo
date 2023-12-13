import React, { useState } from 'react';
import './PetForm.css';

const PetForm = ({ userId, onPetAdded }) => {
  const [petType, setPetType] = useState('');
  const [petName, setPetName] = useState('');

  const handlePetTypeChange = (event) => {
    setPetType(event.target.value);
  };

  const petOptions = [
    { value: 'Aisha', imageUrl: 'https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/aisha.gif?v=1702338038022' },
    { value: 'Flotsam', imageUrl: 'https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/flotsam.gif?v=1702341566583' },
    { value: 'Kacheek', imageUrl: 'https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/kacheek.gif?v=1702341629158' },
    { value: 'Kougra', imageUrl: 'https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/kougra.gif?v=1702452833954' },
  ];

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
        }),
        credentials: 'include',
      });

      if (response.ok) {
        console.log('Pet added successfully!');
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
        <form className="petform-container" onSubmit={handleSubmit}>
          <h2>Add a Pet</h2>
          <div className="pet-options">
            {petOptions.map((pet) => (
                <div key={pet.value} className="pet-option">
                  <label>
                    <img
                        src={pet.imageUrl}
                        alt={`Image of ${pet.value}`}
                        style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '10px' }}
                    />
                    <p>{pet.value}</p>
                    <input
                        type="radio"
                        value={pet.value}
                        checked={petType === pet.value}
                        onChange={handlePetTypeChange}
                    />
                  </label>
                </div>
            ))}
          </div>
          <label>
            Pet Name:
            <input className={"nameInput"} type="text" value={petName} onChange={(e) => setPetName(e.target.value)} required />
          </label>
          <br />
          <button type="submit">Add Pet</button>
        </form>
      </div>
  );
};

export default PetForm;
