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
  const [passwordStrength, setPasswordStrength] = useState('');
  const [errors, setErrors] = useState({});

  // Track if user successfully registered.
  const [isRegistered, setIsRegistered] = useState(false);

  const navigate = useNavigate();

  // Email Validation Function
  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Phone Number Validation (Only Numeric)
  const handlePhoneChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setPhone(value);
    }
  };

  // Password Strength Checker Function
  const checkPasswordStrength = (password) => {
    let strength = 'Weak';
    let color = 'red';
    const regex = {
      upper: /[A-Z]/,
      lower: /[a-z]/,
      number: /[0-9]/,
      special: /[\W_]/,
    };

    const score =
      regex.upper.test(password) +
      regex.lower.test(password) +
      regex.number.test(password) +
      regex.special.test(password);

    if (password.length >= 8 && password.length <= 16) {
      if (score === 4) {
        strength = 'Strong';
        color = 'green';
      } else if (score === 3) {
        strength = 'Good';
        color = 'orange';
      }
    }

    setPasswordStrength({ text: strength, color });
  };

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
      case 'password':
        setPassword(value);
        checkPasswordStrength(value);
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
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,16}$/;

    if (!firstName.trim()) errors.firstName = 'First name is required!';
    if (!lastName.trim()) errors.lastName = 'Last name is required!';
    if (!email.trim()) errors.email = 'Email is required!';
    else if (!validateEmail(email)) errors.email = 'Invalid email format!';
    if (!phone.trim()) errors.phone = 'Phone number is required!';
    if (!password.trim()) errors.password = 'Password is required!';
    else if (!passwordRegex.test(password))
      errors.password =
        'Password must be 8-16 characters, with at least one uppercase letter, one lowercase letter, one number, and one special character.';
    if (!confirmPassword.trim()) errors.confirmPassword = 'Confirm password is required!';
    if (password !== confirmPassword) errors.confirmPassword = 'Passwords do not match';

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
        setIsRegistered(true);
      }
    } catch (error) {
      console.error(
        'Error during registration:',
        error.response ? error.response.data : error.message
      );
      toast.error('An error occurred. Please try again.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <>
      <NavbarSwitch />
      {!isRegistered ? (
        <div className="register-page">
          <div className="register-card">
            <h1 className="register-heading">Create an Account</h1>
            <form className="register-form" onSubmit={handleSubmit}>
              <div className="form-group">
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
              </div>

              <div className="form-group">
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
              </div>

              <div className="form-group">
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
              </div>

              <div className="form-group">
                <label>Phone Number</label>
                <input
                  name="phone"
                  value={phone}
                  onChange={handlePhoneChange}
                  type="text"
                  className="input-field"
                  placeholder="Phone Number"
                />
                {errors.phone && <p className="error-msg">{errors.phone}</p>}
              </div>

              <div className="form-group">
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
                <p className="password-strength" style={{ color: passwordStrength.color }}>
                  {passwordStrength.text}
                </p>
              </div>

              <div className="form-group">
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
              </div>

              <button type="submit" className="register-btn">
                Create Account
              </button>
            </form>
            <div className="login-redirect">
              <p>
                Already have an account?{' '}
                <span onClick={handleLoginRedirect} className="login-link">
                  Login
                </span>
              </p>
            </div>
          </div>
          
        </div>
      ) : (
        <div className="register-page">
          <div className="confirmation-message">
            <h1>Registration Successful!</h1>
            <p>
              Please check your email for a verification link. Once verified, you can log in.
            </p>
            <p onClick={handleLoginRedirect} className="login-link">
              Go to Login
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
