// src/redux/categoriesSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_BASE } from "../../utils/constant";

const initialState = {
  artworksCategories: [],
  artworksCategoriesImage: [],
  loading: false,
  error: null,
  selectedCategoryImage: null,
  supportedSizes: null,
};

export const fetchcategories = createAsyncThunk(
  "categories/fetchcategories",
  async (_, { rejectWithValue }) => {
    try {
      const [artworkCategoriesRes, artworksCategoriesImageRes] =
        await Promise.all([
          axios.get(`${API_BASE}artwork-categories`),
          axios.get(`${API_BASE}artworks-categories-image`),
        ]);

      return {
        artworksCategories: artworkCategoriesRes.data,
        artworksCategoriesImage: artworksCategoriesImageRes.data,
      };
    } catch (error) {
      console.log("Error categories assets:", error);
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setSelectedCategoryImage: (state, action) => {
      state.selectedCategoryImage = action.payload;
    },
    clearSelectedCategoryImage: (state) => {
      state.selectedCategoryImage = null;
    },
    setSupportedSizes: (state, action) => {
      state.supportedSizes = action.payload;
    },
    clearSupportedSizes: (state) => {
      state.supportedSizes = null;
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchcategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchcategories.fulfilled, (state, action) => {
        state.loading = false;
        state.artworksCategories = action.payload.artworksCategories || [];
        state.artworksCategoriesImage =
          action.payload.artworksCategoriesImage || [];
      })
      .addCase(fetchcategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch assets";
      });
  },
});

export const {
  setSelectedCategoryImage,
  clearSelectedCategoryImage,
  setSupportedSizes,
  clearSupportedSizes,
} = categoriesSlice.actions;
export default categoriesSlice.reducer;
