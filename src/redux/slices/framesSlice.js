// src/redux/slices/admin/framesSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { productsApi } from "../../services/api/productsApi";
import { toast } from "react-toastify";

/* ------------------- Thunks ------------------- */

// Create Frame
export const postFrame = createAsyncThunk(
  "frames/postFrame",
  async (data, { rejectWithValue }) => {
    try {
      const response = await productsApi.postFrame(data);
      toast.success("Frame created successfully");
      return response;
    } catch (err) {
      toast.error("Failed to create frame");
      return rejectWithValue(err.response?.data || "Failed to create frame");
    }
  },
);

// Fetch Frames
export const fetchFrames = createAsyncThunk(
  "frames/fetchFrames",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsApi.getFrames();
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch frames");
    }
  },
);

// Update Frame
export const updateFrame = createAsyncThunk(
  "frames/updateFrame",
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      const hasNewImage = formData.image instanceof File;
      const hasNewSelectorImage = formData.selector_image instanceof File;
      const hasFileUpload = hasNewImage || hasNewSelectorImage;
      const payload = hasFileUpload
        ? new FormData()
        : {
            name: formData.name,
            description: formData.description,
            price_addition: formData.price_addition,
            thickness: formData.thickness,
            supported_sizes: formData.supported_sizes,
          };

      if (hasFileUpload) {
        payload.append("name", formData.name);
        payload.append("description", formData.description);
        payload.append("price_addition", formData.price_addition);
        payload.append("thickness", formData.thickness);
        formData.supported_sizes.forEach((id) =>
          payload.append("supported_sizes", id),
        );
        if (hasNewImage) {
          payload.append("image", formData.image);
        }
        if (hasNewSelectorImage) {
          payload.append("selector_image", formData.selector_image);
        }
      }

      const method = hasFileUpload ? "put" : "patch";

      const response = await productsApi.updateFrame(id, payload, {
        method,
        isFormData: hasFileUpload,
      });

      toast.success("Frame updated successfully");
      return response;
    } catch (err) {
      toast.error("Failed to update frame");
      return rejectWithValue(err.response?.data || "Failed to update frame");
    }
  },
);

// Delete Frame
export const deleteFrame = createAsyncThunk(
  "frames/deleteFrame",
  async (id, { rejectWithValue }) => {
    try {
      await productsApi.deleteFrame(id);
      toast.success("Frame deleted successfully");
      return id;
    } catch (err) {
      toast.error("Failed to delete frame");
      return rejectWithValue(err.response?.data || "Failed to delete frame");
    }
  },
);

const framesSlice = createSlice({
  name: "frames",
  initialState: {
    frames: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFrames.pending, (s) => {
        s.loading = true;
      })
      .addCase(fetchFrames.fulfilled, (s, a) => {
        s.loading = false;
        const payload = a.payload;
        if (Array.isArray(payload)) {
          s.frames = payload;
        } else if (payload && Array.isArray(payload.data)) {
          s.frames = payload.data;
        } else if (payload && Array.isArray(payload.results)) {
          s.frames = payload.results;
        } else if (payload && Array.isArray(payload.frames)) {
          s.frames = payload.frames;
        } else {
          s.frames = [];
        }
      })
      .addCase(fetchFrames.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })

      .addCase(postFrame.fulfilled, (s, a) => {
        s.frames.push(a.payload);
      })

      .addCase(updateFrame.fulfilled, (s, a) => {
        const idx = s.frames.findIndex((f) => f.id === a.payload.id);
        if (idx !== -1) s.frames[idx] = a.payload;
      })

      .addCase(deleteFrame.fulfilled, (s, a) => {
        s.frames = s.frames.filter((f) => f.id !== a.payload);
      });
  },
});

export default framesSlice.reducer;
