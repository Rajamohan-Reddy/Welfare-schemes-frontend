import { Routes, Route, Navigate, Outlet } from "react-router-dom";

import AuthLayout from "../layouts/AuthLayout";

import LoginPage from "../features/auth/pages/LoginPage";
import RegisterPage from "../features/auth/pages/RegisterPage";
import ResetPasswordPage from "../features/auth/pages/ResetPasswordPage";

import ProtectedRoute from "./ProtectedRoute";
import RoleRoute from "./RoleRoute";

import DashboardLayout from "../layouts/DashboardLayout/DashboardLayout";

import CitizenDashboardPage from "../features/citizen/pages/CitizenDashboardPage";
import ProfilePage from "../features/citizen/pages/ProfilePage";
import SettingsPage from "../features/citizen/pages/SettingsPage";

import BrowseSchemesPage from "../features/schemes/pages/BrowseSchemesPage";
import SchemeDetailsPage from "../features/schemes/pages/SchemeDetailsPage";
import EligibilityCheckerPage from "../features/schemes/pages/EligibilityCheckerPage";
import ApplySchemePage from "../features/schemes/pages/ApplySchemePage";
import ApplicationTrackingPage from "../features/schemes/pages/ApplicationTrackingPage";
import MyApplicationsPage from "../features/schemes/pages/MyApplicationsPage";

import NotificationsPage from "../features/notifications/pages/NotificationsPage";

import AdminDashboardPage from "../features/admin/pages/AdminDashboardPage";
import AdminReportsPage from "../features/admin/pages/AdminReportsPage";
import AdminStaffPage from "../features/admin/pages/AdminStaffPage";

import OfficerDashboardPage from "../features/officer/pages/OfficerDashboardPage";
import OfficerQueuePage from "../features/officer/pages/OfficerQueuePage";
import OfficerReviewPage from "../features/officer/pages/OfficerReviewPage";
import LandingPage from "../features/landing/pages/LandingPage";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />

      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ResetPasswordPage />} />
      </Route>

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/citizen"
          element={
            <RoleRoute allowedRoles={["CITIZEN"]}>
              <Outlet />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="/citizen/dashboard" replace />} />
          <Route path="dashboard" element={<CitizenDashboardPage />} />
          <Route path="schemes" element={<BrowseSchemesPage />} />
          <Route path="schemes/:schemeId" element={<SchemeDetailsPage />} />
          <Route path="eligibility" element={<EligibilityCheckerPage />} />
          <Route path="apply/:schemeId" element={<ApplySchemePage />} />
          <Route
            path="tracking/:applicationId"
            element={<ApplicationTrackingPage />}
          />
          <Route path="applications" element={<MyApplicationsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>

        <Route
          path="/officer"
          element={
            <RoleRoute allowedRoles={["OFFICER"]}>
              <Outlet />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="/officer/dashboard" replace />} />
          <Route path="dashboard" element={<OfficerDashboardPage />} />
          <Route path="queue" element={<OfficerQueuePage />} />
          <Route path="review/:applicationId" element={<OfficerReviewPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>

        <Route
          path="/admin"
          element={
            <RoleRoute allowedRoles={["ADMIN"]}>
              <Outlet />
            </RoleRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="staff" element={<AdminStaffPage />} />
          <Route path="reports" element={<AdminReportsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
