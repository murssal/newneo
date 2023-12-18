// Home.js
// simple home page!
import React from "react";

// print contents of home page
const Home = () => {
  return (
    <div className={"homeBG"}>
      <h2 className={"homeHeader"}>Welcome to New Neo!</h2>
      <p className={"homeP"}>
        We're a simple version of our favorite childhood game, Neopets. Explore
        our site by creating an account, adopting pets, and taking care of them!
      </p>
      <img
        className={"homeIMG"}
        alt={"cute neopet mascot"}
        src={
          "https://cdn.glitch.global/d13492b2-e8bf-41cb-a366-1a7a92064757/kacheek_red.png?v=1702428953563"
        }
      />
    </div>
  );
};

export default Home;
