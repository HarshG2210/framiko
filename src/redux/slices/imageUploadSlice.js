import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import customizationApi from "../../services/api/customizationApi";

const initialState = {
  uploadedImageUrl: null,
  uploadedImageId: null,
  uploading: false,
  uploadError: null,
};

export const uploadImage = createAsyncThunk(
  "imageUpload/uploadImage",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("image_file", file);
      formData.append("is_user_uploaded", "false");

      const response = await customizationApi.uploadImage(formData);

      return response;
    } catch (error) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Image upload failed";
      return rejectWithValue(message);
    }
  }
);

const imageUploadSlice = createSlice({
  name: "imageUpload",
  initialState,
  reducers: {
    clearUploadState: (state) => {
      state.uploadedImageUrl = null;
      state.uploadedImageId = null;
      state.uploading = false;
      state.uploadError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadImage.pending, (state) => {
        state.uploading = true;
        state.uploadError = null;
        state.uploadedImageUrl = null;
      })
      .addCase(uploadImage.fulfilled, (state, action) => {
        state.uploading = false;

        state.uploadedImageUrl =
          action.payload?.image_url || action.payload?.image_file || null;
        state.uploadedImageId = action.payload?.id || null;
      })
      .addCase(uploadImage.rejected, (state, action) => {
        state.uploading = false;
        state.uploadError = action.payload;
      });
  },
});

export const { clearUploadState } = imageUploadSlice.actions;
export default imageUploadSlice.reducer;
