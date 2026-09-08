// src/redux/slices/artworkCategoriesSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { API_BASE } from "../../utils/constant";
import adminApi from "../../services/adminApi";

// Fetch Artwork Categories
export const fetchArtworkCategories = createAsyncThunk(
  "artworkCategories/fetchArtworkCategories",
  async () => {
    const response = await adminApi.get("/artwork-categories/");
    return response.data;
  },
);

// Post Artwork Category (only name needed)
export const postArtworkCategory = createAsyncThunk(
  "artworkCategories/postArtworkCategory",
  async (data) => {
    const response = await adminApi.post("/artwork-categories/", data);
    console.log("Post Artwork Category", response.data);
    return response.data;
  },
);

export const bulkUploadArtworkCategories = createAsyncThunk(
  "artworkCategories/bulkUploadArtworkCategories",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await adminApi.post(
        "/artwork-categories/bulk-upload/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to bulk upload artwork categories",
      );
    }
  },
);

// Update Artwork Category (only name; use PATCH so it's partial)
export const updateArtworkCategory = createAsyncThunk(
  "artworkCategories/updateArtworkCategory",
  async ({ id, ...updateData }) => {
    const response = await adminApi.patch(
      `/artwork-categories/${id}/`,
      updateData,
    );
    console.log("Update Artwork Category", response.data);
    return response.data;
  },
);

// Delete Artwork Category
export const deleteArtworkCategory = createAsyncThunk(
  "artworkCategories/deleteArtworkCategory",
  async (id) => {
    await adminApi.delete(`/artwork-categories/${id}/`);
    return id;
  },
);

const artworkCategoriesSlice = createSlice({
  name: "artworkCategories",
  initialState: {
    artworkCategories: [],
    loading: false,
    error: null,
    bulkUploadLoading: false,
    bulkUploadResult: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchArtworkCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtworkCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.artworkCategories = action.payload;
      })
      .addCase(fetchArtworkCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // POST
      .addCase(postArtworkCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postArtworkCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.artworkCategories.push(action.payload);
      })
      .addCase(postArtworkCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      .addCase(bulkUploadArtworkCategories.pending, (state) => {
        state.bulkUploadLoading = true;
        state.error = null;
        state.bulkUploadResult = null;
      })
      .addCase(bulkUploadArtworkCategories.fulfilled, (state, action) => {
        state.bulkUploadLoading = false;
        state.bulkUploadResult = action.payload;
      })
      .addCase(bulkUploadArtworkCategories.rejected, (state, action) => {
        state.bulkUploadLoading = false;
        state.error = action.payload || action.error.message;
      })

      // UPDATE
      .addCase(updateArtworkCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArtworkCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.artworkCategories.findIndex(
          (category) => category.id === action.payload.id,
        );
        if (index !== -1) state.artworkCategories[index] = action.payload;
      })
      .addCase(updateArtworkCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // DELETE
      .addCase(deleteArtworkCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArtworkCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.artworkCategories = state.artworkCategories.filter(
          (category) => category.id !== action.payload,
        );
      })
      .addCase(deleteArtworkCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default artworkCategoriesSlice.reducer;
