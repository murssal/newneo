import React, { useState } from 'react';
import './MiniGame.css'
const MiniGame = () => {
  const [userChoice, setUserChoice] = useState('');
  const [gameResult, setGameResult] = useState(null);

  const handlePlayClick = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/playRockPaperScissors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userChoice,
        }),
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setGameResult(result);
    } catch (error) {
      console.error('Error playing Rock-Paper-Scissors:', error.message);
    }
  };

  return (
      <div className="minigame-container">
        <h2>Rock-Paper-Scissors Mini Game</h2>
        <div className="choices-container">
          <label>
            Your Choice:
            <select value={userChoice} onChange={(e) => setUserChoice(e.target.value)}>
              <option value="">Select...</option>
              <option value="rock">Rock</option>
              <option value="paper">Paper</option>
              <option value="scissors">Scissors</option>
            </select>
          </label>
          <button onClick={handlePlayClick}>Play</button>
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
