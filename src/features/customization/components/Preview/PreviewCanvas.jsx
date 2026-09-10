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
      alignItems="center"
      justifyContent="center"
      gap={4}
      bg="#F8F8F8"
      position="relative"
      overflowX="hidden"
      overflowY="visible"
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
