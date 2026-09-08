import { userApi } from "./axiosInstance";

// ============================================
// ORDERS APIs
// ============================================

export const ordersApi = {
  // Fetch all orders for current user
  fetchOrders: () => userApi.get("/api/orders/orders/"),

  // Fetch order details
  fetchOrderDetails: (orderId) =>
    userApi.get(`/api/orders/orders/${orderId}/`),

  // Cancel an order
  cancelOrder: (orderId) =>
    userApi.post(`/api/orders/orders/${orderId}/cancel/`, {}),

  // Create a new order (checkout)
  createOrder: (data) =>
    userApi.post("/api/orders/checkout/create_order/", data),

  // Create a Razorpay order (server-side)
  createRazorpayOrder: (data) =>
    userApi.post("/api/create-order/", data),

  // Verify Razorpay payment signature
  verifyRazorpayPayment: (data) =>
    userApi.post("/api/verify-payment/", data),

  // Get shipping addresses
  getShippingAddresses: () =>
    userApi.get("/api/orders/shipping-address/"),

  // Create shipping address
  createShippingAddress: (data) =>
    userApi.post("/api/orders/shipping-address/", data),

  // Update shipping address
  updateShippingAddress: (addressId, data) =>
    userApi.put(`/api/orders/shipping-address/${addressId}/`, data),

  // Delete shipping address
  deleteShippingAddress: (addressId) =>
    userApi.delete(`/api/orders/shipping-address/${addressId}/`),

  // Set default shipping address
  setDefaultAddress: (addressId) =>
    userApi.post(`/api/orders/shipping-address/${addressId}/set_default/`, {}),
};

export default ordersApi;
