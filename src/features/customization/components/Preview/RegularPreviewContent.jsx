import { Box, Image as ChakraImage } from "@chakra-ui/react";

import { forwardRef } from "react";
import { useFrameBorder } from "../../hooks/useFrameBorder";
import { useSelector } from "react-redux";

/* ---------------- CONFIG ---------------- */

const ORIENTATION_SIZE = {
  portrait: { w: 700, h: 950 },
  landscape: { w: 950, h: 700 },
  square: { w: 800, h: 800 },
};

const RegularPreviewContent = forwardRef((_, previewRef) => {
  const {
    uploadedImage,
    selectedFrame,
    showFrame,
    imageTransform,
    imageOrientation,
  } = useSelector((s) => s.framePreview);

  const { w, h } =
    ORIENTATION_SIZE[imageOrientation] || ORIENTATION_SIZE.square;

  const { borderWidth, borderSlice } = useFrameBorder(selectedFrame, showFrame);

  if (!uploadedImage || !imageOrientation) return null;

  return (
    <Box
      ref={previewRef}
      width={`${w}px`}
      height={`${h}px`}
      boxSizing="content-box"
      border={`${borderWidth}px solid transparent`}
      sx={{
        borderImage: selectedFrame
          ? `url(${selectedFrame.image}) ${borderSlice} stretch`
          : "none",
      }}
      bg="black"
      position="relative"
      overflow="hidden"
    >
      <ChakraImage
        src={uploadedImage}
        alt={uploadedImage}
        w="100%"
        h="100%"
        objectFit="fill"
        transform={`rotate(${imageTransform.rotate}deg)`}
        transition="transform 0.2s ease"
        draggable={false}
      />
    </Box>
  );
});

export default RegularPreviewContent;
