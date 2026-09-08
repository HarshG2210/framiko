import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  forgetPassword,
  setOtpToken,
} from "../../../redux/slices/userAuthSlice";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.userAuth);
  const cardBg = useColorModeValue("white", "neutral.900");
  const pageBg = useColorModeValue("#fff", "neutral.800");
  const inputBg = useColorModeValue("neutral.50", "neutral.700");
  const borderColor = useColorModeValue("neutral.200", "neutral.600");
  // const headingColor = useColorModeValue("neutral.900", "neutral.50");
  const copyColor = useColorModeValue("gray.500", "neutral.300");

  const emailError = (() => {
    if (!touched.email) return "";
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return "Enter a valid email address (e.g. you@example.com)";
    return "";
  })();

  const handleForgetPassword = () => {
    setTouched({ email: true });

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

    dispatch(forgetPassword(email.trim()))
      .unwrap()
      .then((response) => {
        if (response.otp_token) {
          dispatch(setOtpToken(response.otp_token));
          navigate(`/verify-otp/${email.trim()}/reset`, {
            state: { otp_token: response.otp_token },
          });
        } else {
          navigate(`/verify-otp/${email.trim()}/reset`);
        }
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  return (
    <Box
      // minH="100vh"
      bg={pageBg}
      display="flex"
      justifyContent="center"
      alignItems="center"
      px={4}
      py={12}
    >
      <Box w={{ base: "full", sm: "460px" }}>
        {/* ── Card ── */}
        <Box
          bg={cardBg}
          borderRadius="2xl"
          p={{ base: 8, md: 10 }}
          borderWidth="1px"
          borderColor="neutral.200"
        >
          {/* ── Header ── */}
          <Box textAlign="center" mb={8}>
            <Text
              fontSize="2xl"
              fontWeight="700"
              color="neutral.900"
              fontFamily="body"
              mb={2}
            >
              Forgot Password
            </Text>
            <Text fontSize="sm" color={copyColor} lineHeight="1.6">
              Enter your email address to reset your password
            </Text>
          </Box>

          <VStack spacing={5} align="stretch">
            <FormControl isRequired isInvalid={!!emailError}>
              <FormLabel
                fontSize="xs"
                fontWeight="700"
                color="neutral.700"
                textTransform="uppercase"
                letterSpacing="0.08em"
                mb={1.5}
              >
                Email Address
              </FormLabel>
              <Input
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                borderRadius="xl"
                bg={inputBg}
                border="1px solid"
                borderColor={borderColor}
                fontSize="sm"
                h="48px"
                fontFamily="body"
                _placeholder={{ color: "neutral.400" }}
                _hover={{ borderColor: "neutral.400" }}
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "none",
                  bg: "white",
                }}
              />
              {emailError && (
                <FormErrorMessage fontSize="xs" fontFamily="body">
                  {emailError}
                </FormErrorMessage>
              )}
            </FormControl>

            <Button
              mt={2}
              w="full"
              h="50px"
              variant="solid"
              fontFamily="body"
              fontWeight="700"
              fontSize="sm"
              letterSpacing="0.02em"
              isLoading={loading}
              loadingText="Sending…"
              onClick={handleForgetPassword}
            >
              Send OTP
            </Button>

            {error && (
              <Box
                bg="red.50"
                border="1px solid"
                borderColor="red.200"
                borderRadius="xl"
                px={4}
                py={3}
              >
                <Text color="red.600" fontSize="sm" textAlign="center">
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

export default ForgetPassword;
