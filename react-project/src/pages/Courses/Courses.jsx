import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useCourses } from '../../context/CourseContext';
import { useQuiz } from '../../context/QuizContext';
import SakuraBackground from '../../components/SakuraBackground';
import './Courses.css';

// ─── Helpers ──────────────────────────────────────────────────────────────────
function Toast({ message, onDone }) {
    useEffect(() => {
        const t = setTimeout(onDone, 2800);
        return () => clearTimeout(t);
    }, [onDone]);
    return <div className="courses-toast">{message}</div>;
}

function DeleteModal({ count, onConfirm, onCancel }) {
    return (
        <div className="modal-overlay" role="dialog" aria-modal="true">
            <div className="modal-box">
                <span className="modal-icon">🗑️</span>
                <h2 className="modal-title">Delete Course{count > 1 ? 's' : ''}</h2>
                <p className="modal-desc">
                    Are you sure you want to move{' '}
                    <strong>{count} course{count > 1 ? 's' : ''}</strong> to the Recycle Bin?
                    You can restore them within 30 days.
                </p>
                <div className="modal-actions">
                    <button className="btn-modal-cancel" onClick={onCancel}>Cancel</button>
                    <button className="btn-modal-danger" onClick={onConfirm}>Delete</button>
                </div>
            </div>
        </div>
    );
}

