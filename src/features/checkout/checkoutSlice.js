import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { API_BASE } from "../../utils/constant";
import axios from "axios";
import { loadAuthData } from "../../services/authStorage";
import { toast } from "react-toastify";

export const createOrder = createAsyncThunk(
  "checkout/createOrder",
  async (payload, { rejectWithValue }) => {
    try {
      const { token } = loadAuthData();

      const response = await axios.post(
        `${API_BASE}api/orders/checkout/create_order/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Order created successfully");

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.detail || "Failed to create order"
      );
    }
  }
);

export const fetchOrderDetails = createAsyncThunk(
  "checkout/fetchOrderDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const { token } = loadAuthData();

      const response = await axios.get(
        `${API_BASE}api/orders/orders/${orderId}/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.detail || "Failed to fetch order"
      );
    }
  }
);

const checkoutSlice = createSlice({
  name: "checkout",

  initialState: {
    step: 1,
    selectedAddress: null,
    paymentMethod: "razorpay",
    customerNotes: "",
    order: null,
    loading: false,
    error: null,
  },

  reducers: {
    nextStep: (state) => {
      state.step += 1;
    },

    prevStep: (state) => {
      state.step -= 1;
    },

    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },

    setCustomerNotes: (state, action) => {
      state.customerNotes = action.payload;
    },

    resetCheckout: (state) => {
      state.step = 1;
      state.order = null;
      state.selectedAddress = null;
      state.customerNotes = "";
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })

      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchOrderDetails.pending, (state) => {
        state.loading = true;
      })

      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.order = action.payload;
      })

      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  nextStep,
  prevStep,
  setSelectedAddress,
  setCustomerNotes,
  resetCheckout,
} = checkoutSlice.actions;

export default checkoutSlice.reducer;
