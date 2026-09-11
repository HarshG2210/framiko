import {
  Box,
  Center,
  Image as ChakraImage,
  Portal,
  ScaleFade,
  Text,
  VStack,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchFrames } from "../../../../redux/slices/framesSlice";
import { setSelectedFrame } from "../../../../redux/slices/framePreviewSlice";
import { normalizeMediaUrl } from "../../../../utils/constant";

const FrameSelector = () => {
  const dispatch = useDispatch();
  const selectedFrame = useSelector((s) => s.framePreview.selectedFrame);
  const selectedSize = useSelector((s) => s.framePreview.selectedSize);
  const { frames } = useSelector((s) => s.frames || { frames: [] });

  useEffect(() => {
    dispatch(fetchFrames());
  }, [dispatch]);

  const visibleFrames = selectedSize?.id
    ? frames.filter((frame) => frame.supported_sizes?.includes(selectedSize.id))
    : frames;

  useEffect(() => {
    if (!selectedFrame || !selectedSize?.id) return;

    const isStillSupported = visibleFrames.some(
      (frame) => frame.id === selectedFrame.id,
    );

    if (!isStillSupported) {
      dispatch(setSelectedFrame(null));
    }
  }, [dispatch, selectedFrame, selectedSize, visibleFrames]);

  const [hoveredId, setHoveredId] = useState(null);
  const [hoverPos, setHoverPos] = useState({ x: 0, y: 0 });

  const isMobile = useBreakpointValue({ base: true, md: false });

  const hoveredFrame = visibleFrames.find((f) => f.id === hoveredId);

  const handleHover = (e, id) => {
    const rect = e.currentTarget.getBoundingClientRect();
    // Position tooltip to the left of the frame
    setHoverPos({
      x: rect.left - 12,
      y: rect.top + rect.height / 2,
    });
    setHoveredId(id);
  };

  return (
    <Box flex="1" position="relative" h="100%" bg="#F8F8F8" borderRadius="lg">
      {/* Section Label */}
      <Text
        fontSize="sm"
        fontWeight="500"
        color="gray.500"
        mb={4}
        textAlign="center"
      >
        Frame's
      </Text>

      <Box
        maxH={{ base: "none", lg: "480px" }}
        overflowY={{ base: "visible", lg: "auto" }}
        overflowX={{ base: "auto", lg: "visible" }}
        display="flex"
        justifyContent={{ base: "flex-start", lg: "center" }}
        sx={{
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <VStack
          spacing={6}
          align={{ base: "flex-start", lg: "center" }}
          justifyContent="flex-start"
          display="flex"
          flexDirection={{ base: "row", lg: "column" }}
          w={{ base: "max-content", lg: "100%" }}
          pb={{ base: 4, md: 0 }}
          pl={{ base: 2, lg: 0 }}
        >
          {/* -------- NO FRAME OPTION -------- */}
          <Box
            position="relative"
            border="2px solid"
            borderColor={!selectedFrame ? "#590854" : "transparent"}
            borderRadius="lg"
            bg="white"
            cursor="pointer"
            transition="all 0.2s"
            boxShadow={
              !selectedFrame ? "0 2px 8px rgba(89, 8, 84, 0.12)" : "none"
            }
            onClick={() => dispatch(setSelectedFrame(null))}
            mb={{ base: 3, md: 0 }}
          >
            {/* Purple indicator bar */}
            {!selectedFrame && (
              <>
                {/* Mobile → bottom */}
                <Box
                  display={{ base: "block", md: "none" }}
                  position="absolute"
                  left="50%"
                  bottom="-18px"
                  transform="translateX(-50%)"
                  w="34px"
                  h="8px"
                  bg="#590854"
                  borderRadius="full"
                />
                {/* Desktop → left */}
                <Box
                  display={{ base: "none", md: "block" }}
                  position="absolute"
                  left="-18px"
                  top="50%"
                  transform="translateY(-50%)"
                  w="8px"
                  h="34px"
                  bg="#590854"
                  borderRadius="full"
                />
              </>
            )}
            <Center w={{ base: "64px", md: "100px" }} h={{ base: "64px", md: "90px" }} borderRadius="lg">
              <Text fontSize="xs" color="gray.400" fontWeight="500">
                None
              </Text>
            </Center>
          </Box>

          {/* -------- EMPTY STATE -------- */}
          {selectedSize?.id && visibleFrames.length === 0 && (
            <Text fontSize="sm" color="gray.500" textAlign="center" py={4}>
              No frames available for the selected size.
            </Text>
          )}

          {/* -------- FRAME OPTIONS -------- */}
          {visibleFrames.map((frame) => {
            const isSelected = selectedFrame?.id === frame.id;
            const displayImage =
              frame.selector_image ||
              frame.selector_image_url ||
              frame.image ||
              frame.image_url;

            return (
              <Box
                key={frame.id}
                position="relative"
                border="2px solid"
                borderColor={isSelected ? "#590854" : "transparent"}
                borderRadius="lg"
                bg={isSelected ? "white" : "transparent"}
                cursor="pointer"
                transition="all 0.2s"
                boxShadow={
                  isSelected ? "0 2px 8px rgba(89, 8, 84, 0.12)" : "none"
                }
                _hover={{
                  bg: isSelected ? "white" : "rgba(0,0,0,0.02)",
                }}
                onClick={() => dispatch(setSelectedFrame(frame))}
                onMouseEnter={(e) => handleHover(e, frame.id)}
                onMouseLeave={() => setHoveredId(null)}
                mb={{ base: 3, md: 0 }}
              >
                {/* Purple indicator bar */}
                {isSelected && (
                  <>
                    {/* Mobile → bottom */}
                    <Box
                      display={{ base: "block", md: "none" }}
                      position="absolute"
                      left="50%"
                      bottom="-18px"
                      transform="translateX(-50%)"
                      w="34px"
                      h="8px"
                      bg="#590854"
                      borderRadius="full"
                    />
                    {/* Desktop → left */}
                    <Box
                      display={{ base: "none", md: "block" }}
                      position="absolute"
                      left="-18px"
                      top="50%"
                      transform="translateY(-50%)"
                      w="8px"
                      h="34px"
                      bg="#590854"
                      borderRadius="full"
                    />
                  </>
                )}

                <Box
                  w={{ base: "64px", md: "100px" }}
                  h={{ base: "64px", md: "90px" }}
                  mx="auto"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <ChakraImage
                    src={normalizeMediaUrl(displayImage)}
                    alt={frame.name}
                    maxW="100%"
                    maxH="100%"
                    objectFit="contain"
                  />
                </Box>
              </Box>
            );
          })}
        </VStack>
      </Box>

      {/* -------- HOVER TOOLTIP (left side) -------- */}
      {hoveredFrame && !isMobile && (
        <Portal>
          <ScaleFade in>
            <Box
              position="fixed"
              left={hoverPos.x}
              top={hoverPos.y}
              transform="translate(-100%, -50%)"
              bg="white"
              border="1px solid"
              borderColor="#EBEBEB"
              boxShadow="0 8px 24px rgba(0,0,0,0.12)"
              px={4}
              py={3}
              borderRadius="xl"
              zIndex="popover"
              pointerEvents="none"
              minW="140px"
              mr={2}
            >
              <Text fontSize="sm" fontWeight="600" color="#1A1A1A">
                {hoveredFrame.name}
              </Text>
              {hoveredFrame.thickness && (
                <Text fontSize="xs" color="gray.500" mt={0.5}>
                  Thickness: {hoveredFrame.thickness} inch
                </Text>
              )}
            </Box>
          </ScaleFade>
        </Portal>
      )}
    </Box>
  );
};

export default FrameSelector;
