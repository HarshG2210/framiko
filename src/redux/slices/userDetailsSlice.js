import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { adminUsersApi } from "../../services/api/adminApi";

const normalizeUsersPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.users)) return payload.users;
  if (typeof payload === "string") {
    return payload.includes("<!doctype html>") ? [] : [];
  }
  return [];
};

/* ================= USERS LIST ================= */
export const fetchUserDetails = createAsyncThunk(
  "users/fetchUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      const response = await adminUsersApi.getOwnerUsersList();
      return normalizeUsersPayload(response);
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error?.message || "Failed to fetch user details"
      );
    }
  }
);

/* ================= DASHBOARD USER STATS ================= */
export const fetchDashboardUserStats = createAsyncThunk(
  "users/fetchDashboardUserStats",
  async (_, { rejectWithValue }) => {
    try {
      return await adminUsersApi.getOwnerDashboardUserStats();
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error?.message || "Failed to fetch user dashboard stats"
      );
    }
  }
);

const userDetailsSlice = createSlice({
  name: "userDetails",
  initialState: {
    userDetails: [],
    dashboardStats: {
      total_users: 0,
      this_week: 0,
      this_month: 0,
      this_year: 0,
    },
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* ---------- USERS LIST ---------- */
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.userDetails = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ---------- DASHBOARD STATS ---------- */
      .addCase(fetchDashboardUserStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardUserStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardUserStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default userDetailsSlice.reducer;
