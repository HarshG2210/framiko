// src/slices/admin/materialsSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { productsApi } from "../../services/api/productsApi";

// Fetch Materials
export const fetchMaterials = createAsyncThunk(
  "materials/fetchMaterials",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsApi.getMaterials();
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch materials");
    }
  }
);

// Post Material (expects FormData from component)
export const postMaterial = createAsyncThunk(
  "materials/postMaterial",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await productsApi.postMaterial(formData);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create material");
    }
  }
);

// Helper function to convert image URL to File
const fetchImageFile = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new File([blob], "image.jpg", { type: blob.type });
  } catch (err) {
    console.error("Error converting image URL to File:", err);
    return null;
  }
};

// Update Material (builds FormData here, image optional)
export const updateMaterial = createAsyncThunk(
  "materials/updateMaterial",
  async (data, { rejectWithValue }) => {
    try {
      const { id, ...updateData } = data;
      const formData = new FormData();

      for (const [key, value] of Object.entries(updateData)) {
        // Handle image field - can be File or URL string
        if (key === "image") {
          if (value instanceof File) {
            formData.append("image", value);
          } else if (typeof value === "string" && value) {
            // Convert URL string to File
            const imageFile = await fetchImageFile(value);
            if (imageFile) {
              formData.append("image", imageFile);
            }
          }
          continue;
        }

        if (value !== null && value !== undefined && value !== "") {
          formData.append(key, value);
        }
      }

      const response = await productsApi.updateMaterial(id, formData);
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update material");
    }
  }
);

// Delete Material
export const deleteMaterial = createAsyncThunk(
  "materials/deleteMaterial",
  async (id, { rejectWithValue }) => {
    try {
      await productsApi.deleteMaterial(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete material");
    }
  }
);

const materialsSlice = createSlice({
  name: "materials",
  initialState: {
    materials: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.materials = action.payload;
      })
      .addCase(fetchMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // POST
      .addCase(postMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.materials.push(action.payload);
      })
      .addCase(postMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // UPDATE
      .addCase(updateMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateMaterial.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.materials.findIndex(
          (material) => material.id === action.payload.id
        );
        if (index !== -1) state.materials[index] = action.payload;
      })
      .addCase(updateMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })

      // DELETE
      .addCase(deleteMaterial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteMaterial.fulfilled, (state, action) => {
        state.loading = false;
        state.materials = state.materials.filter(
          (material) => material.id !== action.payload
        );
      })
      .addCase(deleteMaterial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default materialsSlice.reducer;
