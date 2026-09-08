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
  updateProfile,
  viewProfile,
} from "../../../redux/slices/userAuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { loadAuthData } from "../../../services/authStorage";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const UpdateProfile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading, error } = useSelector((state) => state.userAuth);

  useEffect(() => {
    if (user) {
      setFirstName(user?.user?.first_name || "");
      setLastName(user?.user?.last_name || "");
      setEmail(user?.user?.email || "");
      setMobileNumber(user?.phone_number || "");
    } else {
      const { token } = loadAuthData();
      if (!token) return;

      dispatch(viewProfile())
        .unwrap()
        .then((response) => {
          setFirstName(response?.user?.first_name || "");
          setLastName(response?.user?.last_name || "");
          setEmail(response?.user?.email || "");
          setMobileNumber(user?.phone_number || "");
        })
        .catch((err) => {
          toast.error(err || "Failed to load profile", {
            position: "top-right",
            autoClose: 3000,
          });
        });
    }
  }, [dispatch, user]);

  const handleUpdateProfile = () => {
    if (!firstName.trim() || !lastName.trim()) {
      toast.error("First name and last name are required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (
      !/^[a-zA-Z\s]{2,50}$/.test(firstName.trim()) ||
      !/^[a-zA-Z\s]{2,50}$/.test(lastName.trim())
    ) {
      toast.error(
        "First name and last name must be 2-50 characters long and contain only letters and spaces",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return;
    }
    if (!email.trim()) {
      toast.error("Email is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      toast.error("Please enter a valid email address", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Validate mobile number
    if (!/^\d{10}$/.test(mobileNumber.trim())) {
      toast.error(
        "Invalid Mobile Number: Please enter a 10-digit mobile number",
        {
          position: "top-right",
          autoClose: 3000,
        }
      );
      return;
    }

    const profileData = new FormData();
    profileData.append("first_name", firstName.trim());
    profileData.append("last_name", lastName.trim());
    profileData.append("phone_number", mobileNumber.trim());
    // formData.append("profile_picture", profilePicture);

    dispatch(clearError());
    dispatch(updateProfile(profileData))
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
          Update Profile
        </Heading>
        <Text
          color="neutral.600"
          fontSize="sm"
          fontFamily="body"
          textAlign="center"
        >
          Update your profile details
        </Text>
        <FormControl isRequired>
          <FormLabel>First Name</FormLabel>
          <Input
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            type="text"
            fontFamily="body"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Last Name</FormLabel>
          <Input
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            type="text"
            fontFamily="body"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Mobile Number</FormLabel>
          <Input
            placeholder="Enter 10-digit mobile number"
            value={mobileNumber}
            onChange={(e) =>
              setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            fontFamily="body"
          />
        </FormControl>
        <FormControl isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            placeholder="Enter your email"
            value={email}
            isDisabled
            type="email"
            fontFamily="body"
          />
        </FormControl>

        <Button
          variant="solid"
          isLoading={loading}
          onClick={handleUpdateProfile}
          w="full"
          fontFamily="body"
          fontSize="md"
          isDisabled={!firstName || !lastName || !mobileNumber}
        >
          Update Profile
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

export default UpdateProfile;
