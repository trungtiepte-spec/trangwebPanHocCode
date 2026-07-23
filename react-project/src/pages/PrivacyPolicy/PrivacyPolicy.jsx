import React, { useState, useEffect, useRef, useCallback } from 'react';
import SakuraBackground from '../../components/SakuraBackground';
import './PrivacyPolicy.css';

const LAST_UPDATED = 'July 21, 2026';

const SECTIONS = [
    {
        id: 'introduction',
        num: '01',
        title: 'Introduction',
        content: [
            'Welcome to Pan Học Code ("we", "our", or "us"). This Privacy Policy explains how we collect, use, and protect information when you use our web-based quiz and learning platform.',
            'By using Pan Học Code, you agree to the collection and use of information in accordance with this policy. This application is designed for educational purposes and runs entirely within your browser using client-side technologies.',
            'We are committed to maintaining the privacy and security of your personal information. Please read this policy carefully to understand our practices.',
        ],
    },
    {
        id: 'information-collected',
        num: '02',
        title: 'Information We Collect',
        content: [
            'Pan Học Code collects minimal information necessary to provide and improve our services:',
        ],
        list: [
            '**Account Information**: When you register, we collect your full name and email address. This is stored locally in your browser.',
            '**Quiz Activity**: Your quiz results, scores, selected answers, and timestamps are stored locally in your browser to power features like My Results and Question Review.',
            '**Custom Courses**: Course names, descriptions, and questions you create are stored locally in your browser.',
            '**Chat History**: Messages from the Customer Support widget are stored locally in your browser.',
            '**No Server Collection**: We do not transmit any personal data to a remote server or third-party database.',
        ],
    },
    {
        id: 'how-we-use',
        num: '03',
        title: 'How We Use Your Information',
        content: [
            'Information stored by Pan Học Code is used solely to operate the application features. Specifically:',
        ],
        list: [
            'To display your quiz results, scores, and performance history.',
            'To track per-question progress (Correct / Wrong / Unanswered) across study sessions.',
            'To store your custom courses and manage the Recycle Bin with 30-day expiry.',
            'To maintain chat conversation history in the support widget.',
            'To authenticate your session and display your name in the header.',
            'We do NOT use your data for advertising, analytics profiling, or any commercial purpose.',
        ],
    },
    {
        id: 'cookies',
        num: '04',
        title: 'Cookies',
        content: [
            'Pan Học Code does not use tracking cookies or third-party advertising cookies.',
            'We may use essential session cookies only to maintain your login state within the browser session. These cookies are strictly necessary for the application to function and cannot be disabled without affecting your experience.',
            'No persistent cross-site tracking cookies are set by our application.',
        ],
        infoBox: 'This application does not use Google Analytics, Facebook Pixel, or any third-party tracking scripts.',
    },
    {
        id: 'local-storage',
        num: '05',
        title: 'Local Storage Usage',
        content: [
            'Pan Học Code relies heavily on your browser\'s localStorage to persist data between sessions without requiring a backend server. The following keys are stored:',
        ],
        list: [
            '**panhoccode_users** — Registered user accounts (email, hashed password, full name).',
            '**panhoccode_current_user** — Currently logged-in user session.',
            '**examcore_custom_courses** — User-created custom courses.',
            '**examcore_deleted_courses** — Soft-deleted courses in the Recycle Bin.',
            '**questionProgress** — Per-question status (correct/wrong/unanswered) for all courses.',
            '**quizResult** — The most recent quiz result for the Results page.',
            '**panhoccode_chat_history** — Customer Support chat conversation history.',
        ],
        endContent: 'You can clear all stored data at any time by clearing your browser\'s localStorage via Developer Tools or browser Settings.',
    },
    {
        id: 'quiz-history',
        num: '06',
        title: 'Quiz History Storage',
        content: [
            'Quiz results and question progress are stored locally in your browser. This data enables features such as:',
        ],
        list: [
            'Viewing your most recent quiz score and review on the My Results page.',
            'Tracking Correct, Wrong, and Unanswered questions for each course on the My Courses page.',
            'Launching targeted practice sessions from the Course Questions page.',
        ],
        endContent: 'Quiz history is never shared with any third party. All data remains in your browser until you manually clear it or uninstall the browser.',
    },
    {
        id: 'third-party',
        num: '07',
        title: 'Third-party Services',
        content: [
            'Pan Học Code uses the following third-party resources, which are loaded from external CDNs:',
        ],
        list: [
            '**Google Fonts (fonts.googleapis.com)** — Used to load the Inter and Material Symbols font families. Google may log font requests per their privacy policy.',
            '**Tailwind CSS CDN** — The Tailwind CSS utility framework is loaded via CDN for styling.',
            '**React Router DOM** — Client-side navigation library bundled with the application.',
        ],
        endContent: 'No personal information is transmitted to these services. They are used solely to load static assets.',
    },
    {
        id: 'data-security',
        num: '08',
        title: 'Data Security',
        content: [
            'Since all data is stored locally in your browser, the security of your data is tied to the security of your device and browser. We recommend:',
        ],
        list: [
            'Keep your browser and operating system up to date.',
            'Do not use Pan Học Code on shared or public computers without clearing your browsing data afterward.',
            'Use a strong, unique password when registering.',
            'Avoid sharing your browser profile with others.',
        ],
        endContent: 'We implement reasonable client-side measures to protect your data, but no method of storage is 100% secure. We cannot guarantee absolute security.',
    },
    {
        id: 'childrens-privacy',
        num: '09',
        title: "Children's Privacy",
        content: [
            'Pan Học Code is intended for educational use by students of all ages under appropriate supervision.',
            'We do not knowingly collect personal information from children under the age of 13 without verified parental consent. Since our application stores all data locally, no information is transmitted to our servers.',
            'Parents and guardians are encouraged to monitor their children\'s use of the application and to clear localStorage data from shared devices.',
        ],
    },
    {
        id: 'policy-changes',
        num: '10',
        title: 'Changes to This Policy',
        content: [
            `This Privacy Policy was last updated on ${LAST_UPDATED}. We may update this policy from time to time to reflect changes in our application or legal requirements.`,
            'When we make significant changes, we will update the "Last Updated" date at the top of this page. We encourage you to review this policy periodically.',
            'Your continued use of Pan Học Code after any changes to this policy constitutes your acceptance of the revised terms.',
        ],
    },
    {
        id: 'contact',
        num: '11',
        title: 'Contact Information',
        content: [
            'If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:',
        ],
        list: [
            '**Email**: support@panhoccode.com',
            '**Phone**: 0123 456 789',
            '**Working Hours**: Monday – Friday, 8:00 AM – 5:00 PM',
        ],
        endContent: 'We will respond to privacy-related inquiries within 5 business days.',
    },
];

