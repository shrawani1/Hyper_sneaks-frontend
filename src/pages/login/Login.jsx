import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUserApi } from "../../apis/Api";
import NavbarSwitch from "../../components/NavbarSwitch";
import "./Login.css";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const navigate = useNavigate();

    // Validation function
    const validation = () => {
        let isValid = true;
        if (email.trim() === "" || !email.includes("@")) {
            setEmailError("Email is empty or invalid");
            isValid = false;
        }
        if (password.trim() === "") {
            setPasswordError("Password is empty");
            isValid = false;
        }
        return isValid;
    };

    // Handle Login
    const handleLogin = async (e) => {
        e.preventDefault();
        if (!validation()) {
            return;
        }
        const data = {
            email: email,
            password: password,
        };
        try {
            const res = await loginUserApi(data);
            if (res.data.success === false) {
                toast.error(res.data.message);
            } else {
                toast.success(res.data.message);
                localStorage.setItem("token", res.data.token);
                const convertedData = JSON.stringify(res.data.userData);
                localStorage.setItem("user", convertedData);
                if (res.data.userData.isAdmin) {
                    window.location.href = "/admindashboard";
                } else {
                    window.location.href = "/dashboard";
                }
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                toast.error(error.response.data.message || "User does not exist!");
            } else {
                toast.error("An unexpected error occurred. Please try again later.");
            }
        }
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
        <>
            <NavbarSwitch />
            <div className="login-container no-bg">
                <div className="login-form">
                    <h1 className="login-heading">Login</h1>
                    <form className="form">
                        <label>Email Address</label>
                        <input
                            onChange={(e) => setEmail(e.target.value)}
                            type="text"
                            className="input-field"
                            placeholder="Enter your email"
                        />
                        {emailError && <p className="error-msg">{emailError}</p>}

                        <label>Password</label>
                        <input
                            onChange={(e) => setPassword(e.target.value)}
                            type="password"
                            className="input-field"
                            placeholder="Enter your password"
                        />
                        {passwordError && <p className="error-msg">{passwordError}</p>}

                        <div className="form-actions">
                            <button
                                type="button"
                                className="forgot-password"
                                onClick={handleForgotPasswordClick}
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <button onClick={handleLogin} className="login-btn">
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={handleCreateAccount}
                            className="create-account-btn"
                        >
                            Create Account
                        </button>
                    </form>
                </div>
                <div className="info-section">
                    <h2>Welcome Back!</h2>
                    <p>Sign in to continue accessing your account and manage your activities.</p>
                </div>
            </div>
        </>
    );
};

export default Login;
