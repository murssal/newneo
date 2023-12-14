import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [neopet, setNeopet] = useState({});

  useEffect(() => {
    const fetchRandomNeopet = async () => {
      try {
        const response = await fetch('http://localhost:5000/getRandomNeopet');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setNeopet(data);
      } catch (error) {
        console.error('Error fetching random Neopet:', error.message);
      }
    };

    fetchRandomNeopet(); // Call the fetch function

  }, []); // Empty dependency array to run the effect only once on mount

  return (
      <div className="App">
        <h1>Random Neopet</h1>
        {neopet.image_url && (
            <>
              <img src={neopet.image_url} alt="Neopet" />
              <p>Name: {neopet.correct_answer}</p>
            </>
        )}
      </div>
  );
}

export default App;
