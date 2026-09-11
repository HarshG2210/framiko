// src/redux/slices/frameInventorySlice.js

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { adminInventoryLegacy } from "../../services/api/adminApi";
import { publicApi } from "../../services/api/axiosInstance";
import { toast } from "react-toastify";

// GET inventory
export const fetchFrameInventory = createAsyncThunk(
  "frameInventory/fetchFrameInventory",
  async (_, { rejectWithValue }) => {
    try {
      // Admin inventory fetch (requires admin auth token)
      const data = await adminInventoryLegacy.getFrameInventory();

      // Handle multiple response formats
      let result = [];
      if (typeof data === "string") {
        if (data.includes("<!doctype html>")) {
          result = [];
        }
      } else if (Array.isArray(data)) {
        result = data;
      } else if (data?.results && Array.isArray(data.results)) {
        result = data.results;
      } else if (data?.data && Array.isArray(data.data)) {
        result = data.data;
      } else if (data?.items && Array.isArray(data.items)) {
        result = data.items;
      } else {
        result = [];
      }

      return result;
    } catch (error) {
      const msg =
        error?.message ||
        error?.data ||
        "Network error while fetching inventory.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

// Public inventory fetch for frontend usage (does not require admin token)
export const fetchPublicFrameInventory = createAsyncThunk(
  "frameInventory/fetchPublicFrameInventory",
  async (_, { rejectWithValue }) => {
    try {
      const data = await publicApi.get("/inventory/frame-inventory/");

      let result = [];
      if (typeof data === "string") {
        if (data.includes("<!doctype html>")) {
          result = [];
        }
      } else if (Array.isArray(data)) {
        result = data;
      } else if (data?.results && Array.isArray(data.results)) {
        result = data.results;
      } else if (data?.data && Array.isArray(data.data)) {
        result = data.data;
      } else if (data?.items && Array.isArray(data.items)) {
        result = data.items;
      } else {
        result = [];
      }

      return result;
    } catch (error) {
      const status = error?.status || error?.response?.status;
      const backendDetail = error?.data || error?.response?.data;

      // If 401 or backend indicates auth required, try a direct backend fallback (useful in dev)
      if (status === 401 || (backendDetail && backendDetail.detail)) {
        try {
          // Try fetching directly from the known backend host as a fallback
          const fallbackBase = import.meta.env.VITE_API_BASE;
          const resp = await fetch(
            `${fallbackBase.replace(/\/$/, "")}/inventory/frame-inventory/`,
          );
          if (!resp.ok) return [];
          const data = await resp.json();
          if (Array.isArray(data)) return data;
          if (data?.results && Array.isArray(data.results)) return data.results;
          if (data?.data && Array.isArray(data.data)) return data.data;
          if (data?.items && Array.isArray(data.items)) return data.items;
          return [];
        } catch (e) {
          console.log(e);
          return [];
        }
      }

      const msg =
        error?.message ||
        error?.data ||
        "Network error while fetching inventory.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

// POST add / update inventory
export const addOrUpdateFrameInventory = createAsyncThunk(
  "frameInventory/addOrUpdateFrameInventory",
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const body = {
        frame: Number(payload.frame),
        size: Number(payload.size),
        quantity: Number(payload.quantity),
      };

      const result = await adminInventoryLegacy.addOrUpdateFrameInventory(body);

      toast.success(result.message || "Inventory updated successfully!");

      // Refresh list after successful update
      dispatch(fetchFrameInventory());

      return result;
    } catch (error) {
      const msg =
        error?.message ||
        error?.data ||
        "Network error while adding/updating inventory.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

export const bulkUploadFrameInventory = createAsyncThunk(
  "frameInventory/bulkUploadFrameInventory",
  async (file, { dispatch, rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const result =
        await adminInventoryLegacy.bulkUploadFrameInventory(formData);
      dispatch(fetchFrameInventory());
      return result.data;
    } catch (error) {
      const msg =
        error?.response?.data?.error ||
        error?.message ||
        error?.data ||
        "Network error while bulk uploading frame inventory.";
      toast.error(msg);
      return rejectWithValue(msg);
    }
  },
);

const frameInventorySlice = createSlice({
  name: "frameInventory",
  initialState: {
    items: [],
    loading: false,
    error: null,
    bulkUploadLoading: false,
    bulkUploadResult: null,
  },
  reducers: {
    clearFrameInventoryError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchFrameInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFrameInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFrameInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch frame inventory.";
      })
      // PUBLIC FETCH (frontend-safe)
      .addCase(fetchPublicFrameInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPublicFrameInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchPublicFrameInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || state.error;
      })
      // ADD / UPDATE
      .addCase(addOrUpdateFrameInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addOrUpdateFrameInventory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addOrUpdateFrameInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add/update frame inventory.";
      })
      // BULK UPLOAD
      .addCase(bulkUploadFrameInventory.pending, (state) => {
        state.bulkUploadLoading = true;
        state.error = null;
      })
      .addCase(bulkUploadFrameInventory.fulfilled, (state, action) => {
        state.bulkUploadLoading = false;
        state.bulkUploadResult = action.payload;
      })
      .addCase(bulkUploadFrameInventory.rejected, (state, action) => {
        state.bulkUploadLoading = false;
        state.error =
          action.payload || "Failed to bulk upload frame inventory.";
      });
  },
});

export const { clearFrameInventoryError } = frameInventorySlice.actions;
export default frameInventorySlice.reducer;
