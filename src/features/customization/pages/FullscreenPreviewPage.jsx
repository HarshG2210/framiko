import { Box, Center, Text } from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import RegularPreviewContent from "../components/Preview/RegularPreviewContent";
import WallPreviewContent from "../components/Preview/WallPreviewContent";
import { hydratePreviewState } from "../../../redux/slices/framePreviewSlice";

const FullscreenPreviewPage = () => {
  const dispatch = useDispatch();
  const { selectedBackground, uploadedImage } = useSelector(
    (state) => state.framePreview,
  );
  const [isReady, setIsReady] = React.useState(false);

  useEffect(() => {
    try {
      const storedPreview = window.localStorage.getItem("fullscreenPreviewState");

      if (storedPreview) {
        const parsedPreview = JSON.parse(storedPreview);
        dispatch(hydratePreviewState(parsedPreview));
      }
    } catch (error) {
      console.error("Failed to restore fullscreen preview state:", error);
    } finally {
      setIsReady(true);
      window.localStorage.removeItem("fullscreenPreviewState");
    }
  }, [dispatch]);

  useEffect(() => {
    if (!isReady || !uploadedImage) return;

    const element = document.body;

    if (element?.requestFullscreen) {
      element.requestFullscreen().catch(() => {});
    }
  }, [isReady, uploadedImage]);

  if (!isReady) {
    return (
      <Center minH="100vh" bg="white">
        <Text fontSize="lg">Loading preview...</Text>
      </Center>
    );
  }

  if (!uploadedImage) {
    return (
      <Center minH="100vh" bg="white">
        <Text fontSize="lg">No preview available.</Text>
      </Center>
    );
  }

  return (
    <Box
      minH="100vh"
      w="100vw"
      h="100vh"
      bg="white"
      overflow="hidden"
      position="fixed"
      inset={0}
      zIndex={99999}
    >
      <Box w="100%" h="100%" display="flex" alignItems="center" justifyContent="center">
        {selectedBackground ? (
          <WallPreviewContent fullscreen />
        ) : (
          <RegularPreviewContent />
        )}
      </Box>
    </Box>
  );
};

export default FullscreenPreviewPage;
