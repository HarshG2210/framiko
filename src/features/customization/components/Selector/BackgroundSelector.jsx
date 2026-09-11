import {
  Box,
  Center,
  Image as ChakraImage,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { memo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchBackgrounds } from "../../../../redux/slices/backgroundsSlice";
import { setSelectedBackground } from "../../../../redux/slices/framePreviewSlice";

const BackgroundSelectorGrid = memo(() => {
  const dispatch = useDispatch();

  const { backgrounds, loading } = useSelector(
    (s) => s.backgrounds || { backgrounds: [] },
  );

  const selectedBackground = useSelector(
    (s) => s.framePreview.selectedBackground,
  );

  useEffect(() => {
    dispatch(fetchBackgrounds());
  }, [dispatch]);

  if (loading) return null;

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
        Background's
      </Text>

      <Box
        maxH={{ base: "none", lg: "480px" }}
        overflowY={{ base: "visible", lg: "auto" }}
        overflowX={{ base: "auto", lg: "visible" }}
        sx={{
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <VStack
          spacing={6}
          align="center"
          justifyContent={{ base: "flex-start", lg: "center" }}
          display="flex"
          flexDirection={{ base: "row", lg: "column" }}
          w={{ base: "max-content", lg: "100%" }}
          pb={{ base: 4, md: 0 }}
        >
          {/* -------- NO BACKGROUND OPTION -------- */}
          <Box
            position="relative"
            border="2px solid"
            borderColor={!selectedBackground ? "#590854" : "transparent"}
            borderRadius="lg"
            bg="white"
            cursor="pointer"
            transition="all 0.2s"
            boxShadow={
              !selectedBackground ? "0 2px 8px rgba(89, 8, 84, 0.12)" : "none"
            }
            onClick={() => dispatch(setSelectedBackground(null))}
            mb={{ base: 3, md: 0 }}
          >
            {!selectedBackground && (
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
                {/* Desktop → right */}
                <Box
                  display={{ base: "none", md: "block" }}
                  position="absolute"
                  right="-18px"
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

          {/* -------- BACKGROUND OPTIONS -------- */}
          {backgrounds?.map((bg) => {
            const isSelected = selectedBackground?.id === bg.id;

            return (
              <Box
                key={bg.id}
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
                onClick={() => dispatch(setSelectedBackground(bg))}
                mb={{ base: 3, md: 0 }}
              >
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
                    {/* Desktop → right */}
                    <Box
                      display={{ base: "none", md: "block" }}
                      position="absolute"
                      right="-18px"
                      top="50%"
                      transform="translateY(-50%)"
                      w="8px"
                      h="34px"
                      bg="#590854"
                      borderRadius="full"
                    />
                  </>
                )}

                <Box w={{ base: "64px", md: "100px" }} h={{ base: "64px", md: "90px" }} borderRadius="lg" overflow="hidden">
                  <ChakraImage
                    src={bg.image}
                    alt={bg.name}
                    w="100%"
                    h="100%"
                    objectFit="contain"
                  />
                </Box>
              </Box>
            );
          })}
        </VStack>
      </Box>
    </Box>);
});

export { BackgroundSelectorGrid };