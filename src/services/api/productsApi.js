import { adminApi, publicApi, userApi } from "./axiosInstance";

// ============================================
// PRODUCTS & CATEGORIES APIs
// ============================================

export const productsApi = {
  // Get all products
  getAllProducts: (params) => publicApi.get("/api/products", { params }),

  // Get product by ID
  getProductById: (id) => publicApi.get(`/api/products/${id}`),

  // Search products
  searchProducts: (query) =>
    publicApi.get("/api/products/search", { params: { q: query } }),

  // Filter products
  filterProducts: (filters) =>
    publicApi.get("/api/products/filter", { params: filters }),

  // Get product categories
  getCategories: () => publicApi.get("/api/product-categories"),

  // Get product categories (admin fetch)
  fetchProductCategories: () => publicApi.get("/product-categories/"),

  // Get frames
  getFrames: () => publicApi.get("/frames/"),

  // Get materials
  getMaterials: () => publicApi.get("/materials/"),

  // Get backgrounds
  getBackgrounds: () => publicApi.get("/backgrounds/"),

  // Get sizes
  getSizes: () => publicApi.get("/sizes/"),

  // Get artwork categories
  getArtworkCategories: () => publicApi.get("/artwork-categories/"),

  // Get artworks
  getArtworks: (params) => publicApi.get("/artworks/", { params }),

  // Get artwork category images
  getArtworkCategoryImages: () => publicApi.get(`/artworks-categories-image/`),

  // Get product reviews
  getProductReviews: (productId) =>
    publicApi.get(`/api/products/${productId}/reviews`),

  // Create product review
  createProductReview: (productId, data) =>
    userApi.post(`/api/products/${productId}/reviews`, data),

  // Admin: Fetch all products
  fetchProducts: () => publicApi.get("/products/"),

  // Admin: Create product
  postProduct: (data) =>
    adminApi.post("/products/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Admin: Update product
  updateProduct: (id, data) =>
    adminApi.put(`/products/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Admin: Delete product
  deleteProduct: (id) => adminApi.delete(`/products/${id}/`),

  // Admin: Delete artwork
  deleteArtwork: (id) => adminApi.delete(`/artworks/${id}/`),

  // Admin: Bulk delete artworks
  bulkDeleteArtworks: (ids) =>
    adminApi.delete(`/artworks/bulk-delete/`, { data: { ids } }),

  // Admin: Create frame
  postFrame: (data) =>
    adminApi.post("/frames/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Admin: Update frame
  updateFrame: (id, data, options = {}) => {
    const method = options.method || "put";
    const headers = options.isFormData
      ? { "Content-Type": "multipart/form-data" }
      : undefined;

    return adminApi.request({
      url: `/frames/${id}/`,
      method,
      data,
      headers,
    });
  },

  // Admin: Delete frame
  deleteFrame: (id) => adminApi.delete(`/frames/${id}/`),

  // Admin: Create material
  postMaterial: (data) =>
    adminApi.post("/materials/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Admin: Update material
  updateMaterial: (id, data) =>
    adminApi.put(`/materials/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Admin: Delete material
  deleteMaterial: (id) => adminApi.delete(`/materials/${id}/`),

  // Admin: Create background
  postBackground: (data) =>
    adminApi.post("/backgrounds/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Admin: Update background
  updateBackground: (id, data) =>
    adminApi.put(`/backgrounds/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Admin: Delete background
  deleteBackground: (id) => adminApi.delete(`/backgrounds/${id}/`),

  // Admin: Create size
  postSize: (data) => adminApi.post("/sizes/", data),

  // Admin: Update size
  updateSize: (id, data) => adminApi.patch(`/sizes/${id}/`, data),

  // Admin: Delete size
  deleteSize: (id) => adminApi.delete(`/sizes/${id}/`),

  // Admin: Create product category
  postProductCategory: (data) =>
    adminApi.post("/product-categories/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Admin: Update product category
  updateProductCategory: (id, data) =>
    adminApi.patch(`/product-categories/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Admin: Bulk upload product categories
  bulkUploadProductCategories: (formData) =>
    adminApi.post("/product-categories/bulk-upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Admin: Delete product category
  deleteProductCategory: (id) => adminApi.delete(`/product-categories/${id}/`),

  // Admin: Create artwork category
  postArtworkCategory: (data) =>
    adminApi.post("/artwork-categories/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Admin: Update artwork category
  updateArtworkCategory: (id, data) =>
    adminApi.patch(`/artwork-categories/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Admin: Delete artwork category
  deleteArtworkCategory: (id) => adminApi.delete(`/artwork-categories/${id}/`),

  // Admin: Create artwork category image
  postArtworkCategoryImage: (data) =>
    adminApi.post("/artworks-categories-image/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Admin: Update artwork category image
  updateArtworkCategoryImage: (id, data) =>
    adminApi.put(`/artworks-categories-image/${id}/`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Admin: Delete artwork category image
  deleteArtworkCategoryImage: (id) =>
    adminApi.delete(`/artworks-categories-image/${id}/`),
};
