import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChatWidget from '../components/ChatWidget';
import SakuraBackground from '../components/SakuraBackground';
import sakuraBg from '../assets/backgrounds/sakura-background.png';

export default function MainLayout() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    const getSakuraIntensity = (pathname) => {
        if (pathname === '/') return 'medium-high';
        return 'medium';
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const handleLogout = () => {
        logout();
        setDropdownOpen(false);
        navigate('/login');
    };

    return (
        <div className="text-on-surface min-h-screen flex flex-col" style={{ position: 'relative' }}>
            {/* Layer 0: Fixed Sakura background image with white overlay */}
            <div style={{
                position: 'fixed',
                top: 0, left: 0,
                width: '100vw',
                height: '100vh',
                backgroundImage: `linear-gradient(rgba(255,255,255,0.65),rgba(255,255,255,0.65)), url(${sakuraBg})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                zIndex: 0,
                pointerEvents: 'none',
            }} />
            {/* Layer 1: Falling Sakura petals */}
            <SakuraBackground intensity={getSakuraIntensity(location.pathname)} />
            {/* Layer 2: Header + main content */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-pink-100 shadow-sm sticky top-0" style={{ zIndex: 50 }}>
                <div className="flex justify-between items-center w-full px-lg py-md max-w-container-max mx-auto">
                    <div className="flex items-center gap-md">
                        <img src="/logo.png" alt="Pan Học Code Logo" className="w-10 h-10 object-contain rounded-full shadow-sm" />
                        <Link className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed" to="/">Pan Học Code</Link>
                    </div>
                    <nav className="hidden md:flex items-center gap-md">
                        <NavLink to="/" end className={({ isActive }) => isActive ? "text-white font-bold bg-gradient-to-r from-pink-400 to-pink-500 rounded-full px-md py-sm shadow-sm transition-all duration-300 relative after:content-['🌸'] after:absolute after:-top-1 after:-right-1.5 after:text-[10px] after:animate-bounce" : "text-on-surface-variant hover:bg-pink-50 hover:text-pink-600 rounded-full px-md py-sm transition-all duration-300"}>Dashboard</NavLink>
                        <NavLink to="/result" className={({ isActive }) => isActive ? "text-white font-bold bg-gradient-to-r from-pink-400 to-pink-500 rounded-full px-md py-sm shadow-sm transition-all duration-300 relative after:content-['🌸'] after:absolute after:-top-1 after:-right-1.5 after:text-[10px] after:animate-bounce" : "text-on-surface-variant hover:bg-pink-50 hover:text-pink-600 rounded-full px-md py-sm transition-all duration-300"}>My Results</NavLink>
                        <NavLink to="/courses" className={({ isActive }) => isActive ? "text-white font-bold bg-gradient-to-r from-pink-400 to-pink-500 rounded-full px-md py-sm shadow-sm transition-all duration-300 relative after:content-['🌸'] after:absolute after:-top-1 after:-right-1.5 after:text-[10px] after:animate-bounce" : "text-on-surface-variant hover:bg-pink-50 hover:text-pink-600 rounded-full px-md py-sm transition-all duration-300"}>My Courses</NavLink>
                    </nav>
                    <div className="flex items-center gap-md">
                        <button className="material-symbols-outlined text-on-surface-variant dark:text-primary-fixed hover:bg-surface-container-low p-sm rounded-full transition-all">timer</button>

                        {currentUser ? (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setDropdownOpen(o => !o)}
                                    className="flex items-center gap-sm hover:bg-surface-container-low px-sm py-xs rounded-full transition-all"
                                    aria-expanded={dropdownOpen}
                                    aria-haspopup="true"
                                    id="user-menu-btn"
                                >
                                    <span className="material-symbols-outlined text-primary dark:text-primary-fixed" style={{ fontSize: 28 }}>account_circle</span>
                                    <span className="hidden md:block font-label-md text-label-md text-on-surface max-w-[120px] truncate">{currentUser.fullName}</span>
                                    <span className="material-symbols-outlined text-on-surface-variant text-sm" style={{ fontSize: 18 }}>
                                        {dropdownOpen ? 'expand_less' : 'expand_more'}
                                    </span>
                                </button>
                                {dropdownOpen && (
                                    <div
                                        className="absolute right-0 top-full mt-sm bg-surface border border-outline-variant rounded-xl shadow-lg py-xs min-w-[180px] z-50"
                                        role="menu"
                                    >
                                        <div className="px-md py-sm border-b border-outline-variant">
                                            <p className="font-label-md text-label-md text-on-surface truncate">{currentUser.fullName}</p>
                                            <p className="font-label-sm text-label-sm text-secondary truncate">{currentUser.email}</p>
                                        </div>
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-md py-sm font-label-md text-label-md text-error hover:bg-surface-container transition-colors flex items-center gap-sm"
                                            role="menuitem"
                                            id="logout-btn"
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>logout</span>
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                id="header-signin-btn"
                                className="btn-sakura px-md py-xs rounded-full"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <div className="relative flex-grow flex flex-col" style={{ zIndex: 20 }}>
                <Outlet />
            </div>

            <ChatWidget />

            <footer className="w-full py-xl px-lg flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto border-t-2 border-pink-100 bg-pink-50/20 relative overflow-hidden">
                {/* Petal patterns in background */}
                <div className="absolute right-2 bottom-2 text-pink-200/20 text-4xl select-none pointer-events-none">🌸 🌸</div>
                <div className="absolute left-2 top-2 text-pink-200/20 text-3xl select-none pointer-events-none">🌸</div>
                
                <div className="flex items-center gap-md mb-md md:mb-0 relative z-10">
                    <img src="/logo.png" alt="Pan Học Code Logo" className="w-12 h-12 object-contain rounded-full shadow-sm" />
                    <div>
                        <h2 className="font-headline-sm text-headline-sm font-bold text-pink-600">Pan Học Code</h2>
                        <p className="font-label-sm text-label-sm text-secondary mt-xs">© 2024 Pan Học Code - Sakura Coding Academy</p>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center gap-xl relative z-10">
                    <Link className="font-label-sm text-label-sm text-secondary hover:text-pink-600 transition-colors" to="/privacy">Privacy Policy</Link>
                    <Link className="font-label-sm text-label-sm text-secondary hover:text-pink-600 transition-colors" to="/terms">Terms of Service</Link>
                    <Link className="font-label-sm text-label-sm text-secondary hover:text-pink-600 transition-colors" to="/accessibility">Accessibility</Link>
                    <Link className="font-label-sm text-label-sm text-secondary hover:text-pink-600 transition-colors" to="/help-center">Help Center</Link>
                    <Link className="font-label-sm text-label-sm text-secondary hover:text-pink-600 transition-colors" to="/help-center">About Pan Học Code</Link>
                </div>
            </footer>
        </div>
    );
}
