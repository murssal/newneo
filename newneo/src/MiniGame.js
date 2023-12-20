// MiniGame.js

import React, { useState } from "react";
import "./MiniGame.css";

// MiniGame component: user choice and results of playing
const MiniGame = ({ user }) => {
  const [userChoice, setUserChoice] = useState("");
  const [gameResult, setGameResult] = useState(null);

  // Handle play button Onclick for mini game
const handlePlayClick = async () => {
  console.log("User ID:", user?.id);

  try {
    // Send a request to the backend to play the game
    const response = await fetch(
      "https://newneobe.onrender.com/api/playRockPaperScissors",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userChoice,
        }),
        credentials: "include",
      }
    );

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse and set the game result
    const result = await response.json();
    setGameResult(result);
  } catch (error) {
    // Handle and log any errors that occur during the process
    console.error("Error playing Rock-Paper-Scissors:", error.message);
  }
};


  return (
    <div className="minigame-container">
      <h2>Rock Paper Scissors Mini Game</h2>
      <div className="choices-container">
        <label>
          Your Choice:
          <br />
          <select
            value={userChoice}
            onChange={(e) => setUserChoice(e.target.value)}
          >
            <option value="">Select...</option>
            <option value="rock">Rock</option>
            <option value="paper">Paper</option>
            <option value="scissors">Scissors</option>
          </select>
        </label>
        <button className={"playButton"} onClick={handlePlayClick}>Play</button>
      </div>
      {gameResult && (
        <div className="result-container">
          <p>{gameResult.result}</p>
          <p>Computer's Choice: {gameResult.computerChoice}</p>
          {gameResult.win && <p>Congratulations! You win!</p>}
        </div>
      )}
    </div>
  );
};

export default MiniGame;
