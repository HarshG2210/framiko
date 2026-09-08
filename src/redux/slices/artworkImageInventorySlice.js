// src/redux/slices/artworkImageInventorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { adminInventoryLegacy } from "../../services/api/adminApi";

// GET /inventory/artwork-image-inventory/
export const fetchArtworkImageInventory = createAsyncThunk(
  "artworkImageInventory/fetchArtworkImageInventory",
  async (_, { rejectWithValue }) => {
    try {
      const data = await adminInventoryLegacy.getArtworkImageInventory();

      // Expected shape: [{ id, category_name, quantity, category, image }]
      return Array.isArray(data) ? data : [];
    } catch (error) {
      console.error("fetchArtworkImageInventory error", error);
      const msg = error?.message || error?.data || "Network error while fetching artwork image inventory.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

// POST /inventory/artwork-image-inventory/add-update/
export const addOrUpdateArtworkImageInventory = createAsyncThunk(
  "artworkImageInventory/addOrUpdateArtworkImageInventory",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const body = {
        category: Number(payload.category),
        image: Number(payload.image),
        quantity: Number(payload.quantity),
      };

      const result = await adminInventoryLegacy.addOrUpdateArtworkImageInventory(body);

      toast.success(result.message || "Artwork image inventory updated successfully!");

      // Refresh list after successful update
      dispatch(fetchArtworkImageInventory());

      return result;
    } catch (error) {
      console.error("addOrUpdateArtworkImageInventory error", error);
      const msg = error?.message || error?.data || "Network error while adding/updating artwork image inventory.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  }
);

const artworkImageInventorySlice = createSlice({
  name: "artworkImageInventory",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearArtworkImageInventoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchArtworkImageInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtworkImageInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchArtworkImageInventory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to fetch artwork image inventory.";
      })
      // ADD / UPDATE
      .addCase(addOrUpdateArtworkImageInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrUpdateArtworkImageInventory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addOrUpdateArtworkImageInventory.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload || "Failed to add/update artwork image inventory.";
      });
  },
});

export const { clearArtworkImageInventoryError } =
  artworkImageInventorySlice.actions;
export default artworkImageInventorySlice.reducer;
