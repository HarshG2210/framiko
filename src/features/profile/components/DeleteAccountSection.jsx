import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";

import { deleteProfile } from "../../../redux/slices/userAuthSlice";

export const EmbeddedDeleteAccount = ({ onOpenModal }) => {
  return (
    <Box
      maxW="520px"
      p={{ base: 4, sm: 5 }}
      bg="red.50"
      border="1px solid"
      borderColor="red.100"
      borderRadius="lg"
      fontFamily="body"
    >
      <Text fontWeight={700} color="red.700" mb={1.5} fontFamily="body">
        This action is permanent
      </Text>
      <Text mb={4} color="red.600" fontSize="sm" fontFamily="body">
        Delete your account permanently. This action cannot be undone.
      </Text>
      <Button variant="solid" onClick={onOpenModal} fontFamily="body">
        Delete Account
      </Button>
    </Box>
  );
};

export const DeleteConfirmationModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((s) => s.userAuth);

  const confirmDelete = () => {
    dispatch(deleteProfile())
      .unwrap()
      .catch((e) => console.log(e));
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent borderRadius="xl" fontFamily="body">
        <ModalHeader color="neutral.900" fontFamily="body">
          Confirm Account Deletion
        </ModalHeader>
        <ModalBody>
          <Text color="neutral.600" fontFamily="body">
            Are you sure you want to permanently delete your account?
          </Text>
        </ModalBody>
        <ModalFooter gap={3}>
          <Button variant="ghost" onClick={onClose} fontFamily="body">
            Cancel
          </Button>
          <Button variant="solid" onClick={confirmDelete} isLoading={loading} fontFamily="body">
            Yes, delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
