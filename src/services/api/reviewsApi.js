import { publicApi, userApi } from "./axiosInstance";

export const reviewsApi = {
  // Get reviews for a content type and object
  getReviews: (contentType, objectId) =>
    publicApi.get("/api/reviews/", {
      params: { content_type: contentType, object_id: objectId },
    }),

  // Create product review
  createProductReview: (productId, formData) =>
    userApi.post(`/products/${productId}/reviews/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Create artwork category image review
  createArtworkCategoryImageReview: (imageId, formData) =>
    userApi.post(`/artworks-categories-image/${imageId}/reviews/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Create order review (customized artwork or product from order)
  createOrderReview: (contentType, objectId, formData) => {
    const formDataWithContentType = new FormData();
    for (const [key, value] of formData.entries()) {
      formDataWithContentType.append(key, value);
    }
    formDataWithContentType.append("content_type", contentType);
    formDataWithContentType.append("object_id", objectId);

    // Route based on content type
    if (contentType === "product") {
      return userApi.post(`/products/${objectId}/reviews/`, formDataWithContentType, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } else if (contentType === "artworkcategoryimage") {
      return userApi.post(`/artworks-categories-image/${objectId}/reviews/`, formDataWithContentType, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    }

    return Promise.reject(new Error("Invalid content type"));
  },
};
