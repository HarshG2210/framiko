import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { productsApi } from "../../services/api/productsApi";
import { toast } from "react-toastify";

const normalizeProduct = (product) => {
  if (!product || typeof product !== "object") return product;

  const quantity = Number(product.quantity ?? 0);
  const threshold = Number(product.low_stock_threshold ?? 0);
  const isLowStock = threshold > 0 && quantity < threshold;

  return {
    ...product,
    quantity,
    low_stock_threshold: threshold,
    is_low_stock: Boolean(product.is_low_stock ?? isLowStock),
  };
};

const normalizeProductsPayload = (payload) => {
  if (Array.isArray(payload)) return payload.map(normalizeProduct);
  if (payload && Array.isArray(payload.data)) return payload.data.map(normalizeProduct);
  if (payload && Array.isArray(payload.results)) return payload.results.map(normalizeProduct);
  if (payload && Array.isArray(payload.products)) return payload.products.map(normalizeProduct);
  return [];
};

/* ---------------- THUNKS ---------------- */

export const fetchProducts = createAsyncThunk(
  "products/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const data = await productsApi.fetchProducts();
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch products");
    }
  }
);

export const postProduct = createAsyncThunk(
  "products/post",
  async (data, { rejectWithValue }) => {
    try {
      const response = await productsApi.postProduct(data);
      toast.success("Product created successfully");
      return normalizeProduct(response);
    } catch (err) {
      toast.error("Failed to create product");
      return rejectWithValue(err.response?.data || "Failed to create product");
    }
  }
);

// Helper function to convert image URL to File
const fetchImageFile = async (imageUrl) => {
  try {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new File([blob], "image.jpg", { type: blob.type });
  } catch (err) {
    console.error("Error converting image URL to File:", err);
    return null;
  }
};

export const updateProduct = createAsyncThunk(
  "products/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Handle both FormData and regular object
      let formData;
      if (data instanceof FormData) {
        formData = data;
      } else {
        formData = new FormData();
        for (const [key, value] of Object.entries(data)) {
          // Handle image fields - can be File or URL string
          if (key.startsWith("image")) {
            if (value instanceof File) {
              formData.append(key, value);
            } else if (typeof value === "string" && value) {
              // Convert URL string to File
              const imageFile = await fetchImageFile(value);
              if (imageFile) {
                formData.append(key, imageFile);
              }
            }
            continue;
          }

          if (key === "is_low_stock") continue;

          if (value !== null && value !== undefined && value !== "") {
            if (key === "quantity" || key === "low_stock_threshold") {
              formData.append(key, String(Number(value)));
            } else {
              formData.append(key, value);
            }
          }
        }
      }

      const response = await productsApi.updateProduct(id, formData);
      toast.success("Product updated successfully");
      return normalizeProduct(response);
    } catch (err) {
      toast.error("Failed to update product");
      return rejectWithValue(err.response?.data || "Failed to update product");
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id, { rejectWithValue }) => {
    try {
      await productsApi.deleteProduct(id);
      toast.success("Product deleted successfully");
      return id;
    } catch (err) {
      toast.error("Failed to delete product");
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
      s.products = normalizeProductsPayload(a.payload);
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
