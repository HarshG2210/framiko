import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../../services/adminApi";
import axios from "axios";
import { API_BASE } from "../../utils/constant";


/* ---------------- THUNKS ---------------- */

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  const res = await axios.get(`${API_BASE}products/`);
  return res.data;
});

export const postProduct = createAsyncThunk(
  "products/post",
  async (data, { rejectWithValue }) => {
    try {
      const res = await adminApi.post("products/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create product");
    }
  }
);

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => {
        if (v !== null && v !== undefined) formData.append(k, v);
      });

      const res = await adminApi.patch(`products/${id}/`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update product");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await adminApi.delete(`products/${id}/`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete product");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProducts.pending, (s) => {
      s.loading = true;
    });
    b.addCase(fetchProducts.fulfilled, (s, a) => {
      s.loading = false;
      s.products = a.payload;
    });
    b.addCase(fetchProducts.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload;
    });

    b.addCase(postProduct.fulfilled, (s, a) => {
      s.products.push(a.payload);
    });

    b.addCase(updateProduct.fulfilled, (s, a) => {
      const i = s.products.findIndex((p) => p.id === a.payload.id);
      if (i !== -1) s.products[i] = a.payload;
    });

    b.addCase(deleteProduct.fulfilled, (s, a) => {
      s.products = s.products.filter((p) => p.id !== a.payload);
    });
  },
});

export default productsSlice.reducer;