// ─── System Course Card ────────────────────────────────────────────────────────
function SystemCourseCard({ course, onStart, onViewQuestions }) {
    const { getCourseStats } = useCourses();
    const stats = getCourseStats(course.id, course.questions || []);

    return (
        <div className="course-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div className="course-card-icon">
                    <span className="material-symbols-outlined">{course.icon}</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
                        <h4 className="course-card-title">{course.name}</h4>
                        <span className="badge badge-system">
                            <span className="material-symbols-outlined" style={{ fontSize: 11 }}>verified</span>
                            System Course
                        </span>
                    </div>
                    <p className="course-card-desc">{course.description}</p>
                </div>
            </div>

            {/* Course Statistics Breakdown */}
            <div className="course-card-meta" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#50616b', fontWeight: 600 }}>
                    <span>Progress: {stats.progressPercent}%</span>
                    <span>{stats.total} Questions</span>
                </div>
                <div style={{ width: '100%', height: 6, background: '#e0e3e5', borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{ width: `${stats.progressPercent}%`, height: '100%', background: '#00288e', borderRadius: 9999, transition: 'width 0.3s ease' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#50616b', paddingTop: 2 }}>
                    <span style={{ color: '#059669', fontWeight: 600 }}>✓ {stats.correct} Correct</span>
                    <span style={{ color: '#ba1a1a', fontWeight: 600 }}>✗ {stats.wrong} Wrong</span>
                    <span style={{ color: '#757684' }}>○ {stats.unanswered} Unanswered</span>
                </div>
            </div>

            <div className="course-card-actions">
                <button className="btn-start-quiz" onClick={() => onStart(course)}>
                    <span className="material-symbols-outlined">play_arrow</span>
                    Start Quiz
                </button>
                <button className="btn-action btn-secondary-action" style={{ padding: '8px 12px', fontSize: 12 }} onClick={() => onViewQuestions(course.id)}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>visibility</span>
                    View Questions
                </button>
            </div>
        </div>
    );
}

// ─── Custom Course Card ────────────────────────────────────────────────────────
function CustomCourseCard({ course, selected, onToggle, onStart, onViewQuestions, onEdit, onDelete }) {
    const { getCourseStats } = useCourses();
    const stats = getCourseStats(course.id, course.questions || []);

    return (
        <div className={`course-card ${selected ? 'selected' : ''}`}>
            <input
                type="checkbox"
                className="course-card-checkbox"
                checked={selected}
                onChange={() => onToggle(course.id)}
                aria-label={`Select ${course.name}`}
                onClick={e => e.stopPropagation()}
            />
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div className="course-card-icon" style={{ background: '#d3e5f1' }}>
                    <span className="material-symbols-outlined">menu_book</span>
                </div>
                <div style={{ flex: 1, minWidth: 0, paddingRight: 24 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', marginBottom: 2 }}>
                        <h4 className="course-card-title">{course.name}</h4>
                        <span className="badge badge-custom">
                            <span className="material-symbols-outlined" style={{ fontSize: 11 }}>person</span>
                            Custom Course
                        </span>
                    </div>
                    <p className="course-card-desc">{course.description || 'No description'}</p>
                </div>
            </div>

            {/* Course Statistics Breakdown */}
            <div className="course-card-meta" style={{ flexDirection: 'column', alignItems: 'stretch', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#50616b', fontWeight: 600 }}>
                    <span>Progress: {stats.progressPercent}%</span>
                    <span>{stats.total} Questions</span>
                </div>
                <div style={{ width: '100%', height: 6, background: '#e0e3e5', borderRadius: 9999, overflow: 'hidden' }}>
                    <div style={{ width: `${stats.progressPercent}%`, height: '100%', background: '#00288e', borderRadius: 9999, transition: 'width 0.3s ease' }}></div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#50616b', paddingTop: 2 }}>
                    <span style={{ color: '#059669', fontWeight: 600 }}>✓ {stats.correct} Correct</span>
                    <span style={{ color: '#ba1a1a', fontWeight: 600 }}>✗ {stats.wrong} Wrong</span>
                    <span style={{ color: '#757684' }}>○ {stats.unanswered} Unanswered</span>
                </div>
            </div>

            <div className="course-card-actions">
                <button className="btn-start-quiz" onClick={() => onStart(course)}>
                    <span className="material-symbols-outlined">play_arrow</span>
                    Start Quiz
                </button>
                <button className="btn-action btn-secondary-action" style={{ padding: '8px 12px', fontSize: 12 }} onClick={() => onViewQuestions(course.id)}>
                    <span className="material-symbols-outlined" style={{ fontSize: 16 }}>visibility</span>
                    View Questions
                </button>
                <button className="btn-icon btn-icon-edit" title="Edit" onClick={() => onEdit(course.id)}>
                    <span className="material-symbols-outlined">edit</span>
                </button>
                <button className="btn-icon btn-icon-delete" title="Delete" onClick={() => onDelete([course.id])}>
                    <span className="material-symbols-outlined">delete</span>
                </button>
            </div>
        </div>
    );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function Courses() {
    const navigate = useNavigate();
    const location = useLocation();
    const { systemCourses, customCourses, softDeleteCourses } = useCourses();
    const { startQuiz, resetQuiz } = useQuiz();

    const [selected, setSelected] = useState([]);
    const [deleteTarget, setDeleteTarget] = useState(null); // array of ids to delete
    const [toast, setToast] = useState('');
    const [warning, setWarning] = useState('');

    // Show toast from navigation state (e.g. after course create/edit)
    useEffect(() => {
        if (location.state?.toast) {
            setToast(location.state.toast);
            // Clear state so toast doesn't reappear on back-navigation
            window.history.replaceState({}, '');
        }
    }, [location.state]);

    const showToast = (msg) => { setToast(msg); };

    const handleStart = useCallback((course) => {
        if (!course?.questions?.length) return;
        resetQuiz();
        const shuffled = [...course.questions].sort(() => 0.5 - Math.random());
        const selected15 = shuffled.slice(0, Math.min(15, shuffled.length));
        startQuiz(course.name, selected15, course.id);
        navigate('/exam');
    }, [resetQuiz, startQuiz, navigate]);

    const handleViewQuestions = useCallback((courseId) => {
        navigate(`/courses/${courseId}/questions`);
    }, [navigate]);

    const toggleSelect = (id) => {
        setSelected(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleDeleteSelected = () => {
        if (selected.length === 0) {
            setWarning('Please select at least one custom course.');
            setTimeout(() => setWarning(''), 3000);
            return;
        }
        setDeleteTarget(selected);
    };

    const handleDeleteSingle = (ids) => {
        setDeleteTarget(ids);
    };

    const confirmDelete = () => {
        softDeleteCourses(deleteTarget);
        setSelected(prev => prev.filter(id => !deleteTarget.includes(id)));
        setDeleteTarget(null);
        showToast(`${deleteTarget.length} course${deleteTarget.length > 1 ? 's' : ''} moved to Recycle Bin.`);
    };

    return (
        <>
            <SakuraBackground intensity="low" />
            <main className="flex-grow">
                {/* ── Hero Banner ──────────────────────────────────────────── */}
                <section style={{ background: 'linear-gradient(135deg, #F9A8D4 0%, #EC4899 100%)', padding: '40px 0' }}>
                    <div className="max-w-container-max mx-auto px-lg">
                        <div style={{ display: 'flex', items: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                            <div style={{ color: '#fff' }}>
                                <h1 className="font-headline-lg text-headline-lg" style={{ margin: '0 0 6px', color: '#fff' }}>My Courses</h1>
                                <p className="font-body-md text-body-md" style={{ opacity: 0.85, margin: 0 }}>
                                    Manage your system and custom quiz courses.
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                                <span style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 14px', color: '#fff', fontSize: 13, fontWeight: 600 }}>
                                    {systemCourses.length + customCourses.length} Total Courses
                                </span>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="max-w-container-max mx-auto px-lg py-xxl">

                    {/* ── Action Bar ───────────────────────────────────────── */}
                    <div className="courses-action-bar">
                        <button className="btn-action btn-primary-action" onClick={() => navigate('/courses/new')}>
                            <span className="material-symbols-outlined">add</span>
                            Add Course
                        </button>
                        <button className="btn-action btn-danger-action" onClick={handleDeleteSelected}>
                            <span className="material-symbols-outlined">delete_sweep</span>
                            Delete Selected
                            {selected.length > 0 && <span style={{ background: '#ba1a1a', color: '#fff', borderRadius: '9999px', padding: '0 6px', fontSize: 11 }}>{selected.length}</span>}
                        </button>
                        <Link to="/courses/trash" className="btn-action btn-secondary-action" style={{ textDecoration: 'none' }}>
                            <span className="material-symbols-outlined">recycling</span>
                            Recycle Bin
                        </Link>
                    </div>

                    {/* ── Warning ───────────────────────────────────────────── */}
                    {warning && (
                        <div className="courses-warning">
                            <span className="material-symbols-outlined">warning</span>
                            {warning}
                        </div>
                    )}

                    {/* ── SECTION: System Courses ───────────────────────────── */}
                    <div style={{ marginBottom: 40 }}>
                        <div className="courses-section-heading">
                            <span className="material-symbols-outlined" style={{ color: '#EC4899', fontSize: 22 }}>verified</span>
                            <h3>System Courses</h3>
                            <span className="courses-section-count">{systemCourses.length}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                            {systemCourses.map(course => (
                                <SystemCourseCard
                                    key={course.id}
                                    course={course}
                                    onStart={handleStart}
                                    onViewQuestions={handleViewQuestions}
                                />
                            ))}
                        </div>
                    </div>

                    {/* ── SECTION: Custom Courses ───────────────────────────── */}
                    <div>
                        <div className="courses-section-heading">
                            <span className="material-symbols-outlined" style={{ color: '#50616b', fontSize: 22 }}>person</span>
                            <h3>Custom Courses</h3>
                            <span className="courses-section-count">{customCourses.length}</span>
                        </div>

                        {customCourses.length === 0 ? (
                            <div className="courses-empty">
                                <span className="material-symbols-outlined">menu_book</span>
                                <h4>No Custom Courses Yet</h4>
                                <p>Create your first custom course using the <strong>Add Course</strong> button above.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
                                {customCourses.map(course => (
                                    <CustomCourseCard
                                        key={course.id}
                                        course={course}
                                        selected={selected.includes(course.id)}
                                        onToggle={toggleSelect}
                                        onStart={handleStart}
                                        onViewQuestions={handleViewQuestions}
                                        onEdit={(id) => navigate(`/courses/${id}/edit`)}
                                        onDelete={handleDeleteSingle}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                </section>
            </main>

            {/* ── Delete Confirmation Modal ─────────────────────────────────── */}
            {deleteTarget && (
                <DeleteModal
                    count={deleteTarget.length}
                    onConfirm={confirmDelete}
                    onCancel={() => setDeleteTarget(null)}
                />
            )}

            {/* ── Toast ────────────────────────────────────────────────────── */}
            {toast && <Toast message={toast} onDone={() => setToast('')} />}
        </>
    );
}
