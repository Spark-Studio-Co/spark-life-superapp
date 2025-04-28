import { QueryClientProvider } from "@tanstack/react-query";
import reactQueryClient from "./shared/api/queryClient";
import { Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import { useAuthData } from "./entities/auth/model/use-auth-store";
import { LoginPage } from "./pages/login/page";
import { RegisterPage } from "./pages/register/page";
import { ResetPasswordPage } from "./pages/reset-password/page";
import VoiceAnalysisPage from "./pages/voice-analysis/page";

function App() {
  const { token } = useAuthData();

  const renderRoutes = () => {
    if (!token) {
      return (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/voice-analysis" element={<VoiceAnalysisPage />} />
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