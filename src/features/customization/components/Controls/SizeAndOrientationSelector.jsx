import {
  Badge,
  Box,
  Button,
  Flex,
  HStack,
  Text,
  VStack,
  useOutsideClick,
} from "@chakra-ui/react";
import React, { useRef, useState } from "react";
import {
  setImageOrientation,
  setPosition,
  setSelectedSize,
} from "../../../../redux/slices/framePreviewSlice";
import { useDispatch, useSelector } from "react-redux";

import { ChevronDownIcon } from "@chakra-ui/icons";
import CropModal from "../Controls/CropModal";
import MaterialDisplay from "./MaterialDisplay";

const ORIENTATIONS = ["portrait", "landscape", "square"];
const ORIENTATION_LABELS = ["Portrait", "Landscape", "Square"];

const SizeAndOrientationSelector = () => {
  const dispatch = useDispatch();

  const {
    filteredSizes,
    imageOrientation,
    selectedSize,
    forceOrientation,
    uploadedImage,
    imageSource,
  } = useSelector((s) => s.framePreview);
  const { artworkCategoryImages = [] } = useSelector(
    (s) => s.artworkCategoryImages,
  );

  const currentImageUrl =
    typeof uploadedImage === "string" ? uploadedImage : uploadedImage?.image;
  const isArtworkCategoryImage = artworkCategoryImages.some(
    (item) => item.image_file?.split("?")[0] === currentImageUrl?.split("?")[0],
  );
  const isOrientationDisabled =
    imageSource !== "user-upload" || forceOrientation || isArtworkCategoryImage;
  const previewHeight = 32;

  const [isCropOpen, setIsCropOpen] = useState(false);
  const openCropModal = () => setIsCropOpen(true);

  const requestOrientationChange = (newOrientation) => {
    if (newOrientation === imageOrientation) return;
    if (isOrientationDisabled) return;
    dispatch(setImageOrientation(newOrientation));
    openCropModal();
  };

  /* ---------------- SIZE DROPDOWN ---------------- */
  const CustomDropdown = () => {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef();

    useOutsideClick({
      ref,
      handler: () => setIsOpen(false),
    });

    const selectedText = selectedSize
      ? `${Number(selectedSize.width_cm).toFixed(0)} × ${Number(
          selectedSize.height_cm,
        ).toFixed(0)} in`
      : "Select Size";

    return (
      <Box position="relative" ref={ref} w="100%">
        <Text fontSize="sm" fontWeight="600" color="#1A1A1A" mb={2}>
          Size
        </Text>
        <Button
          onClick={() => setIsOpen(!isOpen)}
          rightIcon={<ChevronDownIcon boxSize={4} color="gray.400" />}
          bg="#F7F7F7"
          border="1px solid"
          borderColor="#EBEBEB"
          borderRadius="full"
          h="48px"
          px={5}
          fontWeight="400"
          fontSize="sm"
          color={selectedSize ? "#1A1A1A" : "#A0A0A0"}
          _hover={{ bg: "#F0F0F0" }}
          _active={{ bg: "#EBEBEB" }}
          w="100%"
          justifyContent="space-between"
        >
          {selectedText}
        </Button>

        {isOpen && (
          <Box
            position="absolute"
            top="calc(100% + 6px)"
            left={{ base: "-16px", md: 0 }}
            right={{ base: "-16px", md: 0 }}
            zIndex={20}
            bg="white"
            borderRadius="xl"
            boxShadow="0 8px 30px rgba(0,0,0,0.1)"
            border="1px solid"
            borderColor="#EBEBEB"
            maxH="260px"
            overflowY="auto"
            p={2}
          >
            <VStack align="stretch" spacing={1}>
              {filteredSizes.map((size) => {
                const isSelected = selectedSize?.id === size.id;
                const ratio = size.width_cm / size.height_cm;
                const previewWidth = Math.max(
                  18,
                  Math.min(48, previewHeight * ratio),
                );

                return (
                  <HStack
                    key={size.id}
                    px={3}
                    py={2.5}
                    borderRadius="lg"
                    bg={isSelected ? "#F5F0F5" : "transparent"}
                    cursor="pointer"
                    transition="all 0.15s"
                    _hover={{ bg: isSelected ? "#F5F0F5" : "#F9F9F9" }}
                    onClick={() => {
                      dispatch(setSelectedSize(size));
                      dispatch(setPosition({ x: 50, y: 50 }));
                      setIsOpen(false);
                      openCropModal();
                    }}
                  >
                    <Box
                      width={`${previewWidth}px`}
                      height={`${previewHeight}px`}
                      border="1.5px solid"
                      borderColor={isSelected ? "#590854" : "#CCC"}
                      borderRadius="sm"
                      flexShrink={0}
                    />
                    <Text
                      fontSize="sm"
                      fontWeight={isSelected ? "600" : "400"}
                      color="#1A1A1A"
                      flex="1"
                    >
                      {Number(size.width_cm).toFixed(0)} ×{" "}
                      {Number(size.height_cm).toFixed(0)} in
                    </Text>
                  </HStack>
                );
              })}
            </VStack>
          </Box>
        )}
      </Box>
    );
  };

  return (
    <>
      <Box w="100%" maxW="1400px" mx="auto" px={{ base: 4, md: 8 }}>
        {/* ── Orientation Tabs ── */}
        <Flex
          bg="#F5F5F5"
          borderRadius="full"
          //  p="4px"
          mb={6}
          gap={0}
        >
          {ORIENTATION_LABELS.map((label, index) => {
            const value = ORIENTATIONS[index];
            const isActive = imageOrientation === value;

            return (
              <Box
                key={label}
                as="button"
                flex={1}
                py={isActive ? 3.5 : 2.5}
                minH={isActive ? "52px" : "40px"}
                borderRadius="full"
                fontSize="sm"
                fontWeight={isActive ? "600" : "500"}
                color={isActive ? "white" : "#A0A0A0"}
                bg={isActive ? "#590854" : "transparent"}
                transition="all 0.2s"
                cursor={isOrientationDisabled ? "not-allowed" : "pointer"}
                opacity={isOrientationDisabled && !isActive ? 0.5 : 1}
                disabled={isOrientationDisabled}
                aria-disabled={isOrientationDisabled}
                onClick={() => requestOrientationChange(value)}
                _hover={
                  !isOrientationDisabled && !isActive ? { color: "#666" } : {}
                }
              >
                {label}
              </Box>
            );
          })}
        </Flex>

        {/* ── Size + Lamination ── */}
        <Flex direction={{ base: "row", sm: "row" }} gap={4} w="100%">
          <Box flex={1} w={{ base: "50%", md: "50%" }}>
            <CustomDropdown />
          </Box>

          <Box flex={1} w={{ base: "50%", md: "50%" }}>
            <MaterialDisplay />
          </Box>
        </Flex>
      </Box>

      <CropModal isOpen={isCropOpen} onClose={() => setIsCropOpen(false)} />
    </>
  );
};

export default SizeAndOrientationSelector;
