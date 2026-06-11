import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { ROUTES } from "../constants/routes";

const ROLE_HOME = {
  CITIZEN: ROUTES.CITIZEN_DASHBOARD,
  OFFICER: ROUTES.OFFICER_DASHBOARD,
  ADMIN: ROUTES.ADMIN_DASHBOARD,
};

function AuthLoadingScreen() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-slate-200 border-t-[#071A52]" />
    </div>
  );
}

function RoleRoute({ allowedRoles, children }) {
  const { role, isAuthenticated, initialized } = useSelector(
    (state) => state.auth,
  );

  if (!initialized) {
    return <AuthLoadingScreen />;
  }

  if (!isAuthenticated || !role) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={ROLE_HOME[role] || ROUTES.LOGIN} replace />;
  }

  return children;
}

export default RoleRoute;
