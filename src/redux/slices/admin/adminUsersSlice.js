import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { adminUsersApi } from "../../../services/api/adminApi";

// ============================================
// THUNKS
// ============================================

export const fetchAllUsers = createAsyncThunk(
  "admin/users/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminUsersApi.getAllUsers(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Failed to fetch users"
      );
    }
  }
);

export const fetchUserDetails = createAsyncThunk(
  "admin/users/fetchDetails",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminUsersApi.getUserDetails(userId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Failed to fetch user details"
      );
    }
  }
);

export const updateUserData = createAsyncThunk(
  "admin/users/update",
  async ({ userId, data }, { rejectWithValue }) => {
    try {
      const response = await adminUsersApi.updateUser(userId, data);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Failed to update user"
      );
    }
  }
);

export const blockUnblockUser = createAsyncThunk(
  "admin/users/toggleBlock",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminUsersApi.toggleUserBlock(userId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Failed to toggle user block status"
      );
    }
  }
);

export const deleteUserAccount = createAsyncThunk(
  "admin/users/delete",
  async (userId, { rejectWithValue }) => {
    try {
      await adminUsersApi.deleteUser(userId);
      return userId;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Failed to delete user"
      );
    }
  }
);

export const fetchUserActivity = createAsyncThunk(
  "admin/users/fetchActivity",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await adminUsersApi.getUserActivityLog(userId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Failed to fetch user activity"
      );
    }
  }
);

export const exportUsersData = createAsyncThunk(
  "admin/users/export",
  async (format = "csv", { rejectWithValue }) => {
    try {
      const blob = await adminUsersApi.exportUsers(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `users_${new Date().getTime()}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);
      return { success: true, format };
    } catch (error) {
      return rejectWithValue(
        error?.message || "Failed to export users"
      );
    }
  }
);

// ============================================
// SLICE
// ============================================

const adminUsersSlice = createSlice({
  name: "admin/users",
  initialState: {
    users: [],
    selectedUser: null,
    userActivity: [],
    loading: false,
    error: null,
    filters: {
      search: "",
      status: "all", // all, active, blocked
      sortBy: "joinedDate", // name, email, totalSpent, joinedDate
      page: 1,
      limit: 20,
    },
    pagination: {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    },
  },

  reducers: {
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
      state.filters.page = 1;
    },
    setStatusFilter: (state, action) => {
      state.filters.status = action.payload;
      state.filters.page = 1;
    },
    setSortBy: (state, action) => {
      state.filters.sortBy = action.payload;
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
      state.userActivity = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // Fetch all users
    builder
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data || action.payload;
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch user details
    builder
      .addCase(fetchUserDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update user
    builder
      .addCase(updateUserData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserData.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.selectedUser = action.payload;
      })
      .addCase(updateUserData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Block/Unblock user
    builder
      .addCase(blockUnblockUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(blockUnblockUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex(u => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        if (state.selectedUser?.id === action.payload.id) {
          state.selectedUser = action.payload;
        }
      })
      .addCase(blockUnblockUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete user
    builder
      .addCase(deleteUserAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUserAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter(u => u.id !== action.payload);
        if (state.selectedUser?.id === action.payload) {
          state.selectedUser = null;
        }
      })
      .addCase(deleteUserAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch user activity
    builder
      .addCase(fetchUserActivity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserActivity.fulfilled, (state, action) => {
        state.loading = false;
        state.userActivity = action.payload.data || action.payload;
      })
      .addCase(fetchUserActivity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Export users
    builder
      .addCase(exportUsersData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportUsersData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportUsersData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSearchFilter,
  setStatusFilter,
  setSortBy,
  setPage,
  clearSelectedUser,
  clearError,
} = adminUsersSlice.actions;

export default adminUsersSlice.reducer;
