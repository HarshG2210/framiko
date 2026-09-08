import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { productsApi } from "../../services/api/productsApi";

/* ---------------- THUNKS ---------------- */

// Fetch categories
export const fetchProductCategories = createAsyncThunk(
  "productCategories/fetch",
  async () => {
    return await productsApi.fetchProductCategories();
  }
);

// Create category
export const postProductCategory = createAsyncThunk(
  "productCategories/post",
  async (data, { rejectWithValue }) => {
    try {
      return await productsApi.postProductCategory(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to create category");
    }
  }
);

export const bulkUploadProductCategories = createAsyncThunk(
  "productCategories/bulkUpload",
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await productsApi.bulkUploadProductCategories(formData);
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to bulk upload product categories"
      );
    }
  }
);

// Update category
export const updateProductCategory = createAsyncThunk(
  "productCategories/update",
  async ({ id, ...data }, { rejectWithValue }) => {
    try {
      return await productsApi.updateProductCategory(id, data);
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
      await productsApi.deleteProductCategory(id);
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
    bulkUploadLoading: false,
    bulkUploadResult: null,
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProductCategories.pending, (s) => {
      s.loading = true;
    });
    b.addCase(fetchProductCategories.fulfilled, (s, a) => {
      s.loading = false;
      // Normalize payload: API may return an array or an object wrapping the array
      const payload = a.payload;
      if (Array.isArray(payload)) {
        s.categories = payload;
      } else if (payload && Array.isArray(payload.data)) {
        s.categories = payload.data;
      } else if (payload && Array.isArray(payload.results)) {
        s.categories = payload.results;
      } else if (payload && Array.isArray(payload.categories)) {
        s.categories = payload.categories;
      } else {
        s.categories = [];
      }
    });
    b.addCase(fetchProductCategories.rejected, (s, a) => {
      s.loading = false;
      s.error = a.payload;
    });

    b.addCase(postProductCategory.fulfilled, (s, a) => {
      s.categories.push(a.payload);
    });

    b.addCase(bulkUploadProductCategories.pending, (s) => {
      s.bulkUploadLoading = true;
      s.error = null;
      s.bulkUploadResult = null;
    });
    b.addCase(bulkUploadProductCategories.fulfilled, (s, a) => {
      s.bulkUploadLoading = false;
      s.bulkUploadResult = a.payload;
    });
    b.addCase(bulkUploadProductCategories.rejected, (s, a) => {
      s.bulkUploadLoading = false;
      s.error = a.payload || a.error.message;
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
