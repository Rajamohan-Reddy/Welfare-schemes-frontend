import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

import { ROUTES } from "../constants/routes";

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F5F7FB]">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#071A52]" />
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { isAuthenticated, initialized } = useSelector((state) => state.auth);
  const location = useLocation();

  if (!initialized) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />;
  }

  return children;
}

export default ProtectedRoute;
