import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuiz } from '../../context/QuizContext';
import './Exam.css';

export default function Exam() {
    const navigate = useNavigate();
    const { subject, questions, answers, setAnswer, submitQuiz } = useQuiz();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(45 * 60); // 45 minutes
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        if (!subject || !questions || questions.length === 0) {
            navigate('/courses');
        }
    }, [subject, questions, navigate]);

    const handleSubmit = () => {
        const timeSpent = (45 * 60) - timeLeft;
        submitQuiz(timeSpent);
        navigate('/result');
    };

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, [handleSubmit]);

    if (!subject || !questions || questions.length === 0) return null;

    const currentQuestion = questions[currentIndex];
    
    const handleNext = () => {
        if (currentIndex < questions.length - 1) setCurrentIndex(currentIndex + 1);
    };

    const handlePrev = () => {
        if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
    };

    const formatTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const answeredCount = Object.keys(answers).length;
    const progressPercent = ((currentIndex + 1) / questions.length) * 100;

    return (
        <div className="bg-background text-on-surface min-h-screen flex flex-col">
            <header className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-outline-variant shadow-sm transition-all duration-200">
                <div className="flex justify-between items-center w-full px-lg py-md max-w-container-max mx-auto">
                    <div className="flex items-center gap-md">
                        <Link className="font-headline-md text-headline-md font-bold text-primary" to="/">Pan Học Code</Link>
                        <div className="h-6 w-px bg-outline-variant hidden md:block mx-sm"></div>
                        <div className="hidden md:flex flex-col">
                            <span className="font-label-md text-label-md text-on-surface-variant">{subject}</span>
                            <span className="font-label-sm text-label-sm text-secondary">Final Examination</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-lg">
                        <div className="hidden sm:flex flex-col items-end mr-md">
                            <span className="font-label-md text-label-md text-on-surface">Question {currentIndex + 1} of {questions.length}</span>
                            <div className="w-32 h-2 bg-secondary-container rounded-full mt-1 overflow-hidden">
                                <div className="h-full bg-primary rounded-full" style={{width: `${progressPercent}%`}}></div>
                            </div>
                        </div>
                        <div className="flex items-center gap-sm bg-surface-container-high px-md py-sm rounded-lg border border-outline-variant">
                            <span className="material-symbols-outlined text-primary" style={{fontVariationSettings:"'FILL' 1"}}>timer</span>
                            <span className="font-headline-sm text-headline-sm text-primary tabular-nums" id="countdown">{formatTime(timeLeft)}</span>
                        </div>
                        <div className="flex items-center gap-md text-on-surface-variant">
                            <span className="material-symbols-outlined cursor-pointer hover:text-primary transition-colors">account_circle</span>
                        </div>
                    </div>
                </div>
            </header>
            
            <main className="flex-grow pt-xxl pb-xxl px-md mt-md">
                <div className="max-w-3xl mx-auto mt-lg">
                    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl shadow-sm p-xl mb-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-start mb-lg">
                            <span className="bg-secondary-container text-on-secondary-container px-md py-xs rounded-full font-label-md text-label-md">
                                Multiple Choice
                            </span>
                            <button className="text-secondary hover:text-primary transition-colors flex items-center gap-xs">
                                <span className="material-symbols-outlined text-[20px]">flag</span>
                                <span className="font-label-md text-label-md">Flag for review</span>
                            </button>
                        </div>
                        <h2 className="font-headline-sm text-headline-sm text-on-surface mb-xl leading-relaxed">
                            {currentQuestion.question}
                        </h2>
                        
                        <div className="space-y-md" id="options-container">
                            {currentQuestion.options.map((option, idx) => (
                                <label 
                                    key={idx} 
                                    onClick={() => setAnswer(currentQuestion.id, idx)}
                                    className={`option-card relative flex items-center p-lg border rounded-xl cursor-pointer transition-all active:scale-[0.99] group ${answers[currentQuestion.id] === idx ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-outline-variant'}`}
                                >
                                    <input className="hidden" name="exam-option" type="radio" checked={answers[currentQuestion.id] === idx} readOnly />
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mr-lg transition-colors ${answers[currentQuestion.id] === idx ? 'border-primary' : 'border-outline-variant group-hover:border-primary'}`}>
                                        <div className={`w-3 h-3 rounded-full bg-primary transition-opacity ${answers[currentQuestion.id] === idx ? 'opacity-100' : 'opacity-0'}`}></div>
                                    </div>
                                    <span className="font-body-lg text-body-lg text-on-surface">{option}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-md opacity-80">
                        <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant flex items-start gap-md">
                            <span className="material-symbols-outlined text-secondary">info</span>
                            <div>
                                <h4 className="font-label-md text-label-md text-on-surface">Reference Material</h4>
                                <p className="font-label-sm text-label-sm text-secondary">Topic: {currentQuestion.topic}</p>
                            </div>
                        </div>
                        <div className="bg-surface-container-low p-md rounded-xl border border-outline-variant flex items-start gap-md">
                            <span className="material-symbols-outlined text-secondary">history</span>
                            <div>
                                <h4 className="font-label-md text-label-md text-on-surface">Difficulty Level</h4>
                                <p className="font-label-sm text-label-sm text-secondary uppercase">{currentQuestion.level}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            <footer className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-outline-variant">
                <div className="w-full py-md px-lg flex justify-between items-center max-w-container-max mx-auto">
                    <button 
                        onClick={handlePrev}
                        disabled={currentIndex === 0}
                        className={`flex items-center gap-sm px-lg py-md border border-outline rounded-lg text-on-surface font-label-md text-label-md transition-all ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-surface-container active:opacity-80'}`}
                    >
                        <span className="material-symbols-outlined">chevron_left</span> Previous
                    </button>
                    
                    <div className="flex items-center gap-md">
                        <button className="hidden sm:flex items-center gap-sm px-lg py-md text-on-surface font-label-md text-label-md hover:underline decoration-primary underline-offset-4">
                            Jump to Question...
                        </button>
                        <button 
                            onClick={currentIndex === questions.length - 1 ? () => setShowModal(true) : handleNext}
                            className="flex items-center gap-sm px-xl py-md bg-primary text-on-primary rounded-lg font-label-md text-label-md shadow-sm hover:opacity-90 transition-all active:scale-95"
                        >
                            {currentIndex === questions.length - 1 ? 'Finish' : 'Next Question'}
                            {currentIndex !== questions.length - 1 && <span className="material-symbols-outlined">chevron_right</span>}
                        </button>
                    </div>
                    <button onClick={() => setShowModal(true)} className="hidden md:flex items-center gap-sm px-lg py-md bg-error text-on-error rounded-lg font-label-md text-label-md shadow-sm hover:bg-error/90 transition-all active:scale-95" >
                        <span className="material-symbols-outlined">gavel</span> Submit Exam
                    </button>
                </div>
            </footer>
            
            {showModal && (
                <div className="fixed inset-0 z-[100] bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-md" id="finish-modal">
                    <div className="bg-surface p-xl rounded-xl shadow-xl max-w-md w-full border border-outline-variant animate-in zoom-in-95 duration-200">
                        <h3 className="font-headline-sm text-headline-sm text-on-surface mb-md">Finish Examination?</h3>
                        <p className="font-body-md text-body-md text-on-surface-variant mb-xl">
                            You have answered {answeredCount} out of {questions.length} questions. Are you sure you want to submit your exam now? This action cannot be undone.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-md">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-md border border-outline rounded-lg font-label-md text-label-md text-on-surface hover:bg-surface-container transition-colors" >
                                Go Back
                            </button>
                            <button onClick={handleSubmit} className="flex-1 py-md bg-error text-on-error rounded-lg font-label-md text-label-md hover:bg-error/90 transition-colors inline-block text-center flex items-center justify-center">
                                Submit Exam
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
