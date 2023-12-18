// MiniGame.js
// front end to back end connection for mini game (rock,paper, scissors)
import React, { useState } from "react";
import "./MiniGame.css";

// mini game, passes in user credentials for logging in database
const MiniGame = ({ user }) => {
  // react states
  const [userChoice, setUserChoice] = useState("");
  const [gameResult, setGameResult] = useState(null);

  const handlePlayClick = async () => {
    console.log("User ID:", user?.id);
    try {
      // call backend + return parsed response
      const response = await fetch(
        "http://34.215.164.92:5000/api/playRockPaperScissors",
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
      // success and error messages
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setGameResult(result);
    } catch (error) {
      console.error("Error playing Rock-Paper-Scissors:", error.message);
    }
  };
  // display results on webpage
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
        <button className={"playButton"} onClick={handlePlayClick}>
          Play
        </button>
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
