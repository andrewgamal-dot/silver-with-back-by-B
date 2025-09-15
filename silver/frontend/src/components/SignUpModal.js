import React, { useState } from 'react';
import './SignUpModal.css';

const SignUpModal = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
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
        setError(''); // Clear error when user types
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Confirm password must match password
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('http://localhost:5000/api/auth/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                console.log(data);
                throw new Error(data.errors[0].msg || 'Something went wrong');
            }

            setShowSuccess(true);
            setTimeout(() => {
                setShowSuccess(false);
                onClose();
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSwitchToLogin = () => {
        onClose();
        onSwitchToLogin();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={(e) => { if (e.target.className === 'modal-overlay') onClose(); }}>
            <div className="signup-modal">
                <button className="close-button" onClick={onClose}>×</button>
                
                <div className="signup-content">
                    <img src="/ilverCode(final).png" alt="Logo" className="signup-logo" />
                    <h2>Create Account</h2>
                    <p className="signup-subtitle">Join us and start your journey</p>

                    {showSuccess ? (
                        <div className="success-message">
                            <p>Account created successfully! Please check your email to verify your account.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="signup-form">
                            {error && <div className="error-message">{error}</div>}
                            <div className="form-group">
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="Full Name"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email"
                                    required
                                    disabled={isLoading}
                                    pattern="^[^@\s]+@gmail\.com$"
                                    title="Please enter valid email address"
                                />
                            </div>
                            <div className="form-group">
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="Mobile Number"
                                    pattern="[0-9]{11}"
                                    title="Please enter a valid 11-digit mobile number"
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
                            <div className="form-group">
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="Confirm Password"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <button 
                                type="submit" 
                                className="signup-btn"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating Account...' : 'Sign Up'}
                            </button>
                            
                            <div className="login-link">
                                <p>Already have an account? <button type="button" onClick={handleSwitchToLogin}>Log In</button></p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SignUpModal; 