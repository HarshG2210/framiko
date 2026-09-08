// src/slices/admin/sizesSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { API_BASE } from "../../utils/constant";
import adminApi from "../../services/adminApi";
import axios from "axios";

/* -------------------- Post Size (UNCHANGED) -------------------- */
export const postSize = createAsyncThunk(
  "sizes/postSize",
  async (data, { rejectWithValue }) => {
    try {
      const response = await adminApi.post("sizes/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create sizes");
    }
  },
);

export const bulkUploadSizes = createAsyncThunk(
  "sizes/bulkUploadSizes",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await adminApi.post("sizes/bulk-upload/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to bulk upload sizes",
      );
    }
  },
);

/* -------------------- Fetch Sizes (UNCHANGED) -------------------- */
export const fetchSizes = createAsyncThunk("sizes/fetchSizes", async () => {
  const response = await axios.get(`${API_BASE}sizes/`);
  return response.data;
});

/* -------------------- Update Size (UPDATED) -------------------- */
export const updateSize = createAsyncThunk(
  "sizes/updateSize",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await adminApi.put(`sizes/${id}/`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update size");
    }
  },
);

/* -------------------- Delete Size (UPDATED) -------------------- */
export const deleteSize = createAsyncThunk(
  "sizes/deleteSize",
  async (id, { rejectWithValue }) => {
    try {
      await adminApi.delete(`sizes/${id}/`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete size");
    }
  },
);

const sizesSlice = createSlice({
  name: "sizes",
  initialState: {
    sizes: [],
    loading: false,
    error: null,
    bulkUploadLoading: false,
    bulkUploadResult: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* -------------------- POST -------------------- */
      .addCase(postSize.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postSize.fulfilled, (state, action) => {
        state.loading = false;
        state.sizes.push(action.payload);
      })
      .addCase(postSize.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      /* -------------------- BULK UPLOAD -------------------- */
      .addCase(bulkUploadSizes.pending, (state) => {
        state.bulkUploadLoading = true;
        state.error = null;
        state.bulkUploadResult = null;
      })
      .addCase(bulkUploadSizes.fulfilled, (state, action) => {
        state.bulkUploadLoading = false;
        state.bulkUploadResult = action.payload;
      })
      .addCase(bulkUploadSizes.rejected, (state, action) => {
        state.bulkUploadLoading = false;
        state.error = action.payload || action.error.message;
      })

      /* -------------------- FETCH -------------------- */
      .addCase(fetchSizes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSizes.fulfilled, (state, action) => {
        state.loading = false;
        state.sizes = action.payload;
      })
      .addCase(fetchSizes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      /* -------------------- UPDATE -------------------- */
      .addCase(updateSize.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSize.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.sizes.findIndex(
          (size) => size.id === action.payload.id,
        );
        if (index !== -1) state.sizes[index] = action.payload;
      })
      .addCase(updateSize.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      /* -------------------- DELETE -------------------- */
      .addCase(deleteSize.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSize.fulfilled, (state, action) => {
        state.loading = false;
        state.sizes = state.sizes.filter((size) => size.id !== action.payload);
      })
      .addCase(deleteSize.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export default sizesSlice.reducer;
