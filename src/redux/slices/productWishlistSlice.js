// redux/slices/productWishlistSlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { wishlistApi } from "../../services/api/wishlistApi";

/* ================= FETCH ================= */

export const fetchProductWishlist = createAsyncThunk(
  "productWishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const data = await wishlistApi.getWishlist();
      // Filter for product items only
      if (Array.isArray(data)) {
        return data.filter((item) => item.item_type === "product");
      }
      return [];
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to fetch wishlist");
    }
  }
);

/* ================= ADD ================= */

export const addProductWishlist = createAsyncThunk(
  "productWishlist/add",
  async (productId, { rejectWithValue }) => {
    try {
      const server = await wishlistApi.addProductToWishlist(productId);
      const data = await wishlistApi.getWishlist();
      const items = Array.isArray(data)
        ? data.filter((item) => item.item_type === "product")
        : [];
      return { server, items };
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to add product to wishlist");
    }
  }
);

/* ================= REMOVE ================= */

export const removeProductWishlist = createAsyncThunk(
  "productWishlist/remove",
  async (productId, { rejectWithValue }) => {
    try {
      await wishlistApi.removeProductFromWishlist(productId);
      return productId;
    } catch (error) {
      return rejectWithValue(error?.message || "Failed to remove product from wishlist");
    }
  }
);

/* ================= SLICE ================= */

const productWishlistSlice = createSlice({
  name: "productWishlist",
  initialState: {
    items: [],
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductWishlist.fulfilled, (s, a) => {
        const payload = a.payload;
        if (Array.isArray(payload)) {
          s.items = payload;
        } else if (payload && Array.isArray(payload.items)) {
          s.items = payload.items;
        } else if (payload && Array.isArray(payload.data)) {
          s.items = payload.data;
        } else {
          s.items = [];
        }
        s.loading = false;
      })

      .addCase(addProductWishlist.fulfilled, (s, a) => {
        if (Array.isArray(a.payload?.items)) {
          s.items = a.payload.items;
        } else if (a.payload?.server && a.payload?.server.item_id) {
          s.items.push(a.payload.server);
        }
      })

      .addCase(removeProductWishlist.fulfilled, (s, a) => {
        s.items = s.items.filter(
          (i) => String(i.item_id) !== String(a.payload)
        );
      });
  },
});

export default productWishlistSlice.reducer;
