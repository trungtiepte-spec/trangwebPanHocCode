import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import ChatWidget from '../components/ChatWidget';

export default function MainLayout() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

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
        <div className="bg-background text-on-surface min-h-screen flex flex-col">
            <header className="bg-surface dark:bg-on-surface border-b border-outline-variant dark:border-outline shadow-sm sticky top-0 z-50">
                <div className="flex justify-between items-center w-full px-lg py-md max-w-container-max mx-auto">
                    <div className="flex items-center gap-md">
                        <img src="/logo.png" alt="Pan Học Code Logo" className="w-10 h-10 object-contain rounded-full shadow-sm" />
                        <Link className="font-headline-md text-headline-md font-bold text-primary dark:text-primary-fixed" to="/">Pan Học Code</Link>
                    </div>
                    <nav className="hidden md:flex items-center gap-md">
                        <NavLink to="/" end className={({ isActive }) => isActive ? "text-primary dark:text-primary-fixed font-bold bg-primary/10 rounded-lg px-md py-sm transition-all duration-300" : "text-on-surface-variant dark:text-on-tertiary-container hover:bg-primary/5 hover:text-primary rounded-lg px-md py-sm transition-all duration-300"}>Dashboard</NavLink>
                        <NavLink to="/result" className={({ isActive }) => isActive ? "text-primary dark:text-primary-fixed font-bold bg-primary/10 rounded-lg px-md py-sm transition-all duration-300" : "text-on-surface-variant dark:text-on-tertiary-container hover:bg-primary/5 hover:text-primary rounded-lg px-md py-sm transition-all duration-300"}>My Results</NavLink>
                        <NavLink to="/courses" className={({ isActive }) => isActive ? "text-primary dark:text-primary-fixed font-bold bg-primary/10 rounded-lg px-md py-sm transition-all duration-300" : "text-on-surface-variant dark:text-on-tertiary-container hover:bg-primary/5 hover:text-primary rounded-lg px-md py-sm transition-all duration-300"}>My Courses</NavLink>
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
                                className="font-label-md text-label-md bg-primary text-on-primary px-md py-xs rounded-lg hover:opacity-90 transition-all"
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            <Outlet />

            <ChatWidget />

            <footer className="w-full py-xl px-lg flex flex-col md:flex-row justify-between items-center max-w-container-max mx-auto border-t border-outline-variant bg-surface-bright">
                <div className="flex items-center gap-md mb-md md:mb-0">
                    <img src="/logo.png" alt="Pan Học Code Logo" className="w-12 h-12 object-contain rounded-full shadow-sm" />
                    <div>
                        <h2 className="font-headline-sm text-headline-sm font-bold text-primary">Pan Học Code</h2>
                        <p className="font-label-sm text-label-sm text-secondary mt-xs">© 2024 Pan Học Code</p>
                    </div>
                </div>
                <div className="flex flex-wrap justify-center gap-xl">
                    <Link className="font-label-sm text-label-sm text-secondary hover:text-primary transition-opacity" to="/privacy">Privacy Policy</Link>
                    <Link className="font-label-sm text-label-sm text-secondary hover:text-primary transition-opacity" to="/terms">Terms of Service</Link>
                    <Link className="font-label-sm text-label-sm text-secondary hover:text-primary transition-opacity" to="/help-center">Help Center</Link>
                    <Link className="font-label-sm text-label-sm text-secondary hover:text-primary transition-opacity" to="#">Accessibility</Link>
                </div>
            </footer>
        </div>
    );
}
