import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './TermsOfService.css';

const LAST_UPDATED = 'July 21, 2026';
const TOS_ACCEPTED_KEY = 'panhoccode_tos_accepted';

export function isTosAccepted() {
    try { return !!localStorage.getItem(TOS_ACCEPTED_KEY); } catch { return false; }
}

const SECTIONS = [
    {
        id: 'acceptance',
        num: '01',
        title: 'Acceptance of Terms',
        content: [
            'By accessing or using Pan Học Code, you agree to be bound by these Terms of Service. If you do not agree to all terms and conditions, you may not access or use the application.',
            'These Terms apply to all visitors, users, and others who access or use Pan Học Code.',
        ],
    },
    {
        id: 'responsibilities',
        num: '02',
        title: 'User Responsibilities',
        content: ['As a user of Pan Học Code, you agree to:'],
        list: [
            'Provide accurate and truthful information when registering an account.',
            'Keep your login credentials confidential and not share them with others.',
            'Use the platform only for its intended educational purpose.',
            'Not attempt to circumvent, disable, or otherwise interfere with any security feature.',
            'Notify us immediately if you believe your account has been compromised.',
        ],
    },
    {
        id: 'quiz-rules',
        num: '03',
        title: 'Quiz Rules',
        content: ['When participating in quizzes on Pan Học Code, you agree to:'],
        list: [
            'Complete quizzes honestly without assistance from unauthorized sources.',
            'Not manipulate the application\'s client-side storage to falsify quiz results.',
            'Not share quiz questions or answers obtained through the platform in a manner that undermines educational integrity.',
            'Accept that all quiz scores are calculated automatically and cannot be manually overridden.',
        ],
        infoBox: 'Quiz history is stored locally in your browser only and is never transmitted to external servers.',
    },
    {
        id: 'course-guidelines',
        num: '04',
        title: 'Custom Course Guidelines',
        content: ['When creating custom courses on Pan Học Code, you agree that:'],
        list: [
            'You own or have the right to use all content you upload, including questions, answers, and descriptions.',
            'You will not create courses containing illegal, offensive, defamatory, or inappropriate content.',
            'System Courses (HTML & CSS, JavaScript, ReactJS, SQL Server, C Programming) are read-only and cannot be modified or deleted.',
            'Custom courses deleted by you are moved to the Recycle Bin and automatically purged after 30 days.',
            'We reserve the right to remove any user-created content that violates these guidelines.',
        ],
    },
    {
        id: 'intellectual-property',
        num: '05',
        title: 'Intellectual Property',
        content: [
            'All content included in Pan Học Code — including but not limited to text, question banks, source code, design, logos, and graphics — is the intellectual property of Pan Học Code or its content suppliers and is protected by applicable laws.',
            'Users retain ownership of any custom courses they create. By creating courses on this platform, you grant Pan Học Code a non-exclusive, royalty-free license to display and use that content to operate the service.',
            'You may not copy, reproduce, or redistribute any part of Pan Học Code\'s proprietary content without explicit written permission.',
        ],
    },
    {
        id: 'prohibited',
        num: '06',
        title: 'Prohibited Activities',
        content: ['The following activities are strictly prohibited on Pan Học Code:'],
        list: [
            'Using automated bots, scripts, or tools to scrape, extract, or manipulate application data.',
            'Attempting to gain unauthorized access to other users\' accounts.',
            'Uploading malware, viruses, or any other malicious code.',
            'Using the platform for any unlawful purpose or in violation of any applicable law.',
            'Reverse engineering or attempting to extract source code from the application.',
            'Creating fake accounts or impersonating another person or entity.',
            'Interfering with or disrupting the integrity or performance of the application.',
        ],
    },
    {
        id: 'suspension',
        num: '07',
        title: 'Account Suspension',
        content: [
            'We reserve the right to suspend, disable, or terminate your access to Pan Học Code at our sole discretion, without notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or third parties.',
            'Since account data is stored locally in your browser, termination of your access may involve blocking access via application-level controls.',
            'You may terminate your own account at any time by clearing your browser\'s localStorage data associated with Pan Học Code.',
        ],
    },
    {
        id: 'disclaimer',
        num: '08',
        title: 'Disclaimer',
        content: [
            'Pan Học Code is provided on an "AS IS" and "AS AVAILABLE" basis without any warranty of any kind, either express or implied.',
            'We do not warrant that the application will be uninterrupted, error-free, or free of viruses or other harmful components.',
            'The question banks and course content provided are intended for educational purposes only and may not reflect the most current information in rapidly evolving fields.',
        ],
        infoBox: 'Quiz scores and grades generated by this platform are for self-assessment purposes only and do not constitute official academic certification.',
    },
    {
        id: 'liability',
        num: '09',
        title: 'Limitation of Liability',
        content: [
            'To the fullest extent permitted by applicable law, Pan Học Code shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of — or inability to access or use — the application.',
            'This includes, but is not limited to, loss of data, loss of quiz history, or any other intangible losses.',
            'In no event shall our total liability to you exceed the amount you paid us (if any) in the past 12 months.',
        ],
    },
    {
        id: 'changes',
        num: '10',
        title: 'Changes to Terms',
        content: [
            `These Terms of Service were last updated on ${LAST_UPDATED}. We reserve the right to modify these terms at any time.`,
            'When we make significant changes, we will update the "Last Updated" date. Continued use of Pan Học Code after changes are posted constitutes your acceptance of the revised terms.',
            'It is your responsibility to review these Terms periodically for any updates.',
        ],
    },
    {
        id: 'contact',
        num: '11',
        title: 'Contact Information',
        content: ['If you have any questions about these Terms of Service, please contact us:'],
        list: [
            '**Email**: support@panhoccode.com',
            '**Phone**: 0123 456 789',
            '**Working Hours**: Monday – Friday, 8:00 AM – 5:00 PM',
        ],
    },
];

