import { userApi } from "./axiosInstance";

// ============================================
// WISHLIST APIs
// Centralized wishlist API wrapper used by slices
// ============================================

export const wishlistApi = {
  // Get the full wishlist
  getWishlist: () => userApi.get("/wishlist/"),

  addProductToWishlist: async (productId) => {
    try {
      return await userApi.post(`/wishlist/products/${productId}/`);
    } catch (error) {
      console.log("Wishlist service add product error:", error);
      throw error;
    }
  },

  removeProductFromWishlist: async (productId) => {
    try {
      return await userApi.delete(`/wishlist/products/${productId}/`);
    } catch (error) {
      console.log("Wishlist service remove product error:", error);
      throw error;
    }
  },

  addArtworkToWishlist: async (artworkId, frameId) => {
    try {
      const payload = frameId != null ? { frame_id: Number(frameId) } : {};
      return await userApi.post(`/wishlist/artworks/${artworkId}/`, payload);
    } catch (error) {
      console.log("Wishlist service add artwork error:", error);
      throw error;
    }
  },

  removeArtworkFromWishlist: async (artworkId) => {
    try {
      return await userApi.delete(`/wishlist/artworks/${artworkId}/`);
    } catch (error) {
      console.log("Wishlist service remove artwork error:", error);
      throw error;
    }
  },
};

export default wishlistApi;
