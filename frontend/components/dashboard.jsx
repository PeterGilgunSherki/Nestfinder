import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './homepage.css';

const Dashboard = () => {
    const { user, userToken, logoutUser } = useAuthContext();
    const navigate = useNavigate();

    // Host Form State
    const [formData, setFormData] = useState({
        title: '',
        location: '',
        spaceType: 'Spare Room',
        price: 0,
        beds: 1,
        baths: 1,
        maxDuration: 14,
        rules: 'Quiet hours after 10 PM, pet friendly',
        image: ''
    });

    const [myListings, setMyListings] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const userId = user?.id || user?._id;

    // Fetch listings and requests
    useEffect(() => {
        fetchListings();
        if (userId) {
            fetchRequests();
        }
    }, [userId]);

    const fetchListings = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/listings');
            if (user?.role === 'host' && userId) {
                setMyListings(res.data.filter(item => item.user === userId || item.user?._id === userId));
            } else {
                setMyListings(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch listings', err);
        }
    };

    const fetchRequests = async () => {
        try {
            if (user?.role === 'host') {
                const res = await axios.get(`http://localhost:5000/api/requests/host/${userId}`);
                setRequests(res.data);
            }
        } catch (err) {
            console.error('Failed to fetch requests', err);
        }
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await axios.post(
                'http://localhost:5000/api/listings',
                formData,
                { headers: { Authorization: `Bearer ${userToken}` } }
            );
            setMessage('Space posted successfully!');
            
            setFormData({
                title: '',
                location: '',
                spaceType: 'Spare Room',
                price: 0,
                beds: 1,
                baths: 1,
                maxDuration: 14,
                rules: '',
                image: ''
            });

            fetchListings();
        } catch (err) {
            setMessage(err.response?.data?.message || 'Failed to post space');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to remove this space?')) return;
        try {
            await axios.delete(`http://localhost:5000/api/listings/${id}`, {
                headers: { Authorization: `Bearer ${userToken}` }
            });
            fetchListings();
        } catch (err) {
            alert('Failed to delete listing');
        }
    };

    const handleRequestSupport = async (listing) => {
        try {
            await axios.post('http://localhost:5000/api/requests', {
                listingId: listing._id,
                seekerId: userId,
                message: "Hello, I am requesting support for this safe space."
            });
            alert(`Support request sent successfully to the host for "${listing.title}"!`);
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to send support request');
        }
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('File size is too large. Please select an image under 2MB.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const quickExit = () => {
        window.location.href = 'https://www.google.com';
    };

    return (
        <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1.5rem' }}>
            {/* Top Navigation Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '1.5rem', borderBottom: '1px solid #e2e8f0' }}>
                <div>
                    <h1 style={{ fontSize: '1.75rem', color: '#0f172a', margin: 0 }}>
                        {user?.role === 'host' ? 'Host Community Portal' : 'Seeker Support Portal'}
                    </h1>
                    <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.95rem' }}>
                        Logged in as <strong>{user?.email}</strong> ({user?.role?.toUpperCase() || 'MEMBER'})
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    {user?.role === 'seeker' && (
                        <button 
                            onClick={quickExit} 
                            style={{ backgroundColor: '#dc2626', color: '#fff', border: 'none', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                            <i className="fa-solid fa-person-running"></i> Quick Exit
                        </button>
                    )}
                    <button 
                        onClick={() => { logoutUser(); navigate('/'); }} 
                        style={{ backgroundColor: 'transparent', border: '1px solid #cbd5e1', padding: '0.6rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>
                        Sign Out
                    </button>
                </div>
            </div>

            {/* HOST DASHBOARD VIEW */}
            {user?.role === 'host' ? (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
                    {/* Post Space Form */}
                    <div style={{ backgroundColor: '#ffffff', padding: '1.75rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#0f172a' }}>Offer a Safe Space</h2>
                        {message && <p style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: message.includes('success') ? '#dcfce7' : '#fee2e2', color: message.includes('success') ? '#166534' : '#991b1b', fontSize: '0.9rem' }}>{message}</p>}
                        
                        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Listing Title</label>
                                <input type="text" placeholder="e.g. Peaceful Private Bedroom" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>City / Neighborhood</label>
                                    <input type="text" placeholder="e.g. Tel Aviv" value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} required style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Space Type</label>
                                    <select value={formData.spaceType} onChange={(e) => setFormData({...formData, spaceType: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                                        <option value="Spare Room">Spare Room</option>
                                        <option value="Living Room Couch">Living Room Couch</option>
                                        <option value="In-law Suite">In-law Suite</option>
                                        <option value="Entire Apartment">Entire Apartment</option>
                                    </select>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Price ($/mo)</label>
                                    <input type="number" min="0" value={formData.price} onChange={(e) => setFormData({...formData, price: Number(e.target.value)})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Max Days</label>
                                    <input type="number" min="1" value={formData.maxDuration} onChange={(e) => setFormData({...formData, maxDuration: Number(e.target.value)})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Beds</label>
                                    <input type="number" min="1" value={formData.beds} onChange={(e) => setFormData({...formData, beds: Number(e.target.value)})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>House Rules & Boundaries</label>
                                <textarea rows="3" value={formData.rules} onChange={(e) => setFormData({...formData, rules: e.target.value})} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}></textarea>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.25rem' }}>Upload Space Photo</label>
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleImageUpload} 
                                    style={{ width: '100%', padding: '0.5rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#fff' }} 
                                />
                                {formData.image && (
                                    <div style={{ marginTop: '0.5rem' }}>
                                        <img 
                                            src={formData.image} 
                                            alt="Preview" 
                                            style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '6px' }} 
                                        />
                                    </div>
                                )}
                            </div>
                            <button type="submit" disabled={loading} style={{ padding: '0.75rem', backgroundColor: '#2563eb', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>
                                {loading ? 'Publishing...' : 'Publish Space Offer'}
                            </button>
                        </form>
                    </div>

                    {/* Right Panel: Incoming Requests & Offered Spaces */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Incoming Support Requests */}
                        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#0f172a' }}>📬 Incoming Requests ({requests.length})</h2>
                            {requests.length === 0 ? (
                                <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No seekers have contacted you yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {requests.map((req) => (
                                        <div key={req._id} style={{ border: '1px solid #cbd5e1', padding: '1rem', borderRadius: '8px', backgroundColor: '#f8fafc' }}>
                                            <p style={{ margin: '0 0 0.25rem 0', fontWeight: '600', color: '#1e293b' }}>
                                                {req.listing?.title || 'Safe Space'} ({req.listing?.location})
                                            </p>
                                            <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.85rem', color: '#475569' }}>
                                                👤 Seeker Contact: <strong>{req.seeker?.email}</strong>
                                            </p>
                                            <p style={{ margin: 0, fontStyle: 'italic', color: '#64748b', fontSize: '0.85rem' }}>
                                                "{req.message}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Manage Posted Spaces */}
                        <div>
                            <h2 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: '#0f172a' }}>Your Offered Spaces</h2>
                            {myListings.length === 0 ? (
                                <p style={{ color: '#64748b' }}>You haven't posted any spaces yet.</p>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {myListings.map((item) => (
                                        <div key={item._id} style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <div>
                                                <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>{item.title}</h3>
                                                <p style={{ margin: '0.25rem 0', color: '#64748b', fontSize: '0.85rem' }}>{item.location} • {item.price === 0 ? 'Free' : `$${item.price}/mo`}</p>
                                                <span style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>Max Stay: {item.maxDuration || item.sqft} days</span>
                                            </div>
                                            <button onClick={() => handleDelete(item._id)} style={{ backgroundColor: '#fee2e2', color: '#ef4444', border: 'none', padding: '0.5rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                                                Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                /* SEEKER DASHBOARD VIEW */
                <div style={{ marginTop: '2rem' }}>
                    <div style={{ backgroundColor: '#f0f9ff', border: '1px solid #bae6fd', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem' }}>
                        <h2 style={{ color: '#0369a1', marginTop: 0, fontSize: '1.25rem' }}>Safety & Privacy Checklist</h2>
                        <ul style={{ color: '#0c4a6e', paddingLeft: '1.25rem', margin: '0.5rem 0 0 0', lineHeight: '1.6' }}>
                            <li>Never share your exact current location until you feel comfortable with a verified host.</li>
                            <li>Use our internal messaging to communicate before meeting.</li>
                            <li>Use the red <strong>Quick Exit</strong> button at the top right to immediately leave this site if needed.</li>
                        </ul>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', color: '#0f172a', margin: 0 }}>Explore Safe Spaces Nearby</h2>
                        <button onClick={() => navigate('/search')} style={{ backgroundColor: '#2563eb', color: '#ffffff', padding: '0.6rem 1.25rem', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                            Browse All Postings
                        </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {myListings.slice(0, 6).map((listing) => (
                            <div key={listing._id} style={{ backgroundColor: '#ffffff', borderRadius: '10px', padding: '1.25rem', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <div>
                                    <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.2rem 0.5rem', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 'bold' }}>
                                        {listing.price === 0 ? 'Free Accommodation' : `$${listing.price}/mo`}
                                    </span>
                                    <h3 style={{ fontSize: '1.1rem', margin: '0.75rem 0 0.25rem 0' }}>{listing.title}</h3>
                                    <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>📍 {listing.location}</p>
                                    <div style={{ margin: '1rem 0', fontSize: '0.85rem', color: '#334155' }}>
                                        <p style={{ margin: '0.25rem 0' }}>⏱️ Max Stay: <strong>{listing.maxDuration || listing.sqft || 14} days</strong></p>
                                        <p style={{ margin: '0.25rem 0' }}>🏡 Space: <strong>{listing.spaceType || 'Spare Room'}</strong></p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleRequestSupport(listing)} 
                                    style={{ width: '100%', padding: '0.6rem', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
                                >
                                    Request Support
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;