// Highlight search query in text
function highlightText(text, query) {
    if (!query || query.trim() === '') return text;
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    return parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase()
            ? <mark key={i} className="pp-highlight">{part}</mark>
            : part
    );
}

function RichText({ text, query }) {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    const result = [];
    parts.forEach((part, i) => {
        if (i % 2 === 1) {
            result.push(<strong key={i}>{highlightText(part, query)}</strong>);
        } else {
            result.push(<span key={i}>{highlightText(part, query)}</span>);
        }
    });
    return <>{result}</>;
}

function sectionMatchesSearch(section, query) {
    if (!query || !query.trim()) return true;
    const q = query.toLowerCase();
    const texts = [
        section.title,
        ...(section.content || []),
        ...(section.list || []),
        section.endContent || '',
        section.infoBox || '',
    ].join(' ').toLowerCase();
    return texts.includes(q);
}

export default function PrivacyPolicy() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeId, setActiveId] = useState('');
    const [showBackTop, setShowBackTop] = useState(false);
    const [copyToast, setCopyToast] = useState('');
    const sectionRefs = useRef({});
    const contentRef = useRef(null);

    const filteredSections = SECTIONS.filter(s => sectionMatchesSearch(s, searchQuery));

    // Scroll spy
    useEffect(() => {
        const handleScroll = () => {
            setShowBackTop(window.scrollY > 300);
            const scrollPos = window.scrollY + 150;
            let current = '';
            SECTIONS.forEach(s => {
                const el = sectionRefs.current[s.id];
                if (el && el.offsetTop <= scrollPos) current = s.id;
            });
            setActiveId(current);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const el = sectionRefs.current[id];
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const handleBackToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDownloadPDF = () => {
        // Client-side: open print dialog in PDF mode
        const originalTitle = document.title;
        document.title = 'Pan Học Code - Privacy Policy';
        window.print();
        document.title = originalTitle;
    };

    const handleCopyLink = (id) => {
        const url = `${window.location.origin}/privacy#${id}`;
        navigator.clipboard.writeText(url).then(() => {
            setCopyToast('Link copied to clipboard!');
            setTimeout(() => setCopyToast(''), 2500);
        }).catch(() => {
            setCopyToast('Could not copy link.');
            setTimeout(() => setCopyToast(''), 2500);
        });
    };

    return (
        <div className="pp-page">
            <SakuraBackground intensity="medium" />
            {/* Hero Banner */}
            <div className="pp-hero">
                <h1>Privacy Policy 🌸</h1>
                <p>How we collect, use, and protect your information on Pan Học Code.</p>
                <span className="pp-updated-badge">
                    <span className="material-symbols-outlined" style={{ fontSize: 15 }}>event</span>
                    Last Updated: {LAST_UPDATED}
                </span>
            </div>

            {/* Sticky Toolbar */}
            <div className="pp-toolbar">
                <div className="pp-search-wrap">
                    <span className="material-symbols-outlined pp-search-icon">search</span>
                    <input
                        type="text"
                        className="pp-search-input"
                        placeholder="Search Privacy Policy..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        id="pp-search"
                    />
                </div>
                <div className="pp-toolbar-actions">
                    <button className="pp-btn" onClick={handlePrint} id="pp-print-btn">
                        <span className="material-symbols-outlined">print</span>
                        Print
                    </button>
                    <button className="pp-btn" onClick={handleDownloadPDF} id="pp-pdf-btn">
                        <span className="material-symbols-outlined">download</span>
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="pp-body">
                {/* Table of Contents */}
                <aside className="pp-toc">
                    <div className="pp-toc-header">Table of Contents</div>
                    <ul className="pp-toc-list">
                        {SECTIONS.map(s => (
                            <li key={s.id} className="pp-toc-item">
                                <div
                                    className={`pp-toc-link ${activeId === s.id ? 'active' : ''} ${!filteredSections.find(f => f.id === s.id) && searchQuery ? 'opacity-40' : ''}`}
                                    onClick={() => scrollToSection(s.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={e => e.key === 'Enter' && scrollToSection(s.id)}
                                >
                                    <span className="pp-toc-num">{s.num}</span>
                                    {s.title}
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Content */}
                <main className="pp-content" ref={contentRef}>
                    {searchQuery && filteredSections.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#50616b', background: '#fff', borderRadius: 14, border: '1.5px dashed #c4c5d5', marginBottom: 24 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#c4c5d5', display: 'block', marginBottom: 8 }}>search_off</span>
                            No sections matched "{searchQuery}".
                        </div>
                    )}

                    {SECTIONS.map(s => {
                        const isMatch = sectionMatchesSearch(s, searchQuery);
                        return (
                            <section
                                key={s.id}
                                id={s.id}
                                ref={el => (sectionRefs.current[s.id] = el)}
                                className={`pp-section ${!isMatch && searchQuery ? 'opacity-30' : ''}`}
                                style={!isMatch && searchQuery ? { opacity: 0.3 } : {}}
                            >
                                <div className="pp-section-header">
                                    <h2 className="pp-section-title">
                                        <span className="pp-section-num">{s.num}</span>
                                        {highlightText(s.title, searchQuery)}
                                    </h2>
                                    <button
                                        className="pp-copy-link"
                                        onClick={() => handleCopyLink(s.id)}
                                        title={`Copy link to "${s.title}"`}
                                        id={`copy-${s.id}`}
                                    >
                                        <span className="material-symbols-outlined">link</span>
                                        Copy link
                                    </button>
                                </div>

                                {s.content && s.content.map((para, i) => (
                                    <p key={i}><RichText text={para} query={searchQuery} /></p>
                                ))}

                                {s.infoBox && (
                                    <div className="pp-info-box">
                                        <span className="material-symbols-outlined">info</span>
                                        <span><RichText text={s.infoBox} query={searchQuery} /></span>
                                    </div>
                                )}

                                {s.list && (
                                    <ul>
                                        {s.list.map((item, i) => (
                                            <li key={i}><RichText text={item} query={searchQuery} /></li>
                                        ))}
                                    </ul>
                                )}

                                {s.endContent && (
                                    <p style={{ marginTop: 14, fontStyle: 'italic', color: '#50616b' }}>
                                        <RichText text={s.endContent} query={searchQuery} />
                                    </p>
                                )}
                            </section>
                        );
                    })}

                    {/* Footer Contact Card */}
                    <div className="pp-footer-card">
                        <h2>Need help?</h2>
                        <p>Our support team is ready to assist you with any privacy-related questions.</p>
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                            <a href="mailto:support@panhoccode.com" className="pp-support-link">
                                <span className="material-symbols-outlined" style={{ fontSize: 18 }}>support_agent</span>
                                Contact Support
                            </a>
                            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)', fontFamily: 'Inter, sans-serif' }}>
                                support@panhoccode.com
                            </span>
                        </div>
                    </div>
                </main>
            </div>

            {/* Back to Top Button */}
            <button
                className={`pp-back-to-top ${showBackTop ? '' : 'hidden'}`}
                onClick={handleBackToTop}
                aria-label="Back to Top"
                id="pp-back-to-top"
            >
                <span className="material-symbols-outlined">arrow_upward</span>
            </button>

            {/* Copy Toast */}
            {copyToast && (
                <div className="pp-copy-toast">
                    <span>{copyToast}</span>
                </div>
            )}
        </div>
    );
}
