import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PetPage.css";

const PetPage = ({ user }) => {
  console.log("User ID:", user?.id);
  const [pets, setPets] = useState([]);

  // Use useNavigate directly in the component
  const navigate = useNavigate();

  // Define the updateHunger function for a specific pet
  const updateHunger = (petId) => {
    setPets((prevPets) => {
      return prevPets.map((pet) => {
        if (pet.pet_id === petId && pet.health < 100) {
          const updatedHealth = Math.min(pet.health + 10, 100);
          return {
            ...pet,
            health: updatedHealth,
          };
        }
        return pet;
      });
    });
  };

  // Define the updateHappiness function
  const updateHappiness = () => {
    // Use navigate directly here
    navigate("/MiniGame");
  };

  useEffect(() => {
    // Fetch user pets when the component mounts
    fetch("http://localhost:5000/api/user-pets", { credentials: "include" })
        .then((response) => response.json())
        .then((data) => {
          setPets(data.pets);
        })
        .catch((error) => console.error("Error fetching user pets:", error));
  }, []);

  return (
      <div className={"petBackgroundFull"}>
        {pets.map((pet) => (
            <div key={pet.pet_id} className={"petpageBG"}>
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
                <button onClick={() => updateHunger(pet.pet_id)}>Feed</button>
                <button onClick={() => updateHappiness(pet.pet_id)}>Play</button>
              </div>
            </div>
        ))}
      </div>
  );
};

export default PetPage;
