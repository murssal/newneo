import React, { useState } from 'react';
import './PetPage.css';

const PetPage = () => {
  const [stats, setStats] = useState({
    name: 'Pookie',
    level: 1,
    type: 'Aisha',
    happiness: 'unhappy',    
    hunger: 'starving',
  });

  const hungerArray = ['starving', 'famished', 'very hungry', 'hungry', 'not hungry', 'fine', 'satiated', 'bloated'];
  const updateHunger = () => {
    // Get the index of the current hunger level
    const currentIndex = hungerArray.indexOf(stats.hunger);

    // Calculate the next index
    const nextIndex = (currentIndex + 1) % hungerArray.length;

    // Update the hunger level
    if (stats.hunger !== 'bloated') {
      setStats({
        ...stats,
        hunger: hungerArray[nextIndex],
      });
    }
  };

  const happinessArray = ['unhappy', 'content', 'happy', 'excited'];
  const updateHappiness = () => {
    // Get the index of the current hunger level
    const currentIndex = happinessArray.indexOf(stats.happiness);

    // Calculate the next index
    const nextIndex = (currentIndex + 1) % happinessArray.length;

    // Update the happiness level
    if (stats.happiness !== 'excited') {
      setStats({
        ...stats,
        happiness: happinessArray[nextIndex],
      });
    }
  };

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
              <td>Level:</td>
              <td>{stats.level}</td>
            </tr>
            <tr>
              <td>Hunger:</td>
              <td>{stats.hunger}</td>
            </tr>
            <tr>
              <td>Happiness:</td>
              <td>{stats.happiness}</td>
            </tr>
            
          </tbody>
        </table>
      </div>      
      <div className="center">
        <img src="https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/aisha.gif?v=1702338038022" alt="placeholder" />
      </div>
      <div className="left">
        <button onClick={() => updateHunger()}>Feed</button>
        <button onClick={() => updateHappiness()}>Play</button>
      </div>
    </div>
  );
};

export default PetPage;
