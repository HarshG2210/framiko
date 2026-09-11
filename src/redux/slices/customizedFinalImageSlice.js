import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { customizationApi } from "../../services/api/customizationApi";

/* ================================
   FETCH CUSTOMIZED IMAGES
================================ */

export const fetchCustomizedFinalImage = createAsyncThunk(
  "customizedFinalImage/fetchCustomizedFinalImage",
  async (_, { rejectWithValue }) => {
    try {
      return await customizationApi.getCustomizedFinalImages();
    } catch (error) {
      return rejectWithValue(error?.message || error);
    }
  }
);

/* ================================
   SUBMIT CUSTOMIZED IMAGE
================================ */

export const submitCustomizedFinalImage = createAsyncThunk(
  "customizedFinalImage/submitCustomizedFinalImage",
  async (data, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      let finalImageFile;

      if (
        typeof data.final_image === "string" &&
        data.final_image.startsWith("data:image/")
      ) {
        const byteString = atob(data.final_image.split(",")[1]);

        const mimeString = data.final_image
          .split(",")[0]
          .split(":")[1]
          .split(";")[0];

        const ab = new ArrayBuffer(byteString.length);

        const ia = new Uint8Array(ab);

        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }

        finalImageFile = new File([ab], "final.png", {
          type: mimeString,
        });
      } else {
        const imageResponse = await fetch(data.final_image);

        const blob = await imageResponse.blob();

        finalImageFile = new File([blob], "final.png", {
          type: blob.type || "image/png",
        });
      }

      /* ---------------------------
         FILE FIELD
      --------------------------- */

      formData.append("final_image", finalImageFile);
      console.log("Final Image File:", finalImageFile);

      /* ---------------------------
         BASE64 FIELD
      --------------------------- */

      formData.append("final_image_base64", data.final_image);
      console.log("Final Image Base64:", data.final_image);

      /* ---------------------------
         OTHER FIELDS
      --------------------------- */

      formData.append("is_completed", String(data.is_completed));
      formData.append("frame_view_choice", data.frame_view_choice || "bold");
      console.log("Is Completed:", data.is_completed);

      return await customizationApi.submitCustomizedFinalImage(formData);
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/* ================================
   SLICE
================================ */

const customizedFinalImageSlice = createSlice({
  name: "customizedFinalImage",

  initialState: {
    customizedImage: [],
    loading: false,
    submitLoading: false,
    error: null,
  },

  reducers: {
    clearSubmitError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* FETCH */

      .addCase(fetchCustomizedFinalImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(fetchCustomizedFinalImage.fulfilled, (state, action) => {
        state.loading = false;
        state.customizedImage = action.payload;
      })

      .addCase(fetchCustomizedFinalImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* SUBMIT */

      .addCase(submitCustomizedFinalImage.pending, (state) => {
        state.submitLoading = true;
        state.error = null;
      })

      .addCase(submitCustomizedFinalImage.fulfilled, (state, action) => {
        state.submitLoading = false;

        state.customizedImage.push(action.payload);
      })

      .addCase(submitCustomizedFinalImage.rejected, (state, action) => {
        state.submitLoading = false;

        state.error =
          action.payload || action.error?.message || "Something went wrong";
      });
  },
});

export const { clearSubmitError } = customizedFinalImageSlice.actions;

export default customizedFinalImageSlice.reducer;
