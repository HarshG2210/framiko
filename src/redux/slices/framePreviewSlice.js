import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  uploadedImage: null,
  cropOriginalImage: null,
  uploadedFileName: "",
  imageSource: "user-upload",
  imageOrientation: null,
  selectedSize: null,
  filteredSizes: [],
  selectedFrame: [],
  filteredFrames: [],
  showFrame: true,
  forceOrientation: false,
  imageDimensions: { width: 0, height: 0 },
  zoom: { horizontal: 1, vertical: 1 },
  position: { x: 50, y: 50 },
  zoomMode: null,
  selectedBackground: null,
  previewScale: 1,
  backgroundPosition: { x: 0, y: 0 },
  resetKey: 0,
  selectedMaterial: null,
  frameViewChoice: "bold",
  imageTransform: { rotate: 0, scaleX: 1, scaleY: 1 },
};

const framePreviewSlice = createSlice({
  name: "framePreview",
  initialState,
  reducers: {
    setUploadedImage: (state, action) => {
      state.uploadedImage = action.payload.image;
      state.uploadedFileName = action.payload.fileName || "";
      state.imageSource = action.payload.source || "user-upload";
    },
    setCropOriginalImage: (state, action) => {
      state.cropOriginalImage = action.payload.image;
    },

    setImageOrientation: (state, action) => {
      state.imageOrientation = action.payload;
    },
    setSelectedSize: (state, action) => {
      state.selectedSize = action.payload;
    },
    setFilteredSizes: (state, action) => {
      state.filteredSizes = action.payload;
    },
    setSelectedFrame: (state, action) => {
      state.selectedFrame = action.payload;
    },
    setFilteredFrames: (state, action) => {
      state.filteredFrames = action.payload;
    },
    setShowFrame: (state, action) => {
      state.showFrame = action.payload;
    },
    setForceOrientation: (state, action) => {
      state.forceOrientation = action.payload;
    },
    setImageDimensions: (state, action) => {
      state.imageDimensions = action.payload;
    },
    setZoom: (state, action) => {
      state.zoom = action.payload;
    },
    setPosition: (state, action) => {
      state.position = action.payload;
    },
    setZoomMode: (state, action) => {
      state.zoomMode = action.payload;
    },
    setSelectedBackground: (state, action) => {
      state.selectedBackground = action.payload;
    },
    setPreviewScale: (state, action) => {
      state.previewScale = action.payload;
    },
    setBackgroundPosition: (state, action) => {
      state.backgroundPosition = action.payload;
    },
    incrementResetKey: (state) => {
      state.resetKey += 1;
    },
    setSelectedMaterial: (state, action) => {
      state.selectedMaterial = action.payload;
    },
    setFrameViewChoice: (state, action) => {
      state.frameViewChoice = action.payload;
    },

    clearPreviews: (state) => {
      state.savedPreviews = [];
    },
    removePreview: (state, action) => {
      state.savedPreviews = state.savedPreviews.filter(
        (preview) => preview.id !== action.payload
      );
    },
    setImageTransform: (state, action) => {
      state.imageTransform = action.payload;
    },
    resetSelection: (state) => {
      state.selectedFrame = null;
      state.showFrame = true;
      state.zoom = { horizontal: 1, vertical: 1 };
      state.position = { x: 50, y: 50 };
      state.selectedBackground = null;
      state.backgroundPosition = { x: 0, y: 0 };
      state.imageDimensions = { width: 0, height: 0 };
      state.imageTransform = { rotate: 0, scaleX: 1, scaleY: 1 };
      state.selectedMaterial = null;
      state.frameViewChoice = "bold";
    },
    hydratePreviewState: (state, action) => {
      return {
        ...state,
        ...action.payload,
      };
    },
    resetPreview: () => {
      return {
        ...initialState,
        savedPreviews: [],
      };
    },
  },
});

export const {
  setUploadedImage,
  setCropOriginalImage,
  setImageOrientation,
  setSelectedSize,
  setFilteredSizes,
  setSelectedFrame,
  setFilteredFrames,
  setShowFrame,
  setForceOrientation,
  setImageDimensions,
  setZoom,
  setPosition,
  setZoomMode,
  setSelectedBackground,
  setPreviewScale,
  setBackgroundPosition,
  incrementResetKey,
  setSelectedMaterial,
  setFrameViewChoice,
  savePreview,
  clearPreviews,
  removePreview,
  setImageTransform,
  resetSelection,
  resetPreview,
  hydratePreviewState,
} = framePreviewSlice.actions;

export default framePreviewSlice.reducer;
