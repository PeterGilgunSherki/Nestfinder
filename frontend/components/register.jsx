import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import './homepage.css';

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('seeker'); // Default to seeker
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { loginUser } = useAuthContext();
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (!email || !password || !role) return setError('All fields are required');

        setIsLoading(true);
        try {
            const response = await axios.post('http://nestfinder-sxcw.onrender.com/api/auth/register', { email, password, role });
            loginUser(response.data.token, response.data.user);
            navigate('/dashboard'); // Route to dashboard after success
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '450px', margin: '4rem auto', padding: '2.5rem', border: '1px solid #e2e8f0', borderRadius: '12px', backgroundColor: '#ffffff', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
            <h2 style={{ marginBottom: '0.5rem', color: '#0f172a' }}>Join the NestFinder Community</h2>
            <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.95rem' }}>A safe space is just a few steps away. Your privacy is our priority.</p>
            
            {error && <div style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.9rem' }}>{error}</div>}
            
            <form onSubmit={handleRegister}>
                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>I want to...</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                        <option value="seeker">Find a safe place to stay</option>
                        <option value="host">Offer a space to someone in need</option>
                    </select>
                </div>
                <div style={{ marginBottom: '1.25rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', fontSize: '0.9rem' }}>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength="6" style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                </div>
                <button type="submit" disabled={isLoading} style={{ width: '100%', padding: '0.85rem', background: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '1rem' }}>
                    {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>
            </form>
            <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#64748b' }}>
                Already have an account? <Link to="/login" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>Sign In</Link>
            </p>
        </div>
    );
};

export default Register;