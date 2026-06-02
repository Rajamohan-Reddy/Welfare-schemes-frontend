import api from "../../../api/axios";

/**
 * Get all payments (admin only)
 */
export const getPaymentsApi = async () => {
  return await api.get("/payments");
};

/**
 * Get a specific payment by ID (admin only)
 */
export const getPaymentByIdApi = async (paymentId) => {
  return await api.get(`/payments/${paymentId}`);
};

/**
 * Release/process payment for an application (admin only)
 */
export const releasePaymentApi = async (applicationId) => {
  return await api.post(`/payments/release/${applicationId}`);
};

/**
 * Get payment analytics (admin only)
 * Returns: { totalPayments, successfulPayments, totalDisbursed }
 */
export const getPaymentsAnalyticsApi = async () => {
  return await api.get("/payments/analytics");
};
