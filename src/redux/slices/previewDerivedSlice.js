import { createSlice, createSelector } from "@reduxjs/toolkit";

const initialState = {
  filteredFrames: [],
};

const previewDerivedSlice = createSlice({
  name: "previewDerived",
  initialState,
  reducers: {
    setFilteredFrames: (state, action) => {
      state.filteredFrames = action.payload;
    },
  },
});

export const { setFilteredFrames } = previewDerivedSlice.actions;
export default previewDerivedSlice.reducer;

/* --------- DERIVED SELECTOR (KEY FIX) --------- */

export const selectFilteredFrames = createSelector(
  [(state) => state.frames, (state) => state.framePreview.selectedSize],
  (frames, selectedSize) => {
    if (!frames?.length || !selectedSize) return [];
    return frames.filter((f) => f.supported_sizes?.includes(selectedSize.id));
  }
);
