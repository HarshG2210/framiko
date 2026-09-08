import { adminApi } from "./axiosInstance";

// ============================================
// ADMIN APIs
// ============================================

export const adminAuthApi = {
  // Admin login
  login: (payload) => adminApi.post("/registration/admin-login/", payload),

  // Admin logout
  logout: () => adminApi.post("/registration/logout/"),

  // Get admin profile
  getProfile: () => adminApi.get("/registration/profile/"),

  // Update admin profile
  updateProfile: (data) => adminApi.patch("/registration/edit-profile/", data),
};

export const adminOrdersApi = {
  // Get all orders (admin view)
  getAllOrders: (params) => adminApi.get("/api/admin/orders", { params }),

  // Update order status
  updateOrderStatus: (orderId, data) =>
    adminApi.patch(`/api/admin/orders/${orderId}/status/`, data),

  // Get order details
  getOrderDetails: (orderId) => adminApi.get(`/api/admin/orders/${orderId}`),

  // Add order note
  addOrderNote: (orderId, data) =>
    adminApi.post(`/api/admin/orders/${orderId}/notes`, data),

  // Generate shipping label
  generateShippingLabel: (orderId) =>
    adminApi.post(`/api/admin/orders/${orderId}/shipping-label`),

  // Refund order
  refundOrder: (orderId, data) =>
    adminApi.post(`/api/admin/orders/${orderId}/refund`, data),

  // Export orders (CSV/Excel)
  exportOrders: (format = "csv") =>
    adminApi.get("/api/admin/orders/export", {
      params: { format },
      responseType: "blob",
    }),
};

export const adminUsersApi = {
  // Get all users
  getAllUsers: (params) => adminApi.get("/api/admin/users", { params }),

  // Get owner users list
  getOwnerUsersList: () => adminApi.get("/registration/owner/users/list/"),

  // Get user details
  getUserDetails: (userId) => adminApi.get(`/api/admin/users/${userId}`),

  // Update user
  updateUser: (userId, data) =>
    adminApi.patch(`/api/admin/users/${userId}`, data),

  // Get owner dashboard user stats
  getOwnerDashboardUserStats: () =>
    adminApi.get("/registration/owner/dashboard/users/"),

  // Block/Unblock user
  toggleUserBlock: (userId) =>
    adminApi.post(`/api/admin/users/${userId}/toggle-block`),

  // Delete user
  deleteUser: (userId) => adminApi.delete(`/api/admin/users/${userId}`),

  // Get user orders
  getUserOrders: (userId, params) =>
    adminApi.get(`/api/admin/users/${userId}/orders`, { params }),

  // Get user activity log
  getUserActivityLog: (userId) =>
    adminApi.get(`/api/admin/users/${userId}/activity-log`),

  // Send notification to user
  sendNotification: (userId, data) =>
    adminApi.post(`/api/admin/users/${userId}/notification`, data),

  // Export users (CSV/Excel)
  exportUsers: (format = "csv") =>
    adminApi.get("/api/admin/users/export", {
      params: { format },
      responseType: "blob",
    }),
};

export const adminProductsApi = {
  // Get all products (admin)
  getAllProducts: (params) => adminApi.get("/api/admin/products", { params }),

  // Create product
  createProduct: (data) => adminApi.post("/api/admin/products", data),

  // Update product
  updateProduct: (productId, data) =>
    adminApi.patch(`/api/admin/products/${productId}`, data),

  // Delete product
  deleteProduct: (productId) =>
    adminApi.delete(`/api/admin/products/${productId}`),

  // Upload product image
  uploadProductImage: (productId, formData) =>
    adminApi.post(`/api/admin/products/${productId}/upload-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Get product sales data
  getProductSales: (productId) =>
    adminApi.get(`/api/admin/products/${productId}/sales`),

  // Bulk update products
  bulkUpdateProducts: (data) =>
    adminApi.post("/api/admin/products/bulk-update", data),

  // Export products
  exportProducts: (format = "csv") =>
    adminApi.get("/api/admin/products/export", {
      params: { format },
      responseType: "blob",
    }),
};

// Legacy inventory endpoints used by older slices (compatibility)
export const adminInventoryLegacy = {
  // Frame inventory list
  getFrameInventory: () => adminApi.get("/inventory/frame-inventory/"),

  // Add or update frame inventory
  addOrUpdateFrameInventory: (data) =>
    adminApi.post("/inventory/frame-inventory/add-update/", data),

  // Bulk upload frame inventory
  bulkUploadFrameInventory: (formData) =>
    adminApi.post("/inventory/frame-inventory/bulk-upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Artwork image inventory list
  getArtworkImageInventory: () =>
    adminApi.get("/inventory/artwork-image-inventory/"),

  // Add or update artwork image inventory
  addOrUpdateArtworkImageInventory: (data) =>
    adminApi.post("/inventory/artwork-image-inventory/add-update/", data),
};

export const adminInventoryApi = {
  // Product inventory list
  getProductInventory: () => adminApi.get("/inventory/product-inventory/"),

  // Add or update product inventory
  addOrUpdateProductInventory: (data) =>
    adminApi.post("/inventory/product-inventory/add-update/", data),
};

export const adminAnalyticsApi = {
  // Get dashboard metrics
  getDashboardMetrics: () => adminApi.get("/api/admin/analytics/dashboard"),

  // Get sales analytics
  getSalesAnalytics: (params) =>
    adminApi.get("/api/admin/analytics/sales", { params }),

  // Get user analytics
  getUserAnalytics: (params) =>
    adminApi.get("/api/admin/analytics/users", { params }),

  // Get product performance
  getProductPerformance: (params) =>
    adminApi.get("/api/admin/analytics/products", { params }),

  // Get revenue report
  getRevenueReport: (params) =>
    adminApi.get("/api/admin/analytics/revenue", { params }),

  // Export analytics
  exportAnalytics: (type, format = "csv") =>
    adminApi.get(`/api/admin/analytics/${type}/export`, {
      params: { format },
      responseType: "blob",
    }),
};

export const adminNotificationsApi = {
  // Send bulk notification
  sendBulkNotification: (data) =>
    adminApi.post("/api/admin/notifications/send", data),

  // Get notification template
  getTemplates: () => adminApi.get("/api/admin/notifications/templates"),

  // Create notification template
  createTemplate: (data) =>
    adminApi.post("/api/admin/notifications/templates", data),

  // Update notification template
  updateTemplate: (templateId, data) =>
    adminApi.patch(`/api/admin/notifications/templates/${templateId}`, data),
};

export const adminContactApi = {
  getContactMessages: () => adminApi.get("/api/admin/contact-us/"),
};
