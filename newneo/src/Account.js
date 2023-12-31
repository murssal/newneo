import React, { useState, useEffect } from "react";
import "./index.css";

const Account = ({ user }) => {
  const [userInfo, setUserInfo] = useState({});
  const [userItems, setUserItems] = useState([]);
  const [userPets, setUserPets] = useState([]);
  const [error, setError] = useState(null);

useEffect(() => {
  // log the user ID
  console.log("user ID:", user?.id);
  
  // Fetch user information (username and neopoints)
  fetch("https://newneobe.onrender.com/api/account-user-info", {
    credentials: "include",
  })
    .then((response) => {
      // log the HTTP response
      console.log("response:", response);

      // check for successful response
      if (!response.ok) {
        // throw an error if the response is not ok
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // return the response as JSON
      return response.json();
    })
    .then((data) => {
      // log the actual data received
      console.log("data:", data);
      
      // set the user information in the component state
      setUserInfo(data);
    })
    .catch((error) => {
      // log and set an error message if fetching fails
      console.error("error fetching user info:", error);
      setError("failed to fetch user info");
    });

  // Fetch user items
  fetch("https://newneobe.onrender.com/api/account-user-items", {
    credentials: "include",
  })
    .then((response) => {
      // log the HTTP response
      console.log("response:", response);

      // check for successful response
      if (!response.ok) {
        // throw an error if the response is not ok
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // return the response as JSON
      return response.json();
    })
    .then((data) => {
      // set the user items in the component state
      setUserItems(data.items);
    })
    .catch((error) => {
      // log and set an error message if fetching fails
      console.error("error fetching user items:", error);
      setError("failed to fetch user items");
    });

  // Fetch user pets
  fetch("https://newneobe.onrender.com/api/account-user-pets", {
    credentials: "include",
  })
    .then((response) => {
      // log the HTTP response
      console.log("response:", response);

      // check for successful response
      if (!response.ok) {
        // throw an error if the response is not ok
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      // return the response as JSON
      return response.json();
    })
    .then((data) => {
      // set the user pets in the component state
      setUserPets(data.pets);
    })
    .catch((error) => {
      // log and set an error message if fetching fails
      console.error("error fetching user pets:", error);
      setError("failed to fetch user pets");
    });
}, []); // Empty dependency array to run the effect only once on mount


  return (
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
