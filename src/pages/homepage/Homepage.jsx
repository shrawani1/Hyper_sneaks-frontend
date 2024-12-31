
import React from 'react';
import Footer from '../../components/Footer';
import NavbarSwitch from '../../components/NavbarSwitch';
import './HomePage.css';

const HomePage = () => {
  return (
    <>
      <NavbarSwitch />
      <div className="home-container">
        <div className="hero-section">
          <img src="https://images.unsplash.com/photo-1679284392467-347236c31c5e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Too Ease Home" className="hero-image" />
          <div className="hero-text">
            <h1>Welcome to Happy Feet</h1>
            <p>Your One-Stop Shop for All Your Home Needs</p>

          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;
