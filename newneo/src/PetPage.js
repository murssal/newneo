import React, { useState, useEffect } from "react";
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

  // Define the updateHunger function
  const updateHunger = () => {
    // Implement logic to update hunger level
  };

  // Define the updateHappiness function
  const updateHappiness = () => {
    // Implement logic to update happiness level
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
