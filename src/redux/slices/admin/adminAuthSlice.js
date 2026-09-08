import {
  clearAdminToken,
  loadAdminToken,
  saveAdminToken,
} from "../../../services/authStorage";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { adminAuthApi } from "../../../services/api/adminApi";
import { toast } from "react-toastify";

// Try to restore token from storage
const storedAdminToken = loadAdminToken();

// ============================================
// THUNKS
// ============================================

/**
 * Admin Login Thunk
 * Uses centralized admin API for login
 */
export const adminLogin = createAsyncThunk(
  "admin/auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await adminAuthApi.login(credentials);

      const token = response.token || response.access;
      if (!token) {
        return rejectWithValue("No token received from server");
      }

      saveAdminToken(token);

      toast.success("Admin login successful!", {
        position: "top-right",
        autoClose: 3000,
      });

      return {
        token,
        adminInfo: response.admin || response.user || null,
      };
    } catch (error) {
      const errorMsg =
        error?.message || error?.response?.data?.detail || "Admin login failed";

      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
      });

      return rejectWithValue(errorMsg);
    }
  }
);

/**
 * Admin Logout Thunk
 * Uses centralized admin API for logout
 */
export const adminLogout = createAsyncThunk(
  "admin/auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await adminAuthApi.logout();
      clearAdminToken();

      toast.success("Admin logged out successfully.", {
        position: "top-right",
        autoClose: 3000,
      });

      return true;
    } catch (error) {
      const errorMsg = error?.message || "Logout failed";

      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
      });

      return rejectWithValue(errorMsg);
    }
  }
);

/**
 * Fetch Admin Profile Thunk
 */
export const fetchAdminProfile = createAsyncThunk(
  "admin/auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminAuthApi.getProfile();
      return response;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch profile");
    }
  }
);

/**
 * Update Admin Profile Thunk
 */
export const updateAdminProfile = createAsyncThunk(
  "admin/auth/updateProfile",
  async (data, { rejectWithValue }) => {
    try {
      const response = await adminAuthApi.updateProfile(data);

      toast.success("Profile updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      return response;
    } catch (error) {
      const errorMsg = error?.message || "Failed to update profile";

      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
      });

      return rejectWithValue(errorMsg);
    }
  }
);

// ============================================
// SLICE
// ============================================

const adminAuthSlice = createSlice({
  name: "admin/auth",
  initialState: {
    token: storedAdminToken || null,
    isAuthenticated: !!storedAdminToken,
    admin: null,
    loading: false,
    error: null,
  },

  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
    clearAdminAuth: (state) => {
      state.token = null;
      state.isAuthenticated = false;
      state.admin = null;
      state.error = null;
      clearAdminToken();
    },
  },

  extraReducers: (builder) => {
    // ======== Admin Login ========
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.isAuthenticated = true;
        state.admin = action.payload.adminInfo || null;
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.admin = null;
        state.error = action.payload;
      });

    // ======== Admin Logout ========
    builder
      .addCase(adminLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.token = null;
        state.admin = null;
        clearAdminToken();
      })
      .addCase(adminLogout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Logout failed";
      });

    // ======== Fetch Admin Profile ========
    builder
      .addCase(fetchAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
      })
      .addCase(fetchAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // ======== Update Admin Profile ========
    builder
      .addCase(updateAdminProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.admin = action.payload;
      })
      .addCase(updateAdminProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearAdminError, clearAdminAuth } = adminAuthSlice.actions;
export default adminAuthSlice.reducer;
