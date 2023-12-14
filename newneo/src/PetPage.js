import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PetPage.css";

const PetPage = ({ user }) => {
  console.log("User ID:", user?.id);
<<<<<<< HEAD
  const [stats, setStats] = useState({
    name: "",
    type: "",
    health: "",
    happiness: "",
    image_data: "",
  });
  const [error, setError] = useState(null);
=======
  const [pets, setPets] = useState([]);
>>>>>>> c40d6d5e0160ef288658782e982b0da59b57d336

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

  // Define the updatePetHunger function
  const updatePetHunger = () => {
    // Assuming stats.health is the hunger level
    if (stats.health < 100) {
      // Update hunger only if it's less than 100
      const updatedHunger = Math.min(stats.health + 10, 100);
      // Update the UI state
      setStats((prevStats) => ({
        ...prevStats,
        health: updatedHunger,
      }));
      // Make a request to update the server-side
      fetch("http://localhost:5000/api/update-pet-hunger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          // Include any necessary data for updating hunger
          // e.g., pet_id or user_id
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
          console.log(data.message); // Log the message from the server
          // You can update state or perform any other actions based on the response
        })
        .catch((error) => {
          console.error("Error updating pet hunger:", error);
          setError("Failed to update pet hunger");
        });
    }
  };

  // Define the updateHappiness function
  const updateHappiness = () => {
    // Use navigate directly here
    navigate("/MiniGame");
  };

  useEffect(() => {
    // Fetch user pets when the component mounts
    fetch("http://localhost:5000/api/user-pets", { credentials: "include" })
<<<<<<< HEAD
      .then((response) => response.json())
      .then((data) => {
        // Assuming there is only one pet
        const pet = data.pets[0];
        setStats({
          name: pet.pet_name,
          type: pet.pet_type,
          health: pet.health,
          happiness: pet.happiness,
          image_data: pet.image_data,
        });
      })
      .catch((error) => console.error("Error fetching user pets:", error));
  }, []);

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
        <button onClick={() => updatePetHunger()}>Feed</button>
        <button onClick={() => updateHappiness()}>Play</button>
=======
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
>>>>>>> c40d6d5e0160ef288658782e982b0da59b57d336
      </div>
    </div>
  );
};

export default PetPage;
