import { Box } from "@chakra-ui/react";
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

  if (!uploadedImage || !selectedBackground || !selectedSize) return null;

  return (
    <Box
      w="100%"
      h={fullscreen ? "100vh" : "100vh"}
      position="relative"
      backgroundImage={`url(${selectedBackground.image})`}
      backgroundSize="cover"
      backgroundPosition="center"
      overflow="hidden"
      onMouseMove={drag.onMouseMove}
      onMouseUp={drag.onMouseUp}
      // py={4}
      
    >
      <FramedArtwork
        uploadedImage={uploadedImage}
        selectedFrame={selectedFrame}
        showFrame={showFrame}
        size={selectedSize}
        variant="wall"
        draggableProps={drag}
      />
    </Box>
  );
};

export default WallPreviewContent;
