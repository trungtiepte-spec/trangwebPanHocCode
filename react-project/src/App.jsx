import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home/Home';
import Exam from './pages/Exam/Exam';
import Result from './pages/Result/Result';
import Review from './pages/Review/Review';
import Courses from './pages/Courses/Courses';
import CourseForm from './pages/Courses/CourseForm';
import CoursesTrash from './pages/Courses/CoursesTrash';
import CourseQuestions from './pages/Courses/CourseQuestions';
import HelpCenter from './pages/HelpCenter/HelpCenter';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService/TermsOfService';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import { QuizProvider } from './context/QuizContext';
import { AuthProvider } from './context/AuthContext';
import { CourseProvider } from './context/CourseContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CourseProvider>
          <QuizProvider>
            <Routes>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/result" element={<Result />} />
                <Route path="/review" element={<Review />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/new" element={<CourseForm />} />
                <Route path="/courses/:id/edit" element={<CourseForm />} />
                <Route path="/courses/trash" element={<CoursesTrash />} />
                <Route path="/courses/:courseId/questions" element={<CourseQuestions />} />
                <Route path="/help-center" element={<HelpCenter />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/terms" element={<TermsOfService />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
              <Route path="/exam" element={<Exam />} />
            </Routes>
          </QuizProvider>
        </CourseProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
