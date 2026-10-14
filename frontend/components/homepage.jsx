import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'; // Fixed: Added useNavigate import
import { fetchListings } from '../redux/listingsSlice';
import { useAuthContext } from '../context/AuthContext';
import './homepage.css';

const Homepage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { userToken } = useAuthContext();
    const { items: listings, status, error } = useSelector((state) => state.listings);

    const [location, setLocation] = useState('Tel Aviv');

    const handleSearch = (e) => {
        e.preventDefault();
        if (location.trim()) {
            navigate(`/search?location=${encodeURIComponent(location)}`);
        } else {
            navigate('/search');
        }
    };

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchListings());
        }
    }, [status, dispatch]);

    return (
        <div className="homepage">
            <header>
                <nav className="nav-container">
                    <a href="#" className="logo">
                        <i className="fa-solid fa-hands-holding-circle"></i> NestFinder
                    </a>
                    <ul className="nav-links">
                        <li><a href="#features">Our Mission</a></li>
                        <li><a href="#listings">Find Safe Spaces</a></li>
                        {userToken ? (
                            <li><Link to="/dashboard" className="btn-primary">Dashboard</Link></li>
                        ) : (
                            <>
                                <li><Link to="/login">Sign In</Link></li>
                                <li><Link to="/register" className="btn-primary">Get Started</Link></li>
                            </>
                        )}
                    </ul>
                </nav>
            </header>

            <section className="hero">
                <div className="hero-content">
                    <h1>Find a <span>Safe Place</span> to Land</h1>
                    <p>Our goal is to match you with a space where you will actually thrive, and get you out of a nest where you can't spread your wings. You are not alone.</p>
                    
                    {/* Fixed: Converted div to form and attached onSubmit */}
                    <form className="search-container" onSubmit={handleSearch}>
                        <div className="search-group">
                            <label>Location</label>
                            <input 
                                type="text" 
                                placeholder="City, State, or Zip" 
                                value={location}
                                onChange={(e) => setLocation(e.target.value)}
                            />
                        </div>
                        <div className="search-group">
                            <label>Space Type</label>
                            <select defaultValue="Spare Room">
                                <option>Spare Room</option>
                                <option>Living Room Couch</option>
                                <option>In-law Suite</option>
                                <option>Entire Apartment</option>
                            </select>
                        </div>
                        <div className="search-group">
                            <label>Arrangement</label>
                            <select defaultValue="Emergency (Free)">
                                <option>Emergency (Free)</option>
                                <option>Low-Cost Rent</option>
                                <option>Work/Chore Exchange</option>
                            </select>
                        </div>
                        <div className="search-group">
                            <label>Urgency</label>
                            <select defaultValue="Immediate">
                                <option>Immediate / Tonight</option>
                                <option>Within a week</option>
                                <option>Planning ahead</option>
                            </select>
                        </div>
                        <button type="submit" className="search-btn">
                            <i className="fa-solid fa-magnifying-glass"></i> Search
                        </button>
                    </form>
                </div>
            </section>

            <section className="section" id="features">
                <div className="section-header">
                    <h2>Safety and Support First</h2>
                    <p>Leaving a difficult environment is hard enough. Finding a safe, supportive place to rest shouldn't be.</p>
                </div>
                <div className="features-grid">
                    <div className="feature-card">
                        <div className="feature-icon"><i className="fa-solid fa-shield-halved"></i></div>
                        <h3>Verified Hosts</h3>
                        <p>Every host offering a space goes through a community verification process and background check to ensure a secure environment.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><i className="fa-solid fa-user-lock"></i></div>
                        <h3>Absolute Privacy</h3>
                        <p>Your safety is our priority. Exact addresses and personal contact information are kept strictly hidden until both parties mutually agree.</p>
                    </div>
                    <div className="feature-card">
                        <div className="feature-icon"><i className="fa-solid fa-handshake-angle"></i></div>
                        <h3>Clear Boundaries</h3>
                        <p>Our platform helps you and your host establish clear expectations, duration of stay, and house rules upfront to prevent any misunderstandings.</p>
                    </div>
                </div>
            </section>

            <section className="section listings-section" id="listings">
                <div className="section-header">
                    <h2>Welcoming Hosts Near You</h2>
                    <p>Generous community members currently offering a safe environment.</p>
                </div>

                {status === 'loading' && <p className="loading-state">Loading available spaces...</p>}
                {error && <p className="error-state">Failed to load spaces: {error}</p>}

                <div className="listings-grid">
                    {listings && listings.map((listing) => (
                        <div className="listing-card" key={listing._id || listing.id}>
                            <div className="listing-img" style={{ backgroundImage: `url(${listing.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=500&q=80'})` }}>
                                <span className="tag">{listing.price === 0 || listing.price === '0' ? 'Free / Emergency' : 'Verified Host'}</span>
                            </div>
                            <div className="listing-content">
                                <div className="price">
                                    {listing.price === 0 || listing.price === '0' ? 'No Cost' : `$${listing.price?.toLocaleString()}/mo`}
                                </div>
                                <h3 className="listing-title">{listing.title}</h3>
                                <div className="location"><i className="fa-solid fa-location-dot"></i> {listing.location}</div>
                                <div className="details">
                                    <span><i className="fa-solid fa-bed"></i> {listing.beds} Bed(s)</span>
                                    <span><i className="fa-solid fa-bath"></i> {listing.baths} Bath</span>
                                    <span><i className="fa-solid fa-calendar-day"></i> {listing.sqft} Days Max</span> 
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <footer>
                <div className="footer-container">
                    <div className="footer-info">
                        <a href="#" className="logo">
                            <i className="fa-solid fa-hands-holding-circle"></i> NestFinder
                        </a>
                        <p>Helping you transition safely into a space where you can heal and rebuild.</p>
                    </div>
                </div>
                <div className="copyright">
                    &copy; 2026 NestFinder Mutual Aid. All rights reserved.
                </div>
            </footer>
        </div>
    );
};

export default Homepage;