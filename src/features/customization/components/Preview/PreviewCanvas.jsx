// PreviewCanvas.jsx

import { Box } from "@chakra-ui/react";
import HiddenExportStage from "./HiddenExportStage";
import PreviewControls from "./PreviewControls";
import RegularPreviewContent from "./RegularPreviewContent";
import WallPreviewContent from "./WallPreviewContent";
import { useSelector } from "react-redux";

const PreviewCanvas = ({ previewRef }) => {
  const { selectedBackground } = useSelector((s) => s.framePreview);

  return (
    <Box
      h="100%"
      display="flex"
      flexDir="column"
      alignItems={selectedBackground ? "stretch" : "center"}
      justifyContent="center"
      gap={4}
      bg="#fff"
      position="relative"
      overflowX="hidden"
      overflowY="visible"
      // borderRadius="lg"
    >
      <PreviewControls previewRef={previewRef} />

      {selectedBackground ? (
        <>
          <WallPreviewContent />
          <HiddenExportStage />
        </>
      ) : (
        <>
          <RegularPreviewContent ref={previewRef} />
          <HiddenExportStage />
        </>
      )}
    </Box>
  );
};

export default PreviewCanvas;
