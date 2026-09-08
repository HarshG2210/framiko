import {
  Box,
  Button,
  Flex,
  HStack,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import {
  FiCrop,
  FiMaximize,
  FiMoreHorizontal,
  FiRotateCcw,
} from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";

import CropModal from "../Controls/CropModal";
import FullScreenWall from "../Controls/FullScreenWall";
import { resetSelection } from "../../../../redux/slices/framePreviewSlice";
import { useDisclosure } from "@chakra-ui/react";
import { useState } from "react";

// import MaterialDisplay from "../Controls/MaterialDisplay";

const PreviewControls = () => {
  const dispatch = useDispatch();
  const previewState = useSelector((state) => state.framePreview);
  const { selectedBackground } = previewState;
  const crop = useDisclosure();
  const fullscreen = useDisclosure();

  const [moreSelection, setMoreSelection] = useState("Bold");

  const handleFullscreen = () => {
    if (!selectedBackground) return;

    if (typeof window !== "undefined") {
      window.localStorage.setItem(
        "fullscreenPreviewState",
        JSON.stringify(previewState),
      );
    }

    window.open(
      "/customization/fullscreen-preview",
      "_blank",
      "noopener,noreferrer",
    );
  };

  return (
    <>
      {/* Desktop / tablet: full buttons */}
      <Flex
        gap={3}
        mb={4}
        mt={4}
        mr={14}
        justify="flex-end"
        align="center"
        flexWrap="wrap"
        w="100%"
        display={{ base: "none", md: "flex" }}
      >
        <Button
          leftIcon={<Icon as={FiCrop} boxSize={4} />}
          onClick={crop.onOpen}
        >
          Crop
        </Button>

        <Button
          leftIcon={<Icon as={FiRotateCcw} boxSize={4} />}
          onClick={() => dispatch(resetSelection())}
        >
          Reset
        </Button>

        <Button
          leftIcon={<Icon as={FiMaximize} boxSize={4} />}
          onClick={handleFullscreen}
          isDisabled={!selectedBackground}
          opacity={!selectedBackground ? 0.5 : 1}
        >
          Full screen
        </Button>

        <Menu>
          <MenuButton
            as={Button}
            rightIcon={<Icon as={FiMoreHorizontal} boxSize={4} />}
          >
            More
          </MenuButton>
          <MenuList minW="160px" borderRadius="md" py={2}>
            <MenuItem onClick={() => setMoreSelection("Bold")}>
              <HStack spacing={3} w="full">
                <Box
                  w={3}
                  h={3}
                  borderRadius="full"
                  bg={moreSelection === "Bold" ? "purple.600" : "transparent"}
                  borderWidth={moreSelection === "Bold" ? 0 : "1px"}
                  borderColor="gray.200"
                />
                <Box>Bold</Box>
              </HStack>
            </MenuItem>
            <MenuItem onClick={() => setMoreSelection("Moult")}>
              <HStack spacing={3} w="full">
                <Box
                  w={3}
                  h={3}
                  borderRadius="full"
                  bg={moreSelection === "Moult" ? "purple.600" : "transparent"}
                  borderWidth={moreSelection === "Moult" ? 0 : "1px"}
                  borderColor="gray.200"
                />
                <Box>Moult</Box>
              </HStack>
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      {/* Mobile: icon-only overlay top-left */}
      <Flex
        direction="column"
        gap={2}
        position="absolute"
        top={2}
        right={2}
        zIndex={50}
        display={{ base: "flex", md: "none" }}
        align="center"
      >
        <Button
          aria-label="Crop"
          onClick={crop.onOpen}
          w="40px"
          h="40px"
          minW="40px"
          p={0}
          borderRadius="full"
          boxShadow="sm"
        >
          <Icon as={FiCrop} boxSize={4} color="white" />
        </Button>

        <Button
          aria-label="Reset"
          onClick={() => dispatch(resetSelection())}
          w="40px"
          h="40px"
          minW="40px"
          p={0}
          borderRadius="full"
          boxShadow="sm"
        >
          <Icon as={FiRotateCcw} boxSize={4} color="white" />
        </Button>

        <Button
          aria-label="Fullscreen"
          onClick={handleFullscreen}
          isDisabled={!selectedBackground}
          w="40px"
          h="40px"
          minW="40px"
          p={0}
          borderRadius="full"
          boxShadow="sm"
        >
          <Icon as={FiMaximize} boxSize={4} color="white" />
        </Button>

        <Menu>
          <MenuButton
            as={Button}
            aria-label="More"
            w="40px"
            h="40px"
            minW="40px"
            p={0}
            borderRadius="full"
            boxShadow="sm"
          >
            <Icon as={FiMoreHorizontal} boxSize={4} color="white" />
          </MenuButton>
          <MenuList minW="160px" borderRadius="md" py={2}>
            <MenuItem onClick={() => setMoreSelection("Bold")}>Bold</MenuItem>
            <MenuItem onClick={() => setMoreSelection("Moult")}>Moult</MenuItem>
          </MenuList>
        </Menu>
      </Flex>

      <CropModal {...crop} />
      <FullScreenWall {...fullscreen} />
    </>
  );
};

export default PreviewControls;
