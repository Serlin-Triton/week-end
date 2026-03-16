import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { KeyRound, Phone, ArrowLeft } from 'lucide-react';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [mobileNumber, setMobileNumber] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        setMessage('');
        
        try {
            const response = await api.post('/auth/forgot-password', { mobileNumber, newPassword });
            setMessage(response.data.message + " Redirecting to login...");
            setMobileNumber('');
            setNewPassword('');
            setTimeout(() => {
                navigate('/login');
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to reset password.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container} className="animate-fade-in">
            <div className="glass-panel" style={styles.card}>
                <Link to="/login" style={styles.backLink}>
                    <ArrowLeft size={16} /> Back to Login
                </Link>
                
                <div style={styles.header}>
                    <div style={styles.logoContainer}>
                        <KeyRound size={32} color="var(--accent)" />
                    </div>
                    <h2 style={styles.title}>Reset Password</h2>
                    <p style={styles.subtitle}>Enter your details to create a new password</p>
                </div>
                
                {error && <div style={styles.alert} className="badge badge-danger">{error}</div>}
                {message && <div style={styles.alert} className="badge badge-success">{message}</div>}
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label>Mobile Number</label>
                        <div style={styles.inputWrapper}>
                            <Phone size={18} style={styles.inputIcon} />
                            <input 
                                type="text" 
                                placeholder="Registered mobile number" 
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                style={styles.inputWithIcon}
                                required 
                            />
                        </div>
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label>New Password</label>
                        <div style={styles.inputWrapper}>
                            <KeyRound size={18} style={styles.inputIcon} />
                            <input 
                                type="password" 
                                placeholder="Enter new password" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={styles.inputWithIcon}
                                required 
                            />
                        </div>
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

const styles = {
    // Reusing similar styles for consistency
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)', // Darker theme for variation
        padding: '20px'
    },
    card: {
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(255, 255, 255, 0.95)',
        position: 'relative'
    },
    backLink: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '14px',
        color: 'var(--text-muted)',
        marginBottom: '24px',
        fontWeight: '500'
    },
    header: {
        textAlign: 'center',
        marginBottom: '32px'
    },
    logoContainer: {
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        backgroundColor: '#FFE4E6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 16px'
    },
    title: {
        fontSize: '24px',
        marginBottom: '8px'
    },
    subtitle: {
        color: 'var(--text-muted)'
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px'
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column'
    },
    inputWrapper: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center'
    },
    inputIcon: {
        position: 'absolute',
        left: '12px',
        color: 'var(--text-muted)'
    },
    inputWithIcon: {
        paddingLeft: '40px'
    },
    submitBtn: {
        width: '100%',
        marginTop: '8px',
        padding: '14px'
    },
    alert: {
        padding: '12px',
        marginBottom: '20px',
        textAlign: 'center',
        display: 'block'
    }
};

export default ForgotPassword;
