import React, { useState, useEffect } from "react";
import "./index.css";

const Account = () => {
    const [userInfo, setUserInfo] = useState({});
    const [userItems, setUserItems] = useState([]);
    const [userPets, setUserPets] = useState([]);

    useEffect(() => {
        // Fetch user information (username and neopoints)
        fetch("/api/account-user-info")
            .then((response) => response.json())
            .then((data) => setUserInfo(data))
            .catch((error) => console.error("Error fetching user info:", error));

        // Fetch user items
        fetch("/api/account-user-items")
            .then((response) => response.json())
            .then((data) => setUserItems(data.items))
            .catch((error) => console.error("Error fetching user items:", error));

        // Fetch user pets
        fetch("/api/account-user-pets")
            .then((response) => response.json())
            .then((data) => setUserPets(data.pets))
            .catch((error) => console.error("Error fetching user pets:", error));
    }, []); // Empty dependency array to run the effect only once on mount

    return (
        <div className="account-text-container">
            <h2>Account Information</h2>
            <div>
                <strong>Username:</strong> {userInfo.username}
            </div>
            <div>
                <strong>Neopoints:</strong> {userInfo.neopoints}
            </div>
            <div>
                <h3>Items:</h3>
                <ul>
                    {userItems.map((item) => (
                        <li key={item.item_id}>{item.item_name}</li>
                    ))}
                </ul>
            </div>
            <div>
                <h3>Pets:</h3>
                <ul>
                    {userPets.map((pet) => (
                        <li key={pet.pet_id}>{pet.pet_name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Account;
