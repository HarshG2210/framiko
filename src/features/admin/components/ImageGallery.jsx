import React from "react";
import {
  Box,
  Image as ChakraImage,
  Badge,
  Flex,
  Spinner,
  Text,
  VStack,
  Wrap,
  WrapItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  IconButton,
  HStack,
  Button,
} from "@chakra-ui/react";
import { resolveMediaUrl } from "../utils/orderFormatters";
import {
  FiDownload,
  FiChevronLeft,
  FiChevronRight,
  FiMaximize2,
  FiX,
} from "react-icons/fi";

/**
 * Image gallery: featured large image + clickable thumbnail strip
 * Memoized for performance
 */
const ImageGallery = React.memo(({ images = [] }) => {
  const valid = images.filter((img) => resolveMediaUrl(img.src));
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [isViewerOpen, setIsViewerOpen] = React.useState(false);

  if (valid.length === 0) {
    return (
      <Flex
        w="100%"
        h="280px"
        bg="gray.100"
        borderRadius="lg"
        align="center"
        justify="center"
        borderWidth="1px"
        borderStyle="dashed"
        borderColor="gray.300"
      >
        <Text fontSize="sm" color="gray.400">
          No images available
        </Text>
      </Flex>
    );
  }

  const safeIdx = Math.min(activeIdx, valid.length - 1);
  const active = valid[safeIdx];

  const goToPrev = () => {
    setActiveIdx((prev) => (prev === 0 ? valid.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setActiveIdx((prev) => (prev === valid.length - 1 ? 0 : prev + 1));
  };

  const handleDownload = async () => {
    const imageUrl = resolveMediaUrl(active.src);
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl, { mode: "cors" });
      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${(active.label || "image").replace(/\s+/g, "_")}${blob.type.includes("image") ? "" : ".jpg"}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(imageUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Box w="100%">
      {/* Featured large image */}
      <Box
        position="relative"
        w="100%"
        h={{ base: "260px", md: "340px" }}
        borderRadius="lg"
        overflow="hidden"
        borderWidth="2px"
        borderColor="blue.400"
        boxShadow="md"
        mb={3}
        bg="gray.50"
      >
        <Box
          as="button"
          position="absolute"
          top={2}
          right={2}
          zIndex={2}
          onClick={() => setIsViewerOpen(true)}
          bg="whiteAlpha.900"
          borderRadius="full"
          p={2}
          boxShadow="md"
          _hover={{ bg: "white" }}
        >
          <FiMaximize2 size={16} />
        </Box>
        <ChakraImage
          src={resolveMediaUrl(active.src)}
          alt={active.label}
          w="100%"
          h="100%"
          objectFit="contain"
          fallback={
            <Flex w="100%" h="100%" align="center" justify="center">
              <Spinner />
            </Flex>
          }
          onClick={() => setIsViewerOpen(true)}
          cursor="pointer"
        />
        <Badge
          position="absolute"
          top={2}
          left={2}
          colorScheme="blue"
          fontSize="xs"
          px={2}
          py={1}
          borderRadius="md"
        >
          {active.label}
        </Badge>
      </Box>

      <Modal
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        size="full"
      >
        <ModalOverlay />
        <ModalContent bg="black" color="white" borderRadius={0}>
          <ModalBody p={0} display="flex" flexDirection="column" minH="100vh">
            <Flex
              justify="space-between"
              align="center"
              p={4}
              bg="blackAlpha.700"
            >
              <Text fontWeight="600">{active.label}</Text>
              <HStack>
                {active.label?.toLowerCase().includes("uploaded") && (
                  <Button
                    leftIcon={<FiDownload />}
                    size="sm"
                    colorScheme="blue"
                    onClick={handleDownload}
                  >
                    Download
                  </Button>
                )}
                <IconButton
                  aria-label="Close viewer"
                  icon={<FiX />}
                  onClick={() => setIsViewerOpen(false)}
                />
              </HStack>
            </Flex>

            <Flex
              flex={1}
              align="center"
              justify="center"
              position="relative"
              p={4}
            >
              <IconButton
                aria-label="Previous image"
                icon={<FiChevronLeft />}
                onClick={goToPrev}
                position="absolute"
                left={4}
                size="lg"
                borderRadius="full"
                bg="blackAlpha.600"
                color="white"
                _hover={{ bg: "blackAlpha.700" }}
              />

              <Box maxW="90vw" maxH="80vh" overflow="hidden" borderRadius="lg">
                <ChakraImage
                  src={resolveMediaUrl(active.src)}
                  alt={active.label}
                  maxW="90vw"
                  maxH="80vh"
                  objectFit="contain"
                />
              </Box>

              <IconButton
                aria-label="Next image"
                icon={<FiChevronRight />}
                onClick={goToNext}
                position="absolute"
                right={4}
                size="lg"
                borderRadius="full"
                bg="blackAlpha.600"
                color="white"
                _hover={{ bg: "blackAlpha.700" }}
              />
            </Flex>

            {valid.length > 1 && (
              <Wrap spacing={2} justify="center" p={4} bg="blackAlpha.700">
                {valid.map((img, idx) => {
                  const isActive = idx === safeIdx;
                  return (
                    <WrapItem key={`${img.label}-${idx}`}>
                      <Box
                        as="button"
                        onClick={() => setActiveIdx(idx)}
                        borderWidth={isActive ? "3px" : "1px"}
                        borderColor={isActive ? "blue.400" : "whiteAlpha.300"}
                        borderRadius="md"
                        overflow="hidden"
                        w="70px"
                        h="70px"
                      >
                        <ChakraImage
                          src={resolveMediaUrl(img.src)}
                          alt={img.label}
                          w="100%"
                          h="100%"
                          objectFit="cover"
                        />
                      </Box>
                    </WrapItem>
                  );
                })}
              </Wrap>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Thumbnail strip */}
      {valid.length > 1 && (
        <Wrap spacing={2}>
          {valid.map((img, idx) => {
            const isActive = idx === safeIdx;
            return (
              <WrapItem key={`${img.label}-${idx}`}>
                <VStack spacing={1}>
                  <Box
                    as="button"
                    onClick={() => setActiveIdx(idx)}
                    borderWidth={isActive ? "3px" : "1px"}
                    borderColor={isActive ? "blue.500" : "gray.200"}
                    borderRadius="md"
                    overflow="hidden"
                    boxShadow={
                      isActive ? "0 0 0 2px rgba(66,153,225,0.4)" : "none"
                    }
                    transition="all 0.15s ease"
                    _hover={{ borderColor: "blue.400" }}
                    w="76px"
                    h="76px"
                    flexShrink={0}
                  >
                    <ChakraImage
                      src={resolveMediaUrl(img.src)}
                      alt={img.label}
                      w="100%"
                      h="100%"
                      objectFit="cover"
                      opacity={isActive ? 1 : 0.75}
                    />
                  </Box>
                  <Text
                    fontSize="2xs"
                    fontWeight={isActive ? "700" : "400"}
                    color={isActive ? "blue.600" : "gray.400"}
                  >
                    {img.label}
                  </Text>
                </VStack>
              </WrapItem>
            );
          })}
        </Wrap>
      )}
    </Box>
  );
});

ImageGallery.displayName = "ImageGallery";

export default ImageGallery;
