import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import adminApi from "../../services/adminApi";
import axios from "axios";
import { API_BASE } from "../../utils/constant";

/* ---------------- THUNKS ---------------- */

// Fetch categories
export const fetchProductCategories = createAsyncThunk(
  "productCategories/fetch",
  async () => {
    const res = await axios.get(`${API_BASE}product-categories/`);
    return res.data;
  }
);

// Create category
export const postProductCategory = createAsyncThunk(
  "productCategories/post",
  async (data, { rejectWithValue }) => {
    try {
      const res = await adminApi.post("product-categories/", data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create category");
    }
  }
);

// Update category
export const updateProductCategory = createAsyncThunk(
  "productCategories/update",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      const res = await adminApi.patch(`product-categories/${id}/`, data);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to update category");
    }
  }
);

// Delete category
export const deleteProductCategory = createAsyncThunk(
  "productCategories/delete",
  async (id, { rejectWithValue }) => {
    try {
      await adminApi.delete(`product-categories/${id}/`);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to delete category");
    }
  }
);

const productCategoriesSlice = createSlice({
  name: "productCategories",
  initialState: {
    categories: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProductCategories.pending, (s) => {
      s.loading = true;
    });
    b.addCase(fetchProductCategories.fulfilled, (s, a) => {
      s.loading = false;
      s.categories = a.payload;
    });
    b.addCase(fetchProductCategories.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload;
    });

    b.addCase(postProductCategory.fulfilled, (s, a) => {
      s.categories.push(a.payload);
    });

    b.addCase(updateProductCategory.fulfilled, (s, a) => {
      const i = s.categories.findIndex((c) => c.id === a.payload.id);
      if (i !== -1) s.categories[i] = a.payload;
    });

    b.addCase(deleteProductCategory.fulfilled, (s, a) => {
      s.categories = s.categories.filter((c) => c.id !== a.payload);
    });
  },
});

export default productCategoriesSlice.reducer;
