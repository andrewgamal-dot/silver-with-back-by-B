import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './EmailVerification.css';

const EmailVerification = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('verifying');
    const [message, setMessage] = useState('Verifying your email...');

    useEffect(() => {
        const verifyEmail = async () => {
            const token = searchParams.get('token');
            
            if (!token) {
                setStatus('error');
                setMessage('Invalid verification link');
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/api/auth/verify-email/${token}`);
                const data = await response.json();

                if (response.ok) {
                    setStatus('success');
                    setMessage('Email verified successfully! You can now log in.');
                    setTimeout(() => {
                        navigate('/login');
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage(data.message || 'Verification failed');
                }
            } catch (error) {
                setStatus('error');
                setMessage('An error occurred during verification');
            }
        };

        verifyEmail();
    }, [searchParams, navigate]);

    return (
        <div className="verification-container">
            <div className="verification-box">
                <img src="/ilverCode(final).png" alt="Logo" className="verification-logo" />
                <h2>Email Verification</h2>
                <div className={`verification-status ${status}`}>
                    {status === 'verifying' && (
                        <div className="loading-spinner"></div>
                    )}
                    <p>{message}</p>
                </div>
                {status === 'error' && (
                    <button 
                        className="retry-button"
                        onClick={() => window.location.reload()}
                    >
                        Try Again
                    </button>
                )}
            </div>
        </div>
    );
};

export default EmailVerification; 