import React from 'react';
import { useRoutes, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import AcademicAnalytics from './pages/AcademicAnalytics';
import { AuthProvider } from './AuthContext';
import { ChatbotProvider } from './ChatbotContext';
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
import ClarityAI from './components/ClarityAI';
import './styles/Career.css';
import JournalPage from './pages/JournalPage';
import Aluminai from './pages/aluminai';

const routeDefinitions = [
  { path: '/', element: <Login /> },
  { path: '/student', element: <AuthenticatedRoute element={<StudentDashboard />} /> },
  { path: '/analytics', element: <Analytics /> },
  { path: '/academic-analytics', element: <AcademicAnalytics /> },
  { path: '/allTests', element: <AllTest /> },
  { path: '/test/:testId', element: <Test /> },
  { path: '/clarity-analytics', element: <ClarityAnalytics /> },
  { path: '/career', element: <Career /> },
  { path: '/counselor', element: <Counselor /> },
  { path: '/counselors-student-dashboard', element: <CounselorsStudentDashboard /> },
  { path: '/counselor-training', element: <CounselorTraining /> },
  { path: '/about-career', element: <AboutCareer /> },
  { path: '/journal-page', element: <JournalPage /> },
  { path: '/aluminai', element: <Aluminai /> }
];

function App() {
  const routing = useRoutes(routeDefinitions);
  const location = useLocation();

  return (
    <AuthProvider>
      <ChatbotProvider>
        <div className="App bg-black">
          {location.pathname === '/' ? (
            <>
              {routing}
              </>
          ) : (
            <>
            {routing}
            <ClarityAI />
            </>
          )}
        </div>
      </ChatbotProvider>
    </AuthProvider>
  );
}

export default App;