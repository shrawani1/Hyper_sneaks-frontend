import React, { useState } from 'react';
import { registerUserApi } from '../../apis/Api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import NavbarSwitch from '../../components/NavbarSwitch';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'firstName':
        setFirstName(value);
        break;
      case 'lastName':
        setLastName(value);
        break;
      case 'email':
        setEmail(value);
        break;
      case 'phone':
        setPhone(value);
        break;
      case 'password':
        setPassword(value);
        break;
      case 'confirmPassword':
        setConfirmPassword(value);
        break;
      default:
        break;
    }
  };

  const validate = () => {
    const errors = {};
    if (!firstName.trim()) errors.firstName = 'First name is required!';
    if (!lastName.trim()) errors.lastName = 'Last name is required!';
    if (!email.trim()) errors.email = 'Email is required!';
    if (!phone.trim()) errors.phone = 'Phone number is required!';
    if (!password.trim()) errors.password = 'Password is required!';
    if (!confirmPassword.trim()) errors.confirmPassword = 'Confirm password is required!';
    if (password !== confirmPassword) errors.confirmPassword = 'Password and confirm password do not match';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    const data = { firstName, lastName, email, phone, password };

    try {
      const res = await registerUserApi(data);
      if (!res.data.success) {
        toast.error(res.data.message);
      } else {
        toast.success(res.data.message);
        navigate('/login'); // Redirect after successful registration
      }
    } catch (error) {
      console.error('Error during registration:', error.response ? error.response.data : error.message);
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <>
      <NavbarSwitch />
      <div className="register-container no-bg">
        <div className="register-form">
          <h1 className="register-heading">Create an Account</h1>
          <form className="form" onSubmit={handleSubmit}>
            <label>First Name</label>
            <input
              name="firstName"
              value={firstName}
              onChange={handleInputChange}
              type="text"
              className="input-field"
              placeholder="First Name"
            />
            {errors.firstName && <p className="error-msg">{errors.firstName}</p>}

            <label>Last Name</label>
            <input
              name="lastName"
              value={lastName}
              onChange={handleInputChange}
              type="text"
              className="input-field"
              placeholder="Last Name"
            />
            {errors.lastName && <p className="error-msg">{errors.lastName}</p>}

            <label>Email Address</label>
            <input
              name="email"
              value={email}
              onChange={handleInputChange}
              type="email"
              className="input-field"
              placeholder="Email Address"
            />
            {errors.email && <p className="error-msg">{errors.email}</p>}

            <label>Phone Number</label>
            <input
              name="phone"
              value={phone}
              onChange={handleInputChange}
              type="text"
              className="input-field"
              placeholder="Phone Number"
            />
            {errors.phone && <p className="error-msg">{errors.phone}</p>}

            <label>Password</label>
            <input
              name="password"
              value={password}
              onChange={handleInputChange}
              type="password"
              className="input-field"
              placeholder="Password"
            />
            {errors.password && <p className="error-msg">{errors.password}</p>}

            <label>Confirm Password</label>
            <input
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleInputChange}
              type="password"
              className="input-field"
              placeholder="Confirm Password"
            />
            {errors.confirmPassword && <p className="error-msg">{errors.confirmPassword}</p>}

            <button type="submit" className="register-btn">Create Account</button>
          </form>
          <div className="login-redirect">
            <p>Already have an account? <span onClick={handleLoginRedirect} className="login-link">Login</span></p>
          </div>
        </div>
        <div className="info-section">
          <h2>Welcome!</h2>
          <p>Create your account to join us and access amazing features.</p>
        </div>
      </div>
    </>
  );
};

export default Register;
