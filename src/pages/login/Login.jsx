import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import ReCAPTCHA from "react-google-recaptcha";
import { loginUserApi } from "../../apis/Api";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

const LOCKOUT_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
const MAX_FAILED_ATTEMPTS = 5;

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [captchaToken, setCaptchaToken] = useState(null);
  const [captchaError, setCaptchaError] = useState("");
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutEndTime, setLockoutEndTime] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const navigate = useNavigate();

  // Load failed attempts and lockout time for the specific email
  useEffect(() => {
    if (email) {
      const storedAttempts = localStorage.getItem(`failedAttempts_${email}`);
      const storedLockoutEnd = localStorage.getItem(`lockoutEndTime_${email}`);

      if (storedAttempts) setFailedAttempts(parseInt(storedAttempts, 10));

      if (storedLockoutEnd) {
        const endTime = parseInt(storedLockoutEnd, 10);
        if (endTime > Date.now()) {
          setIsLocked(true);
          setLockoutEndTime(endTime);
        }
      } else {
        setIsLocked(false);
      }
    }
  }, [email]);

  // Countdown Timer Effect
  useEffect(() => {
    if (isLocked) {
      const interval = setInterval(() => {
        const remainingTime = Math.max(0, lockoutEndTime - Date.now());
        setTimeLeft(Math.ceil(remainingTime / 1000));

        if (remainingTime <= 0) {
          setIsLocked(false);
          setFailedAttempts(0);
          localStorage.removeItem(`failedAttempts_${email}`);
          localStorage.removeItem(`lockoutEndTime_${email}`);
          clearInterval(interval);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLocked, lockoutEndTime, email]);

  // Validation function
  const validation = () => {
    let isValid = true;

    if (!email.trim() || !email.includes("@")) {
      setEmailError("Email is empty or invalid");
      isValid = false;
    } else {
      setEmailError("");
    }

    if (!password.trim()) {
      setPasswordError("Password is empty");
      isValid = false;
    } else {
      setPasswordError("");
    }

    if (!captchaToken) {
      setCaptchaError("Captcha validation is required!");
      isValid = false;
    } else {
      setCaptchaError("");
    }

    return isValid;
  };

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (isLocked) {
      toast.error(`Too many failed attempts! Try again in ${timeLeft} seconds.`);
      return;
    }

    if (!validation()) {
      return;
    }

    const data = { email, password, captchaToken };

    try {
      const res = await loginUserApi(data);

      if (!res.data.success) {
        toast.error(res.data.message);

        setFailedAttempts((prev) => {
          const newAttempts = prev + 1;
          localStorage.setItem(`failedAttempts_${email}`, newAttempts);

          if (newAttempts >= MAX_FAILED_ATTEMPTS) {
            const lockoutEnd = Date.now() + LOCKOUT_TIME;
            localStorage.setItem(`lockoutEndTime_${email}`, lockoutEnd);
            setLockoutEndTime(lockoutEnd);
            setIsLocked(true);
          }

          return newAttempts;
        });
      } else {
        toast.success(res.data.message);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.userData));

        if (res.data.userData.isAdmin) {
          window.location.href = "/admindashboard";
        } else {
          window.location.href = "/dashboard";
        }
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again later.");

      setFailedAttempts((prev) => {
        const newAttempts = prev + 1;
        localStorage.setItem(`failedAttempts_${email}`, newAttempts);

        if (newAttempts >= MAX_FAILED_ATTEMPTS) {
          const lockoutEnd = Date.now() + LOCKOUT_TIME;
          localStorage.setItem(`lockoutEndTime_${email}`, lockoutEnd);
          setLockoutEndTime(lockoutEnd);
          setIsLocked(true);
        }

        return newAttempts;
      });
    }
  };

  // Handle reCAPTCHA token change
  const handleCaptchaChange = (token) => {
    setCaptchaToken(token);
    setCaptchaError("");
  };

  // Handle Create Account
  const handleCreateAccount = () => {
    navigate("/register");
  };

  // Handle Forgot Password Link Click
  const handleForgotPasswordClick = () => {
    navigate("/forgot-password");
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-heading">Welcome Back</h1>
        {isLocked && (
          <p className="lockout-msg">
            Too many failed attempts! Try again in {timeLeft} seconds.
          </p>
        )}
        <form className="login-form" onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="text"
              className="input-field"
              placeholder="Enter your email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              disabled={isLocked}
            />
            {emailError && <span className="error-text">{emailError}</span>}
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              disabled={isLocked}
            />
            {passwordError && <span className="error-text">{passwordError}</span>}
          </div>
          <div className="captcha-container">
            <ReCAPTCHA
              sitekey="6LfErsgqAAAAAPkUZ0pI96_UGzON78ifJch987Oi"
              onChange={handleCaptchaChange}
            />
            {captchaError && <span className="error-text">{captchaError}</span>}
          </div>
          <div className="form-actions">
            <button
              type="button"
              className="forgot-password"
              onClick={handleForgotPasswordClick}
              disabled={isLocked}
            >
              Forgot Password?
            </button>
          </div>
          <button type="submit" className="login-btn" disabled={isLocked}>
            {isLocked ? `Locked (${timeLeft}s)` : "Login"}
          </button>
          <button
            type="button"
            className="create-account-btn"
            onClick={handleCreateAccount}
            disabled={isLocked}
          >
            Create Account
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick />
    </div>
  );
};

export default Login;
