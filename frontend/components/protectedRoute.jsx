import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

// Client-side protected route wrapper[cite: 1]
const ProtectedRoute = ({ children }) => {
    const { userToken } = useAuthContext();
    
    if (!userToken) {
        return <Navigate to="/login" replace />;
    }
    
    return children;
};

export default ProtectedRoute;