import {
  Box,
  Button,
  Flex,
  Icon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

import { FiPlay } from "react-icons/fi";

const YOUTUBE_EMBED_URL =
  "https://www.youtube.com/embed/Bhguje7f8WU?autoplay=1&rel=0&modestbranding=1";

const VideoModalButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    setIframeKey((prev) => prev + 1);
  }, [isOpen]);

  return (
    <>
      <Box
        mx="auto"
        w="100%"
        maxW="1400px"
        bg="brand.500"
        borderRadius="xl"
        px={{ base: 5, md: 6 }}
        py={{ base: 6, md: 6 }}
        mt={{ base: 6, md: 8 }}
        mb={6}
        position="relative"
        overflow="hidden"
        fontFamily="body"
        // subtle dot pattern
        sx={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
          backgroundSize: "12px 12px",
        }}
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          justify="space-between"
          align={{ base: "flex-start", md: "center" }}
          gap={4}
        >
          {/* Left content */}
          <Flex align="center" gap={4} flex={1}>
            {/* Circular play icon */}
            <Box
              w="40px"
              h="40px"
              borderRadius="full"
              bg="solid"
              display="flex"
              alignItems="center"
              justifyContent="center"
              flexShrink={0}
            >
              <Icon as={FiPlay} color="white" boxSize={4} ml="1px" />
            </Box>

            <VStack align="flex-start" spacing={0.5}>
              <Text
                fontSize={{ base: "sm", md: "md" }}
                fontWeight="600"
                color="#fff"
                lineHeight="1.3"
                fontFamily="body"
              >
                Watch the customization guide
              </Text>
              <Text
                fontSize="sm"
                color="#fff"
                lineHeight="1.4"
                fontFamily="body"
              >
                See how to upload artwork, choose a mat, and preview the
                finished frame.
              </Text>
            </VStack>
          </Flex>

          {/* Right button */}
          <Button
            onClick={onOpen}
            leftIcon={<Icon as={FiPlay} boxSize={3.5} />}
            variant="solid"
            size="md"
            flexShrink={0}
            fontFamily="body"
          >
            View video
          </Button>
        </Flex>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="4xl">
        <ModalOverlay />
        <ModalContent bg="black">
          <ModalCloseButton color="white" />
          <ModalBody p={0}>
            <Box
              key={iframeKey}
              as="iframe"
              src={YOUTUBE_EMBED_URL}
              title="Customization walkthrough"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{
                width: "100%",
                aspectRatio: "16 / 9",
                border: 0,
                borderRadius: "8px",
              }}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default VideoModalButton;
