import { publicApi, userApi } from "./axiosInstance";

// ============================================
// CUSTOMIZATION APIs
// ============================================

export const customizationApi = {
  // Upload image
  uploadImage: (formData) =>
    publicApi.post("/artworks/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Save customized preview
  saveCustomization: (data) =>
    userApi.post("/api/customization/save", data),

  // Get saved customizations
  getSavedCustomizations: () =>
    userApi.get("/api/customization/saved"),

  // Get customization by ID
  getCustomizationById: (customizationId) =>
    userApi.get(`/api/customization/${customizationId}`),

  // Update customization
  updateCustomization: (customizationId, data) =>
    userApi.patch(`/api/customization/${customizationId}`, data),

  // Delete customization
  deleteCustomization: (customizationId) =>
    userApi.delete(`/api/customization/${customizationId}`),

  // Export customization as image
  exportCustomization: (customizationId, format = "png") =>
    userApi.get(`/api/customization/${customizationId}/export`, {
      params: { format },
      responseType: "blob",
    }),

  // Duplicate customization
  duplicateCustomization: (customizationId) =>
    userApi.post(`/api/customization/${customizationId}/duplicate`),

  // Share customization (get shareable link)
  shareCustomization: (customizationId) =>
    userApi.post(`/api/customization/${customizationId}/share`),

  // Get shared customization
  getSharedCustomization: (shareToken) =>
    userApi.get(`/api/customization/shared/${shareToken}`),

  // Submit customized final image
  submitCustomizedFinalImage: (data) =>
    publicApi.post("/customized-artworks/", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Get customized final images list
  getCustomizedFinalImages: () => publicApi.get("/customized-artworks/"),

  // Get customized final image
  getCustomizedFinalImage: (id) =>
    publicApi.get(`/customized-artworks/${id}`),

  // Update customized final image
  updateCustomizedFinalImage: (id, data) =>
    publicApi.patch(`/customized-artworks/${id}`, data),

  // Delete customized final image
  deleteCustomizedFinalImage: (id) =>
    publicApi.delete(`/customized-artworks/${id}`),
};

export default customizationApi;
