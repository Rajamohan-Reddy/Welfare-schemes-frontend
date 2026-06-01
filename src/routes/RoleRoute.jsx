import { Navigate } from "react-router-dom";

import { getUser } from "../utils/storage";

import { ROUTES } from "../constants/routes";

function RoleRoute({ allowedRoles, children }) {
  const user = getUser();

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return children;
}

export default RoleRoute;
