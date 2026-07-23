import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCourses } from '../../context/CourseContext';
import { useQuiz } from '../../context/QuizContext';
import SakuraBackground from '../../components/SakuraBackground';
import './Home.css';

export default function Home() {
    const navigate = useNavigate();
    const { systemCourses } = useCourses();
    const { startQuiz, resetQuiz } = useQuiz();
    const [showSubjectModal, setShowSubjectModal] = useState(false);

    const handleStartSubject = (course) => {
        if (!course || !course.questions || course.questions.length === 0) return;
        resetQuiz();
        const shuffled = [...course.questions].sort(() => 0.5 - Math.random());
        const selected15 = shuffled.slice(0, Math.min(15, shuffled.length));
        startQuiz(course.name, selected15, course.id);
        navigate('/exam');
    };

    return (
        <>
            <SakuraBackground intensity="medium" />
            <main className="flex-grow">
                <section className="max-w-container-max mx-auto px-lg py-xxl">
                    {/* Hero Banner */}
                    <div className="relative overflow-hidden rounded-xl bg-primary-container p-xl mb-xxl flex flex-col md:flex-row items-center justify-between">
                        <div className="relative z-10 text-on-primary">
                            <h2 className="font-headline-lg text-headline-lg mb-sm">Ready for your exam?</h2>
                            <p className="font-body-lg text-body-lg opacity-90 max-w-xl">Choose your subject below to begin your assessment. Ensure you have a stable connection and a quiet environment.</p>
                        </div>
                        <div className="relative z-10 mt-lg md:mt-0 flex flex-col items-center gap-sm">
                            <div className="bg-white/10 backdrop-blur-md rounded-lg p-lg border border-white/20">
                                <div className="text-center">
                                    <span className="block font-label-sm text-label-sm uppercase tracking-widest mb-xs">Active Student</span>
                                    <span className="font-headline-sm text-headline-sm">Alex Johnson</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section Header */}
                    <div className="mb-lg flex items-center justify-between">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface">Select Subject</h3>
                        <span className="font-label-md text-label-md text-on-surface-variant">{systemCourses.length} Subjects Available</span>
                    </div>

                    {/* Subject Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter" id="subject-grid">
                        {systemCourses.map(course => (
                            <div
                                key={course.id}
                                onClick={() => handleStartSubject(course)}
                                className="group cursor-pointer bg-white border border-outline-variant rounded-xl p-lg transition-all duration-200 hover:border-primary flex flex-col gap-md relative"
                                style={{ boxShadow: "0px 4px 20px rgba(30, 64, 175, 0.05)" }}
                            >
                                <div className="w-12 h-12 rounded-lg bg-surface-container-low flex items-center justify-center text-primary">
                                    <span className="material-symbols-outlined text-3xl">{course.icon}</span>
                                </div>
                                <div>
                                    <h4 className="font-headline-sm text-headline-sm mb-xs">{course.name}</h4>
                                    <p className="font-label-sm text-label-sm text-on-surface-variant">{course.description}</p>
                                </div>
                                <div className="mt-auto flex flex-col gap-xs border-t border-outline-variant pt-md">
                                    <div className="flex justify-between items-center text-on-surface-variant">
                                        <span className="font-label-md text-label-md flex items-center gap-xs">
                                            <span className="material-symbols-outlined text-md">quiz</span> {course.questions?.length || 0} Questions
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleStartSubject(course);
                                    }}
                                    className="mt-sm bg-primary text-on-primary py-xs px-md rounded-lg font-label-md text-label-md hover:bg-primary-container transition-all flex items-center justify-center gap-xs"
                                >
                                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>play_arrow</span>
                                    Start Quiz
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Start Exam Main Action */}
                    <div className="mt-xxl flex flex-col items-center gap-md">
                        <button
                            onClick={() => setShowSubjectModal(true)}
                            className="bg-primary text-on-primary px-xxl py-md rounded-lg font-headline-sm transition-all duration-300 shadow-lg active:scale-95 inline-block text-center hover:bg-primary-container hover:shadow-xl"
                            id="start-exam-btn"
                        >
                            Start Exam
                        </button>
                        <p className="font-label-sm text-label-sm text-on-surface-variant max-w-md text-center">
                            By clicking "Start Exam", you agree to the examination code of conduct and monitoring protocols.
                        </p>
                    </div>
                </section>

                <section className="bg-surface-container-low py-xxl">
                    <div className="max-w-container-max mx-auto px-lg grid grid-cols-1 md:grid-cols-3 gap-xl">
                        <div className="flex items-start gap-md">
                            <div className="bg-white p-sm rounded-lg shadow-sm">
                                <span className="material-symbols-outlined text-primary">lock</span>
                            </div>
                            <div>
                                <h5 className="font-label-md text-label-md text-on-surface">Secure Session</h5>
                                <p className="font-label-sm text-label-sm text-on-surface-variant">Fully encrypted examination environment with anti-cheat measures.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-md">
                            <div className="bg-white p-sm rounded-lg shadow-sm">
                                <span className="material-symbols-outlined text-primary">save</span>
                            </div>
                            <div>
                                <h5 className="font-label-md text-label-md text-on-surface">Auto-Save</h5>
                                <p className="font-label-sm text-label-sm text-on-surface-variant">Your progress is automatically saved every 30 seconds.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-md">
                            <div className="bg-white p-sm rounded-lg shadow-sm">
                                <span className="material-symbols-outlined text-primary">support_agent</span>
                            </div>
                            <div>
                                <h5 className="font-label-md text-label-md text-on-surface">Instant Support</h5>
                                <p className="font-label-sm text-label-sm text-on-surface-variant">Proctors are available via live chat for technical difficulties.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Subject Selection Modal */}
            {showSubjectModal && (
                <div className="modal-overlay" role="dialog" aria-modal="true" onClick={() => setShowSubjectModal(false)}>
                    <div className="modal-box" style={{ maxWidth: 480 }} onClick={e => e.stopPropagation()}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                            <h2 className="font-headline-sm" style={{ fontSize: 20, margin: 0, color: '#0d1c2e' }}>
                                Choose a Subject
                            </h2>
                            <button className="btn-icon" onClick={() => setShowSubjectModal(false)} aria-label="Close modal">
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {systemCourses.map(course => (
                                <div
                                    key={course.id}
                                    onClick={() => {
                                        setShowSubjectModal(false);
                                        handleStartSubject(course);
                                    }}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px 16px',
                                        border: '1.5px solid #c4c5d5',
                                        borderRadius: 12,
                                        background: '#fff',
                                        cursor: 'pointer',
                                        transition: 'all 0.15s'
                                    }}
                                    className="hover:border-primary hover:bg-surface-container-low"
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                                        <div className="w-10 h-10 rounded-lg bg-surface-container-low flex items-center justify-center text-primary" style={{ flexShrink: 0 }}>
                                            <span className="material-symbols-outlined text-2xl">{course.icon}</span>
                                        </div>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: 15, fontWeight: 700, color: '#0d1c2e', fontFamily: 'Inter, sans-serif' }}>
                                                {course.name}
                                            </h4>
                                            <span style={{ fontSize: 12, color: '#50616b', fontFamily: 'Inter, sans-serif' }}>
                                                {course.questions?.length || 0} Questions
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        className="btn-start-quiz"
                                        style={{ padding: '6px 16px', fontSize: 13, flex: 'none', width: 'auto' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setShowSubjectModal(false);
                                            handleStartSubject(course);
                                        }}
                                    >
                                        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>play_arrow</span>
                                        Start
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
