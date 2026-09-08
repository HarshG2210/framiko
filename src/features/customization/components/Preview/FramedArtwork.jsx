import { Box, Image as ChakraImage } from "@chakra-ui/react";

import { useFrameBorder } from "../../hooks/useFrameBorder";

const CM_TO_PX = 8;

const FramedArtwork = ({
  uploadedImage,
  selectedFrame,
  showFrame,
  size,
  variant = "regular",
  draggableProps,
}) => {
  const widthPx = Number(size.width_cm) * CM_TO_PX;
  const heightPx = Number(size.height_cm) * CM_TO_PX;

  const { borderWidth, borderSlice } = useFrameBorder(
    selectedFrame,
    showFrame,
    variant
  );

  if (!uploadedImage || !size) return null;
  return (
    <Box
      cursor="grab"
      onMouseDown={draggableProps?.onMouseDown}
      ref={draggableProps?.ref}
      position="absolute"
      left={`${draggableProps?.position.x}px`}
      top={`${draggableProps?.position.y}px`}
      transition="transform 0.1s linear"
      boxShadow="10px 10px 10px 5px rgba(0,0,0,0.3)"
    >
      <Box
        width={`${widthPx}px`}
        height={`${heightPx}px`}
        boxSizing="content-box"
        border={`${borderWidth}px solid transparent`}
        sx={{
          borderImage: selectedFrame
            ? `url(${selectedFrame.image}) ${borderSlice} stretch`
            : "none",
        }}
        bg="transparent"
      >
        <ChakraImage
          src={uploadedImage}
          alt={uploadedImage}
          w="100%"
          h="100%"
          objectFit="fill"
          draggable={false}
          bg="transparent"
        />
      </Box>
    </Box>
  );
};

export default FramedArtwork;
