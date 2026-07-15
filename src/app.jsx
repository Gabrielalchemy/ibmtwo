import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { SchoolProvider } from './context/SchoolContext.jsx';
import Navbar from './components/Navbar.jsx';
import Layout from './layout/Layout.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Students from './pages/StudentsPage.jsx';
import Teachers from './pages/TeachersPage.jsx';
import Classes from './pages/ClassesPage.jsx';
import Grades from './pages/GradesPage.jsx';
import Attendance from './pages/AttendancePage.jsx';
import Fees from './pages/FeesPage.jsx';

const App = () => {
  return (
    <SchoolProvider>
      <div className="h-full flex flex-col">
        <Navbar />
        <div className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/students" element={<Students />} />
              <Route path="/teachers" element={<Teachers />} />
              <Route path="/classes" element={<Classes />} />
              <Route path="/grades" element={<Grades />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/fees" element={<Fees />} />
            </Route>
          </Routes>
        </div>
      </div>
    </SchoolProvider>
  );
};

export default App;
