// redux/slices/artworkWishlistSlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { wishlistApi } from "../../services/api/wishlistApi";

/* ================= FETCH ================= */

export const fetchArtworkWishlist = createAsyncThunk(
  "artworkWishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const data = await wishlistApi.getWishlist();
      // Filter for artwork items only
      if (Array.isArray(data)) {
        return data.filter((item) =>
          ["artwork", "artworkcategoryimage"].includes(item.item_type)
        );
      }
      return [];
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch wishlist");
    }
  }
);

/* ================= ADD ================= */

export const addArtworkWishlist = createAsyncThunk(
  "artworkWishlist/add",
  async ({ artworkId, frameId }, { rejectWithValue }) => {
    try {
      const server = await wishlistApi.addArtworkToWishlist(artworkId, frameId);
      const data = await wishlistApi.getWishlist();
      const items = Array.isArray(data)
        ? data.filter((item) => ["artwork", "artworkcategoryimage"].includes(item.item_type))
        : [];
      return { server, items };
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to add artwork to wishlist");
    }
  }
);

/* ================= REMOVE ================= */

export const removeArtworkWishlist = createAsyncThunk(
  "artworkWishlist/remove",
  async (artworkId, { rejectWithValue }) => {
    try {
      await wishlistApi.removeArtworkFromWishlist(artworkId);
      return artworkId;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to remove artwork from wishlist");
    }
  }
);

const slice = createSlice({
  name: "artworkWishlist",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchArtworkWishlist.fulfilled, (s, a) => {
      // Normalize server response: some backends return an array, others
      // return an object { items: [...] } or paginated response.
      const payload = a.payload;
      if (Array.isArray(payload)) {
        s.items = payload;
      } else if (payload && Array.isArray(payload.items)) {
        s.items = payload.items;
      } else {
        s.items = [];
      }
    });

    b.addCase(addArtworkWishlist.fulfilled, (s, a) => {
      if (Array.isArray(a.payload?.items)) {
        s.items = a.payload.items;
      } else if (a.payload?.server && a.payload?.server.item_id) {
        s.items.push(a.payload.server);
      }
    });

    b.addCase(removeArtworkWishlist.fulfilled, (s, a) => {
      s.items = s.items.filter((i) => String(i.item_id) !== String(a.payload));
    });
  },
});

export default slice.reducer;
