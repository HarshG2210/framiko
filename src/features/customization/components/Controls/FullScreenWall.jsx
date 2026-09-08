// src/components/FramesPreview/Controls/FullScreenWall.jsx
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
} from "@chakra-ui/react";

import RegularPreviewContent from "../Preview/RegularPreviewContent";
import WallPreviewContent from "../Preview/WallPreviewContent";
import { useSelector } from "react-redux";

const FullScreenWall = ({ isOpen, onClose }) => {
  const { selectedBackground } = useSelector((state) => state.framePreview);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="full">
      <ModalOverlay />
      <ModalContent
        p={0}
        m={0}
        maxW="100vw"
        maxH="100vh"
        h="100vh"
        w="100vw"
        borderRadius={0}
        overflow="hidden"
        bg="white"
      >
        <ModalCloseButton zIndex={10} />
        <ModalBody p={0} h="100vh" overflow="hidden">
          <Box
            h="100vh"
            w="100vw"
            display="flex"
            alignItems="center"
            justifyContent="center"
            bg="white"
          >
            {selectedBackground ? (
              <WallPreviewContent fullscreen />
            ) : (
              <RegularPreviewContent />
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default FullScreenWall;
