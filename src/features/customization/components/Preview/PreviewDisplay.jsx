import { Box } from "@chakra-ui/react";
import FrameSelector from "../Selector/FrameSelector";
import PreviewCanvas from "./PreviewCanvas";
import { useRef } from "react";

const PreviewDisplay = () => {
  const previewRef = useRef(null);

  return (
    <Box justify="center" align="center">
      <PreviewCanvas previewRef={previewRef} />
    </Box>
  );
};

export default PreviewDisplay;
