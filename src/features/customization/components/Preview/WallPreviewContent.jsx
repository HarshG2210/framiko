import { Box, Image as ChakraImage, useBreakpointValue } from "@chakra-ui/react";

import FramedArtwork from "./FramedArtwork";
import { useDraggable } from "../../hooks/useDraggable";
import { useSelector } from "react-redux";

const WallPreviewContent = ({ fullscreen = false }) => {
  const {
    uploadedImage,
    selectedFrame,
    selectedBackground,
    selectedSize,
    showFrame,
  } = useSelector((s) => s.framePreview);

  const drag = useDraggable();

  const isMobile = useBreakpointValue({ base: true, md: false });

  if (!uploadedImage || !selectedBackground || !selectedSize) return null;

  return (
    <Box
      w="100%"
      // mobile: make the background square using viewport width; desktop: full height
      h={isMobile ? "100vw" : fullscreen ? "100vh" : "100vh"}
      position="relative"
      overflow="hidden"
      onMouseMove={drag.onMouseMove}
      onMouseUp={drag.onMouseUp}
    >
      <ChakraImage
        src={selectedBackground.image}
        alt="background"
        position="absolute"
        top={0}
        left={0}
        w="100%"
        h="100%"
        objectFit={isMobile ? "contain" : "cover"}
        objectPosition="center"
        pointerEvents="none"
        zIndex={0}
      />

      <FramedArtwork
        uploadedImage={uploadedImage}
        selectedFrame={selectedFrame}
        showFrame={showFrame}
        size={selectedSize}
        variant="wall"
        draggableProps={drag}
        mobileFixed={isMobile}
      />
    </Box>
  );
};

export default WallPreviewContent;
