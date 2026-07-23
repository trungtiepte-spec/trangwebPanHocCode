import React, { useState } from 'react';
import './HelpCenter.css';

const FAQ_ITEMS = [
    {
        id: 1,
        question: 'I cannot start a quiz.',
        answer: 'Ensure you have selected a valid course or subject. If you are experiencing technical difficulties, check your internet connection or refresh the page. Note that if a course has 0 questions, a quiz cannot be generated.'
    },
    {
        id: 2,
        question: 'My quiz score is incorrect.',
        answer: 'Quiz scores are calculated automatically based on the answer key for each question. After finishing an exam, you can click "Review Answers" on the Results page to inspect your submitted answers against the correct answers and explanations.'
    },
    {
        id: 3,
        question: 'I accidentally closed the quiz.',
        answer: 'If you close or leave the exam page during an active quiz, your progress for that session will not be saved automatically unless submitted. You can start a fresh quiz anytime from the Dashboard or My Courses page.'
    },
    {
        id: 4,
        question: 'I cannot log in.',
        answer: 'Please check that your email and password are entered correctly. Ensure caps lock is turned off. If you haven\'t registered an account on this device yet, click "Sign Up" to create one.'
    },
    {
        id: 5,
        question: 'I forgot my password.',
        answer: 'You can reset your password or register a new account on the Login page. As accounts are currently stored locally in your browser, you can also re-register with your email address.'
    },
    {
        id: 6,
        question: 'My custom course disappeared.',
        answer: 'If you deleted a custom course, it is moved to the Recycle Bin and stored for 30 days before permanent removal. Check the "Recycle Bin" tab under My Courses to restore it.'
    },
    {
        id: 7,
        question: 'I deleted a course by mistake.',
        answer: 'Navigate to "My Courses" and click "Recycle Bin". Find your deleted course in the list and click the "Restore" button to bring it back to your active courses.'
    },
    {
        id: 8,
        question: 'My results are not showing.',
        answer: 'Results are saved upon submitting an exam. Make sure you click "Submit Exam" at the end of a quiz. You can view your latest result anytime on the "My Results" page.'
    },
    {
        id: 9,
        question: 'Why can\'t I delete system courses?',
        answer: 'System Courses (such as HTML & CSS, JavaScript, ReactJS, SQL Server, C Programming) are built-in core courses provided by Pan Học Code to ensure standard testing is always available. They cannot be edited or deleted.'
    },
    {
        id: 10,
        question: 'How do I create a custom course?',
        answer: 'Go to "My Courses", click the "Add Course" button at the top, fill in the course title, description, and add your custom questions with 4 options and 1 correct answer, then click "Create Course".'
    }
];

export default function HelpCenter() {
    const [searchTerm, setSearchTerm] = useState('');
    const [openIds, setOpenIds] = useState([1]); // First FAQ open by default

    const toggleAccordion = (id) => {
        setOpenIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const filteredFaqs = FAQ_ITEMS.filter(item =>
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <main className="flex-grow bg-background">
            <div className="hc-container">

                <h1 className="hc-title">Frequently Asked Questions</h1>
                <p className="hc-subtitle">Find answers to common questions about Pan Học Code</p>

                {/* Live Search Bar */}
                <div className="hc-search-wrap">
                    <span className="material-symbols-outlined hc-search-icon">search</span>
                    <input
                        type="text"
                        className="hc-search-input"
                        placeholder="Search Help..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        id="help-search-input"
                    />
                </div>

                {/* FAQ List */}
                <div className="hc-faq-list">
                    {filteredFaqs.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '36px 20px', color: '#50616b', background: '#fff', borderRadius: 12, border: '1.5px dashed #c4c5d5' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 40, color: '#c4c5d5', display: 'block', marginBottom: 8 }}>search_off</span>
                            No matching questions found for "{searchTerm}".
                        </div>
                    ) : (
                        filteredFaqs.map(item => {
                            const isOpen = openIds.includes(item.id);
                            return (
                                <div key={item.id} className={`hc-accordion ${isOpen ? 'open' : ''}`}>
                                    <button
                                        className="hc-accordion-header"
                                        onClick={() => toggleAccordion(item.id)}
                                        aria-expanded={isOpen}
                                    >
                                        <h3 className="hc-accordion-question">{item.question}</h3>
                                        <span className="material-symbols-outlined hc-accordion-icon">
                                            expand_more
                                        </span>
                                    </button>

                                    {isOpen && (
                                        <div className="hc-accordion-content">
                                            {item.answer}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* Contact Info Card */}
                <div className="hc-contact-card">
                    <h2 className="hc-contact-title">Still need help?</h2>
                    <p className="hc-contact-subtitle">Our support team is available to assist you with any questions.</p>

                    <div className="hc-contact-grid">
                        <div className="hc-contact-item">
                            <span className="material-symbols-outlined">mail</span>
                            <span className="hc-contact-label">Email Support</span>
                            <span className="hc-contact-val">support@panhoccode.com</span>
                        </div>
                        <div className="hc-contact-item">
                            <span className="material-symbols-outlined">call</span>
                            <span className="hc-contact-label">Phone Support</span>
                            <span className="hc-contact-val">0123 456 789</span>
                        </div>
                        <div className="hc-contact-item">
                            <span className="material-symbols-outlined">schedule</span>
                            <span className="hc-contact-label">Working Hours</span>
                            <span className="hc-contact-val">Mon - Fri: 8:00 AM - 5:00 PM</span>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
