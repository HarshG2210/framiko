import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { wishlistApi } from "../../services/api/wishlistApi";

const getArrayPayload = (payload) => {
  if (Array.isArray(payload)) return payload;
  if (payload && Array.isArray(payload.items)) return payload.items;
  if (payload && Array.isArray(payload.data)) return payload.data;
  if (payload && Array.isArray(payload.results)) return payload.results;
  return [];
};

const normalizeWishlistItems = (payload) => {
  return getArrayPayload(payload).map((item) => ({
    ...item,
    item_id:
      item.item_id ?? item.id ?? item.product_id ?? item.artwork_id ?? null,
    item_type:
      item.item_type ??
      (item.product
        ? "product"
        : item.artwork || item.artwork_id
          ? "artwork"
          : null),
  }));
};

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await wishlistApi.getWishlist();
      return normalizeWishlistItems(response);
    } catch (error) {
      console.log("Wishlist slice fetch error:", error);
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to fetch wishlist"
      );
    }
  }
);

export const addWishlistItem = createAsyncThunk(
  "wishlist/add",
  async ({ itemType, itemId, frameId }, { rejectWithValue }) => {
    try {
      await wishlistApi.addToWishlist(itemType, itemId, frameId);
      const response = await wishlistApi.getWishlist();
      return normalizeWishlistItems(response);
    } catch (error) {
      console.log("Wishlist slice add error:", error);
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to add item to wishlist"
      );
    }
  }
);

export const removeWishlistItem = createAsyncThunk(
  "wishlist/remove",
  async ({ itemType, itemId }, { rejectWithValue }) => {
    try {
      await wishlistApi.removeFromWishlist(itemType, itemId);
      const response = await wishlistApi.getWishlist();
      return normalizeWishlistItems(response);
    } catch (error) {
      console.log("Wishlist slice remove error:", error);
      return rejectWithValue(
        error?.response?.data || error?.message || "Failed to remove item from wishlist"
      );
    }
  }
);

const initialState = {
  items: [],
  products: [],
  artworks: [],
  loading: false,
  error: null,
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    clearWishlistError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.products = action.payload.filter(
          (item) => String(item.item_type).toLowerCase() === "product"
        );
        state.artworks = action.payload.filter(
          (item) =>
            ["artwork", "artworkcategoryimage"].includes(
              String(item.item_type).toLowerCase()
            )
        );
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addWishlistItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.products = action.payload.filter(
          (item) => String(item.item_type).toLowerCase() === "product"
        );
        state.artworks = action.payload.filter(
          (item) =>
            ["artwork", "artworkcategoryimage"].includes(
              String(item.item_type).toLowerCase()
            )
        );
      })
      .addCase(addWishlistItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(removeWishlistItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.products = action.payload.filter(
          (item) => String(item.item_type).toLowerCase() === "product"
        );
        state.artworks = action.payload.filter(
          (item) =>
            ["artwork", "artworkcategoryimage"].includes(
              String(item.item_type).toLowerCase()
            )
        );
      })
      .addCase(removeWishlistItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearWishlistError } = wishlistSlice.actions;
export const selectWishlistItems = (state) => state.wishlist?.items ?? [];
export const selectWishlistProducts = (state) => state.wishlist?.products ?? [];
export const selectWishlistArtworks = (state) => state.wishlist?.artworks ?? [];

export default wishlistSlice.reducer;
