import api from "../../../api/axios";

/**
 * Get comprehensive dashboard analytics (admin & officer)
 * Returns: {
 *   summary: { totalApplications, totalUsers, totalSchemes, totalPayments, approvedApplications, rejectedApplications, paidApplications },
 *   applicationsByStatus: [{ _id: status, count }],
 *   applicationsByMonth: [{ _id: { month, year }, count }],
 *   usersByRole: [{ _id: role, count }],
 *   paymentsByMonth: [{ _id: { month, year }, totalAmount, count }],
 *   schemesByCategory: [{ _id: categoryName, count }]
 * }
 */
export const getDashboardAnalyticsApi = async () => {
  return await api.get("/dashboard/analytics");
};
