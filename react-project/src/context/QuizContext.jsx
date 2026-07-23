import React, { createContext, useState, useContext } from 'react';
import { useCourses } from './CourseContext';

const QuizContext = createContext();

export function QuizProvider({ children }) {
    const { updateQuestionProgress, getCourseByName } = useCourses();
    const [subject, setSubject] = useState(null);
    const [courseId, setCourseId] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [timeTaken, setTimeTaken] = useState(0); // in seconds
    const [score, setScore] = useState({ correct: 0, incorrect: 0, total: 0 });

    const startQuiz = (courseSubject, randomQuestions, cId = null) => {
        setSubject(courseSubject);
        const resolvedId = cId || getCourseByName(courseSubject)?.id || null;
        setCourseId(resolvedId);
        setQuestions(randomQuestions);
        setAnswers({});
        setTimeTaken(0);
        setScore({ correct: 0, incorrect: 0, total: 0 });
    };

    const setAnswer = (questionId, optionIndex) => {
        setAnswers(prev => ({
            ...prev,
            [questionId]: optionIndex
        }));
    };

    const submitQuiz = (timeSpent) => {
        setTimeTaken(timeSpent);
        let correct = 0;
        let incorrect = 0;
        
        questions.forEach(q => {
            if (answers[q.id] === q.answer) {
                correct++;
            } else {
                incorrect++;
            }
        });
        
        const computedScore = {
            correct,
            incorrect,
            total: correct * 10
        };
        setScore(computedScore);

        const targetCourseId = courseId || getCourseByName(subject)?.id;
        if (targetCourseId) {
            updateQuestionProgress(targetCourseId, questions, answers);
        }

        try {
            localStorage.setItem('quizResult', JSON.stringify({
                subject,
                courseId: targetCourseId,
                questions,
                answers,
                timeTaken: timeSpent,
                score: computedScore,
                submittedAt: new Date().toISOString()
            }));
        } catch (e) {
            console.error('Failed to save quizResult to localStorage', e);
        }
    };

    const resetQuiz = () => {
        setSubject(null);
        setCourseId(null);
        setQuestions([]);
        setAnswers({});
        setTimeTaken(0);
        setScore({ correct: 0, incorrect: 0, total: 0 });
    };

    return (
        <QuizContext.Provider value={{
            subject,
            courseId,
            questions,
            answers,
            timeTaken,
            score,
            startQuiz,
            setAnswer,
            submitQuiz,
            resetQuiz
        }}>
            {children}
        </QuizContext.Provider>
    );
}

export function useQuiz() {
    return useContext(QuizContext);
}
