//PetPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./PetPage.css";

const PetPage = ({ user }) => {
    console.log("User ID:", user?.id);
    const [pets, setPets] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const updatePetHunger = (petId) => {
        // Find the pet with the specified ID
        const updatedPets = pets.map((pet) => {
            if (pet.pet_id === petId && pet.health < 100) {
                // Update health only if it's less than 100
                const updatedHealth = Math.min(pet.health + 10, 100);
                return {
                    ...pet,
                    health: updatedHealth,
                };
            }
            return pet;
        });

        // Update the UI state
        setPets(updatedPets);

        // Make a request to update the server-side for the specific pet
        fetch("https://newneobe.onrender.com/api/update-pet-hunger", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                petId: petId, // Include the pet ID for the server-side update
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
    };

    const updateHappiness = () => {
        navigate("/MiniGame");
    };

    useEffect(() => {
        fetch("https://newneobe.onrender.com/api/user-pets", { credentials: "include" })
            .then((response) => response.json())
            .then((data) => {
                setPets(data.pets);
            })
            .catch((error) => console.error("Error fetching user pets:", error));
    }, []);

    return (
        <div>
            {pets && pets.map((pet) => (
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
