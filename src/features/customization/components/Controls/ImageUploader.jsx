import {
  Box,
  Button,
  Flex,
  Icon,
  Input,
  Spinner,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FiImage, FiUploadCloud } from "react-icons/fi";
import React, { useEffect } from "react";
import {
  clearUploadState,
  uploadImage,
} from "../../../../redux/slices/imageUploadSlice";
import {
  resetPreview,
  setCropOriginalImage,
  setUploadedImage,
} from "../../../../redux/slices/framePreviewSlice";
import { useDispatch, useSelector } from "react-redux";

import CropModal from "./CropModal";
import { clearSupportedSizes } from "../../../../redux/slices/categoriesSlice";

const ImageUploader = () => {
  const dispatch = useDispatch();
  const crop = useDisclosure();

  const { uploading, uploadedImageUrl, uploadError } = useSelector(
    (s) => s.imageUpload,
  );

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    dispatch(uploadImage(file));
  };

  useEffect(() => {
    if (!uploadedImageUrl) return;

    dispatch(
      setUploadedImage({
        image: uploadedImageUrl,
        fileName: "uploaded-image",
        source: "user-upload",
      }),
    );

    dispatch(
      setCropOriginalImage({
        image: uploadedImageUrl,
      }),
    );

    crop.onOpen();
  }, [uploadedImageUrl, dispatch]);

  const handleReset = () => {
    dispatch(resetPreview());
    dispatch(clearSupportedSizes());
    dispatch(clearUploadState());
  };

  return (
    <>
      <Box mx="auto" w="100%" maxW="1400px" px={{ base: 5, md: 8 }}>
        <Text
          as="h2"
          fontFamily="heading"
          fontSize={{ base: "xl", md: "3xl" }}
          fontWeight="700"
          color="neutral.900"
          mb={4}
        >
          Upload Image
        </Text>
      </Box>

      <Flex justify="center" mt={2} mb={4}>
        <Box
          // Outer big dashed box (mobile-only size tweak; md+ unchanged)
          w="100%"
          maxW={{ base: "360px", md: "600px" }}
          mx="auto"
          px={{ base: 2, md: 6 }}
          py={{ base: 3, md: 8 }}
          border="2px dashed"
          borderColor={uploading ? "brand.500" : "brand.500"}
          bg="transparent"
        >
          <Box
            position="relative"
            w="100%"
            maxW={{ base: "320px", sm: "420px", md: "640px" }}
            mx="auto"
            overflow="hidden"
          >
            {/* Hidden file input */}
            <Input
              type="file"
              accept="image/*"
              onChange={handleChange}
              opacity={0}
              position="absolute"
              inset={0}
              w="100%"
              h="100%"
              cursor="pointer"
              zIndex={2}
            />
            {/* Upload Card */}
            <Box bg="#F9F9F9" px={{ base: 4, md: 10 }} py={{ base: 4, md: 10 }}>
              <VStack spacing={1} align="center">
                {uploading ? (
                  <>
                    <Spinner
                      thickness="3px"
                      speed="0.7s"
                      emptyColor="gray.200"
                      color="solid"
                      size="lg"
                    />
                    <Text fontSize="sm" color="gray.600" fontWeight="500">
                      Uploading your artwork…
                    </Text>
                  </>
                ) : (
                  <>
                    {/* Icon circle */}
                    <Box
                      borderRadius="full"
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      boxSize={12}
                    >
                      <Icon as={FiUploadCloud} boxSize={12} color="#000" />
                    </Box>

                    <Text fontSize="sm" color="#000" textAlign="center" mt={0}>
                      Drag & drop or click to browse
                    </Text>

                    <Flex align="center" gap={1} mt={0}>
                      <Text fontSize="xs" color="#ACACAC" fontWeight="500">
                        Support JPG, JPEG, PNG, WEBP
                      </Text>
                    </Flex>
                  </>
                )}

                {uploadError && (
                  <Text fontSize="sm" color="red.500" fontWeight="500" mt={1}>
                    {uploadError}
                  </Text>
                )}
              </VStack>
            </Box>
          </Box>
        </Box>
      </Flex>

      {uploadedImageUrl && (
        <Flex justify="center" mt={3}>
          <Button
            variant="ghost"
            size="sm"
            color="gray.600"
            fontWeight="500"
            onClick={handleReset}
            _hover={{ color: "solid", bg: "transparent" }}
          >
            ← Back to Select
          </Button>
        </Flex>
      )}

      <CropModal {...crop} />
    </>
  );
};

export default ImageUploader;
