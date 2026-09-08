import { Box } from "@chakra-ui/react";
import Categories from "../../home/components/Categories";
import FramePreview from "../../home/components/FramePreview";
import VideoModalButton from "../components/VideoModalButton";

const Customization = () => {
  return (
    <Box p={2} bg="#fff">
      <Categories />
      <VideoModalButton />
      <FramePreview />
    </Box>
  );
};

export default Customization;
