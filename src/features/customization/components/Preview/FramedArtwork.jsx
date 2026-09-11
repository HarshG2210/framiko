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
  mobileFixed = false,
}) => {
  const widthPx = Number(size.width_cm) * CM_TO_PX;
  const heightPx = Number(size.height_cm) * CM_TO_PX;

  const { borderWidth, borderSlice } = useFrameBorder(
    selectedFrame,
    showFrame,
    variant,
  );

  if (!uploadedImage || !size) return null;

  // Responsive positioning: fixed top-center on mobile, draggable absolute on desktop
  const positionStyles = mobileFixed
    ? {
        position: "absolute",
        left: "50%",
        top: "25%",
        transform: "translateX(-50%)",
        zIndex: 80,
        cursor: "default",
      }
    : {
        position: "absolute",
        left: `${draggableProps?.position.x}px`,
        top: `${draggableProps?.position.y}px`,
        cursor: "grab",
      };

  return (
    <Box
      {...positionStyles}
      onMouseDown={!mobileFixed ? draggableProps?.onMouseDown : undefined}
      ref={!mobileFixed ? draggableProps?.ref : undefined}
      transition="transform 0.1s linear"
      boxShadow={mobileFixed ? "none" : "10px 10px 10px 5px rgba(0,0,0,0.3)"}
      maxW={mobileFixed ? "10vw" : undefined}
      width={mobileFixed ? "10vw" : undefined}
    >
      <Box
        width={mobileFixed ? "10vw" : `${widthPx}px`}
        height={mobileFixed ? "auto" : `${heightPx}px`}
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
          objectFit={mobileFixed ? "contain" : "fill"}
          draggable={false}
          bg="transparent"
        />
      </Box>
    </Box>
  );
};

export default FramedArtwork;
