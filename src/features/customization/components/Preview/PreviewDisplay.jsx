import { Box } from "@chakra-ui/react";
import FrameSelector from "../Selector/FrameSelector";
import PreviewCanvas from "./PreviewCanvas";
import { useRef } from "react";

const PreviewDisplay = () => {
  const previewRef = useRef(null);

  return (
    <Box justify="center" align="center">
      <PreviewCanvas previewRef={previewRef} />
      <Box display={{ base: "block", md: "block", lg: "none" }} w="100%" mt={4}>
        <FrameSelector />
      </Box>
    </Box>
  );
};

export default PreviewDisplay;
