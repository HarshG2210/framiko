import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { API_BASE } from "../../utils/constant";
import axios from "axios";
import { loadAuthData } from "../../services/authStorage";
import { toast } from "react-toastify";

export const fetchShippingAddresses = createAsyncThunk(
  "shippingAddress/fetchShippingAddresses",
  async (_, { rejectWithValue }) => {
    try {
      const { token } = loadAuthData();

      const response = await axios.get(
        `${API_BASE}api/orders/shipping-address/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.detail || "Failed to fetch shipping addresses"
      );
    }
  }
);

export const createShippingAddress = createAsyncThunk(
  "shippingAddress/createShippingAddress",
  async (payload, { rejectWithValue }) => {
    try {
      const { token } = loadAuthData();

      const response = await axios.post(
        `${API_BASE}api/orders/shipping-address/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Address added successfully");

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.detail || "Failed to create address"
      );
    }
  }
);

export const updateShippingAddress = createAsyncThunk(
  "shippingAddress/updateShippingAddress",
  async ({ id, payload }, { rejectWithValue }) => {
    try {
      const { token } = loadAuthData();

      const response = await axios.patch(
        `${API_BASE}api/orders/shipping-address/${id}/`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Address updated successfully");

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.detail || "Failed to update address"
      );
    }
  }
);

export const setDefaultShippingAddress = createAsyncThunk(
  "shippingAddress/setDefaultShippingAddress",
  async (addressId, { rejectWithValue }) => {
    try {
      const { token } = loadAuthData();

      const response = await axios.post(
        `${API_BASE}api/orders/shipping-address/${addressId}/set_default/`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Default address updated");

      return addressId || response.data;
    } catch (error) {
      return rejectWithValue(
        error?.response?.data?.detail || "Failed to set default address"
      );
    }
  }
);

const shippingAddressSlice = createSlice({
  name: "shippingAddress",

  initialState: {
    loading: false,
    addresses: [],
    error: null,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(fetchShippingAddresses.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchShippingAddresses.fulfilled, (state, action) => {
        state.loading = false;
        state.addresses = action.payload || [];
      })
      .addCase(fetchShippingAddresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createShippingAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(createShippingAddress.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateShippingAddress.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateShippingAddress.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(setDefaultShippingAddress.pending, (state) => {
        state.loading = true;
      })

      .addCase(setDefaultShippingAddress.fulfilled, (state, action) => {
        state.loading = false;

        state.addresses = state.addresses.map((address) => ({
          ...address,
          is_default: address.id === action.payload,
        }));
      })

      .addCase(setDefaultShippingAddress.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default shippingAddressSlice.reducer;
