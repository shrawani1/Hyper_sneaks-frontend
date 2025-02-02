

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const user = JSON.parse(localStorage.getItem("user"));
  const [welcomeMessage, setWelcomeMessage] = useState("");

  useEffect(() => {
    if (user) {
      // Fetch additional user data if needed
      const fetchUserData = async () => {
        try {
          const response = await fetch(`https://localhost:3000/user/${user._id}`);
          if (!response.ok) throw new Error("Network response was not ok");
          const data = await response.json();
          setWelcomeMessage(`Welcome back, ${data.firstName}!`);
        } catch (error) {
          console.log("Failed to fetch user data", error);
        }
      };
      fetchUserData();
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Check if link is active
  const isActive = (path) => location.pathname === path;

  return (
    <header className="fresh-navbar">

       {/* Center section: Logo */}
       <div className="nav-center" onClick={() => navigate("/dashboard")}>
        <img
          src="/assets/images/logo.png"
          alt="Logo"
          className="center-logo"
        />
      </div>

      {/* Left section: Search bar */}
      <div className="nav-left">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tap to search"
            className="search-input-fresh"
          />
          <button className="search-btn-fresh">
            <i className="fas fa-search"></i>
          </button>
        </div>
      </div>

     
      {/* Right section: Links & user info */}
      <nav className="nav-right-links">
        <Link
          to="/dashboard"
          className={`fresh-link ${isActive("/dashboard") ? "link-active" : ""}`}
        >
          Home
        </Link>
        {user && (
          <Link
            to="/profile"
            className={`fresh-link ${isActive("/profile") ? "link-active" : ""}`}
          >
            Profile
          </Link>
        )}
        <Link
          to="/favourites"
          className={`fresh-link ${isActive("/favourites") ? "link-active" : ""}`}
        >
          Favourites
        </Link>
        <Link
          to="/my_cart"
          className={`fresh-link ${isActive("/my_cart") ? "link-active" : ""}`}
        >
          Cart
        </Link>
        <Link
          to="/orderlist"
          className={`fresh-link ${isActive("/orderlist") ? "link-active" : ""}`}
        >
          My Orders
        </Link>

        {/* User login/logout controls */}
        {user ? (
          <>
            <span className="welcome-text">{welcomeMessage}</span>
            <button className="logout-btn-fresh" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt mr-2"></i> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="fresh-link">
              <i className="fas fa-sign-in-alt mr-2"></i> Login
            </Link>
            <Link to="/register" className="fresh-link">
              <i className="fas fa-user-plus mr-2"></i> Register
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
