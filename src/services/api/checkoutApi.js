import { userApi } from "./axiosInstance";

// ============================================
// CHECKOUT APIs
// ============================================

export const checkoutApi = {
  // Get shipping addresses
  getAddresses: () =>
    userApi.get("/api/addresses"),

  // Add new shipping address
  createAddress: (data) =>
    userApi.post("/api/addresses", data),

  // Update shipping address
  updateAddress: (addressId, data) =>
    userApi.patch(`/api/addresses/${addressId}`, data),

  // Delete shipping address
  deleteAddress: (addressId) =>
    userApi.delete(`/api/addresses/${addressId}`),

  // Set default shipping address
  setDefaultAddress: (addressId) =>
    userApi.post(`/api/addresses/${addressId}/set-default`),

  // Get shipping methods
  getShippingMethods: () =>
    userApi.get("/api/shipping-methods"),

  // Calculate shipping cost
  calculateShipping: (data) =>
    userApi.post("/api/shipping/calculate", data),

  // Process payment
  processPayment: (data) =>
    userApi.post("/api/payments/process", data),

  // Validate payment
  validatePayment: (data) =>
    userApi.post("/api/payments/validate", data),

  // Create order
  createOrder: (data) =>
    userApi.post("/api/orders", data),

  // Get payment methods
  getPaymentMethods: () =>
    userApi.get("/api/payment-methods"),
};
