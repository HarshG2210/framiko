import { publicApi, userApi } from "./axiosInstance";

import { loadAuthData } from "../../services/authStorage";

// ============================================
// AUTHENTICATION APIs (legacy endpoints compatibility)
// Maps new API layer methods to the old `registration/...` endpoints
// so existing slices can migrate to the api layer without changing URLs.
// ============================================

export const authApi = {
  // User Signup (registration/register/)
  signup: (data) => publicApi.post("/registration/register/", data),

  // User Login (registration/login/)
  login: (payload) => publicApi.post("/registration/login/", payload),

  // OTP Verification (registration/verify-otp/)
  verifyOTP: (payload) => publicApi.post("/registration/verify-otp/", payload),

  // Forgot Password OTP Verification (registration/verify-reset-otp/)
  verifyResetOTP: (payload) => publicApi.post("/registration/verify-reset-otp/", payload),

  // Get User Profile (registration/profile/)
  getUserProfile: () => {
    const { token } = loadAuthData();
    if (!token) {
      return Promise.reject({
        response: {
          status: 401,
          data: { detail: "Authentication token missing" },
        },
        message: "Authentication token missing",
      });
    }
    return userApi.get("/registration/profile/");
  },

  // Update User Profile (registration/edit-profile/)
  updateProfile: (data) => userApi.put("/registration/edit-profile/", data),

  // Upload Profile Picture (reuse edit-profile or specific endpoint)
  uploadProfilePicture: (formData) =>
    userApi.put("/registration/upload-profile-pic/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Logout (registration/logout/)
  logout: () => userApi.post("/registration/logout/"),

  // Forgot Password (registration/forget-password/)
  forgotPassword: (payload) => publicApi.post("/registration/forget-password/", payload),

  // Reset Password (registration/reset-password/)
  resetPassword: (payload) => publicApi.post("/registration/reset-password/", payload),

  // Resend OTP (registration/resend-otp/)
  resendOTP: (payload) => publicApi.post("/registration/resend-otp/", payload),

  // Complete Profile (after signup)
  completeProfile: (data) => userApi.post("/registration/profile/complete/", data),

  // Delete Account (registration/delete-account/)
  deleteAccount: (payload) => publicApi.post("/registration/delete-account/", payload),
};
