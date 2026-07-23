import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useQuiz } from '../../context/QuizContext';
import './Result.css';

export default function Result() {
    const navigate = useNavigate();
    const { subject: contextSubject, questions: contextQuestions, score: contextScore, timeTaken: contextTimeTaken } = useQuiz();
    
    let subject = contextSubject;
    let questions = contextQuestions;
    let score = contextScore;
    let timeTaken = contextTimeTaken;

    if (!subject) {
        try {
            const saved = localStorage.getItem('quizResult');
            if (saved) {
                const parsed = JSON.parse(saved);
                if (parsed && parsed.subject && parsed.score) {
                    subject = parsed.subject;
                    questions = parsed.questions || [];
                    score = parsed.score;
                    timeTaken = parsed.timeTaken || 0;
                }
            }
        } catch (e) {
            console.error('Failed to parse quizResult from localStorage', e);
        }
    }

    const hasResult = !!(subject && score && questions?.length);

    const percent = hasResult ? Math.round((score.correct / questions.length) * 100) || 0 : 0;
    const offset = 264 - (264 * (percent / 100));
    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };
    return (
        <>
{hasResult ? (
<main className="flex-grow w-full max-w-container-max mx-auto px-lg py-xxl">
{/**/}
<section className="mb-xxl text-center">
<div className="relative inline-block mb-lg">
{/**/}
<svg className="w-48 h-48 md:w-64 md:h-64" viewBox="0 0 100 100">
<circle className="text-secondary-container stroke-current" cx="50" cy="50" fill="transparent" r="42" strokeWidth="8"></circle>
<circle className="text-primary stroke-current progress-ring__circle" cx="50" cy="50" fill="transparent" r="42" strokeLinecap="round" strokeWidth="8" style={{"strokeDasharray":"264",strokeDashoffset: offset}}></circle>
<text alignmentBaseline="central" className="text-on-surface" fill="currentColor" fontFamily="Inter" fontSize="20" fontWeight="700" textAnchor="middle" x="50" y="50">{percent}%</text>
</svg>
<div className="absolute -top-4 -right-4 bg-primary text-on-primary p-md rounded-full shadow-lg animate-pulse-soft">
<span className="material-symbols-outlined text-headline-md" style={{"fontVariationSettings":"\"FILL\" 1"}}>emoji_events</span>
</div>
</div>
<h1 className="font-headline-lg text-headline-lg md:text-headline-lg mb-sm text-on-surface">Exam Completed!</h1>
<p className="font-body-lg text-body-lg text-secondary max-w-2xl mx-auto">Outstanding effort! You've successfully completed the <span className="font-bold text-primary">{subject} Final</span>. Your results have been recorded.</p>
</section>
{/**/}
<div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-xxl">
{/**/}
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center text-center shadow-sm hover:border-primary transition-colors">
<span className="material-symbols-outlined text-primary mb-sm text-headline-md">assessment</span>
<span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-xs">Total Score</span>
<span className="font-headline-md text-headline-md text-on-surface">{score.total}/{questions.length * 10}</span>
</div>
{/**/}
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center text-center shadow-sm hover:border-primary transition-colors">
<span className="material-symbols-outlined text-[#059669] mb-sm text-headline-md">check_circle</span>
<span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-xs">Correct</span>
<span className="font-headline-md text-headline-md text-on-surface">{score.correct}</span>
</div>
{/**/}
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center text-center shadow-sm hover:border-primary transition-colors">
<span className="material-symbols-outlined text-error mb-sm text-headline-md">cancel</span>
<span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-xs">Incorrect</span>
<span className="font-headline-md text-headline-md text-on-surface">{score.incorrect}</span>
</div>
{/**/}
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col items-center justify-center text-center shadow-sm hover:border-primary transition-colors">
<span className="material-symbols-outlined text-secondary mb-sm text-headline-md">schedule</span>
<span className="font-label-sm text-label-sm text-secondary uppercase tracking-wider mb-xs">Time Taken</span>
<span className="font-headline-md text-headline-md text-on-surface">{formatTime(timeTaken)}</span>
</div>
</div>
{/**/}
<div className="flex flex-col md:flex-row gap-lg justify-center items-center">
<button onClick={() => navigate('/exam')} className="w-full md:w-auto min-w-[200px] py-md px-xl bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-sm">
<span className="material-symbols-outlined">refresh</span>
                Restart Exam
            </button>
<button onClick={() => navigate('/review')} className="w-full md:w-auto min-w-[200px] py-md px-xl bg-secondary-container text-primary font-label-md text-label-md rounded-lg shadow-sm border border-outline-variant hover:bg-surface-container-high active:scale-95 transition-all flex items-center justify-center gap-sm">
<span className="material-symbols-outlined">visibility</span>
                Review Answers
            </button>
<button className="w-full md:w-auto min-w-[200px] py-md px-xl bg-surface-container-lowest text-secondary font-label-md text-label-md rounded-lg border border-outline hover:border-primary transition-all flex items-center justify-center gap-sm">
<span className="material-symbols-outlined">share</span>
                Download Certificate
            </button>
</div>
{/**/}
<section className="mt-xxl grid grid-cols-1 lg:grid-cols-3 gap-gutter">
<div className="lg:col-span-2 bg-surface-container-low rounded-xl p-xl border border-outline-variant relative overflow-hidden">
<div className="relative z-10">
<h3 className="font-headline-sm text-headline-sm mb-md text-primary">Performance Insight</h3>
<p className="font-body-md text-body-md text-on-surface-variant mb-lg">You performed 15% better than the average student on this assessment. Your strongest area was <span className="font-bold">Electromagnetic Theory</span>, while you might benefit from reviewing <span className="font-bold">Particle Dynamics</span>.</p>
<div className="w-full bg-secondary-container h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full w-[85%] rounded-full"></div>
</div>
<div className="flex justify-between mt-sm">
<span className="font-label-sm text-label-sm text-secondary">Class Average: 70%</span>
<span className="font-label-sm text-label-sm text-primary font-bold">Your Score: 85%</span>
</div>
</div>
{/**/}
<div className="absolute -bottom-10 -right-10 opacity-10">
<span className="material-symbols-outlined text-[120px]">insights</span>
</div>
</div>
<div className="bg-white rounded-xl p-lg border border-outline-variant shadow-sm">
<h3 className="font-label-md text-label-md font-bold mb-md text-on-surface">Upcoming Exams</h3>
<ul className="space-y-md">
<li className="flex items-center gap-md p-sm hover:bg-surface-container rounded-lg transition-colors cursor-pointer">
<div className="bg-secondary-container p-sm rounded-lg">
<span className="material-symbols-outlined text-primary">science</span>
</div>
<div>
<p className="font-label-md text-label-md text-on-surface">Chemistry 101</p>
<p className="font-label-sm text-label-sm text-secondary">Oct 24, 2024</p>
</div>
</li>
<li className="flex items-center gap-md p-sm hover:bg-surface-container rounded-lg transition-colors cursor-pointer">
<div className="bg-secondary-container p-sm rounded-lg">
<span className="material-symbols-outlined text-primary">functions</span>
</div>
<div>
<p className="font-label-md text-label-md text-on-surface">Calculus II</p>
<p className="font-label-sm text-label-sm text-secondary">Oct 28, 2024</p>
</div>
</li>
</ul>
</div>
</section>
</main>
) : (
<main className="flex-grow w-full max-w-container-max mx-auto px-lg py-xxl flex flex-col items-center justify-center text-center">
<div className="bg-surface-container-lowest rounded-xl p-xl border border-outline-variant max-w-md w-full shadow-sm mx-auto my-xxl">
<span className="material-symbols-outlined text-6xl text-on-surface-variant mb-md">history</span>
<h2 className="font-headline-md text-headline-md text-on-surface mb-sm">No Quiz Results Yet</h2>
<p className="font-body-md text-body-md text-secondary mb-lg">You haven't completed any quizzes yet.<br/>Start your first quiz to see your results here.</p>
<button onClick={() => navigate('/courses')} className="py-md px-xl bg-primary text-on-primary font-label-md text-label-md rounded-lg shadow-md hover:opacity-90 active:scale-95 transition-all w-full">
Start Quiz
</button>
</div>
</main>
)}
        </>
    );
}
