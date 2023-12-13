// UserContext.js

import React, { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const useUser = () => {
    return useContext(UserContext);
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const login = (userData) => {
        // login
        setUser(userData);
    };

    const logout = () => {
        // logout
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
