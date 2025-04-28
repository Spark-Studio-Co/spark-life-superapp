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

function App() {
  const { token } = useAuthData();

  const renderRoutes = () => {
    if (!token) {
      return (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/spark-voice" element={<VoiceAnalysisPage />} />
          <Route path="/modules" element={<ModulesPage />} />
          <Route path="/reminder" element={<RemindersPage />} />
          <Route path="/stress-test" element={<StressTestPage />} />
          <Route path="/reminders/new" element={<NewReminderPage />} />
          <Route path="/modules/:moduleId" element={<ModulesPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/ai-assistent" element={<ChatPage />} />
          <Route path="/clinics" element={<ClinicsPage />} />
          <Route path="/clinic/:id/doctors" element={<ClinicDoctors />} />
          <Route path="/hydration" element={<HydrationPage />} />
          <Route path="/sleep" element={<SleepPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/" element={<DashboardPage />} />
          <Route path="/health-stats" element={<HealthStatsPage />} />
          <Route path="/spark-face" element={<SparkFace />} />
          <Route path="/spark-face-result" element={<ResultsPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      );
    }

    return <></>;
  };

  return (
    <QueryClientProvider client={reactQueryClient}>
      <Routes>{renderRoutes()}</Routes>
    </QueryClientProvider>
  );
}

export default App;
