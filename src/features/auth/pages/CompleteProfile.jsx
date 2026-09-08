import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  clearError,
  completeProfile,
} from "../../../redux/slices/userAuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CompleteProfile = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.userAuth);

  useEffect(() => {
    if (user?.profile_completed === true) {
      navigate("/");
    }
  }, [navigate, user?.profile_completed]);

  const handleCompleteProfile = () => {
    if (!firstName.trim()) {
      toast.error("First name is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!/^[a-zA-Z\s]{2,50}$/.test(firstName.trim())) {
      toast.error(
        "First name must be 2-50 characters long and contain only letters and spaces",
        {
          position: "top-right",
          autoClose: 3000,
        },
      );
      return;
    }

    if (!lastName.trim()) {
      toast.error("Last name is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!/^[a-zA-Z\s]{2,50}$/.test(lastName.trim())) {
      toast.error(
        "Last name must be 2-50 characters long and contain only letters and spaces",
        {
          position: "top-right",
          autoClose: 3000,
        },
      );
      return;
    }

    if (!/^\d{10}$/.test(mobileNumber)) {
      toast.error(
        "Invalid Mobile Number: Please enter a 10-digit mobile number",
        {
          position: "top-right",
          autoClose: 3000,
        },
      );
      return;
    }

    const formData = new FormData();
    formData.append("first_name", firstName.trim());
    formData.append("last_name", lastName.trim());
    formData.append("phone_number", mobileNumber.trim());

    dispatch(clearError());
    dispatch(completeProfile(formData))
      .unwrap()
      .then(() => {
        navigate("/");
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const cardBg = useColorModeValue("white", "neutral.900");
  const pageBg = useColorModeValue("#fff", "neutral.800");
  const inputBg = useColorModeValue("neutral.50", "neutral.700");
  const borderColor = useColorModeValue("neutral.200", "neutral.600");
  const copyColor = useColorModeValue("gray.500", "neutral.300");

  return (
    <Box
      bg={pageBg}
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={4}
      py={12}
      fontFamily="body"
    >
      <Box w={{ base: "full", sm: "460px" }}>
        <Box
          bg={cardBg}
          borderRadius="2xl"
          p={{ base: 8, md: 10 }}
          borderWidth="1px"
          borderColor={borderColor}
        >
          <Box textAlign="center" mb={8}>
            <Text
              fontSize="2xl"
              fontWeight="700"
              color="neutral.900"
              letterSpacing="0.02em"
              mb={2}
              fontFamily="body"
            >
              Complete Your Profile
            </Text>
            <Text fontSize="sm" color={copyColor} lineHeight="1.6" fontFamily="body">
              Please provide your details to complete your profile
            </Text>
          </Box>

          <VStack spacing={5} align="stretch">
            <FormControl isRequired>
              <FormLabel
                fontSize="xs"
                fontWeight="700"
                color="neutral.600"
                textTransform="uppercase"
                letterSpacing="0.08em"
                mb={1.5}
                fontFamily="body"
              >
                First Name
              </FormLabel>
              <Input
                placeholder="Enter your first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                type="text"
                borderRadius="xl"
                bg={inputBg}
                border="1px solid"
                borderColor={borderColor}
                fontSize="sm"
                h="48px"
                fontFamily="body"
                _placeholder={{ color: "neutral.400" }}
                _hover={{ borderColor: "brand.500" }}
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "none",
                  bg: "white",
                }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel
                fontSize="xs"
                fontWeight="700"
                color="neutral.600"
                textTransform="uppercase"
                letterSpacing="0.08em"
                mb={1.5}
                fontFamily="body"
              >
                Last Name
              </FormLabel>
              <Input
                placeholder="Enter your last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                type="text"
                borderRadius="xl"
                bg={inputBg}
                border="1px solid"
                borderColor={borderColor}
                fontSize="sm"
                h="48px"
                fontFamily="body"
                _placeholder={{ color: "neutral.400" }}
                _hover={{ borderColor: "brand.500" }}
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "none",
                  bg: "white",
                }}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel
                fontSize="xs"
                fontWeight="700"
                color="neutral.600"
                textTransform="uppercase"
                letterSpacing="0.08em"
                mb={1.5}
                fontFamily="body"
              >
                Mobile Number
              </FormLabel>
              <Input
                placeholder="Enter 10-digit mobile number"
                value={mobileNumber}
                onChange={(e) =>
                  setMobileNumber(
                    e.target.value.replace(/\D/g, "").slice(0, 10),
                  )
                }
                type="tel"
                inputMode="numeric"
                pattern="[0-9]*"
                borderRadius="xl"
                bg={inputBg}
                border="1px solid"
                borderColor={borderColor}
                fontSize="sm"
                h="48px"
                fontFamily="body"
                _placeholder={{ color: "neutral.400" }}
                _hover={{ borderColor: "brand.500" }}
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "none",
                  bg: "white",
                }}
              />
            </FormControl>

            <Button
              mt={2}
              w="full"
              h="50px"
              borderRadius="full"
              variant="solid"
              isLoading={loading}
              loadingText="Submitting…"
              onClick={handleCompleteProfile}
              fontFamily="body"
            >
              Submit Profile
            </Button>

            {error && (
              <Box
                bg="soft.50"
                border="1px solid"
                borderColor="soft.100"
                borderRadius="xl"
                px={4}
                py={3}
              >
                <Text color="neutral.700" fontSize="sm" textAlign="center" fontFamily="body">
                  {error}
                </Text>
              </Box>
            )}
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default CompleteProfile;
