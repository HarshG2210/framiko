import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { publicApi } from "../../services/api/axiosInstance";
import { toast } from "react-toastify";

export const submitContactMessage = createAsyncThunk(
  "contact/submitContactMessage",
  async (data, { rejectWithValue }) => {
    try {
      const response = await publicApi.post("/contact-us/", data);
      toast.success(response?.message || "Contact message sent successfully");
      return response;
    } catch (error) {
      const message = error?.message || "Failed to send contact message";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const contactSlice = createSlice({
  name: "contact",
  initialState: {
    loading: false,
    success: false,
    error: null,
  },
  reducers: {
    clearContactState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(submitContactMessage.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(submitContactMessage.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(submitContactMessage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearContactState } = contactSlice.actions;
export default contactSlice.reducer;
