import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCourses } from '../../context/CourseContext';
import { useQuiz } from '../../context/QuizContext';
import './Courses.css';

function Toast({ message, onDone }) {
    useEffect(() => {
        const t = setTimeout(onDone, 2800);
        return () => clearTimeout(t);
    }, [onDone]);
    return <div className="courses-toast">{message}</div>;
}

function QuestionDetailModal({ question, qIndex, statusObj, onClose }) {
    if (!question) return null;
    const { status, attempts, lastAnswer, lastAttempt } = statusObj;

    const optionLabels = ['A', 'B', 'C', 'D'];

    return (
        <div className="modal-overlay" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="modal-box" style={{ maxWidth: 640 }} onClick={e => e.stopPropagation()}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                        <span className="font-label-md" style={{ color: '#00288e', fontWeight: 700 }}>
                            Question #{qIndex + 1}
                        </span>
                        <div style={{ display: 'flex', gap: 8, marginTop: 4, alignItems: 'center' }}>
                            {status === 'correct' && (
                                <span className="badge" style={{ background: '#d1fae5', color: '#059669' }}>
                                    ✓ Correct
                                </span>
                            )}
                            {status === 'wrong' && (
                                <span className="badge" style={{ background: '#ffdad6', color: '#ba1a1a' }}>
                                    ✗ Wrong
                                </span>
                            )}
                            {status === 'unanswered' && (
                                <span className="badge" style={{ background: '#e0e3e5', color: '#50616b' }}>
                                    ○ Unanswered
                                </span>
                            )}
                            <span style={{ fontSize: 12, color: '#50616b', fontFamily: 'Inter, sans-serif' }}>
                                Attempts: {attempts}
                            </span>
                        </div>
                    </div>
                    <button className="btn-icon" onClick={onClose} aria-label="Close modal">
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <h3 className="font-headline-sm" style={{ fontSize: 18, marginBottom: 20, color: '#0d1c2e' }}>
                    {question.question}
                </h3>

                {/* Options List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
                    {question.options.map((opt, idx) => {
                        const isCorrectOpt = idx === question.answer;
                        const isUserAnswer = lastAnswer === idx;

                        let borderStyle = '1.5px solid #c4c5d5';
                        let bgStyle = '#f8f9ff';
                        let badgeText = null;
                        let badgeBg = '#e0e3e5';
                        let badgeColor = '#323537';

                        if (isCorrectOpt) {
                            borderStyle = '2px solid #059669';
                            bgStyle = '#ecfdf5';
                            badgeText = 'Correct Answer';
                            badgeBg = '#d1fae5';
                            badgeColor = '#065f46';
                        }
                        if (isUserAnswer && !isCorrectOpt) {
                            borderStyle = '2px solid #ba1a1a';
                            bgStyle = '#fef2f2';
                            badgeText = 'Your Last Answer';
                            badgeBg = '#ffdad6';
                            badgeColor = '#93000a';
                        } else if (isUserAnswer && isCorrectOpt) {
                            badgeText = 'Your Answer (Correct)';
                        }

                        return (
                            <div
                                key={idx}
                                style={{
                                    border: borderStyle,
                                    background: bgStyle,
                                    borderRadius: 10,
                                    padding: '12px 16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 12
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                    <span style={{ fontWeight: 700, fontSize: 13, color: '#00288e', width: 20 }}>
                                        {optionLabels[idx]}.
                                    </span>
                                    <span style={{ fontSize: 14, color: '#0d1c2e', fontFamily: 'Inter, sans-serif' }}>
                                        {opt}
                                    </span>
                                </div>
                                {badgeText && (
                                    <span className="badge" style={{ background: badgeBg, color: badgeColor }}>
                                        {badgeText}
                                    </span>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Explanation */}
                {question.explanation && (
                    <div style={{ background: '#eff4ff', border: '1px solid #c4c5d5', borderRadius: 10, padding: 14, marginBottom: 16 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, fontSize: 13, color: '#00288e', marginBottom: 4 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>lightbulb</span>
                            Explanation
                        </div>
                        <p style={{ fontSize: 13, color: '#0d1c2e', margin: 0, lineHeight: 1.5, fontFamily: 'Inter, sans-serif' }}>
                            {question.explanation}
                        </p>
                    </div>
                )}

                {/* Last Attempt Info */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#50616b', paddingTop: 12, borderTop: '1px solid #e6eeff' }}>
                    <span>
                        Last Attempt Date: {lastAttempt ? new Date(lastAttempt).toLocaleString() : 'Never attempted'}
                    </span>
                    <button className="btn-modal-cancel" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function CourseQuestions() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { getCourseById, getCourseStats, getQuestionStatus } = useCourses();
    const { startQuiz, resetQuiz } = useQuiz();

    const course = getCourseById(courseId);
    const [selectedQuestion, setSelectedQuestion] = useState(null);
    const [selectedQIndex, setSelectedQIndex] = useState(0);
    const [toast, setToast] = useState('');
    const [searchTerm, setSearchTerm] = useState('');

    if (!course) {
        return (
            <main className="flex-grow max-w-container-max mx-auto px-lg py-xxl text-center">
                <h2>Course not found</h2>
                <button className="btn-action btn-primary-action" onClick={() => navigate('/courses')} style={{ marginTop: 16 }}>
                    Back to Courses
                </button>
            </main>
        );
    }

    const stats = getCourseStats(course.id, course.questions || []);

    const handlePractice = (mode) => {
        const allQ = course.questions || [];
        let pool = [];

        if (mode === 'wrong') {
            pool = allQ.filter(q => getQuestionStatus(course.id, q.id).status === 'wrong');
            if (pool.length === 0) {
                setToast('No wrong questions to practice!');
                return;
            }
        } else if (mode === 'unanswered') {
            pool = allQ.filter(q => getQuestionStatus(course.id, q.id).status === 'unanswered');
            if (pool.length === 0) {
                setToast('No unanswered questions to practice!');
                return;
            }
        } else if (mode === 'wrong_unanswered') {
            pool = allQ.filter(q => {
                const st = getQuestionStatus(course.id, q.id).status;
                return st === 'wrong' || st === 'unanswered';
            });
            if (pool.length === 0) {
                setToast('No wrong or unanswered questions to practice!');
                return;
            }
        } else if (mode === 'all') {
            pool = [...allQ];
            if (pool.length === 0) {
                setToast('No questions available in this course!');
                return;
            }
        }

        const randomized = [...pool].sort(() => 0.5 - Math.random());
        const selected = mode === 'all' && randomized.length > 15 ? randomized.slice(0, 15) : randomized;

        resetQuiz();
        startQuiz(course.name, selected, course.id);
        navigate('/exam');
    };

    const filteredQuestions = (course.questions || []).filter(q => 
        q.question.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <main className="flex-grow bg-background">
                {/* Header Banner */}
                <section style={{ background: 'linear-gradient(135deg, #1e40af 0%, #00288e 100%)', padding: '36px 0', color: '#fff' }}>
                    <div className="max-w-container-max mx-auto px-lg">
                        <Link to="/courses" style={{ color: '#ffffff', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600, marginBottom: 12 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>arrow_back</span>
                            Back to My Courses
                        </Link>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                                    <h1 className="font-headline-lg text-headline-lg" style={{ margin: 0, color: '#fff' }}>{course.name}</h1>
                                    <span className={`badge ${course.type === 'system' ? 'badge-system' : 'badge-custom'}`}>
                                        {course.type === 'system' ? 'System Course' : 'Custom Course'}
                                    </span>
                                </div>
                                <p style={{ margin: 0, opacity: 0.9, fontSize: 14 }}>{course.description || 'Question Bank & Review'}</p>
                            </div>

                            {/* Progress Ring / Percentage */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: 20, background: 'rgba(255,255,255,0.12)', padding: '12px 20px', borderRadius: 12, backdropFilter: 'blur(4px)' }}>
                                <div style={{ textAlign: 'center' }}>
                                    <span style={{ display: 'block', fontSize: 24, fontWeight: 800 }}>{stats.progressPercent}%</span>
                                    <span style={{ fontSize: 11, textTransform: 'uppercase', opacity: 0.8, letterSpacing: '0.05em' }}>Progress</span>
                                </div>
                                <div style={{ height: 32, width: 1, background: 'rgba(255,255,255,0.25)' }}></div>
                                <div style={{ display: 'flex', gap: 16, fontSize: 13 }}>
                                    <div><span style={{ fontWeight: 700 }}>{stats.total}</span> Total</div>
                                    <div><span style={{ fontWeight: 700, color: '#86efac' }}>{stats.correct}</span> Correct</div>
                                    <div><span style={{ fontWeight: 700, color: '#fca5a5' }}>{stats.wrong}</span> Wrong</div>
                                    <div><span style={{ fontWeight: 700, opacity: 0.8 }}>{stats.unanswered}</span> Unanswered</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-container-max mx-auto px-lg py-xxl">
                    {/* Practice Action Bar */}
                    <div style={{ marginBottom: 32 }}>
                        <h3 className="font-headline-sm" style={{ fontSize: 16, marginBottom: 12, color: '#0d1c2e' }}>Practice Sessions</h3>
                        <div className="courses-action-bar" style={{ marginBottom: 0 }}>
                            <button className="btn-action btn-danger-action" onClick={() => handlePractice('wrong')}>
                                <span className="material-symbols-outlined">cancel</span>
                                Practice Wrong ({stats.wrong})
                            </button>
                            <button className="btn-action btn-secondary-action" onClick={() => handlePractice('unanswered')}>
                                <span className="material-symbols-outlined">help_outline</span>
                                Practice Unanswered ({stats.unanswered})
                            </button>
                            <button className="btn-action btn-primary-action" onClick={() => handlePractice('wrong_unanswered')}>
                                <span className="material-symbols-outlined">checklist</span>
                                Practice Wrong + Unanswered ({stats.wrong + stats.unanswered})
                            </button>
                            <button className="btn-action btn-secondary-action" onClick={() => handlePractice('all')}>
                                <span className="material-symbols-outlined">shuffle</span>
                                Practice All ({stats.total})
                            </button>
                        </div>
                    </div>

                    {/* Question List Header + Search */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
                        <div className="courses-section-heading" style={{ marginBottom: 0, borderBottom: 'none' }}>
                            <h3>Question Bank</h3>
                            <span className="courses-section-count">{filteredQuestions.length}</span>
                        </div>
                        <div style={{ position: 'relative', width: 280 }}>
                            <input
                                type="text"
                                className="cf-input"
                                placeholder="Search questions..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                style={{ paddingLeft: 36 }}
                            />
                            <span className="material-symbols-outlined" style={{ position: 'absolute', left: 10, top: 10, fontSize: 18, color: '#50616b' }}>
                                search
                            </span>
                        </div>
                    </div>

                    {/* Questions Grid */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {filteredQuestions.map((q, idx) => {
                            const statusObj = getQuestionStatus(course.id, q.id);
                            const { status } = statusObj;

                            return (
                                <div
                                    key={q.id || idx}
                                    className="course-card"
                                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 260 }}>
                                        <span style={{ fontWeight: 700, fontSize: 14, color: '#00288e', background: '#eff4ff', padding: '6px 12px', borderRadius: 8, flexShrink: 0 }}>
                                            #{idx + 1}
                                        </span>
                                        <p style={{ margin: 0, fontWeight: 600, fontSize: 15, color: '#0d1c2e', fontFamily: 'Inter, sans-serif' }}>
                                            {q.question}
                                        </p>
                                    </div>

                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        {status === 'correct' && (
                                            <span className="badge" style={{ background: '#d1fae5', color: '#059669', padding: '6px 12px', fontSize: 12 }}>
                                                ✓ Correct
                                            </span>
                                        )}
                                        {status === 'wrong' && (
                                            <span className="badge" style={{ background: '#ffdad6', color: '#ba1a1a', padding: '6px 12px', fontSize: 12 }}>
                                                ✗ Wrong
                                            </span>
                                        )}
                                        {status === 'unanswered' && (
                                            <span className="badge" style={{ background: '#e0e3e5', color: '#50616b', padding: '6px 12px', fontSize: 12 }}>
                                                ○ Unanswered
                                            </span>
                                        )}

                                        <button
                                            className="btn-action btn-secondary-action"
                                            style={{ padding: '6px 14px', fontSize: 13 }}
                                            onClick={() => {
                                                setSelectedQuestion(q);
                                                setSelectedQIndex(idx);
                                            }}
                                        >
                                            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>visibility</span>
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>
            </main>

            {/* Question Detail Modal */}
            {selectedQuestion && (
                <QuestionDetailModal
                    question={selectedQuestion}
                    qIndex={selectedQIndex}
                    statusObj={getQuestionStatus(course.id, selectedQuestion.id)}
                    onClose={() => setSelectedQuestion(null)}
                />
            )}

            {toast && <Toast message={toast} onDone={() => setToast('')} />}
        </>
    );
}
