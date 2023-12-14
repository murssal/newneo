import React, { useState, useEffect } from 'react';
import './Shelter.css';

const Shelter = ({ userId, onPetAdded }) => {
  const [petType, setPetType] = useState('');
  const [petName, setPetName] = useState('');
  const [imageData, setImageData] = useState('');
  const [error, setError] = useState(null); // New error state
  const [successMessage, setSuccessMessage] = useState(null); //success message

  useEffect(() => {
    if (petOptions.length > 0) {
      loadImageData(petOptions[0].imageUrl); // Load data for the first pet type
    }
  }, []);

  


  const loadImageData = async (imageUrl) => {
    try {
      console.log('Image URL loaded successfully:', imageUrl);
      setImageData(imageUrl);
    } catch (error) {
      console.error('Error loading image data:', error.message);
      setError('Error loading image data'); // Set error state
    }
  };
  
  const potentialNames = [
    'Eyrie', 'Gelert', 'Gnorbu', 'Grarrl', 'Grundo', 'Hissi', 'Ixi', 'Jetsam',
    'JubJub', 'Kau', 'Kiko', 'Koi', 'Korbat', 'Krawk', 'Kyrii', 'Lenny',
    'Lupe', 'Lutari', 'Meerca', 'Moehog', 'Mynci', 'Max', 'Bella', 'Oliver', 'Chloe', 'Charlie', 'Lucy', 'Leo', 'Daisy', 'Milo',
    'Bella', 'Rocky', 'Lily', 'Teddy', 'Zoe', 'Oscar', 'Mia', 'Jasper', 'Sadie', 'Dexter'
  ];
  
  const getRandomName = () => {
    const randomIndex = Math.floor(Math.random() * potentialNames.length);
    return potentialNames[randomIndex];
  };
  

  const petOptions = [
    { name: getRandomName(), value: 'Aisha', imageUrl: 'https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/aisha.gif?v=1702338038022' },
    { name: getRandomName(), value: 'Flotsam', imageUrl: 'https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/flotsam.gif?v=1702341566583' },
    { name: getRandomName(), value: 'Kacheek', imageUrl: 'https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/kacheek.gif?v=1702341629158' },
    { name: getRandomName(), value: 'Kougra', imageUrl: 'https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/kougra.gif?v=1702452833954' },
  ];

  const getRandomPet = (usedPets) => {
    let availablePets = petOptions.filter(pet => !usedPets.includes(pet));
    const randomIndex = Math.floor(Math.random() * availablePets.length);
    const selectedPet = availablePets[randomIndex];
    usedPets.push(selectedPet);
    return selectedPet;
  };
  
  const selectedPets = Array.from({ length: 3 }, () => getRandomPet([]));

  const handlePetTypeChange = (selectedPet) => {
    setPetType(selectedPet.value);
    setPetName(selectedPet.name); // Set the selected pet name
    setImageData(selectedPet.imageUrl);
  };

  const handlePetSelectAndAdd = (selectedPet) => {
    setPetType(selectedPet.value);
    setPetName(selectedPet.name);
    setImageData(selectedPet.imageUrl);

    try {
      fetch('http://localhost:5000/api/user-pets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          pet_name: selectedPet.name,
          pet_type: selectedPet.value,
          image_data: selectedPet.imageUrl,
        }),
        credentials: 'include',
      })
        .then((response) => {
          if (response.ok) {
            console.log('Pet added successfully!');
            setError(null);
            setSuccessMessage('Pet added successfully!');
            if (onPetAdded) {
              onPetAdded();
            }
          } else {
            console.error('Failed to add pet.');
            setError('Failed to add pet, you must be logged in to create a pet!');
            setSuccessMessage(null);
          }
        })
        .catch((error) => {
          console.error('An error occurred:', error.message);
          setError('An error occurred, it\'s us, not you!');
          setSuccessMessage(null);
        });
    } catch (error) {
      console.error('An error occurred:', error.message);
      setError('An error occurred, it\'s us, not you!');
      setSuccessMessage(null);
    }
  };


  return (
    <div>
    <div className='landing-BG'>
        <h2>Welcome to the Shelter!</h2>
        <p>
            This is where you can meet and adopt new pets!
        </p>
    </div>

    <div className='shelter-container'>
        <div className='shelter-background'>
          {selectedPets.map((pet, index) => (
            <div key={index} className='pet-container'>
              <p>{pet.name}</p>
              <p>Type: {pet.value}</p>
              <img src={pet.imageUrl} alt={`Pet ${index + 1}`} />
              <button onClick={() => handlePetSelectAndAdd(pet)}>Add Pet</button>
            </div>
          ))}
        </div>
      </div>
    </div>

  );
};

export default Shelter;