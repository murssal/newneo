// UserContext.js

import React, { createContext, useContext, useState } from "react";

// create a new context for user-related information
const UserContext = createContext();

// custom hook to access the UserContext
export const useUser = () => {
  return useContext(UserContext);
};

// UserProvider component provides user-related data to its children
export const UserProvider = ({ children }) => {
  // state to manage user data
  const [user, setUser] = useState(null);

  // function to handle user login
  const login = (userData) => {
    // perform login logic and set user data
    setUser(userData);
  };

  // function to handle user logout
  const logout = () => {
    // perform logout logic and set user to null
    setUser(null);
  };

  // provide user data and functions to children components
  return (
    <UserContext.Provider value={{ user, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};
