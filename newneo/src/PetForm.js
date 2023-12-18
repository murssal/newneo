// PetForm.js
// Create a Pet webpage
import React, { useState, useEffect } from "react";
import "./PetForm.css";

const PetForm = ({ userId, onPetAdded }) => {
  // react states
  const [petType, setPetType] = useState("");
  const [petName, setPetName] = useState("");
  const [imageData, setImageData] = useState("");
  const [error, setError] = useState(null); // error state
  const [successMessage, setSuccessMessage] = useState(null); //success message

  useEffect(() => {
    if (petOptions.length > 0) {
      loadImageData(petOptions[0].imageUrl); // Load data for the first pet type
    }
  }, []);

  const handlePetTypeChange = (event) => {
    const selectedPetType = event.target.value;
    const selectedPet = petOptions.find((pet) => pet.value === selectedPetType);
    setPetType(selectedPetType);

    loadImageData(selectedPet.imageUrl);
  };

  const loadImageData = async (imageUrl) => {
    try {
      console.log("Image URL loaded successfully:", imageUrl);
      setImageData(imageUrl);
    } catch (error) {
      console.error("Error loading image data:", error.message);
      setError("Error loading image data"); // Set error state
    }
  };
  // pet options
  const petOptions = [
    {
      value: "Aisha",
      imageUrl:
        "https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/aisha.gif?v=1702338038022",
    },
    {
      value: "Flotsam",
      imageUrl:
        "https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/flotsam.gif?v=1702341566583",
    },
    {
      value: "Kacheek",
      imageUrl:
        "https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/kacheek.gif?v=1702341629158",
    },
    {
      value: "Kougra",
      imageUrl:
        "https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/kougra.gif?v=1702452833954",
    },
  ];
  // pet select option, interacts with backend
  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const selectedPet = petOptions.find((pet) => pet.value === petType);
      // backend call, retrieves data and parses for web display
      const response = await fetch("http://34.215.164.92:5000/api/user-pets", {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: userId,
          pet_name: petName,
          pet_type: petType,
          image_data: imageData,
        }),
        credentials: "include",
      });
      //error and success messages
      if (response.ok) {
        console.log("Pet added successfully!");
        setError(null); // Clear error state on success
        setSuccessMessage("Pet added successfully!"); // Set success message
        if (onPetAdded) {
          onPetAdded();
        }
      } else {
        const responseData = await response.json();

        if (response.status === 401) {
          // User not logged in
          console.error("Failed to add pet. User not logged in.");
          setError("Failed to add pet. You must be logged in to create a pet!");
          setSuccessMessage(null); // Clear success message on failure
        } else if (
          response.status === 409 &&
          responseData.error === "Pet name already exists"
        ) {
          // Pet with the same name already exists
          console.error(
            "Failed to add pet. Pet with the same name already exists."
          );
          setError(
            "Failed to add pet. A pet with the same name already exists!"
          );
          setSuccessMessage(null); // Clear success message on failure
        } else {
          // Other errors
          console.error("Failed to add pet.");
          setError("Failed to add pet. An unexpected error occurred!");
          setSuccessMessage(null); // Clear success message on failure
        }
      }
    } catch (error) {
      console.error("An error occurred:", error.message);
      setError("An error occurred. It's us, not you!");
      setSuccessMessage(null); // Clear success message on failure
    }
  };
  //pets displayed on webpage
  return (
    <div>
      <form className="petform-container" onSubmit={handleSubmit}>
        <h2>Add a Pet</h2>
        {error && <div className="error-message">{error}</div>}
        {successMessage && (
          <div className="success-message">{successMessage}</div>
        )}
        <div className="pet-options">
          {petOptions.map((pet) => (
            <div key={pet.value} className="pet-option">
              <label>
                <img
                  src={pet.imageUrl}
                  alt={`Image of ${pet.value}`}
                  style={{
                    maxWidth: "100%",
                    maxHeight: "200px",
                    borderRadius: "10px",
                  }}
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
          <input
            className={"nameInput"}
            type="text"
            value={petName}
            onChange={(e) => setPetName(e.target.value)}
            required
          />
        </label>
        <br />
        <button type="submit">Add Pet</button>
      </form>
    </div>
  );
};

export default PetForm;
