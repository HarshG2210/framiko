import {
  setFilteredSizes,
  setForceOrientation,
  setImageOrientation,
  setSelectedSize,
} from "../../../redux/slices/framePreviewSlice";
import { useDispatch, useSelector } from "react-redux";

import { useEffect } from "react";

export const useSizeFiltering = () => {
  const dispatch = useDispatch();

  const { sizes } = useSelector((s) => s.sizes);
  const { supportedSizes } = useSelector((s) => s.categories);
  const { imageOrientation, selectedSize, imageSource } = useSelector(
    (s) => s.framePreview,
  );

  useEffect(() => {
    if (!sizes?.length) return;

    let filtered = [];

    /* -----------------------------------------
       1. Artwork-category selections use supported sizes
    ------------------------------------------ */
    if (imageSource === "artwork-category" && supportedSizes?.length) {
      filtered = sizes.filter((s) => supportedSizes.includes(s.id));

      if (filtered.length) {
        dispatch(setForceOrientation(true));

        if (imageOrientation !== filtered[0].orientation) {
          dispatch(setImageOrientation(filtered[0].orientation));
        }
      }
    } else if (imageOrientation) {
      /* -----------------------------------------
         2. Uploaded images follow their actual image orientation
      ------------------------------------------ */
      filtered = sizes.filter((s) => s.orientation === imageOrientation);
      dispatch(setForceOrientation(false));
    }

    dispatch(setFilteredSizes(filtered));

    /* -----------------------------------------
       3. Ensure selectedSize is valid
    ------------------------------------------ */
    if (filtered.length) {
      const isValid =
        selectedSize && filtered.some((s) => s.id === selectedSize.id);

      if (!isValid) {
        dispatch(setSelectedSize(filtered[0]));
      }
    }
  }, [sizes, supportedSizes, imageOrientation, imageSource, selectedSize, dispatch]);
};
