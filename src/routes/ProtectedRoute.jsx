import { Navigate } from "react-router-dom";

import { ROUTES } from "../constants/routes";

import { getAccessToken } from "../utils/storage";

function ProtectedRoute({ children }) {
  const token = getAccessToken();

  if (!token) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}

export default ProtectedRoute;
