import { AspectRatio, Box, Image as ChakraImage, useBreakpointValue } from "@chakra-ui/react";

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

  const isMobile = useBreakpointValue({ base: true, md: false });

  const { borderWidth, borderSlice } = useFrameBorder(
    selectedFrame,
    showFrame,
    "regular",
    false,
    !!isMobile
  );

  // On mobile, use most of the viewport width but keep some padding to avoid touching edges
  const containerWidth = useBreakpointValue({ base: "calc(100vw - 32px)", md: `${w}px` });
  const containerMaxHeight = useBreakpointValue({ base: "90vh", md: "auto" });

  if (!uploadedImage || !imageOrientation) return null;

  return (
    <Box ref={previewRef} display="flex" justifyContent="center">
      <AspectRatio
        ratio={w / h}
        width={containerWidth}
        maxW={`${w}px`}
        sx={{
          boxSizing: "border-box",
          border: `${borderWidth}px solid transparent`,
          borderImage: selectedFrame
            ? `url(${selectedFrame.image}) ${borderSlice} stretch`
            : "none",
          bg: "white",
          position: "relative",
          overflow: "hidden",
          maxHeight: containerMaxHeight,
        }}
      >
        <ChakraImage
          src={uploadedImage}
          alt={uploadedImage}
          w="100%"
          h="100%"
          objectFit="contain"
          objectPosition="center"
          transform={`rotate(${imageTransform.rotate}deg)`}
          transition="transform 0.2s ease"
          draggable={false}
        />
      </AspectRatio>
    </Box>
  );
});

export default RegularPreviewContent;
