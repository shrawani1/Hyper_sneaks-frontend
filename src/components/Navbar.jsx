import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const [welcomeMessage, setWelcomeMessage] = useState('');

  useEffect(() => {
    if (user) {
      // Fetch additional data if needed
      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://localhost:3000/user/${user._id}`);
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          setWelcomeMessage(`Welcome back, ${data.firstName}!`);
        } catch (error) {
          console.log('Failed to fetch user data', error);
        }
      };
      fetchUserData();
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="navbar-container">
      <nav className="navbar">
        <div className="navbar-left">
          <Link className="navbar-logo-link" to="/">
            <img src="../assets/images/logo.png" alt="Logo" className="navbar-logo" />
            <span className="brand-name">
              <span className="brand-highlight">Happy</span> Feet
            </span>
          </Link>
          <div className="navbar-links-left">

            <Link className="nav-link" to="/dashboard">Dashboard</Link>
            {user && <Link className="nav-link" to="/profile">Profile</Link>}
          </div>
        </div>
        <div className="navbar-links-right">
          {user ? (
            <div className="nav-item dropdown">
              <button className="nav-link dropdown-toggle">
                <i className="fas fa-user mr-2"></i>
                {user.firstName}
                <div className="welcome-message">{welcomeMessage}</div>
              </button>
              <div className="dropdown-menu">
                <Link to='/my_cart' className="dropdown-item">
                  <i className='fas fa-shopping-cart mr-2'></i> My Cart
                </Link>
                <Link to='/Favourites' className="dropdown-item">
                  <i className='fas fa-shopping-cart mr-2'></i> Favourites
                </Link>
                <Link to='/orderlist' className="dropdown-item">
                  <i className='fas fa-shopping-cart mr-2'></i> My orders
                </Link>
                <button onClick={handleLogout} className="dropdown-item">
                  <i className="fas fa-sign-out-alt mr-2"></i> Logout
                </button>
              </div>
            </div>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                <i className="fas fa-sign-in-alt mr-2"></i> Login
              </Link>
              <Link to="/register" className="nav-link">
                <i className="fas fa-user-plus mr-2"></i> Register
              </Link>

            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;
