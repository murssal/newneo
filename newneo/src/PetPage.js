import React, { useState } from 'react';

const PetPage = () => {
  const [stats, setStats] = useState({
    score: 0,
    level: 1,
    experience: 0,
  });

  const updateStats = (type, value) => {
    setStats({
      ...stats,
      [type]: stats[type] + value,
    });
  };

  return (
    <div className="container">
      <div className="left">
        <button onClick={() => updateStats('score', 10)}>Train Defense</button>
        <button onClick={() => updateStats('level', 1)}>Increase Level</button>
        <button onClick={() => updateStats('experience', 50)}>Increase Experience</button>
      </div>
      <div className="center">
        <img src="https://via.placeholder.com/150" alt="placeholder" />
      </div>
      <div className="right">
        <h2>Stats</h2>
        <table>
          <tbody>
            <tr>
              <td>Score:</td>
              <td>{stats.score}</td>
            </tr>
            <tr>
              <td>Level:</td>
              <td>{stats.level}</td>
            </tr>
            <tr>
              <td>Experience:</td>
              <td>{stats.experience}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PetPage;
