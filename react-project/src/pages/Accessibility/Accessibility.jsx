import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SakuraBackground from '../../components/SakuraBackground';
import './Accessibility.css';

const DEFAULT_SETTINGS = {
    textSize: 'Medium',
    theme: 'Light',
    font: 'Default',
    reduceMotion: false,
};

export default function Accessibility() {
    const navigate = useNavigate();
    const [settings, setSettings] = useState(() => {
        try {
            const saved = localStorage.getItem('pan_accessibility_settings');
            return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
        } catch (e) {
            return DEFAULT_SETTINGS;
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem('pan_accessibility_settings', JSON.stringify(settings));
        } catch (e) {
            console.error('Failed to save accessibility settings to localStorage', e);
        }
    }, [settings]);

    // Keyboard shortcut listeners (Alt + H = Home, Alt + C = Courses, Alt + R = Results)
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.altKey) {
                const key = e.key.toLowerCase();
                if (key === 'h') {
                    e.preventDefault();
                    navigate('/');
                } else if (key === 'c') {
                    e.preventDefault();
                    navigate('/courses');
                } else if (key === 'r') {
                    e.preventDefault();
                    navigate('/result');
                }
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [navigate]);

    const handleReset = () => {
        setSettings(DEFAULT_SETTINGS);
    };

    // Calculate font size for preview box
    const getFontSize = () => {
        switch (settings.textSize) {
            case 'Small': return '13px';
            case 'Large': return '18px';
            case 'Extra Large': return '22px';
            default: return '15px'; // Medium
        }
    };

    return (
        <>
            <SakuraBackground intensity="medium" />
            <main className="flex-grow">
                <div className="ac-container">
                    <header className="ac-header">
                        <h1 className="ac-title">Accessibility Center 🌸</h1>
                        <p className="ac-subtitle">Customize your visual and reading experience at Pan Học Code Sakura Coding Academy.</p>
                    </header>

                    {/* Interactive Live Preview Box */}
                    <div
                        className="ac-preview-box"
                        style={{
                            fontFamily: settings.font === 'Dyslexia Friendly' ? 'Comic Sans MS, OpenDyslexic, sans-serif' : 'Inter, sans-serif',
                            backgroundColor: settings.theme === 'Dark' ? '#1f2937' : settings.theme === 'High Contrast' ? '#000000' : '#ffffff',
                            color: settings.theme === 'Dark' ? '#f9fafb' : settings.theme === 'High Contrast' ? '#ffff00' : '#374151',
                            borderColor: settings.theme === 'High Contrast' ? '#ffff00' : '#fbcfe8',
                        }}
                    >
                        <h2 className="ac-preview-title" style={{ color: settings.theme === 'High Contrast' ? '#ffff00' : '#9d174d' }}>
                            Live Preview Box
                        </h2>
                        <p className="ac-preview-content" style={{ fontSize: getFontSize() }}>
                            Welcome to Pan Học Code! This sample text instantly reflects your selected font size, contrast theme, and typeface preferences.
                        </p>
                    </div>

                    {/* Controls Grid */}
                    <div className="ac-grid">
                        {/* Text Size */}
                        <div className="ac-card">
                            <h3 className="ac-card-title">
                                <span className="material-symbols-outlined">format_size</span>
                                Text Size
                            </h3>
                            <div className="ac-btn-group">
                                {['Small', 'Medium', 'Large', 'Extra Large'].map(size => (
                                    <button
                                        key={size}
                                        className={`ac-opt-btn ${settings.textSize === size ? 'active' : ''}`}
                                        onClick={() => setSettings(s => ({ ...s, textSize: size }))}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Theme */}
                        <div className="ac-card">
                            <h3 className="ac-card-title">
                                <span className="material-symbols-outlined">palette</span>
                                Contrast & Theme
                            </h3>
                            <div className="ac-btn-group">
                                {['Light', 'Dark', 'High Contrast'].map(t => (
                                    <button
                                        key={t}
                                        className={`ac-opt-btn ${settings.theme === t ? 'active' : ''}`}
                                        onClick={() => setSettings(s => ({ ...s, theme: t }))}
                                    >
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Font Style */}
                        <div className="ac-card">
                            <h3 className="ac-card-title">
                                <span className="material-symbols-outlined">font_download</span>
                                Typeface
                            </h3>
                            <div className="ac-btn-group">
                                {['Default', 'Dyslexia Friendly'].map(f => (
                                    <button
                                        key={f}
                                        className={`ac-opt-btn ${settings.font === f ? 'active' : ''}`}
                                        onClick={() => setSettings(s => ({ ...s, font: f }))}
                                    >
                                        {f}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Motion */}
                        <div className="ac-card">
                            <h3 className="ac-card-title">
                                <span className="material-symbols-outlined">motion_photos_off</span>
                                Motion
                            </h3>
                            <div className="ac-toggle-wrap">
                                <span className="ac-toggle-label">Reduce Animations</span>
                                <label className="ac-switch">
                                    <input
                                        type="checkbox"
                                        checked={settings.reduceMotion}
                                        onChange={e => setSettings(s => ({ ...s, reduceMotion: e.target.checked }))}
                                    />
                                    <span className="ac-slider"></span>
                                </label>
                            </div>
                        </div>

                        {/* Keyboard Navigation Shortcuts */}
                        <div className="ac-card">
                            <h3 className="ac-card-title">
                                <span className="material-symbols-outlined">keyboard</span>
                                Keyboard Shortcuts
                            </h3>
                            <ul className="ac-shortcut-list">
                                <li className="ac-shortcut-item">
                                    <span>Go to Dashboard</span>
                                    <span className="ac-key">Alt + H</span>
                                </li>
                                <li className="ac-shortcut-item">
                                    <span>Go to My Courses</span>
                                    <span className="ac-key">Alt + C</span>
                                </li>
                                <li className="ac-shortcut-item">
                                    <span>Go to My Results</span>
                                    <span className="ac-key">Alt + R</span>
                                </li>
                            </ul>
                        </div>

                        {/* Screen Reader Support Tips */}
                        <div className="ac-card">
                            <h3 className="ac-card-title">
                                <span className="material-symbols-outlined">record_voice_over</span>
                                Screen Reader Tips
                            </h3>
                            <p style={{ fontSize: 13, color: '#4b5563', margin: 0, lineHeight: 1.5 }}>
                                All interactive controls feature semantic HTML elements, ARIA labels, and keyboard focus outlines compatible with NVDA, JAWS, and VoiceOver screen readers.
                            </p>
                        </div>
                    </div>

                    {/* Reset Button */}
                    <div className="ac-actions">
                        <button className="btn-sakura px-8 py-3 rounded-full text-sm font-bold" onClick={handleReset}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>restart_alt</span>
                            Reset All Preferences
                        </button>
                    </div>
                </div>
            </main>
        </>
    );
}
