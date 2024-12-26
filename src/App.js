import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import TeacherStaffingApp from './components/TeacherStaffingApp';
import FindTeachers from './pages/FindTeachers';
import BecomeSubstitute from './pages/BecomeSubstitute';
import Schedule from './pages/Schedule';
import Assignments from './pages/Assignments';
import PostTeachingJob from './pages/PostTeachingJob';
import ListJobs from './pages/ListJobs';
import PendingTeachers from './pages/PendingTeachers';
import SchoolSchedule from './pages/SchoolSchedule';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import LandingPage from './pages/LandingPage';
import ProtectedRoute from './components/ProtectedRoute';
import { AppProvider } from './context/AppContext';
import './styles/sweetalert.css';
import SuperAdminDashboard from './pages/SuperAdminDashboard';
import Layout from './components/Layout';
import Profile from './pages/Profile';

function App() {
  return (
    <AppProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        
        {/* Protected routes - nested under TeacherStaffingApp */}
        <Route element={
          <ProtectedRoute>
            <TeacherStaffingApp />
          </ProtectedRoute>
        }>
          <Route path="/app" element={<FindTeachers />} />
          <Route path="/app/dashboard" element={
            <ProtectedRoute allowedUserTypes={[1]}>
              <SuperAdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/app/become-substitute" element={<BecomeSubstitute />} />
          <Route path="/app/schedule" element={<Schedule />} />
          <Route path="/app/assignments" element={<Assignments />} />
          <Route path="/app/post-job" element={<PostTeachingJob />} />
          <Route path="/app/list-jobs" element={<ListJobs />} />
          <Route path="/app/pending-teachers" element={
            <ProtectedRoute allowedUserTypes={[1]}>
              <PendingTeachers />
            </ProtectedRoute>
          } />
          <Route path="/app/school-schedule" element={<SchoolSchedule />} />
          <Route path="/app/profile" element={<Profile />} />
        </Route>

        {/* Redirect all other routes to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppProvider>
  );
}

export default App;
