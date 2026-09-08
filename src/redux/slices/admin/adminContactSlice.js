import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { adminContactApi } from "../../../services/api/adminApi";
import { toast } from "react-toastify";

export const fetchAdminContactMessages = createAsyncThunk(
  "adminContact/fetchAdminContactMessages",
  async (_, { rejectWithValue }) => {
    try {
      const data = await adminContactApi.getContactMessages();
      return data;
    } catch (error) {
      const message = error?.message || "Failed to load contact messages";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const adminContactSlice = createSlice({
  name: "adminContact",
  initialState: {
    messages: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminContactMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminContactMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload || [];
      })
      .addCase(fetchAdminContactMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default adminContactSlice.reducer;
