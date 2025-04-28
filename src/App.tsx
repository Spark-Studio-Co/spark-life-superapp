import { QueryClientProvider } from "@tanstack/react-query";
import reactQueryClient from "./shared/api/queryClient";
import { Navigate, Route, Routes } from "react-router-dom";
import "./index.css";
import { useAuthData } from "./entities/auth/model/use-auth-store";
import { LoginPage } from "./pages/login/page";
import { RegisterPage } from "./pages/register/page";
import { ResetPasswordPage } from "./pages/reset-password/page";

function App() {
  const { token } = useAuthData();
  // const [isAdmin, setIsAdmin] = useState<boolean | null>(() => {
  //   const storedAdminStatus = localStorage.getItem("isAdmin");
  //   return storedAdminStatus ? JSON.parse(storedAdminStatus) : null;
  // });

  const renderRoutes = () => {
    if (!token) {
      return (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      );
    }

    // if (isAdmin) {
    //   return (
    //     <>
    //       <Route path="/" element={<Navigate to="/admin" replace />} />
    //     </>
    //   );
    // }

    return <></>;
  };

  return (
    <QueryClientProvider client={reactQueryClient}>
      <Routes>{renderRoutes()}</Routes>
    </QueryClientProvider>
  );
}

export default App;
