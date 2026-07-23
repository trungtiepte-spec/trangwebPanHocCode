import React, { createContext, useContext, useState, useEffect } from 'react';

import htmlCssData from '../data/html_css.json';
import jsData from '../data/javascript.json';
import reactData from '../data/reactjs.json';
import sqlData from '../data/sql_server.json';
import cData from '../data/c_programming.json';

// ─── Constants ───────────────────────────────────────────────────────────────
const CUSTOM_KEY   = 'examcore_custom_courses';
const DELETED_KEY  = 'examcore_deleted_courses';
const PROGRESS_KEY = 'questionProgress';
const TRASH_DAYS   = 30;

// ─── System Courses ───────────────────────────────────────────────────────────
export const SYSTEM_COURSES = [
    { id: 'sys_html_css',      name: 'HTML & CSS',      description: 'Web Structure & Styling',      icon: 'language',                questions: htmlCssData, type: 'system' },
    { id: 'sys_js',            name: 'JavaScript',      description: 'Dynamic Programming',          icon: 'data_object',             questions: jsData,      type: 'system' },
    { id: 'sys_react',         name: 'ReactJS',         description: 'Modern UI Engineering',        icon: 'integration_instructions', questions: reactData,   type: 'system' },
    { id: 'sys_sql',           name: 'SQL Server',      description: 'Database Management',          icon: 'database',                questions: sqlData,     type: 'system' },
    { id: 'sys_c',             name: 'C Programming',   description: 'System Fundamentals',          icon: 'terminal',                questions: cData,       type: 'system' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const loadJson = (key) => {
    try {
        const raw = localStorage.getItem(key);
        return raw ? JSON.parse(raw) : (key === PROGRESS_KEY ? {} : []);
    } catch { return key === PROGRESS_KEY ? {} : []; }
};

const saveJson = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
};

const daysRemaining = (deletedAt) => {
    const elapsed = (Date.now() - deletedAt) / (1000 * 60 * 60 * 24);
    return Math.max(0, Math.ceil(TRASH_DAYS - elapsed));
};

// ─── Context ──────────────────────────────────────────────────────────────────
const CourseContext = createContext();

export function CourseProvider({ children }) {
    const [customCourses, setCustomCourses]   = useState(() => loadJson(CUSTOM_KEY));
    const [deletedCourses, setDeletedCourses] = useState(() => {
        const all = loadJson(DELETED_KEY);
        return Array.isArray(all) ? all.filter(c => daysRemaining(c.deletedAt) > 0) : [];
    });
    const [questionProgress, setQuestionProgress] = useState(() => loadJson(PROGRESS_KEY));

    // Persist to localStorage whenever state changes
    useEffect(() => { saveJson(CUSTOM_KEY,  customCourses);  }, [customCourses]);
    useEffect(() => { saveJson(DELETED_KEY, deletedCourses); }, [deletedCourses]);
    useEffect(() => { saveJson(PROGRESS_KEY, questionProgress); }, [questionProgress]);

    // ── CRUD ──────────────────────────────────────────────────────────────────

    /** Add a new custom course */
    const addCourse = (courseData) => {
        const newCourse = {
            ...courseData,
            id: `custom_${Date.now()}`,
            type: 'custom',
            createdAt: Date.now(),
        };
        setCustomCourses(prev => [...prev, newCourse]);
        return newCourse;
    };

    /** Update an existing custom course */
    const updateCourse = (id, updates) => {
        setCustomCourses(prev =>
            prev.map(c => c.id === id ? { ...c, ...updates, updatedAt: Date.now() } : c)
        );
    };

    /** Move custom courses to Recycle Bin */
    const softDeleteCourses = (ids) => {
        const toDelete = customCourses
            .filter(c => ids.includes(c.id))
            .map(c => ({ ...c, deletedAt: Date.now() }));
        setDeletedCourses(prev => [...prev, ...toDelete]);
        setCustomCourses(prev => prev.filter(c => !ids.includes(c.id)));
    };

    /** Restore courses from Recycle Bin */
    const restoreCourses = (ids) => {
        const toRestore = deletedCourses
            .filter(c => ids.includes(c.id))
            .map(({ deletedAt, ...rest }) => rest);
        setCustomCourses(prev => [...prev, ...toRestore]);
        setDeletedCourses(prev => prev.filter(c => !ids.includes(c.id)));
    };

    /** Permanently delete from Recycle Bin */
    const permanentDeleteCourses = (ids) => {
        setDeletedCourses(prev => prev.filter(c => !ids.includes(c.id)));
    };

    /** Empty entire Recycle Bin */
    const emptyTrash = () => setDeletedCourses([]);

    /** Get a single course by id (checks both system + custom) */
    const getCourseById = (id) => {
        return SYSTEM_COURSES.find(c => c.id === id)
            || customCourses.find(c => c.id === id)
            || null;
    };

    /** Find course by subject name */
    const getCourseByName = (name) => {
        return SYSTEM_COURSES.find(c => c.name.toLowerCase() === (name || '').toLowerCase())
            || customCourses.find(c => c.name.toLowerCase() === (name || '').toLowerCase())
            || null;
    };

    // ── Question Progress & Stats ─────────────────────────────────────────────

    /** Get progress object for a course */
    const getQuestionProgress = (courseId) => {
        return questionProgress[courseId] || {};
    };

    /** Get status of a single question */
    const getQuestionStatus = (courseId, questionId) => {
        const courseProg = questionProgress[courseId] || {};
        const qProg = courseProg[questionId];
        return {
            status: qProg?.status || 'unanswered',
            attempts: qProg?.attempts || 0,
            lastAnswer: qProg?.lastAnswer ?? null,
            lastAttempt: qProg?.lastAttempt || null,
        };
    };

    /** Calculate statistics for a course */
    const getCourseStats = (courseId, questions = []) => {
        const total = questions.length;
        let correct = 0;
        let wrong = 0;
        const courseProg = questionProgress[courseId] || {};
        questions.forEach(q => {
            const st = courseProg[q.id]?.status;
            if (st === 'correct') correct++;
            else if (st === 'wrong') wrong++;
        });
        const unanswered = Math.max(0, total - correct - wrong);
        const progressPercent = total > 0 ? Math.round((correct / total) * 100) : 0;
        return { total, correct, wrong, unanswered, progressPercent };
    };

    /** Update progress of questions after quiz submission */
    const updateQuestionProgress = (courseId, quizQuestions = [], userAnswers = {}) => {
        if (!courseId) return;
        setQuestionProgress(prev => {
            const courseProg = { ...(prev[courseId] || {}) };
            quizQuestions.forEach(q => {
                const uAns = userAnswers[q.id];
                if (uAns !== undefined && uAns !== null) {
                    const existing = courseProg[q.id] || {};
                    const isCorrect = uAns === q.answer;
                    courseProg[q.id] = {
                        status: isCorrect ? 'correct' : 'wrong',
                        attempts: (existing.attempts || 0) + 1,
                        lastAnswer: uAns,
                        lastAttempt: new Date().toISOString(),
                    };
                }
            });
            const next = { ...prev, [courseId]: courseProg };
            saveJson(PROGRESS_KEY, next);
            return next;
        });
    };

    return (
        <CourseContext.Provider value={{
            systemCourses: SYSTEM_COURSES,
            customCourses,
            deletedCourses,
            questionProgress,
            addCourse,
            updateCourse,
            softDeleteCourses,
            restoreCourses,
            permanentDeleteCourses,
            emptyTrash,
            getCourseById,
            getCourseByName,
            daysRemaining,
            getQuestionProgress,
            getQuestionStatus,
            getCourseStats,
            updateQuestionProgress,
        }}>
            {children}
        </CourseContext.Provider>
    );
}

export function useCourses() {
    return useContext(CourseContext);
}
