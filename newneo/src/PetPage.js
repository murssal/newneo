// PetPage.js
// displays all owned pets of user
// also contains functionality to play a game or feed pet
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PetPage.css";

const PetPage = ({ user }) => {
  // react states
  console.log("User ID:", user?.id);
  const [pets, setPets] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // update hunger by feeding pet (affects health in database)
  const updatePetHunger = (petId) => {
    // find the pet with the specified ID
    const updatedPets = pets.map((pet) => {
      if (pet.pet_id === petId && pet.health < 100) {
        // update health only if it's less than 100
        const updatedHealth = Math.min(pet.health + 10, 100);
        return {
          ...pet,
          health: updatedHealth,
        };
      }
      return pet;
    });

    // update the UI state
    setPets(updatedPets);

    // make a request to update the server-side for the specific pet
    fetch("http://localhost:5000/api/update-pet-hunger", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        petId: petId, // include the pet ID for the server-side update
      }),
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.message); // log the message from the server
      })
      .catch((error) => {
        console.error("Error updating pet hunger:", error);
        setError("Failed to update pet hunger");
      });
  };

  // update happniess level in database, routes to minigame page
  const updateHappiness = () => {
    navigate("/MiniGame");
  };

  // backend call to retrieve the users' pets
  //retrives response and parses for webpage display
  useEffect(() => {
    fetch("http://localhost:5000/api/user-pets", { credentials: "include" })
      .then((response) => response.json())
      .then((data) => {
        setPets(data.pets);
      })
      .catch((error) => console.error("Error fetching user pets:", error));
  }, []);

  //display results on webpage
  return (
    <div>
      {pets.map((pet) => (
        <div key={pet.pet_id} className="petpageBG">
          <div className="right">
            <h2>{pet.pet_name}</h2>
            <table>
              <tbody>
                <tr>
                  <td>Type:</td>
                  <td>{pet.pet_type}</td>
                </tr>
                <tr>
                  <td>Health:</td>
                  <td>{pet.health}</td>
                </tr>
                <tr>
                  <td>Happiness:</td>
                  <td>{pet.happiness}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="center">
            <img src={pet.image_data} alt={`Pet ${pet.pet_id}`} />
          </div>
          <div className="left">
            <button onClick={() => updatePetHunger(pet.pet_id)}>Feed</button>
            <button onClick={() => updateHappiness(pet.pet_id)}>Play</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PetPage;
