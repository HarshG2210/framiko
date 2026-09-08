import {
  Avatar,
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { clearError, updateProfilePicture } from "../../../redux/slices/userAuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

const ProfilePictureModal = ({ isOpen, onClose, profilePictureUrl, onSaved }) => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((s) => s.userAuth);
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setImageFile(null);
      setPreviewUrl("");
    }
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = () => {
    if (!imageFile) return;
    const formData = new FormData();
    formData.append("profile_picture", imageFile);
    dispatch(clearError());
    dispatch(updateProfilePicture(formData))
      .unwrap()
      .then(() => {
        onSaved?.();
        onClose();
      })
      .catch((e) => console.log(e));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={{ base: "full", md: "xl" }} isCentered>
      <ModalOverlay bg="blackAlpha.600" />
      <ModalContent
        borderRadius={{ base: "none", md: "3xl" }}
        overflow="hidden"
        mx={3}
        maxH={{ base: "100vh", md: "auto" }}
        fontFamily="body"
      >
        <ModalHeader
          pt={{ base: 6, md: 8 }}
          pb={2}
          px={{ base: 4, md: 8 }}
          color="neutral.900"
          fontFamily="body"
        >
          Edit Profile Photo
        </ModalHeader>
        <ModalBody px={{ base: 4, md: 8 }} pb={{ base: 4, md: 6 }} fontFamily="body">
          <Text color="neutral.600" mb={5} fontSize="sm" fontFamily="body">
            Choose a new picture and preview it before saving. Your current photo is shown on the left.
          </Text>

          <SimpleGrid columns={{ base: 1, md: 2 }} gap={4} mb={6}>
            <Box
              bg="neutral.50"
              border="1px solid"
              borderColor="neutral.200"
              borderRadius="3xl"
              p={4}
            >
              <Text
                fontSize="xs"
                fontWeight={700}
                textTransform="uppercase"
                letterSpacing="0.12em"
                color="neutral.500"
                mb={3}
                fontFamily="body"
              >
                Current photo
              </Text>
              <Box display="flex" justifyContent="center" alignItems="center" minH="220px">
                <Avatar size="2xl" src={profilePictureUrl} />
              </Box>
            </Box>

            <Box
              bg="neutral.50"
              border="1px solid"
              borderColor="neutral.200"
              borderRadius="3xl"
              p={4}
            >
              <Text
                fontSize="xs"
                fontWeight={700}
                textTransform="uppercase"
                letterSpacing="0.12em"
                color="neutral.500"
                mb={3}
                fontFamily="body"
              >
                Preview
              </Text>
              <Box
                bg="white"
                border="1px solid"
                borderColor="neutral.200"
                borderRadius="2xl"
                minH="220px"
                display="flex"
                alignItems="center"
                justifyContent="center"
                overflow="hidden"
              >
                {previewUrl ? (
                  <Box
                    as="img"
                    src={previewUrl}
                    alt="Preview"
                    maxH="220px"
                    maxW="100%"
                  />
                ) : (
                  <Text color="neutral.500" fontSize="sm" textAlign="center" px={4} fontFamily="body">
                    Add a new photo to preview it here. The image will update in your account when you save.
                  </Text>
                )}
              </Box>
            </Box>
          </SimpleGrid>

          <Stack spacing={4}>
            <FormControl>
              <FormLabel fontSize="sm" color="neutral.600" fontFamily="body">
                Upload new picture
              </FormLabel>
              <Box
                bg="neutral.50"
                border="1px dashed"
                borderColor="neutral.300"
                borderRadius="3xl"
                p={6}
                textAlign="center"
              >
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  display="none"
                  ref={fileInputRef}
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  size="md"
                  fontFamily="body"
                >
                  Select photo
                </Button>
                <Text color="neutral.500" fontSize="sm" mt={3} fontFamily="body">
                  Supported formats: JPG, PNG, GIF. Max file size 5MB.
                </Text>
                {imageFile && (
                  <Text color="neutral.600" fontSize="xs" mt={3} fontFamily="body">
                    Selected file: {imageFile.name}
                  </Text>
                )}
              </Box>
            </FormControl>

            {error && (
              <Text color="red.500" fontSize="sm" fontFamily="body">
                {error}
              </Text>
            )}
          </Stack>
        </ModalBody>

        <ModalFooter px={{ base: 4, md: 8 }} pb={{ base: 4, md: 8 }} gap={3} flexDirection={{ base: "column-reverse", sm: "row" }} fontFamily="body">
          <Button variant="ghost" onClick={onClose} w={{ base: "100%", sm: "auto" }} fontFamily="body">
            Cancel
          </Button>
          <Button
            variant="solid"
            onClick={handleUpload}
            isLoading={loading}
            isDisabled={!imageFile}
            w={{ base: "100%", sm: "auto" }}
            fontFamily="body"
          >
            Save photo
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProfilePictureModal;
