import axios from 'axios';
import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from '../../components/Footer';
import './Contact.css'; // Import the CSS for styling

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/contact/contact', formData);
      toast.success(response.data.message || 'Form submitted successfully');
      setFormData({ firstName: '', lastName: '', email: '', message: '' }); // Reset form only if successful
    } catch (error) {
      toast.error((error.response && error.response.data && error.response.data.message) || 'Error submitting form');
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-content">
        <div className="contact-logo">
          <img src="../assets/images/logo.png" alt="Too Ease Logo" />
        </div>
        <h1>Contact Us</h1>
        <p>If you have any questions, feel free to reach out to us. We're here to help!</p>

        <form onSubmit={handleSubmit} className="contact-form">
          <label htmlFor="firstName">First Name</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />

          <label htmlFor="lastName">Last Name</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            required
          ></textarea>
          
          <button type="submit">Send Message</button>
        </form>

        <div className="contact-details">
          <h2>Contact Information</h2>
          <p><strong>Email:</strong> support@tooease.com</p>
          <p><strong>Phone:</strong> +123 456 7890</p>
          <p><strong>Address:</strong> 123 E-Commerce St, Suite 456, City, Country</p>
        </div>
      </div>
      <Footer />
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={true} closeOnClick pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
};

export default Contact;
