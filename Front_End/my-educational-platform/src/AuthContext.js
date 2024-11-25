import React, { createContext, useState, useContext } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(() => localStorage.getItem('authToken'));
    const [userData, setUserData] = useState(() => {
        const storedUserData = localStorage.getItem('userData');
        try {
            return storedUserData ? JSON.parse(storedUserData) : null;
        } catch (error) {
            console.error("Failed to parse userData from localStorage:", error);
            return null;
        }
    });

    // Function to log in the user
    const login = (token, user) => {
        setAuthToken(token);
        setUserData(user);
        localStorage.setItem('authToken', token);
        localStorage.setItem('userData', JSON.stringify(user));
    };

    // Function to log out the user
    const logout = () => {
        setAuthToken(null);
        setUserData(null);
        localStorage.removeItem('authToken');
        localStorage.removeItem('userData');
    };

    // Check if the user is authenticated
    const isAuthenticated = !!authToken;

    return (
        <AuthContext.Provider value={{ authToken, userData, login, logout, isAuthenticated, setUserData }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    return useContext(AuthContext);
};