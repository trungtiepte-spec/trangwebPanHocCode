import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useCourses } from '../../context/CourseContext';
import './CourseForm.css';

// ─── Blank question template ──────────────────────────────────────────────────
const blankQuestion = () => ({
    _key: Date.now() + Math.random(),
    question: '',
    options: ['', '', '', ''],
    answer: 0,
    explanation: '',
});

// ─── Validate ─────────────────────────────────────────────────────────────────
function validateForm(name, questions) {
    const errors = {};
    if (!name.trim()) errors.name = 'Course name is required.';
    if (questions.length === 0) errors.questions = 'At least one question is required.';
    questions.forEach((q, qi) => {
        if (!q.question.trim()) errors[`q${qi}_question`] = 'Question text is required.';
        q.options.forEach((opt, oi) => {
            if (!opt.trim()) errors[`q${qi}_opt${oi}`] = `Option ${String.fromCharCode(65 + oi)} is required.`;
        });
    });
    return errors;
}

export default function CourseForm() {
    const navigate = useNavigate();
    const { id } = useParams();
    const isEdit = Boolean(id);
    const { addCourse, updateCourse, getCourseById } = useCourses();

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([blankQuestion()]);
    const [errors, setErrors] = useState({});
    const [globalError, setGlobalError] = useState('');
    const [saving, setSaving] = useState(false);

    // Load course data when editing
    useEffect(() => {
        if (isEdit) {
            const course = getCourseById(id);
            if (!course) { navigate('/courses'); return; }
            if (course.type === 'system') { navigate('/courses'); return; } // guard
            setName(course.name || '');
            setDescription(course.description || '');
            setQuestions(
                (course.questions || []).map(q => ({
                    _key: q.id || Math.random(),
                    question: q.question || '',
                    options: Array.isArray(q.options) && q.options.length === 4
                        ? q.options
                        : ['', '', '', ''],
                    answer: typeof q.answer === 'number' ? q.answer : 0,
                    explanation: q.explanation || '',
                }))
            );
        }
    }, [id, isEdit, getCourseById, navigate]);

    // ── Question helpers ──────────────────────────────────────────────────────
    const addQuestion = () => {
        setQuestions(prev => [...prev, blankQuestion()]);
    };

    const removeQuestion = (idx) => {
        if (questions.length === 1) return; // keep at least one
        setQuestions(prev => prev.filter((_, i) => i !== idx));
    };

    const updateQuestion = (idx, field, value) => {
        setQuestions(prev => prev.map((q, i) =>
            i === idx ? { ...q, [field]: value } : q
        ));
        // Clear field error on edit
        setErrors(prev => {
            const next = { ...prev };
            delete next[`q${idx}_${field}`];
            return next;
        });
    };

    const updateOption = (qi, oi, value) => {
        setQuestions(prev => prev.map((q, i) => {
            if (i !== qi) return q;
            const opts = [...q.options];
            opts[oi] = value;
            return { ...q, options: opts };
        }));
        setErrors(prev => {
            const next = { ...prev };
            delete next[`q${qi}_opt${oi}`];
            return next;
        });
    };

    // ── Submit ────────────────────────────────────────────────────────────────
    const handleSubmit = (e) => {
        e.preventDefault();
        const errs = validateForm(name, questions);
        if (Object.keys(errs).length > 0) {
            setErrors(errs);
            setGlobalError('Please fix the errors below before saving.');
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }
        setGlobalError('');
        setSaving(true);

        // Build questions with sequential numeric IDs for quiz compatibility
        const builtQuestions = questions.map((q, idx) => ({
            id: idx + 1,
            question: q.question.trim(),
            options: q.options.map(o => o.trim()),
            answer: q.answer,
            explanation: q.explanation.trim(),
        }));

        setTimeout(() => {
            if (isEdit) {
                updateCourse(id, { name: name.trim(), description: description.trim(), questions: builtQuestions });
                navigate('/courses', { state: { toast: 'Course updated successfully.' } });
            } else {
                addCourse({ name: name.trim(), description: description.trim(), questions: builtQuestions });
                navigate('/courses', { state: { toast: 'Course created successfully.' } });
            }
        }, 300);
    };

    const OPTION_LABELS = ['A', 'B', 'C', 'D'];

    return (
        <main className="flex-grow bg-background">
            <div className="cf-page">
                {/* ── Header ──────────────────────────────────────────── */}
                <div className="cf-header">
                    <Link to="/courses" className="cf-back">
                        <span className="material-symbols-outlined">arrow_back</span>
                        Back
                    </Link>
                    <h1 className="cf-title">{isEdit ? 'Edit Course' : 'Add New Course'}</h1>
                </div>

                <form onSubmit={handleSubmit} noValidate>
                    {/* ── Global Error ─────────────────────────────────── */}
                    {globalError && (
                        <div className="cf-global-error">
                            <span className="material-symbols-outlined">error</span>
                            {globalError}
                        </div>
                    )}

                    {/* ── Course Info Card ────────────────────────────── */}
                    <div className="cf-card">
                        <h2 className="cf-card-title">
                            <span className="material-symbols-outlined">info</span>
                            Course Information
                        </h2>

                        <div className="cf-field">
                            <label className="cf-label" htmlFor="cf-name">Course Name *</label>
                            <input
                                id="cf-name"
                                className={`cf-input ${errors.name ? 'error' : ''}`}
                                value={name}
                                onChange={e => { setName(e.target.value); setErrors(p => ({ ...p, name: '' })); }}
                                placeholder="e.g. Advanced JavaScript"
                                maxLength={80}
                            />
                            {errors.name && <span className="cf-error">{errors.name}</span>}
                        </div>

                        <div className="cf-field">
                            <label className="cf-label" htmlFor="cf-desc">Description</label>
                            <textarea
                                id="cf-desc"
                                className="cf-textarea"
                                value={description}
                                onChange={e => setDescription(e.target.value)}
                                placeholder="Brief description of this course..."
                                maxLength={300}
                            />
                        </div>
                    </div>

                    {/* ── Questions Card ──────────────────────────────── */}
                    <div className="cf-card">
                        <h2 className="cf-card-title">
                            <span className="material-symbols-outlined">quiz</span>
                            Questions
                            <span style={{ marginLeft: 'auto', fontSize: 12, fontWeight: 600, color: '#50616b' }}>
                                {questions.length} question{questions.length !== 1 ? 's' : ''}
                            </span>
                        </h2>

                        {errors.questions && (
                            <div className="cf-global-error" style={{ marginBottom: 12 }}>
                                <span className="material-symbols-outlined">error</span>
                                {errors.questions}
                            </div>
                        )}

                        {questions.map((q, qi) => (
                            <div key={q._key} className="cf-question-block">
                                <div className="cf-question-header">
                                    <span className="cf-question-num">Question {qi + 1}</span>
                                    <button
                                        type="button"
                                        className="cf-remove-btn"
                                        onClick={() => removeQuestion(qi)}
                                        disabled={questions.length === 1}
                                        title={questions.length === 1 ? 'At least one question required' : 'Remove question'}
                                    >
                                        <span className="material-symbols-outlined">remove</span>
                                        Remove
                                    </button>
                                </div>

                                {/* Question text */}
                                <div className="cf-field">
                                    <label className="cf-label">Question *</label>
                                    <textarea
                                        className={`cf-textarea ${errors[`q${qi}_question`] ? 'error' : ''}`}
                                        value={q.question}
                                        onChange={e => updateQuestion(qi, 'question', e.target.value)}
                                        placeholder="Enter question text..."
                                        style={{ minHeight: 56 }}
                                    />
                                    {errors[`q${qi}_question`] && <span className="cf-error">{errors[`q${qi}_question`]}</span>}
                                </div>

                                {/* Options */}
                                <div className="cf-options-grid">
                                    {q.options.map((opt, oi) => (
                                        <div key={oi} className="cf-field" style={{ marginBottom: 0 }}>
                                            <label className="cf-label">Option {OPTION_LABELS[oi]} *</label>
                                            <div className="cf-option-wrap">
                                                <input
                                                    type="radio"
                                                    name={`correct_${qi}`}
                                                    checked={q.answer === oi}
                                                    onChange={() => updateQuestion(qi, 'answer', oi)}
                                                    title="Mark as correct answer"
                                                    style={{ accentColor: '#00288e', flexShrink: 0 }}
                                                />
                                                <input
                                                    className={`cf-input ${errors[`q${qi}_opt${oi}`] ? 'error' : ''}`}
                                                    value={opt}
                                                    onChange={e => updateOption(qi, oi, e.target.value)}
                                                    placeholder={`Option ${OPTION_LABELS[oi]}`}
                                                    style={{ margin: 0 }}
                                                />
                                            </div>
                                            {errors[`q${qi}_opt${oi}`] && <span className="cf-error">{errors[`q${qi}_opt${oi}`]}</span>}
                                        </div>
                                    ))}
                                </div>

                                {/* Correct Answer indicator */}
                                <div style={{ margin: '10px 0 4px', fontSize: 12, color: '#059669', fontWeight: 600, fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: 15 }}>check_circle</span>
                                    Correct Answer: Option {OPTION_LABELS[q.answer]} (use the radio button to change)
                                </div>

                                {/* Explanation */}
                                <div className="cf-field" style={{ marginTop: 10, marginBottom: 0 }}>
                                    <label className="cf-label">Explanation (optional)</label>
                                    <textarea
                                        className="cf-textarea"
                                        value={q.explanation}
                                        onChange={e => updateQuestion(qi, 'explanation', e.target.value)}
                                        placeholder="Explain why the correct answer is correct..."
                                        style={{ minHeight: 50 }}
                                    />
                                </div>
                            </div>
                        ))}

                        <button type="button" className="cf-add-q-btn" onClick={addQuestion}>
                            <span className="material-symbols-outlined">add</span>
                            Add Question
                        </button>
                    </div>

                    {/* ── Form Actions ─────────────────────────────────── */}
                    <div className="cf-form-actions">
                        <button type="button" className="cf-btn-cancel" onClick={() => navigate('/courses')}>
                            Cancel
                        </button>
                        <button type="submit" className="cf-btn-save" disabled={saving}>
                            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Course'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
}
