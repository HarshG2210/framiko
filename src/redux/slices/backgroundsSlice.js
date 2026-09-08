// src/slices/admin/backgroundsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { productsApi } from "../../services/api/productsApi";

const fetchImageFile = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    const filename = imageUrl
      .split("/")
      .pop()
      .split("?")[0] || "background.png";

    return new File([blob], filename, {
      type: blob.type || "image/png",
    });
  } catch (err) {
    console.warn("Unable to fetch existing background image for update", err);
    return null;
  }
};

// Fetch Backgrounds
export const fetchBackgrounds = createAsyncThunk(
  "backgrounds/fetchBackgrounds",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsApi.getBackgrounds();
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch backgrounds");
    }
  }
);

// Post Background (expects FormData from component)
export const postBackground = createAsyncThunk(
  "backgrounds/postBackground",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await productsApi.postBackground(formData);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create background");
    }
  }
);

// Update Background (name, description, image; image optional)
export const updateBackground = createAsyncThunk(
  "backgrounds/updateBackground",
  async (data, { rejectWithValue }) => {
    try {
      const { id, ...updateData } = data;
      const formData = new FormData();

      let imageValue = updateData.image;
      if (!(imageValue instanceof File) && typeof imageValue === "string") {
        imageValue = await fetchImageFile(imageValue);
      }

      Object.keys(updateData).forEach((key) => {
        const value = key === "image" ? imageValue : updateData[key];

        if (key === "image") {
          if (value instanceof File) {
            formData.append("image", value);
          }
          return;
        }

        if (value !== null && value !== undefined && value !== "") {
          formData.append(key, value);
        }
      });

      const response = await productsApi.updateBackground(id, formData);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update background");
    }
  }
);

// Delete Background
export const deleteBackground = createAsyncThunk(
  "backgrounds/deleteBackground",
  async (id, { rejectWithValue }) => {
    try {
      await productsApi.deleteBackground(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete background");
    }
  }
);

const backgroundsSlice = createSlice({
  name: "backgrounds",
  initialState: {
    backgrounds: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchBackgrounds.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBackgrounds.fulfilled, (state, action) => {
        state.loading = false;
        state.backgrounds = action.payload;
      })
      .addCase(fetchBackgrounds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // POST
      .addCase(postBackground.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postBackground.fulfilled, (state, action) => {
        state.loading = false;
        state.backgrounds.push(action.payload);
      })
      .addCase(postBackground.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // UPDATE
      .addCase(updateBackground.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateBackground.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.backgrounds.findIndex(
          (background) => background.id === action.payload.id
        );
        if (index !== -1) state.backgrounds[index] = action.payload;
      })
      .addCase(updateBackground.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // DELETE
      .addCase(deleteBackground.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteBackground.fulfilled, (state, action) => {
        state.loading = false;
        state.backgrounds = state.backgrounds.filter(
          (background) => background.id !== action.payload
        );
      })
      .addCase(deleteBackground.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default backgroundsSlice.reducer;
