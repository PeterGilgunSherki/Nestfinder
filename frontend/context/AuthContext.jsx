import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userToken, setUserToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        if (userToken) {
            localStorage.setItem('token', userToken);
        } else {
            localStorage.removeItem('token');
        }
    }, [userToken]);

    const loginUser = (token, userData) => {
        setUserToken(token);
        setUser(userData);
        localStorage.setItem('token', token);
    };

    const logoutUser = () => {
        setUserToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, userToken, loginUser, logoutUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuthContext = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
};