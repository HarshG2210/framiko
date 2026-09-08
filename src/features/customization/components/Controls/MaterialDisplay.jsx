import {
  Badge,
  Box,
  Button,
  Image as ChakraImage,
  Flex,
  HStack,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  Text,
  VStack,
  useDisclosure,
  useOutsideClick,
} from "@chakra-ui/react";
import { ChevronDownIcon, InfoOutlineIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import { fetchMaterials } from "../../../../redux/slices/materialsSlice";
import { setSelectedMaterial } from "../../../../redux/slices/framePreviewSlice";

const MaterialDisplay = () => {
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const ref = useRef();

  const { materials = [] } = useSelector((state) => state.materials || {});
  const selectedMaterial = useSelector(
    (state) => state.framePreview?.selectedMaterial,
  );

  useOutsideClick({
    ref,
    handler: () => setIsDropdownOpen(false),
  });

  useEffect(() => {
    dispatch(fetchMaterials());
    dispatch(setSelectedMaterial(null));
  }, [dispatch]);

  const handleSelectMaterial = (material) => {
    dispatch(setSelectedMaterial(material));
    setIsDropdownOpen(false);
  };

  return (
    <Box position="relative" ref={ref} w="100%">
      <Flex justify="space-between" align="center" mb={2}>
        <Text fontSize="sm" fontWeight="600" color="#1A1A1A">
          Lamination
        </Text>
        <IconButton
          icon={<InfoOutlineIcon />}
          variant="ghost"
          size="xs"
          color="gray.400"
          aria-label="Material details"
          onClick={onOpen}
          _hover={{ color: "brand.500" }}
        />
      </Flex>

      <Button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        rightIcon={<ChevronDownIcon boxSize={4} color="gray.400" />}
        bg="#F7F7F7"
        border="1px solid"
        borderColor="#EBEBEB"
        borderRadius="full"
        h="48px"
        px={5}
        fontWeight="400"
        fontSize="sm"
        color={selectedMaterial ? "#1A1A1A" : "#A0A0A0"}
        _hover={{ bg: "#F0F0F0" }}
        w="100%"
        justifyContent="space-between"
      >
        {selectedMaterial?.name || "Select Lamination"}
      </Button>

      {isDropdownOpen && (
        <Box
          position="absolute"
          top="calc(100% + 6px)"
          left={0}
          right={0}
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
            {materials.map((mat) => {
              const isSelected = selectedMaterial?.id === mat.id;
              return (
                <HStack
                  key={mat.id}
                  px={3}
                  py={2.5}
                  borderRadius="lg"
                  bg={isSelected ? "#F5F0F5" : "transparent"}
                  cursor="pointer"
                  _hover={{ bg: isSelected ? "#F5F0F5" : "#F9F9F9" }}
                  onClick={() => handleSelectMaterial(mat)}
                >
                  <ChakraImage
                    src={mat.image}
                    alt={mat.name}
                    boxSize="28px"
                    borderRadius="md"
                    objectFit="cover"
                  />
                  <Text
                    fontSize="sm"
                    fontWeight={isSelected ? "600" : "400"}
                    color="#1A1A1A"
                    flex="1"
                  >
                    {mat.name}
                  </Text>
                  {isSelected && (
                    <Badge
                      colorScheme="purple"
                      fontSize="9px"
                      borderRadius="full"
                    >
                      Selected
                    </Badge>
                  )}
                </HStack>
              );
            })}
          </VStack>
        </Box>
      )}

      {/* Details Modal (kept) */}
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>All Material Details</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={6} align="stretch">
              {materials?.map((mat) => {
                const isSelected = selectedMaterial?.id === mat.id;
                return (
                  <Box
                    key={mat.id}
                    border="2px solid"
                    borderColor={isSelected ? "brand.500" : "gray.200"}
                    borderRadius="lg"
                    p={6}
                    cursor="pointer"
                    onClick={() => {
                      handleSelectMaterial(mat);
                      onClose();
                    }}
                  >
                    <HStack spacing={6} align="flex-start">
                      <ChakraImage
                        src={mat.image}
                        alt={mat.name}
                        boxSize="120px"
                        objectFit="cover"
                        borderRadius="lg"
                      />
                      <Box flex="1">
                        <Flex align="center" gap={3}>
                          <Text fontWeight="bold" fontSize="xl">
                            {mat.name}
                          </Text>
                          {isSelected && (
                            <Badge colorScheme="green" borderRadius="full">
                              Selected
                            </Badge>
                          )}
                        </Flex>
                        <Text mt={3} fontSize="lg">
                          Price : ₹{mat.price_multiplier}
                        </Text>
                        {mat.description && (
                          <Text mt={2} color="gray.600" noOfLines={2}>
                            {mat.description}
                          </Text>
                        )}
                      </Box>
                    </HStack>
                  </Box>
                );
              })}
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MaterialDisplay;
