import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { isTosAccepted } from '../TermsOfService/TermsOfService';
import './Auth.css';


const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Toast({ message, onDone }) {
    useEffect(() => {
        const t = setTimeout(onDone, 2600);
        return () => clearTimeout(t);
    }, [onDone]);
    return <div className="auth-toast">{message}</div>;
}

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({ email: '', password: '', rememberMe: false });
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState('');
    const [tosAccepted] = useState(() => isTosAccepted());


    const emailRef = useRef(null);
    const passwordRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        setGlobalError('');
    };

    const validate = () => {
        const newErrors = {};
        if (!form.email.trim()) newErrors.email = 'Email is required.';
        else if (!EMAIL_REGEX.test(form.email.trim())) newErrors.email = 'Please enter a valid email address.';
        if (!form.password) newErrors.password = 'Password is required.';
        return newErrors;
    };

    const isFormFilled = form.email.trim() !== '' && form.password !== '';

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            if (newErrors.email) emailRef.current?.focus();
            else if (newErrors.password) passwordRef.current?.focus();
            return;
        }
        setLoading(true);
        setTimeout(() => {
            const result = login({
                email: form.email.trim(),
                password: form.password,
                rememberMe: form.rememberMe,
            });
            setLoading(false);
            if (result.success) {
                navigate('/');
            } else {
                setGlobalError(result.error);
            }
        }, 400);
    };

    const handleSocialClick = (provider) => {
        setToast(`${provider} Login is coming soon.`);
    };

    return (
        <>
            <div className="auth-page">
                <div className="auth-card">

                    {/* Logo */}
                    <Link to="/" className="auth-logo">
                        <img src="/logo.png" alt="Pan Học Code Logo" className="w-10 h-10 object-contain rounded-full shadow-sm" />
                        <span className="auth-logo-text">Pan Học Code</span>
                    </Link>

                    {/* Terms of Service Banner */}
                    {!tosAccepted && (
                        <div className="tos-login-banner">
                            <span className="material-symbols-outlined">gavel</span>
                            <span>
                                Please review our{' '}
                                <Link to="/terms">Terms of Service</Link>{' '}
                                before continuing.
                            </span>
                        </div>
                    )}

                    <h1 className="auth-title">Welcome Back</h1>

                    <p className="auth-subtitle">Sign in to continue your learning journey</p>

                    <form className="auth-form" onSubmit={handleSubmit} noValidate>

                        {/* Global Error */}
                        {globalError && (
                            <div className="auth-global-error" role="alert">
                                <span className="material-symbols-outlined">error</span>
                                {globalError}
                            </div>
                        )}

                        {/* Email */}
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="login-email">Email address</label>
                            <div className="auth-input-wrap">
                                <input
                                    ref={emailRef}
                                    id="login-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className={`auth-input${errors.email ? ' error' : ''}`}
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    aria-describedby={errors.email ? 'login-email-err' : undefined}
                                />
                            </div>
                            {errors.email && <span id="login-email-err" className="auth-error-msg">{errors.email}</span>}
                        </div>

                        {/* Password */}
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="login-password">Password</label>
                            <div className="auth-input-wrap">
                                <input
                                    ref={passwordRef}
                                    id="login-password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="current-password"
                                    className={`auth-input has-icon${errors.password ? ' error' : ''}`}
                                    placeholder="Enter your password"
                                    value={form.password}
                                    onChange={handleChange}
                                    aria-describedby={errors.password ? 'login-pw-err' : undefined}
                                />
                                <button
                                    type="button"
                                    className="auth-pw-toggle"
                                    onClick={() => setShowPassword(s => !s)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    tabIndex={0}
                                >
                                    <span className="material-symbols-outlined">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                            {errors.password && <span id="login-pw-err" className="auth-error-msg">{errors.password}</span>}
                        </div>

                        {/* Remember Me + Forgot Password */}
                        <div className="auth-row">
                            <label className="auth-check-label">
                                <input
                                    type="checkbox"
                                    name="rememberMe"
                                    checked={form.rememberMe}
                                    onChange={handleChange}
                                    id="login-remember"
                                />
                                Remember me
                            </label>
                            <a href="#" className="auth-forgot">Forgot password?</a>
                        </div>

                        {/* Login Button */}
                        <button
                            id="login-submit"
                            type="submit"
                            className="auth-btn-primary"
                            disabled={!isFormFilled || loading}
                        >
                            {loading ? 'Signing in…' : 'Sign In'}
                        </button>

                        {/* OR Divider */}
                        <div className="auth-divider">
                            <span className="auth-divider-text">OR</span>
                        </div>

                        {/* Social Buttons */}
                        <div className="auth-socials">
                            <button
                                type="button"
                                className="auth-social-btn"
                                onClick={() => handleSocialClick('Google')}
                                id="login-google"
                            >
                                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                                    <path fill="#4285F4" d="M45.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h11.9c-.5 2.7-2.1 5-4.4 6.5v5.4h7.1c4.2-3.9 6.5-9.6 6.5-15.9z"/>
                                    <path fill="#34A853" d="M24 46c5.9 0 10.9-2 14.5-5.4l-7.1-5.4c-2 1.3-4.5 2.1-7.4 2.1-5.7 0-10.5-3.8-12.2-9H4.5v5.6C8.1 41.6 15.5 46 24 46z"/>
                                    <path fill="#FBBC04" d="M11.8 28.3c-.4-1.3-.7-2.7-.7-4.3s.3-3 .7-4.3v-5.6H4.5C2.9 17.4 2 20.6 2 24s.9 6.6 2.5 9.9l7.3-5.6z"/>
                                    <path fill="#E94235" d="M24 10.7c3.2 0 6.1 1.1 8.4 3.3l6.3-6.3C34.9 4.2 29.9 2 24 2 15.5 2 8.1 6.4 4.5 13.1l7.3 5.6c1.7-5.2 6.5-9 12.2-9z"/>
                                </svg>
                                Continue with Google
                            </button>
                            <button
                                type="button"
                                className="auth-social-btn"
                                onClick={() => handleSocialClick('Facebook')}
                                id="login-facebook"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="#1877F2">
                                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.514c-1.491 0-1.955.93-1.955 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/>
                                </svg>
                                Continue with Facebook
                            </button>
                        </div>

                    </form>

                    {/* Footer */}
                    <p className="auth-footer-text" style={{ marginTop: '20px' }}>
                        Don't have an account?{' '}
                        <Link to="/register">Sign Up</Link>
                    </p>

                </div>
            </div>

            {/* Toast */}
            {toast && <Toast message={toast} onDone={() => setToast('')} />}
        </>
    );
}
