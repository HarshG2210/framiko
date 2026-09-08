// redux/slices/cartSlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import cartApi from "../../services/api/cartApi";
import { loadAuthData } from "../../services/authStorage";
import { toast } from "react-toastify";

export const fetchCartItems = createAsyncThunk(
  "cart/fetchCartItems",
  async (_, { rejectWithValue }) => {
    try {
      const { token } = loadAuthData();

      if (!token) {
        return rejectWithValue("NO_TOKEN");
      }

      const data = await cartApi.getCart();

      return data;
    } catch (error) {
      console.error("FETCH CART ERROR", error);

      return rejectWithValue(
        error?.response?.data?.detail ||
          error?.response?.data?.message ||
          "Failed to fetch cart"
      );
    }
  }
);

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (payload, { rejectWithValue }) => {
    try {
      const { token } = loadAuthData();

      if (!token) {
        toast.warning("Please login first");
        return rejectWithValue("NO_TOKEN");
      }

      console.log("ADD TO CART PAYLOAD =>", payload);

      // Use centralized API layer
      const data = await cartApi.addToCart(payload);

      toast.success(data?.message || "Added to cart successfully");

      return data;
    } catch (error) {
      console.error("ADD CART ERROR =>", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to add to cart";

      toast.error(message);

      return rejectWithValue(message);
    }
  }
);

export const removeCartItem = createAsyncThunk(
  "cart/removeCartItem",
  async (cartItemId, { rejectWithValue }) => {
    try {
      const { token } = loadAuthData();

      if (!token) {
        toast.warning("Please login first");
        return rejectWithValue("NO_TOKEN");
      }

      const data = await cartApi.removeFromCartItem(cartItemId);

      toast.success(data?.message || "Item removed from cart");
      return cartItemId;
    } catch (error) {
      console.error("REMOVE CART ERROR =>", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to remove item";

      toast.error(message);

      return rejectWithValue(message);
    }
  }
);

export const clearCart = createAsyncThunk(
  "cart/clearCart",
  async (_, { rejectWithValue }) => {
    try {
      const { token } = loadAuthData();

      if (!token) {
        toast.warning("Please login first");
        return rejectWithValue("NO_TOKEN");
      }

      const data = await cartApi.clearCart();

      toast.success(data?.message || "Cart cleared successfully");

      return true;
    } catch (error) {
      console.error("CLEAR CART ERROR =>", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.detail ||
        "Failed to clear cart";

      toast.error(message);

      return rejectWithValue(message);
    }
  }
);

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    loading: false,
    removingItemId: null,
    cartData: null,
    cartItems: [],
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchCartItems.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchCartItems.fulfilled, (state, action) => {
        state.loading = false;

        state.cartItems =
          action.payload?.items ||
          action.payload?.cart_items ||
          action.payload ||
          [];
      })

      .addCase(fetchCartItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cartData = action.payload;
      })

      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
      })

      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;

        state.cartItems = state.cartItems.filter(
          (item) => item.id !== action.payload
        );
      })

      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
      })

      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.cartItems = [];
      })

      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default cartSlice.reducer;
