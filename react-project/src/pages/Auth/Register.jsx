import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SakuraBackground from '../../components/SakuraBackground';
import sakuraBg from '../../assets/backgrounds/sakura-background.png';
import './Auth.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PW_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

function Toast({ message, onDone }) {
    useEffect(() => {
        const t = setTimeout(onDone, 2600);
        return () => clearTimeout(t);
    }, [onDone]);
    return <div className="auth-toast">{message}</div>;
}

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [form, setForm] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false,
    });
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState('');

    const fullNameRef = useRef(null);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const confirmRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        setGlobalError('');
        setSuccessMsg('');
    };

    const validate = () => {
        const newErrors = {};
        if (!form.fullName.trim()) newErrors.fullName = 'Full name is required.';
        if (!form.email.trim()) newErrors.email = 'Email is required.';
        else if (!EMAIL_REGEX.test(form.email.trim())) newErrors.email = 'Please enter a valid email address.';
        if (!form.password) newErrors.password = 'Password is required.';
        else if (!PW_REGEX.test(form.password)) newErrors.password = 'Password must be at least 8 characters and contain uppercase, lowercase and a number.';
        if (!form.confirmPassword) newErrors.confirmPassword = 'Confirm password is required.';
        else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match.';
        if (!form.agreeTerms) newErrors.agreeTerms = 'You must agree to the Terms.';
        return newErrors;
    };

    const isFormValid =
        form.fullName.trim() !== '' &&
        form.email.trim() !== '' &&
        form.password !== '' &&
        form.confirmPassword !== '' &&
        form.agreeTerms;

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            if (newErrors.fullName) fullNameRef.current?.focus();
            else if (newErrors.email) emailRef.current?.focus();
            else if (newErrors.password) passwordRef.current?.focus();
            else if (newErrors.confirmPassword) confirmRef.current?.focus();
            return;
        }
        setLoading(true);
        setTimeout(() => {
            const result = register({
                fullName: form.fullName.trim(),
                email: form.email.trim(),
                password: form.password,
            });
            setLoading(false);
            if (result.success) {
                setSuccessMsg('Account created successfully.');
                setTimeout(() => navigate('/login'), 1600);
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
            {/* Fixed Sakura background image with white overlay */}
            <div style={{
                position: 'fixed', top: 0, left: 0,
                width: '100vw', height: '100vh',
                backgroundImage: `linear-gradient(rgba(255,255,255,0.65),rgba(255,255,255,0.65)), url(${sakuraBg})`,
                backgroundSize: 'cover', backgroundPosition: 'center',
                backgroundAttachment: 'fixed', zIndex: 0, pointerEvents: 'none',
            }} />
            <SakuraBackground intensity="high" />
            <div className="auth-page" style={{ position: 'relative', zIndex: 20 }}>
                <div className="auth-card">

                    {/* Logo */}
                    <Link to="/" className="auth-logo">
                        <img src="/logo.png" alt="Pan Học Code Logo" className="w-10 h-10 object-contain rounded-full shadow-sm" />
                        <span className="auth-logo-text">Pan Học Code</span>
                    </Link>

                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join Pan Học Code and start your learning journey</p>

                    <form className="auth-form" onSubmit={handleSubmit} noValidate>

                        {/* Success Message */}
                        {successMsg && (
                            <div className="auth-success" role="status">
                                <span className="material-symbols-outlined">check_circle</span>
                                {successMsg}
                            </div>
                        )}

                        {/* Global Error */}
                        {globalError && (
                            <div className="auth-global-error" role="alert">
                                <span className="material-symbols-outlined">error</span>
                                {globalError}
                            </div>
                        )}

                        {/* Full Name */}
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="reg-fullname">Full Name</label>
                            <div className="auth-input-wrap">
                                <input
                                    ref={fullNameRef}
                                    id="reg-fullname"
                                    name="fullName"
                                    type="text"
                                    autoComplete="name"
                                    className={`auth-input${errors.fullName ? ' error' : ''}`}
                                    placeholder="Alex Johnson"
                                    value={form.fullName}
                                    onChange={handleChange}
                                    aria-describedby={errors.fullName ? 'reg-name-err' : undefined}
                                />
                            </div>
                            {errors.fullName && <span id="reg-name-err" className="auth-error-msg">{errors.fullName}</span>}
                        </div>

                        {/* Email */}
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="reg-email">Email address</label>
                            <div className="auth-input-wrap">
                                <input
                                    ref={emailRef}
                                    id="reg-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    className={`auth-input${errors.email ? ' error' : ''}`}
                                    placeholder="you@example.com"
                                    value={form.email}
                                    onChange={handleChange}
                                    aria-describedby={errors.email ? 'reg-email-err' : undefined}
                                />
                            </div>
                            {errors.email && <span id="reg-email-err" className="auth-error-msg">{errors.email}</span>}
                        </div>

                        {/* Password */}
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="reg-password">Password</label>
                            <div className="auth-input-wrap">
                                <input
                                    ref={passwordRef}
                                    id="reg-password"
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    className={`auth-input has-icon${errors.password ? ' error' : ''}`}
                                    placeholder="Min. 8 chars, uppercase, number"
                                    value={form.password}
                                    onChange={handleChange}
                                    aria-describedby={errors.password ? 'reg-pw-err' : undefined}
                                />
                                <button
                                    type="button"
                                    className="auth-pw-toggle"
                                    onClick={() => setShowPassword(s => !s)}
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    <span className="material-symbols-outlined">
                                        {showPassword ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                            {errors.password && <span id="reg-pw-err" className="auth-error-msg">{errors.password}</span>}
                        </div>

                        {/* Confirm Password */}
                        <div className="auth-field">
                            <label className="auth-label" htmlFor="reg-confirm">Confirm Password</label>
                            <div className="auth-input-wrap">
                                <input
                                    ref={confirmRef}
                                    id="reg-confirm"
                                    name="confirmPassword"
                                    type={showConfirm ? 'text' : 'password'}
                                    autoComplete="new-password"
                                    className={`auth-input has-icon${errors.confirmPassword ? ' error' : ''}`}
                                    placeholder="Re-enter your password"
                                    value={form.confirmPassword}
                                    onChange={handleChange}
                                    aria-describedby={errors.confirmPassword ? 'reg-confirm-err' : undefined}
                                />
                                <button
                                    type="button"
                                    className="auth-pw-toggle"
                                    onClick={() => setShowConfirm(s => !s)}
                                    aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                                >
                                    <span className="material-symbols-outlined">
                                        {showConfirm ? 'visibility_off' : 'visibility'}
                                    </span>
                                </button>
                            </div>
                            {errors.confirmPassword && <span id="reg-confirm-err" className="auth-error-msg">{errors.confirmPassword}</span>}
                        </div>

                        {/* Agree to Terms */}
                        <div className="auth-field">
                            <label className="auth-check-label" htmlFor="reg-terms">
                                <input
                                    type="checkbox"
                                    id="reg-terms"
                                    name="agreeTerms"
                                    checked={form.agreeTerms}
                                    onChange={handleChange}
                                />
                                I agree to the{' '}
                                <a href="#" className="auth-forgot" style={{ marginLeft: 3 }}>Terms of Service</a>
                                {' '}and{' '}
                                <a href="#" className="auth-forgot">Privacy Policy</a>
                            </label>
                            {errors.agreeTerms && <span className="auth-error-msg">{errors.agreeTerms}</span>}
                        </div>

                        {/* Create Account Button */}
                        <button
                            id="register-submit"
                            type="submit"
                            className="auth-btn-primary"
                            disabled={!isFormValid || loading}
                        >
                            {loading ? 'Creating account…' : 'Create Account'}
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
                                id="register-google"
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
                                id="register-facebook"
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
                        Already have an account?{' '}
                        <Link to="/login">Sign In</Link>
                    </p>

                </div>
            </div>

            {/* Toast */}
            {toast && <Toast message={toast} onDone={() => setToast('')} />}
        </>
    );
}
