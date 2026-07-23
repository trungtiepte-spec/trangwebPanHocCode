import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuiz } from '../../context/QuizContext';
import './Review.css';

export default function Review() {
    const navigate = useNavigate();
    const { subject, questions, answers, timeTaken, score } = useQuiz();

    if (!subject || !questions || questions.length === 0) return null;

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `00:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const accuracy = Math.round((score.correct / questions.length) * 100) || 0;

    return (
        <>
            <main className="max-w-[1280px] mx-auto px-gutter py-xl flex flex-col md:flex-row gap-lg">
                <aside className="w-full md:w-1/4 space-y-md">
                    <button onClick={() => navigate('/courses')} className="flex items-center gap-sm text-primary font-label-md text-label-md hover:translate-x-[-4px] transition-transform duration-200 group" >
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span>Back to Courses</span>
                    </button>
                    <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl custom-shadow">
                        <h3 className="font-headline-sm text-headline-sm text-primary mb-md">Summary</h3>
                        <div className="space-y-md">
                            <div className="flex justify-between items-center">
                                <span className="font-body-md text-body-md text-secondary">Correct</span>
                                <span className="px-sm py-xs bg-green-100 text-green-700 rounded-full font-label-sm text-label-sm">{score.correct} / {questions.length}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="font-body-md text-body-md text-secondary">Accuracy</span>
                                <span className="font-headline-sm text-headline-sm text-on-surface">{accuracy}%</span>
                            </div>
                            <div className="w-full bg-secondary-container h-2 rounded-full overflow-hidden">
                                <div className="bg-primary h-full transition-all" style={{width: `${accuracy}%`}}></div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl custom-shadow hidden md:block">
                        <h4 className="font-label-md text-label-md text-on-surface mb-md">Question Map</h4>
                        <div className="grid grid-cols-5 gap-xs">
                            {questions.map((q, idx) => {
                                const isCorrect = answers[q.id] === q.answer;
                                return (
                                    <button key={q.id} className={`w-8 h-8 rounded flex items-center justify-center font-label-sm text-label-sm border ${isCorrect ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </aside>
                <section className="flex-1 space-y-lg">
                    <header className="mb-xl">
                        <h1 className="font-headline-lg text-headline-lg text-on-surface">Detailed Question Review</h1>
                        <p className="font-body-md text-body-md text-secondary mt-xs">{subject} Final Examination - Session A</p>
                    </header>
                    
                    {questions.map((q, idx) => {
                        const isCorrect = answers[q.id] === q.answer;
                        return (
                            <div key={q.id} className={`bg-surface-container-lowest border border-outline-variant rounded-xl custom-shadow overflow-hidden transition-all ${isCorrect ? 'correct-border hover:border-primary' : 'incorrect-border hover:border-error'}`}>
                                <div className="p-lg">
                                    <div className="flex justify-between items-start mb-md">
                                        <span className="font-label-md text-label-md text-primary bg-primary-fixed px-sm py-xs rounded">Question {idx + 1}</span>
                                        <div className={`flex items-center gap-xs ${isCorrect ? 'text-green-600' : 'text-error'}`}>
                                            <span className="material-symbols-outlined">{isCorrect ? 'check_circle' : 'cancel'}</span>
                                            <span className="font-label-md text-label-md">{isCorrect ? 'Correct' : 'Incorrect'}</span>
                                        </div>
                                    </div>
                                    <p className="font-body-lg text-body-lg text-on-surface mb-lg">{q.question}</p>
                                    <div className="space-y-sm">
                                        {q.options.map((opt, optIdx) => {
                                            const isSelected = answers[q.id] === optIdx;
                                            const isActualAnswer = q.answer === optIdx;
                                            const letter = String.fromCharCode(65 + optIdx);
                                            
                                            let borderClass = 'border-outline-variant bg-surface-bright';
                                            let circleClass = 'border border-outline';
                                            let textClass = '';
                                            let icon = null;
                                            
                                            if (isActualAnswer) {
                                                borderClass = 'border-green-500 bg-green-50';
                                                circleClass = 'bg-green-500 text-white';
                                                textClass = 'text-green-900 flex-1';
                                                icon = <span className="material-symbols-outlined text-green-600 ml-sm" style={{fontVariationSettings:"'FILL' 1"}}>check_circle</span>;
                                            } else if (isSelected && !isActualAnswer) {
                                                borderClass = 'border-error bg-error-container/20';
                                                circleClass = 'bg-error text-white';
                                                textClass = 'text-error flex-1';
                                                icon = <span className="font-label-sm text-label-sm uppercase tracking-wider text-error font-bold">Your Choice</span>;
                                            }
                                            
                                            return (
                                                <div key={optIdx} className={`flex items-center p-md rounded-lg border ${borderClass}`}>
                                                    <span className={`w-6 h-6 rounded-full flex items-center justify-center mr-md font-label-sm text-label-sm ${circleClass}`}>{letter}</span>
                                                    <span className={`font-body-md text-body-md ${textClass}`}>{opt}</span>
                                                    {icon}
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className="mt-lg pt-lg border-t border-outline-variant">
                                        <details className="group">
                                            <summary className="list-none flex items-center justify-between cursor-pointer text-primary font-label-md text-label-md">
                                                <span className="flex items-center gap-sm">
                                                    <span className="material-symbols-outlined">info</span>
                                                    View Explanation
                                                </span>
                                                <span className="material-symbols-outlined group-open:rotate-180 transition-transform">expand_more</span>
                                            </summary>
                                            <div className="mt-md p-md bg-surface-container-low rounded-lg text-secondary font-body-md text-body-md">
                                                {q.explanation}
                                            </div>
                                        </details>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    
                    <div className="flex flex-col sm:flex-row justify-between items-center pt-xl border-t border-outline-variant gap-md">
                        <button onClick={() => window.scrollTo(0, 0)} className="px-lg py-md border border-outline-variant text-secondary rounded-lg font-label-md text-label-md hover:bg-surface-container-low transition-colors w-full sm:w-auto text-center">
                            Back to Top
                        </button>
                        <button onClick={() => navigate('/')} className="px-lg py-md bg-primary text-white rounded-lg font-label-md text-label-md hover:bg-primary-container transition-colors w-full sm:w-auto inline-block text-center">
                            Dashboard
                        </button>
                    </div>
                </section>
            </main>
        </>
    );
}
