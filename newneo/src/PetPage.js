import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./PetPage.css";

const PetPage = ({ user }) => {
  console.log("User ID:", user?.id);
  const [stats, setStats] = useState({
    name: "",
    type: "",
    health: "",
    happiness: "",
    image_data: "",
  });

  // Use useNavigate directly in the component
  const navigate = useNavigate();

  // // Define the updateHunger function
  // const updateHunger = () => {
  //   // Assuming stats.health is the hunger level
  //   if (stats.health < 100) {
  //     // Update hunger only if it's less than 100
  //     const updatedHunger = Math.min(stats.health + 10, 100);
  //     setStats((prevStats) => ({
  //       ...prevStats,
  //       health: updatedHunger,
  //     }));
  //   }
  // };


// Define the updateHunger function
  const updateHunger = () => {
    // Assuming stats.health is the hunger level
    if (stats.health < 100) {
      // Update hunger only if it's less than 100
      const updatedHunger = Math.min(stats.health + 10, 100);

      // Update hunger in the database
      fetch("http://localhost:5000/api/update-Hunger", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          updated_hunger: updatedHunger,
        }),
        credentials: "include",
      })
          .then((response) => response.json())
          .then((data) => {
            console.log("API Response:", data);

            if (data.success) {
              // If the update is successful, update the state
              setStats((prevStats) => ({
                ...prevStats,
                health: updatedHunger,
              }));

              // Check if updatedPet is defined and has at least one element
              if (data.updatedPet && Array.isArray(data.updatedPet) && data.updatedPet.length > 0 && data.updatedPet[0].pet_id) {
                const petId = data.updatedPet[0].pet_id;
                console.log("pet id:", petId);
              } else {
                console.error("Updated pet information not available or missing pet_id.");
              }
            } else {
              console.error("Failed to update hunger in the database.");
            }
          })
          .catch((error) => console.error("Error updating hunger:", error));
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
          <button onClick={() => updateHunger()}>Feed</button>
          <button onClick={() => updateHappiness()}>Play</button>
        </div>
      </div>
  );
};

export default PetPage;
