// src/routes/index.jsx
import { Routes, Route, Navigate }
  from 'react-router-dom'
import { AnimatePresence }
  from 'framer-motion'
import { useLocation }
  from 'react-router-dom'

// Layouts
import AuthLayout
  from '../components/layout/AuthLayout/AuthLayout'
import MainLayout
  from '../components/layout/MainLayout/MainLayout'
import AIAssistantPage
  from '../pages/ai/AIAssistantPage'
// Guards
import ProtectedRoute
  from '../components/auth/ProtectedRoute'
import PublicRoute
  from '../components/auth/PublicRoute'

// Auth Pages
import LoginPage
  from '../pages/auth/LoginPage'
import RegisterPage
  from '../pages/auth/RegisterPage'
import ForgotPasswordPage
  from '../pages/auth/ForgotPasswordPage'
import ResetPasswordPage
  from '../pages/auth/ResetPasswordPage'

// App Pages
import ProjectsPage
  from '../pages/project/ProjectsPage'
import WorkspacePage
  from '../pages/workspace/WorkspacePage'
import BoardPage
  from '../pages/board/BoardPage'
import SprintPage
  from '../pages/sprint/SprintPage'
import AnalyticsPage
  from '../pages/analytics/AnalyticsPage'
import ChatPage
  from '../pages/chat/ChatPage'
import ProfilePage
  from '../pages/profile/ProfilePage'
import NotFoundPage
  from '../pages/error/NotFoundPage'

export default function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>

        {/* ==================== */}
        {/*     Auth Routes      */}
        {/* ==================== */}
        <Route element={<AuthLayout />}>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicRoute>
                <ForgotPasswordPage />
              </PublicRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <PublicRoute>
                <ResetPasswordPage />
              </PublicRoute>
            }
          />
        </Route>

        {/* ==================== */}
        {/*   Protected Routes   */}
        {/* ==================== */}
        <Route
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route
            index
            element={
              <Navigate to="/projects" replace />
            }
          />
          <Route
            path="/projects"
            element={<ProjectsPage />}
          />
          <Route
            path="/workspaces"
            element={<WorkspacePage />}
          />
          <Route
            path="/projects/:projectId/board"
            element={<BoardPage />}
          />
          <Route
            path="/projects/:projectId/sprints"
            element={<SprintPage />}
          />
          <Route
            path="/projects/:projectId/analytics"
            element={<AnalyticsPage />}
          />
          <Route
            path="/projects/:projectId/chat"
            element={<ChatPage />}
          />
          <Route
            path="/projects/:projectId/ai-assistant"
            element={<AIAssistantPage />}
            />
        <Route
            path="/profile"
            element={<ProfilePage />}
          />
        </Route>

        {/* ==================== */}
        {/*       404            */}
        {/* ==================== */}
        <Route path="*" element={<NotFoundPage />} />

      </Routes>
    </AnimatePresence>
  )
}