function highlight(text, q) {
    if (!q || !q.trim()) return text;
    const esc = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${esc})`, 'gi'));
    return parts.map((p, i) =>
        p.toLowerCase() === q.toLowerCase()
            ? <mark key={i} className="tos-highlight">{p}</mark>
            : p
    );
}

function RichText({ text, query }) {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return (
        <>
            {parts.map((part, i) =>
                i % 2 === 1
                    ? <strong key={i}>{highlight(part, query)}</strong>
                    : <span key={i}>{highlight(part, query)}</span>
            )}
        </>
    );
}

function sectionMatches(s, q) {
    if (!q || !q.trim()) return true;
    const ql = q.toLowerCase();
    return [s.title, ...(s.content || []), ...(s.list || []), s.infoBox || '']
        .join(' ').toLowerCase().includes(ql);
}

export default function TermsOfService() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openIds, setOpenIds] = useState(() => SECTIONS.map(s => s.id));
    const [activeId, setActiveId] = useState('');
    const [showBackTop, setShowBackTop] = useState(false);
    const [toast, setToast] = useState('');
    const [accepted, setAccepted] = useState(() => isTosAccepted());
    const sectionRefs = useRef({});

    // Scroll spy
    useEffect(() => {
        const onScroll = () => {
            setShowBackTop(window.scrollY > 300);
            const scrollPos = window.scrollY + 150;
            let cur = '';
            SECTIONS.forEach(s => {
                const el = sectionRefs.current[s.id];
                if (el && el.offsetTop <= scrollPos) cur = s.id;
            });
            setActiveId(cur);
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const toggleSection = (id) =>
        setOpenIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

    const scrollTo = (id) => {
        sectionRefs.current[id]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        if (!openIds.includes(id)) setOpenIds(prev => [...prev, id]);
    };

    const copyLink = (id) => {
        const url = `${window.location.origin}/terms#${id}`;
        navigator.clipboard.writeText(url).then(() => {
            setToast('Link copied!');
            setTimeout(() => setToast(''), 2200);
        }).catch(() => {
            setToast('Could not copy.');
            setTimeout(() => setToast(''), 2200);
        });
    };

    const handleAccept = (e) => {
        const checked = e.target.checked;
        setAccepted(checked);
        if (checked) {
            localStorage.setItem(TOS_ACCEPTED_KEY, new Date().toISOString());
        } else {
            localStorage.removeItem(TOS_ACCEPTED_KEY);
        }
    };

    const filtered = SECTIONS.filter(s => sectionMatches(s, searchQuery));

    return (
        <div className="tos-page">
            {/* Hero */}
            <div className="tos-hero">
                <h1>Terms of Service</h1>
                <p>Please read these terms carefully before using Pan Học Code.</p>
                <span className="tos-badge">
                    <span className="material-symbols-outlined" style={{ fontSize: 15 }}>event</span>
                    Last Updated: {LAST_UPDATED}
                </span>
            </div>

            {/* Toolbar */}
            <div className="tos-toolbar">
                <div className="tos-search-wrap">
                    <span className="material-symbols-outlined tos-search-icon">search</span>
                    <input
                        type="text"
                        className="tos-search-input"
                        placeholder="Search terms..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        id="tos-search"
                    />
                </div>
                <div className="tos-toolbar-actions">
                    <button className="tos-btn" onClick={() => setOpenIds(SECTIONS.map(s => s.id))}>
                        <span className="material-symbols-outlined">unfold_more</span>
                        Expand All
                    </button>
                    <button className="tos-btn" onClick={() => setOpenIds([])}>
                        <span className="material-symbols-outlined">unfold_less</span>
                        Collapse All
                    </button>
                    <button className="tos-btn" onClick={() => window.print()} id="tos-print-btn">
                        <span className="material-symbols-outlined">print</span>
                        Print
                    </button>
                    <button className="tos-btn" onClick={() => { const t = document.title; document.title = 'Pan Học Code - Terms of Service'; window.print(); document.title = t; }} id="tos-pdf-btn">
                        <span className="material-symbols-outlined">download</span>
                        PDF
                    </button>
                </div>
            </div>

            {/* Body */}
            <div className="tos-body">
                {/* ToC */}
                <aside className="tos-toc">
                    <div className="tos-toc-header">Table of Contents</div>
                    <ul className="tos-toc-list">
                        {SECTIONS.map(s => (
                            <li key={s.id}>
                                <div
                                    className={`tos-toc-link ${activeId === s.id ? 'active' : ''}`}
                                    onClick={() => scrollTo(s.id)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={e => e.key === 'Enter' && scrollTo(s.id)}
                                    style={!filtered.find(f => f.id === s.id) && searchQuery ? { opacity: 0.35 } : {}}
                                >
                                    <span className="tos-toc-num">{s.num}</span>
                                    {s.title}
                                </div>
                            </li>
                        ))}
                    </ul>
                </aside>

                {/* Content */}
                <main className="tos-content">
                    {searchQuery && filtered.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#50616b', background: '#fff', borderRadius: 14, border: '1.5px dashed #c4c5d5', marginBottom: 14 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#c4c5d5', display: 'block', marginBottom: 8 }}>search_off</span>
                            No sections matched "{searchQuery}".
                        </div>
                    )}

                    {SECTIONS.map(s => {
                        const isOpen = openIds.includes(s.id);
                        const isMatch = sectionMatches(s, searchQuery);
                        return (
                            <div
                                key={s.id}
                                id={s.id}
                                ref={el => (sectionRefs.current[s.id] = el)}
                                className={`tos-section ${isOpen ? 'open' : ''}`}
                                style={!isMatch && searchQuery ? { opacity: 0.3 } : {}}
                            >
                                <button className="tos-section-header" onClick={() => toggleSection(s.id)}>
                                    <div className="tos-section-left">
                                        <span className="tos-section-num">{s.num}</span>
                                        <h2 className="tos-section-title">
                                            {highlight(s.title, searchQuery)}
                                        </h2>
                                    </div>
                                    <div className="tos-section-right">
                                        <button
                                            className="tos-copy-btn"
                                            onClick={e => { e.stopPropagation(); copyLink(s.id); }}
                                            title={`Copy link to "${s.title}"`}
                                        >
                                            <span className="material-symbols-outlined">link</span>
                                            Copy link
                                        </button>
                                        <span className="material-symbols-outlined tos-chevron">expand_more</span>
                                    </div>
                                </button>

                                {isOpen && (
                                    <div className="tos-section-body">
                                        {s.content?.map((p, i) => (
                                            <p key={i}><RichText text={p} query={searchQuery} /></p>
                                        ))}
                                        {s.infoBox && (
                                            <div className="tos-info-box">
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
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {/* Acceptance Block */}
                    <div className="tos-acceptance">
                        <h3>Agreement</h3>
                        <p>
                            By checking the box below, you confirm that you have read, understood, and agree to all of the Terms of Service above.
                            Your acceptance is saved in your browser.
                        </p>
                        <label className="tos-check-label">
                            <input
                                type="checkbox"
                                checked={accepted}
                                onChange={handleAccept}
                                id="tos-accept-checkbox"
                            />
                            I have read and agree to the Terms of Service.
                        </label>
                        <div className={`tos-acceptance-status ${accepted ? 'accepted' : ''}`}>
                            {accepted ? (
                                <>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>check_circle</span>
                                    You accepted these Terms of Service. Thank you!
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)' }}>radio_button_unchecked</span>
                                    Not yet accepted.
                                </>
                            )}
                        </div>
                    </div>

                    {/* Footer link */}
                    <div style={{ textAlign: 'center', padding: '20px 0 8px' }}>
                        <p style={{ fontSize: 13, color: '#50616b', fontFamily: 'Inter, sans-serif', marginBottom: 8 }}>
                            Have questions about these terms?
                        </p>
                        <a href="mailto:support@panhoccode.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#00288e', fontWeight: 700, fontFamily: 'Inter, sans-serif', fontSize: 14 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>mail</span>
                            support@panhoccode.com
                        </a>
                    </div>
                </main>
            </div>

            {/* Back to Top */}
            <button
                className={`tos-back-top ${showBackTop ? '' : 'hidden'}`}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                aria-label="Back to Top"
                id="tos-back-top"
            >
                <span className="material-symbols-outlined">arrow_upward</span>
            </button>

            {/* Toast */}
            {toast && <div className="tos-toast">{toast}</div>}
        </div>
    );
}
