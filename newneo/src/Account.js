// Account.js
// displays user account - neopoints, username, pets, and items
import React, { useState, useEffect } from "react";
import "./index.css";

const Account = ({ user }) => {
  //react states
  const [userInfo, setUserInfo] = useState({});
  const [userItems, setUserItems] = useState([]);
  const [userPets, setUserPets] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    //log on console for debugging
    console.log("User ID:", user?.id);
    // fetch user information (username and neopoints) + parse response
    fetch("http://localhost:5000/api/account-user-info", {
      credentials: "include",
    })
      .then((response) => {
        console.log("Response:", response);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })

      .then((data) => {
        console.log("Data:", data); // print in web console for debugging
        setUserInfo(data);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
        setError("Failed to fetch user info");
      });

    // fetch user items
    fetch("http://localhost:5000/api/account-user-items", {
      credentials: "include",
    })
      .then((response) => {
        console.log("Response:", response);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setUserItems(data.items))
      .catch((error) => {
        console.error("Error fetching user items:", error);
        setError("Failed to fetch user items");
      });

    // fetch user pets
    fetch("http://localhost:5000/api/account-user-pets", {
      credentials: "include",
    })
      .then((response) => {
        console.log("Response:", response);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => setUserPets(data.pets))
      .catch((error) => {
        console.error("Error fetching user pets:", error);
        setError("Failed to fetch user pets");
      });
  }, []);

  return (
    // print user account results
    <div className="account-text-container">
      <h2>Account Information</h2>
      {error && <div className="error-message">{error}</div>}
      <div>
        <strong>Username:</strong> {userInfo.username}
      </div>
      <div>
        <strong>Neopoints:</strong> {userInfo.neopoints}
      </div>
      <div>
        <h3>Items:</h3>
        <ul>
          {userItems.map((itemName) => (
            <li key={itemName}>{itemName}</li>
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
