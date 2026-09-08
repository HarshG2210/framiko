import {
  Box,
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";

import { deleteProfile } from "../../../redux/slices/userAuthSlice";
import { useNavigate } from "react-router-dom";

const DeleteProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.userAuth);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleDeleteProfile = () => {
    onOpen();
  };

  const confirmDeleteProfile = () => {
    onClose();
    dispatch(deleteProfile())
      .unwrap()
      .then(() => {
        navigate("/signup");
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  return (
    <Box
      p={8}
      bg="#f5f5f5"
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <VStack
        spacing={6}
        w={{ base: "90%", md: "450px" }}
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="md"
        border="1px solid #e0e0e0"
      >
        <Heading
          as="h2"
          size="xl"
          color="neutral.900"
          fontFamily="body"
          textAlign="center"
        >
          Delete Profile
        </Heading>
        <Text
          color="neutral.600"
          fontSize="sm"
          fontFamily="body"
          textAlign="center"
        >
          This will permanently delete your account. Proceed with caution.
        </Text>
        <Button
          variant="solid"
          isLoading={loading}
          onClick={handleDeleteProfile}
          w="full"
          fontFamily="body"
          fontSize="md"
        >
          Delete Profile
        </Button>
        {error && (
          <Text color="red.500" fontSize="sm" textAlign="center">
            {error}
          </Text>
        )}
      </VStack>

      {/* Custom Alert Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader fontFamily="body" textAlign="center">
            Confirm Deletion
          </ModalHeader>
          <ModalBody>
            <Text
              color="neutral.800"
              fontSize="md"
              fontFamily="body"
              textAlign="center"
            >
              Are you sure you want to delete your profile? This action cannot
              be undone.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button
              variant="solid"
              mr={3}
              onClick={confirmDeleteProfile}
              isLoading={loading}
              fontFamily="body"
            >
              Yes
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              fontFamily="body"
            >
              No
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default DeleteProfile;
