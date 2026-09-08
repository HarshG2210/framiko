import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { productsApi } from "../../services/api/productsApi";

/* ================= FETCH ================= */
export const fetchArtworkCategoryImages = createAsyncThunk(
  "artworkCategoryImages/fetchArtworkCategoryImages",
  async () => {
    return await productsApi.getArtworkCategoryImages();
  }
);

/* ================= POST ================= */
export const postArtworkCategoryImage = createAsyncThunk(
  "artworkCategoryImages/postArtworkCategoryImage",
  async (data, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("category", data.category);

      if (data.image_file instanceof File) {
        formData.append("image_file", data.image_file);
      }

      if (data.image_url) {
        formData.append("image_url", data.image_url);
      }

      if (data.description) {
        formData.append("description", data.description);
      }

      if (data.supported_sizes !== null && data.supported_sizes !== undefined) {
        formData.append("supported_sizes", data.supported_sizes.toString());
      }

      formData.append(
        "is_user_uploaded",
        data.is_user_uploaded ? "true" : "false"
      );

      return await productsApi.postArtworkCategoryImage(formData);
    } catch (error) {
      console.error("POST ERROR:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

/* ================= UPDATE (PATCH) ================= */
export const updateArtworkCategoryImage = createAsyncThunk(
  "artworkCategoryImages/updateArtworkCategoryImage",
  async (data, { rejectWithValue }) => {
    try {
      const { id, ...updateData } = data;
      const formData = new FormData();

      if (updateData.category) {
        formData.append("category", updateData.category);
      }

      if (updateData.image_file instanceof File) {
        formData.append("image_file", updateData.image_file);
      }

      if (updateData.image_url !== undefined) {
        formData.append("image_url", updateData.image_url);
      }

      if (updateData.description !== undefined) {
        formData.append("description", updateData.description);
      }

      if (
        updateData.supported_sizes !== null &&
        updateData.supported_sizes !== undefined
      ) {
        formData.append(
          "supported_sizes",
          updateData.supported_sizes.toString()
        );
      }

      formData.append(
        "is_user_uploaded",
        updateData.is_user_uploaded ? "true" : "false"
      );

      return await productsApi.updateArtworkCategoryImage(id, formData);
    } catch (error) {
      console.error("UPDATE ERROR:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

/* ================= DELETE ================= */
export const deleteArtworkCategoryImage = createAsyncThunk(
  "artworkCategoryImages/deleteArtworkCategoryImage",
  async (id, { rejectWithValue }) => {
    try {
      await productsApi.deleteArtworkCategoryImage(id);
      return id;
    } catch (error) {
      console.error("DELETE ERROR:", error.response?.data || error.message);
      return rejectWithValue(
        error.response?.data || { message: error.message }
      );
    }
  }
);

/* ================= SLICE ================= */
const artworkCategoryImagesSlice = createSlice({
  name: "artworkCategoryImages",
  initialState: {
    artworkCategoryImages: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      /* FETCH */
      .addCase(fetchArtworkCategoryImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtworkCategoryImages.fulfilled, (state, action) => {
        state.loading = false;
        state.artworkCategoryImages = action.payload;
      })
      .addCase(fetchArtworkCategoryImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      /* POST */
      .addCase(postArtworkCategoryImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postArtworkCategoryImage.fulfilled, (state, action) => {
        state.loading = false;
        state.artworkCategoryImages.push(action.payload);
      })
      .addCase(postArtworkCategoryImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })

      /* UPDATE */
      .addCase(updateArtworkCategoryImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArtworkCategoryImage.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.artworkCategoryImages.findIndex(
          (img) => img.id === action.payload.id
        );
        if (index !== -1) {
          state.artworkCategoryImages[index] = action.payload;
        }
      })
      .addCase(updateArtworkCategoryImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      })

      /* DELETE */
      .addCase(deleteArtworkCategoryImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArtworkCategoryImage.fulfilled, (state, action) => {
        state.loading = false;
        state.artworkCategoryImages = state.artworkCategoryImages.filter(
          (img) => img.id !== action.payload
        );
      })
      .addCase(deleteArtworkCategoryImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error.message;
      });
  },
});

export default artworkCategoryImagesSlice.reducer;
