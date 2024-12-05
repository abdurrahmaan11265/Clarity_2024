import React from 'react';
import { useRoutes } from 'react-router-dom'; // No need to import Router here
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AcademicAnalytics from './pages/AcademicAnalytics';
import { AuthProvider } from './AuthContext'; // Ensure this path is correct
import AuthenticatedRoute from './services/useAuthContext';
import Analytics from './pages/Analytics';
import AllTest from './pages/AllTest';
import Test from './pages/Test';
import ClarityAnalytics from './pages/ClarityAnalytics';
import Career from './pages/Career';
import Counselor from './pages/Counselor';
import CounselorsStudentDashboard from './pages/CounselorsStudentDashboard';
import CounselorTraining from './pages/CounselorTraining';
import AboutCareer from './pages/AboutCareer';
const routeDefinitions = [
  { path: '/', element: <Login /> },
  { path: "/student", element: <AuthenticatedRoute element={<StudentDashboard />} /> },
  { path: '/analytics', element: <Analytics /> },
  { path: '/academic-analytics', element: <AcademicAnalytics /> },
  { path: '/allTests', element: <AllTest /> },
  { path: '/test/:testId', element: <Test /> },
  { path: '/clarity-analytics', element: <ClarityAnalytics /> },
  { path: '/career', element: <Career /> },
  { path: '/counselor', element: <Counselor /> },
  { path: '/counselors-student-dashboard', element: <CounselorsStudentDashboard /> },
  { path: '/counselor-training', element: <CounselorTraining /> },
  {path: '/about-career', element: <AboutCareer />}
];

function App() {
  const routing = useRoutes(routeDefinitions);

  return (
    <AuthProvider>
      <div className="App bg-black">
        {routing}
      </div>
    </AuthProvider>
  );
}

export default App; // Export App directly