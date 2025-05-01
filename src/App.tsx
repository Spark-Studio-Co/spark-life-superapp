import type React from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import reactQueryClient from "./shared/api/queryClient";
import { Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import { useAuthData } from "./entities/auth/model/use-auth-store";
import { LoginPage } from "./pages/login/page";
import { RegisterPage } from "./pages/register/page";
import { ResetPasswordPage } from "./pages/reset-password/page";
import VoiceAnalysisPage from "./pages/spark-voice/page";
import { ModulesPage } from "./pages/modules/page";
import { AppointmentsPage } from "./pages/appointments/appointments-page";
import { ProfilePage } from "./pages/profile/page";
import { DashboardPage } from "./widgets/dashboard/dashboard";
import { HealthStatsPage } from "./pages/health-stats/page";
import { HydrationPage } from "./pages/hydration/page";
import { SleepPage } from "./pages/sleep/page";
import { NewReminderPage } from "./pages/new-reminder/page";
import { RemindersPage } from "./pages/reminder/page";
import { StressTestPage } from "./pages/stress-test/page";
import { ClinicsPage } from "./pages/clinics-page/clinics-page";
import SparkFace from "./pages/spark-face/page";
import ResultsPage from "./pages/spark-face-result/page";
import { ClinicDoctors } from "./pages/clinics-doctors-page/clinics-doctors-page";
import ChatPage from "./pages/ai-messenger/page";
import { DocumentsPage } from "./pages/documents/page";
import { SettingsPage } from "./pages/settings/page";
import VoiceAnalysisResultsPage from "./pages/voice-analysis-results/page";
import SleepStatistics from "./pages/sleep/statistics";
import RecommendedClinicsPage from "./pages/recommendations/page";
import { AdminPanel } from "./pages/admin-panel/admin-panel";
import SparkTeeth from "./pages/spark-teeth/page";
import SparkTeethResult from "./pages/spark-teeth/result-page";

// Component for protected routes
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthData();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Component for authentication routes
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthData();

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

function App() {
  const { token } = useAuthData();

  return (
    <QueryClientProvider client={reactQueryClient}>
      <Routes>
        <Route
          path="/login"
          element={
            <AuthRoute>
              <LoginPage />
            </AuthRoute>
          }
        />
        <Route
          path="/register"
          element={
            <AuthRoute>
              <RegisterPage />
            </AuthRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <AuthRoute>
              <ResetPasswordPage />
            </AuthRoute>
          }
        />
        <Route path="/spark-voice" element={<VoiceAnalysisPage />} />
        <Route
          path="/voice-analysis-results"
          element={<VoiceAnalysisResultsPage />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/recommended-clinics"
          element={
            <ProtectedRoute>
              <RecommendedClinicsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/modules"
          element={
            <ProtectedRoute>
              <ModulesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/modules/:moduleId"
          element={
            <ProtectedRoute>
              <ModulesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reminder"
          element={
            <ProtectedRoute>
              <RemindersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reminders/new"
          element={
            <ProtectedRoute>
              <NewReminderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stress-test"
          element={
            <ProtectedRoute>
              <StressTestPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/appointments"
          element={
            <ProtectedRoute>
              <AppointmentsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-assistent"
          element={
            <ProtectedRoute>
              <ChatPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clinics"
          element={
            <ProtectedRoute>
              <ClinicsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/clinic/:id/doctors"
          element={
            <ProtectedRoute>
              <ClinicDoctors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hydration"
          element={
            <ProtectedRoute>
              <HydrationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/spark-teeth"
          element={
            <ProtectedRoute>
              <SparkTeeth />
            </ProtectedRoute>
          }
        />
        <Route
          path="/spark-teeth-result"
          element={
            <ProtectedRoute>
              <SparkTeethResult />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sleep"
          element={
            <ProtectedRoute>
              <SleepPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sleep-statistics"
          element={
            <ProtectedRoute>
              <SleepStatistics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/health-stats"
          element={
            <ProtectedRoute>
              <HealthStatsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/spark-face"
          element={
            <ProtectedRoute>
              <SparkFace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/spark-face-result"
          element={
            <ProtectedRoute>
              <ResultsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/documents"
          element={
            <ProtectedRoute>
              <DocumentsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/settings"
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="*"
          element={<Navigate to={token ? "/" : "/login"} replace />}
        />
      </Routes>
    </QueryClientProvider>
  );
}

export default App;
