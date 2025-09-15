import React, { useState } from 'react';
import './LoginModal.css';

const LoginModal = ({ isOpen, onClose, onSwitchToSignup }) => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:5000/api/auth/signin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                console.log(data);

                let message = "Something went wrong";
            
                if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                    message = data.errors[0].msg; // validation errors
                } else if (data.msg) {
                    message = data.msg; // auth error like "Invalid credentials"
                }
            
                throw new Error(message);
            }

            // Store the token in localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onClose();
                // You might want to trigger a page refresh or state update here
                window.location.reload();
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwitchToSignup = () => {
        onClose();
        onSwitchToSignup();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target.className === 'modal-overlay') onClose(); }}>
            <div className="login-modal">
                <button className="close-button" onClick={onClose}>×</button>
                
                <div className="login-content">
                    <img src="/ilverCode(final).png" alt="Logo" className="login-logo" />
                    <h2>Welcome Back!</h2>
                    <p className="login-subtitle">Log in to continue your journey</p>

                    {showSuccess ? (
                        <div className="success-message">
                            <p>Successfully logged in!</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="login-form">
                            {error && <div className="error-message">{error}</div>}
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="form-options">
                                <label className="remember-me">
                                    <input type="checkbox" />
                                    Remember me
                                </label>
                                <a href="#" className="forgot-password">Forgot Password?</a>
                            </div>
                            <button 
                                type="submit" 
                                className="login-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Log In'}
                            </button>
                            
                            <div className="signup-link">
                                <p>Don't have an account? <button type="button" onClick={handleSwitchToSignup}>Sign Up</button></p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LoginModal; 