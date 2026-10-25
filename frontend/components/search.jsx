import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const queryLocation = searchParams.get('location') || '';
    
    const [searchInput, setSearchInput] = useState(queryLocation);
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState([]);
    const [loading, setLoading] = useState(true);

    const { userToken } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        fetchListings();
    }, []);

    // Sync input field when URL parameter changes
    useEffect(() => {
        setSearchInput(queryLocation);
    }, [queryLocation]);

    // Filter listings whenever queryLocation or raw listings change
    useEffect(() => {
        if (queryLocation.trim() === '') {
            setFilteredListings(listings);
        } else {
            const filtered = listings.filter(item =>
                item.location?.toLowerCase().includes(queryLocation.toLowerCase()) ||
                item.title?.toLowerCase().includes(queryLocation.toLowerCase())
            );
            setFilteredListings(filtered);
        }
    }, [queryLocation, listings]);

    const fetchListings = async () => {
        try {
            const res = await axios.get('http://nestfinder-sxcw.onrender.com/api/listings');
            setListings(res.data);
        } catch (err) {
            console.error('Failed to load listings', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        setSearchParams({ location: searchInput });
    };

    const handleActionClick = async (listing) => {
    if (!userToken) {
        navigate('/login');
        return;
    }

    try {
        await axios.post('http://nestfinder-sxcw.onrender.com/api/requests', {
            listingId: listing._id,
            seekerId: user?.id || user?._id, // Ensure user ID comes from AuthContext
            message: "Hello, I am requesting support for this safe space."
        });
        alert(`Support request successfully sent to the host for "${listing.title}"!`);
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to send request');
    }
};

    return (
        <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' }}>
            {/* Header & Search Bar */}
            <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '2rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <Link to="/" style={{ textDecoration: 'none', color: '#2563eb', fontWeight: 'bold', fontSize: '1.1rem' }}>
                        ← Back to Home
                    </Link>
                    {!userToken && (
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                            Need to host or request support? <Link to="/login" style={{ color: '#2563eb', fontWeight: '600' }}>Sign In</Link>
                        </div>
                    )}
                </div>

                <h1 style={{ fontSize: '1.75rem', color: '#0f172a', marginBottom: '0.5rem' }}>Find Safe Accommodation</h1>
                <p style={{ color: '#64748b', marginBottom: '1.5rem', fontSize: '0.95rem' }}>Search vetted host spaces across safe neighborhoods.</p>

                <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', maxWidth: '600px' }}>
                    <input 
                        type="text" 
                        placeholder="Enter city or neighborhood (e.g. Tel Aviv)..." 
                        value={searchInput} 
                        onChange={(e) => setSearchInput(e.target.value)} 
                        style={{ flex: 1, padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '1rem' }}
                    />
                    <button type="submit" style={{ backgroundColor: '#2563eb', color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}>
                        Search
                    </button>
                </form>
            </div>

            {/* Results Header */}
            <div style={{ marginBottom: '1.5rem' }}>
                <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>
                    {queryLocation ? `Spaces near "${queryLocation}"` : 'All Available Spaces'} 
                    <span style={{ fontSize: '0.9rem', color: '#64748b', marginLeft: '0.5rem', fontWeight: 'normal' }}>({filteredListings.length} found)</span>
                </h2>
            </div>

            {/* Loading / Results Grid */}
            {loading ? (
                <p style={{ color: '#64748b' }}>Loading available spaces...</p>
            ) : filteredListings.length === 0 ? (
                /* Empathy Empty State */
                <div style={{ backgroundColor: '#f8fafc', padding: '3rem 2rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                    <h3 style={{ color: '#1e293b', marginBottom: '0.5rem' }}>
                        No direct matches found in "{queryLocation}"
                    </h3>
    
                    <p style={{ color: '#64748b', maxWidth: '500px', margin: '0 auto 1.5rem auto', lineHeight: '1.5', fontSize: '0.95rem' }}>
                        {userToken ? (
                            "We are continuously verifying new hosts. Try searching for broader metropolitan areas, or head to your dashboard to submit an urgent support request."
                        ) : (
                            "We are continuously verifying new hosts. Try searching for broader metropolitan areas, or register to submit an urgent support request to our team."
                        )}
                    </p>

                    <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <button 
                            onClick={() => { setSearchInput(''); setSearchParams({}); }} 
                            style={{ padding: '0.6rem 1.2rem', backgroundColor: '#e2e8f0', color: '#334155', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}
                        >
                            Clear Filters
                        </button>

                        {userToken ? (
                            <Link 
                                to="/dashboard" 
                                style={{ padding: '0.6rem 1.2rem', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '6px', textDecoration: 'none', fontWeight: '600' }}
                            >
                                Go to Dashboard
                            </Link>
                        ) : (
                            <Link 
                                to="/register" 
                                style={{ padding: '0.6rem 1.2rem', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '6px', textDecoration: 'none', fontWeight: '600' }}
                            >
                                Create Account for Help
                            </Link>
                        )}
                    </div>
                </div>
            ) : (
                /* Cards Grid */
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
                    {filteredListings.map((listing) => (
                        <div key={listing._id || listing.id} style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.04)', display: 'flex', flexDirection: 'column' }}>
                            {listing.image ? (
                                <img src={listing.image} alt={listing.title} style={{ width: '100%', height: '180px', objectFit: 'cover' }} />
                            ) : (
                                <div style={{ width: '100%', height: '140px', backgroundColor: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                                    Photo Available Upon Request
                                </div>
                            )}

                            <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                        <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.2rem 0.6rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                            {listing.price === 0 || listing.price === '0' ? 'Free Accommodation' : `$${listing.price}/mo`}
                                        </span>
                                        <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: '500' }}>
                                            {listing.spaceType || 'Spare Room'}
                                        </span>
                                    </div>

                                    <h3 style={{ fontSize: '1.1rem', color: '#0f172a', margin: '0.5rem 0 0.25rem 0' }}>{listing.title}</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>📍 {listing.location}</p>

                                    <div style={{ margin: '1rem 0', fontSize: '0.85rem', color: '#475569' }}>
                                        <p style={{ margin: '0.25rem 0' }}>⏱️ Stay Duration: <strong>Up to {listing.maxDuration || listing.sqft || 14} days</strong></p>
                                        {listing.rules && <p style={{ margin: '0.25rem 0', color: '#64748b', fontStyle: 'italic' }}>"{listing.rules}"</p>}
                                    </div>
                                </div>

                                <button 
                                    onClick={handleActionClick} 
                                    style={{ width: '100%', padding: '0.75rem', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', marginTop: '1rem' }}
                                >
                                    {userToken ? 'Connect with Host' : 'Sign In to Request Support'}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Search;