// src/slices/admin/artworksSlice.js
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { productsApi } from "../../services/api/productsApi";

// Fetch Artworks
export const fetchArtworks = createAsyncThunk(
  "artworks/fetchArtworks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await productsApi.getArtworks();
      return response;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch artworks");
    }
  }
);

// Delete Artwork
export const deleteArtwork = createAsyncThunk(
  "artworks/deleteArtwork",
  async (id, { rejectWithValue }) => {
    try {
      await productsApi.deleteArtwork(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete artwork");
    }
  }
);

// Bulk delete artworks
export const bulkDeleteArtworks = createAsyncThunk(
  "artworks/bulkDeleteArtworks",
  async (ids, { rejectWithValue }) => {
    try {
      await productsApi.bulkDeleteArtworks(ids);
      return ids;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to bulk delete artworks");
    }
  }
);

const artworksSlice = createSlice({
  name: "artworks",
  initialState: {
    artworks: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchArtworks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtworks.fulfilled, (state, action) => {
        state.loading = false;
        state.artworks = action.payload;
      })
      .addCase(fetchArtworks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteArtwork.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArtwork.fulfilled, (state, action) => {
        state.loading = false;
        state.artworks = state.artworks.filter(
          (artwork) => artwork.id !== action.payload
        );
      })
      .addCase(deleteArtwork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(bulkDeleteArtworks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkDeleteArtworks.fulfilled, (state, action) => {
        state.loading = false;
        state.artworks = state.artworks.filter(
          (artwork) => !action.payload.includes(artwork.id)
        );
      })
      .addCase(bulkDeleteArtworks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default artworksSlice.reducer;
