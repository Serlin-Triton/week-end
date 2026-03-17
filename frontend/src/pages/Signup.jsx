import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { CarFront, Lock, Phone, User as UserIcon } from 'lucide-react';

const Signup = () => {
    const [name, setName] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setIsLoading(true);
        
        try {
            await api.post('/auth/register', { name, mobileNumber, password });
            navigate('/login', { state: { message: "Account created successfully. Please login." } });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed or server error.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={styles.container} className="animate-fade-in">
            <div className="glass-panel" style={styles.card}>
                <div style={styles.header}>
                    <div style={styles.logoContainer}>
                        <CarFront size={32} color="var(--primary)" />
                    </div>
                    <h2 style={styles.title}>Welcome to ZoomTrip</h2>
                    <p style={styles.subtitle}>Create an account to manage your travels</p>
                </div>
                
                {error && <div style={styles.error} className="badge badge-danger">{error}</div>}
                
                <form onSubmit={handleSubmit} style={styles.form}>
                    <div style={styles.inputGroup}>
                        <label>Full Name</label>
                        <div style={styles.inputWrapper}>
                            <UserIcon size={18} style={styles.inputIcon} />
                            <input 
                                type="text" 
                                placeholder="Enter full name" 
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={styles.inputWithIcon}
                                required 
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Mobile Number</label>
                        <div style={styles.inputWrapper}>
                            <Phone size={18} style={styles.inputIcon} />
                            <input 
                                type="text" 
                                placeholder="Enter mobile number" 
                                value={mobileNumber}
                                onChange={(e) => setMobileNumber(e.target.value)}
                                style={styles.inputWithIcon}
                                required 
                            />
                        </div>
                    </div>
                    
                    <div style={styles.inputGroup}>
                        <label>Password</label>
                        <div style={styles.inputWrapper}>
                            <Lock size={18} style={styles.inputIcon} />
                            <input 
                                type="password" 
                                placeholder="Enter password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={styles.inputWithIcon}
                                required 
                            />
                        </div>
                    </div>

                    <div style={styles.inputGroup}>
                        <label>Confirm Password</label>
                        <div style={styles.inputWrapper}>
                            <Lock size={18} style={styles.inputIcon} />
                            <input 
                                type="password" 
                                placeholder="Confirm password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={styles.inputWithIcon}
                                required 
                            />
                        </div>
                    </div>
                    
                    <button type="submit" className="btn btn-primary" style={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? 'Creating account...' : 'Sign Up'}
                    </button>

                    <div style={styles.options}>
                        <span style={styles.signupText}>Already have an account? <Link to="/login" style={styles.signupLink}>Login</Link></span>
                    </div>
                </form>
            </div>
        </div>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #4F46E5 0%, #10B981 100%)',
        padding: '20px'
    },
    card: {
        width: '100%',
        maxWidth: '440px',
        background: 'rgba(255, 255, 255, 0.9)',
    },
    header: {
        textAlign: 'center',
        marginBottom: '32px'
    },
    logoContainer: {
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        backgroundColor: 'var(--primary-light)',
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
    options: {
        display: 'flex',
        justifyContent: 'center',
        fontSize: '14px',
        marginTop: '10px'
    },
    signupText: {
        color: 'var(--text-muted)'
    },
    signupLink: {
        fontWeight: '500',
        color: 'var(--primary)',
        textDecoration: 'none'
    },
    submitBtn: {
        width: '100%',
        marginTop: '8px',
        padding: '14px'
    },
    error: {
        padding: '12px',
        marginBottom: '20px',
        textAlign: 'center',
        display: 'block'
    }
};

export default Signup;
