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
  SimpleGrid,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import {
  FiArrowRight,
  FiCrop,
  FiEye,
  FiGrid,
  FiImage,
  FiPlay,
  FiShoppingCart,
  FiUpload,
} from "react-icons/fi";

import { useNavigate } from "react-router-dom";

const YOUTUBE_EMBED_URL =
  "https://www.youtube.com/embed/Bhguje7f8WU?autoplay=1&rel=0&modestbranding=1";

const steps = [
  {
    icon: FiUpload,
    title: "Upload Your Artwork",
    description:
      "Start by uploading your image or choosing from our curated gallery.",
  },
  {
    icon: FiImage,
    title: "Choose Orientation & Size",
    description:
      "Select the perfect orientation and size that fits your space.",
  },
  {
    icon: FiGrid,
    title: "Pick Your Frame",
    description:
      "Browse premium frame styles and find the one that elevates your artwork.",
  },
  {
    icon: FiCrop,
    title: "Crop & Adjust",
    description:
      "Fine-tune placement so your artwork sits perfectly inside the frame.",
  },
  {
    icon: FiEye,
    title: "Preview on Wall",
    description: "See how your framed artwork looks on real room backgrounds.",
  },
  {
    icon: FiShoppingCart,
    title: "Add to Cart & Order",
    description: "Once satisfied, add to cart and place your order in seconds.",
  },
];

/* Warm tan from the icon circles in the Figma */
const ICON_BG = "#C9AB7E";
/* Off-white card background */
const CARD_BG = "#F7F5F1";

const CustomizationFlowSection = () => {
  const navigate = useNavigate();
  const videoModal = useDisclosure();

  return (
    <Box
      w="full"
      bg="#ffffff"
      mt="10"
      py={{ base: 14, md: 18 }}
      px={{ base: 6, md: 12 }}
    >
      <VStack
        textAlign="center"
        mb={14}
        spacing={{ base: 8, md: 10 }}
        maxW="1200px"
        mx="auto"
      >
        <Box textAlign="center">
          <Text
            fontSize={{ base: "3xl", sm: "4xl", lg: "5xl" }}
            fontWeight="500"
            color="#D0D0D0"
            letterSpacing="-0.05em"
            fontFamily="heading"
            mb={4}
            lineHeight="1.05"
          >
            Your Custom Frame Journey
          </Text>

          <Text
            fontSize={{ base: "1rem", md: "1.2rem" }}
            color="#6a6a6a"
            maxW="860px"
            mx="auto"
            lineHeight="1.7"
            fontFamily="body"
          >
            From the moment you upload your image to the final wall-ready
            preview, our seamless customization process makes framing easy and
            enjoyable.
          </Text>
        </Box>

        <SimpleGrid
          columns={{ base: 1, md: 2, xl: 3 }}
          spacing={{ base: 6, md: 8 }}
          w="100%"
        >
          {steps.map((step, i) => (
            <Flex
              key={i}
              direction="column"
              align="center"
              textAlign="center"
              pt={{ base: 8, md: 10 }}
              pb={{ base: 8, md: 9 }}
              px={{ base: 6, md: 7 }}
              borderRadius="2xl"
              bg="#FBF9F7"
              minH={{ base: "250px", md: "270px" }}
              justify="flex-start"
            >
              <Box
                w="72px"
                h="72px"
                borderRadius="full"
                bg="#D8C4A2"
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={6}
              >
                <Icon as={step.icon} fontSize="28px" color="white" />
              </Box>

              <Text
                fontSize={{ base: "1.15rem", md: "1.4rem" }}
                fontWeight="600"
                color="#1d1d1d"
                fontFamily="heading"
                letterSpacing="-0.03em"
                mb={3}
              >
                {step.title}
              </Text>

              <Text
                fontSize={{ base: "0.95rem", md: "1rem" }}
                color="#5f5f5f"
                lineHeight="1.7"
                fontFamily="body"
                maxW="280px"
              >
                {step.description}
              </Text>
            </Flex>
          ))}
        </SimpleGrid>

        <Flex gap={5} flexWrap="wrap" justify="center" align="center" pt={2}>
          <Button
            px={8}
            py={6}
            fontSize={{ base: "1.05rem", md: "1.2rem" }}
            fontWeight="700"
            borderRadius="full"
            bg="#1b1b1b"
            color="white"
            fontFamily="body"
            letterSpacing="-0.02em"
            transition="none"
            _hover={{ bg: "#1b1b1b" }}
            _active={{ bg: "#1b1b1b" }}
            _focus={{ boxShadow: "none" }}
            onClick={() => navigate("/customization")}
            rightIcon={
              <Box
                w="28px"
                h="28px"
                borderRadius="full"
                bg="white"
                display="flex"
                alignItems="center"
                justifyContent="center"
                ml={2}
              >
                <Icon as={FiArrowRight} color="#1b1b1b" fontSize="14px" />
              </Box>
            }
          >
            Try Customization Now
          </Button>

          <Button
            px={8}
            py={6}
            fontSize={{ base: "1.05rem", md: "1.2rem" }}
            fontWeight="600"
            borderRadius="full"
            variant="outline"
            border="1.5px solid #1b1b1b"
            color="#1b1b1b"
            fontFamily="body"
            letterSpacing="-0.02em"
            transition="none"
            _hover={{ bg: "white" }}
            _active={{ bg: "transparent" }}
            _focus={{ boxShadow: "none" }}
            onClick={videoModal.onOpen}
            leftIcon={<Icon as={FiPlay} fontSize="18px" />}
          >
            Watch Video
          </Button>
        </Flex>
      </VStack>

      {/* ── VIDEO MODAL ── */}
      <Modal
        isOpen={videoModal.isOpen}
        onClose={videoModal.onClose}
        size="4xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent bg="black">
          <ModalCloseButton color="white" />
          <ModalBody p={0}>
            <Box
              as="iframe"
              src={videoModal.isOpen ? YOUTUBE_EMBED_URL : ""}
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
    </Box>
  );
};

export default CustomizationFlowSection;
