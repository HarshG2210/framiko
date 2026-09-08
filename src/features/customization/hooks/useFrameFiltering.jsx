import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilteredFrames,
  setSelectedFrame,
} from "../../../redux/slices/framePreviewSlice";
import { selectFilteredFrames } from "../../../redux/slices/previewDerivedSlice";

export const useFrameFiltering = () => {
  const dispatch = useDispatch();
  const { frames } = useSelector((s) => s.frames);
  const { selectedSize, selectedFrame } = useSelector((s) => s.framePreview);
  const filteredFrames = useSelector(selectFilteredFrames);

  useEffect(() => {
    dispatch(setFilteredFrames(filteredFrames));
  }, [filteredFrames, dispatch]);

  useEffect(() => {
    if (!frames.length || !selectedSize) return;

    const filtered = frames.filter((f) =>
      f.supported_sizes.includes(selectedSize.id)
    );

    dispatch(setFilteredFrames(filtered));

    if (selectedFrame === undefined && filtered.length) {
      dispatch(setSelectedFrame(filtered[0]));
    }
  }, [frames, selectedSize, selectedFrame, dispatch]);
};
