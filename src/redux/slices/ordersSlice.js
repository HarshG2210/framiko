import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import ordersApi from "../../services/api/ordersApi";
import { toast } from "react-toastify";

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const data = await ordersApi.fetchOrders();
      return data;
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to fetch orders");
      return rejectWithValue(
        error?.response?.data?.detail || "Failed to fetch orders"
      );
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  "orders/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const data = await ordersApi.fetchOrderDetails(orderId);
      return data;
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to fetch order details");
      return rejectWithValue(
        error?.response?.data?.detail || "Failed to fetch order details"
      );
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      await ordersApi.cancelOrder(orderId);
      toast.success("Order cancelled successfully");
      return orderId;
    } catch (error) {
      toast.error(
        error?.response?.data?.detail || "Failed to cancel order"
      );
      return rejectWithValue(
        error?.response?.data?.detail || "Failed to cancel order"
      );
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",

  initialState: {
    loading: false,
    orders: [],
    selectedOrder: null,
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload || [];
      })

      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })

      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(cancelOrder.pending, (state) => {
        state.loading = true;
      })

      .addCase(cancelOrder.fulfilled, (state) => {
        state.loading = false;
      })

      .addCase(cancelOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default ordersSlice.reducer;