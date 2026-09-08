import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { adminOrdersApi } from "../../../services/api/adminApi";
import { toast } from "react-toastify";

// ============================================
// THUNKS
// ============================================

export const fetchAllAdminOrders = createAsyncThunk(
  "admin/orders/fetchAll",
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await adminOrdersApi.getAllOrders(params);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Failed to fetch orders"
      );
    }
  }
);

export const fetchAdminOrderDetails = createAsyncThunk(
  "admin/orders/fetchDetails",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await adminOrdersApi.getOrderDetails(orderId);
      return response;
    } catch (error) {
      return rejectWithValue(
        error?.message || "Failed to fetch order details"
      );
    }
  }
);

const normalizeOrderStatus = (status) => {
  if (typeof status !== "string") return status;
  const trimmed = status.trim();
  if (/^".*"$/.test(trimmed) || /^'.*'$/.test(trimmed)) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed.replace(/^['"]+|['"]+$/g, "");
    }
  }
  return trimmed.replace(/^['"]+|['"]+$/g, "");
};

export const updateAdminOrderStatus = createAsyncThunk(
  "admin/orders/updateStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      // backend expects `order_status` field
      const payload = { order_status: normalizeOrderStatus(status) };
      const response = await adminOrdersApi.updateOrderStatus(orderId, payload);

      toast.success("Order status updated successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      return response;
    } catch (error) {
      const errorMsg = error?.message || "Failed to update order status";

      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
      });

      return rejectWithValue(errorMsg);
    }
  }
);

export const addOrderNote = createAsyncThunk(
  "admin/orders/addNote",
  async ({ orderId, note }, { rejectWithValue }) => {
    try {
      const response = await adminOrdersApi.addOrderNote(orderId, note);

      toast.success("Note added successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      return response;
    } catch (error) {
      const errorMsg = error?.message || "Failed to add note";

      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
      });

      return rejectWithValue(errorMsg);
    }
  }
);

export const generateShippingLabel = createAsyncThunk(
  "admin/orders/generateLabel",
  async (orderId, { rejectWithValue }) => {
    try {
      const blob = await adminOrdersApi.generateShippingLabel(orderId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `shipping_label_${orderId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Shipping label generated!", {
        position: "top-right",
        autoClose: 3000,
      });

      return { success: true, orderId };
    } catch (error) {
      const errorMsg = error?.message || "Failed to generate shipping label";

      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
      });

      return rejectWithValue(errorMsg);
    }
  }
);

export const processRefund = createAsyncThunk(
  "admin/orders/refund",
  async ({ orderId, reason }, { rejectWithValue }) => {
    try {
      const response = await adminOrdersApi.refundOrder(orderId, reason);

      toast.success("Refund processed successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      return response;
    } catch (error) {
      const errorMsg = error?.message || "Failed to process refund";

      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
      });

      return rejectWithValue(errorMsg);
    }
  }
);

export const exportOrdersData = createAsyncThunk(
  "admin/orders/export",
  async (format = "csv", { rejectWithValue }) => {
    try {
      const blob = await adminOrdersApi.exportOrders(format);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `orders_${new Date().getTime()}.${format}`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success("Orders exported successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      return { success: true, format };
    } catch (error) {
      const errorMsg = error?.message || "Failed to export orders";

      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
      });

      return rejectWithValue(errorMsg);
    }
  }
);

// ============================================
// SLICE
// ============================================

const adminOrdersSlice = createSlice({
  name: "admin/orders",
  initialState: {
    orders: [],
    selectedOrder: null,
    loading: false,
    error: null,
    filters: {
      search: "",
      status: "all", // all, pending, processing, shipped, delivered, cancelled
      dateRange: null,
      page: 1,
      limit: 20,
    },
    pagination: {
      total: 0,
      page: 1,
      limit: 20,
      totalPages: 0,
    },
  },

  reducers: {
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
    setSearchFilter: (state, action) => {
      state.filters.search = action.payload;
      state.filters.page = 1;
    },
    setStatusFilter: (state, action) => {
      state.filters.status = action.payload;
      state.filters.page = 1;
    },
    setPage: (state, action) => {
      state.filters.page = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    // Fetch All Orders
    builder
      .addCase(fetchAllAdminOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllAdminOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data || action.payload;
        state.pagination = action.payload.pagination || {};
      })
      .addCase(fetchAllAdminOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch Order Details
    builder
      .addCase(fetchAdminOrderDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOrderDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchAdminOrderDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Update Order Status
    builder
      .addCase(updateAdminOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAdminOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
      })
      .addCase(updateAdminOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Add Order Note
    builder
      .addCase(addOrderNote.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrderNote.fulfilled, (state, action) => {
        state.loading = false;
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
      })
      .addCase(addOrderNote.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Generate Shipping Label
    builder
      .addCase(generateShippingLabel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateShippingLabel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(generateShippingLabel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Process Refund
    builder
      .addCase(processRefund.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processRefund.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.orders.findIndex(o => o.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
        if (state.selectedOrder?.id === action.payload.id) {
          state.selectedOrder = action.payload;
        }
      })
      .addCase(processRefund.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Export Orders
    builder
      .addCase(exportOrdersData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(exportOrdersData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(exportOrdersData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  clearSelectedOrder,
  setSearchFilter,
  setStatusFilter,
  setPage,
  clearError,
} = adminOrdersSlice.actions;

export default adminOrdersSlice.reducer;
