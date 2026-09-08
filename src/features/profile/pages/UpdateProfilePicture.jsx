import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import {
  clearError,
  updateProfilePicture,
} from "../../../redux/slices/userAuthSlice";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const UpdateProfilePicture = () => {
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.userAuth);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error("Image size must be less than 5MB", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }
      setImage(file);
    }
  };

  const handleUpdateProfilePicture = () => {
    if (!image) {
      toast.error("Please select an image to upload", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const formData = new FormData();
    formData.append("profile_picture", image);

    dispatch(clearError());
    dispatch(updateProfilePicture(formData))
      .unwrap()
      .then(() => {
        navigate("/viewProfile");
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
          Update Profile Picture
        </Heading>
        <Text
          color="neutral.600"
          fontSize="sm"
          fontFamily="body"
          textAlign="center"
        >
          Upload a new profile picture
        </Text>
        <FormControl isRequired>
          <FormLabel>Profile Picture</FormLabel>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            fontFamily="body"
          />
        </FormControl>
        <Button
          variant="solid"
          isLoading={loading}
          onClick={handleUpdateProfilePicture}
          w="full"
          fontFamily="body"
          fontSize="md"
          isDisabled={!image}
        >
          Upload Picture
        </Button>
        {error && (
          <Text color="red.500" fontSize="sm" textAlign="center">
            {error}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default UpdateProfilePicture;
