import { userApi } from "./axiosInstance";

// ============================================
// CART APIs
// Centralized cart API wrapper used by slices
// ============================================

export const cartApi = {
  // Primary: endpoints used by existing slices (orders namespace)
  getCart: (params) => userApi.get("/api/orders/cart/", { params }),

  // Add an item to the cart. Some codepaths post to /api/orders/cart/ and
  // others to /api/orders/cart/add_item/ — prefer the root endpoint first.
  addToCart: (data) => userApi.post("/api/orders/cart/", data),

  // Remove a cart item
  removeFromCartItem: (itemId) =>
    userApi.delete(`/api/orders/cart/items/${itemId}/`),

  // Clear the entire cart
  clearCart: () => userApi.delete(`/api/orders/cart/clear/`),

  // Generic cart endpoints (kept for other modules)
  legacyGetCart: (params) => userApi.get("/api/cart", { params }),
  legacyAddToCart: (data) => userApi.post("/api/cart/items", data),
  legacyRemoveFromCart: (itemId) => userApi.delete(`/api/cart/items/${itemId}`),
};

export default cartApi;
