import { AspectRatio, Box, Image as ChakraImage, useBreakpointValue } from "@chakra-ui/react";
import { normalizeMediaUrl } from "../../../../utils/constant";

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
    frameViewChoice,
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

  // On mobile, use the available container width (avoid using viewport width which can overflow)
  const containerWidth = useBreakpointValue({ base: "100%", md: `${w}px` });
  const containerMaxHeight = useBreakpointValue({ base: "90vh", md: "auto" });
  const matGap = frameViewChoice === "moult" ? (isMobile ? 14 : 28) : 0;

  if (!uploadedImage || !imageOrientation) return null;

  return (
    <Box ref={previewRef} display="flex" justifyContent="center" width="100%">
      <AspectRatio
        ratio={w / h}
        width={containerWidth}
        maxW={`${w}px`}
        sx={{
          boxSizing: "border-box",
          border: `${borderWidth}px solid transparent`,
          borderImage: selectedFrame
            ? `url(${normalizeMediaUrl(selectedFrame.image)}) ${borderSlice} stretch`
            : "none",
          bg: "white",
          position: "relative",
          overflow: "hidden",
          maxHeight: containerMaxHeight,
        }}
      >
        <Box
          position="absolute"
          top={`${matGap}px`}
          right={`${matGap}px`}
          bottom={`${matGap}px`}
          left={`${matGap}px`}
          width="auto"
          height="auto"
          overflow="hidden"
          bg="white"
          sx={{
            top: `${matGap}px !important`,
            right: `${matGap}px !important`,
            bottom: `${matGap}px !important`,
            left: `${matGap}px !important`,
            width: `auto !important`,
            height: `auto !important`,
          }}
        >
          <ChakraImage
            src={uploadedImage}
            alt={uploadedImage}
            w="100%"
            h="100%"
            objectFit="fill"
            objectPosition="center"
            transform={`rotate(${imageTransform.rotate}deg)`}
            transition="transform 0.2s ease"
            draggable={false}
          />
        </Box>
      </AspectRatio>
    </Box>
  );
});

export default RegularPreviewContent;
