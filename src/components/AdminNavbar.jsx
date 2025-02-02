import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import './AdminNavbar.css'; // Use the same CSS

const AdminNavbar = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();
  const [welcomeMessage, setWelcomeMessage] = useState('');
  useEffect(() => {
    if (user) {
      // Fetch additional data if needed
      const fetchUserData = async () => {
        try {
          const response = await fetch(`https://localhost:3000/user/${user._id}`);
          if (!response.ok) throw new Error('Network response was not ok');
          const data = await response.json();
          setWelcomeMessage(`Welcome back, ${data.firstName}!`);
        } catch (error) {
          console.error('Failed to fetch user data', error);
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

export default AdminNavbar;
