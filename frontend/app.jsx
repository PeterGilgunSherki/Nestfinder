import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './components/homepage';
import Search from './components/search';
import Login from './components/login';
import Register from './components/register';
import ProtectedRoute from './components/protectedRoute';
import Dashboard from './components/dashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Homepage />} />
      <Route path="/search" element={<Search />} /> {/* Public Search Route */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard" 
        element={
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute>
    } 
    />
    </Routes>
  );
}

export default App;