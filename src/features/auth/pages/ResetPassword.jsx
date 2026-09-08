import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Progress,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiCheck, FiX } from "react-icons/fi";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import { resetPassword } from "../../../redux/slices/userAuthSlice";
import { toast } from "react-toastify";
import { useState } from "react";

const getPasswordStrength = (pwd) => {
  if (!pwd) return { score: 0, label: "", color: "" };
  let score = 0;
  if (pwd.length >= 8) score++;
  if (pwd.length >= 12) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[@$!%*#?&^()_\-+=]/.test(pwd)) score++;

  if (score <= 2)
    return { score: (score / 6) * 100, label: "Weak", color: "#E53E3E" };
  if (score <= 4)
    return { score: (score / 6) * 100, label: "Fair", color: "#DD6B20" };
  if (score <= 5)
    return { score: (score / 6) * 100, label: "Good", color: "rose.500" };
  return { score: 100, label: "Strong", color: "#38A169" };
};

const Req = ({ met, label }) => (
  <HStack spacing={2}>
    <Box
      w="16px"
      h="16px"
      borderRadius="full"
      flexShrink={0}
      bg={met ? "#38A169" : "#E0DEDA"}
      display="flex"
      alignItems="center"
      justifyContent="center"
      transition="background 0.2s ease"
    >
      <Icon as={met ? FiCheck : FiX} fontSize="9px" color="white" />
    </Box>
    <Text
      fontSize="xs"
      color={met ? "#38A169" : "gray.400"}
      fontFamily="'Inter', sans-serif"
      transition="color 0.2s ease"
    >
      {label}
    </Text>
  </HStack>
);

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({
    newPassword: false,
    confirmPassword: false,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { email } = useParams();
  const { loading, error, verifiedToken } = useSelector(
    (state) => state.userAuth,
  );

  const newPasswordError = (() => {
    if (!touched.newPassword) return "";
    if (!newPassword.trim()) return "New password is required";
    if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        newPassword.trim(),
      )
    ) {
      return "Password must be at least 8 characters with letters, numbers, and a special character";
    }
    return "";
  })();

  const confirmPasswordError = (() => {
    if (!touched.confirmPassword) return "";
    if (!confirmPassword.trim()) return "Confirm password is required";
    if (confirmPassword.trim() !== newPassword.trim()) {
      return "Passwords do not match";
    }
    return "";
  })();

  const handleResetPassword = () => {
    if (!newPassword.trim()) {
      toast.error("New password is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!confirmPassword.trim()) {
      toast.error("Confirm password is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(
        newPassword.trim(),
      )
    ) {
      toast.error(
        "Password must be at least 8 characters with letters, numbers, and a special character",
        {
          position: "top-right",
          autoClose: 3000,
        },
      );
      return;
    }

    if (newPassword.trim() !== confirmPassword.trim()) {
      toast.error("Passwords do not match", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (newPassword.trim().length > 128) {
      toast.error("Password must not exceed 128 characters", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (
      /\s{2,}/.test(newPassword.trim()) ||
      !/^[A-Za-z\d@$!%*#?&]+$/.test(newPassword.trim())
    ) {
      toast.error(
        "Password should not contain consecutive spaces or invalid characters",
        {
          position: "top-right",
          autoClose: 3000,
        },
      );
      return;
    }

    const resetData = {
      email,
      new_password: newPassword.trim(),
      verified_token: verifiedToken,
    };

    dispatch(resetPassword(resetData))
      .unwrap()
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) handleResetPassword();
  };

  const strength = getPasswordStrength(newPassword);

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
              fontFamily="body"
              mb={2}
            >
              Reset Password
            </Text>
            <Text fontSize="sm" color={copyColor} lineHeight="1.6">
              Set your new password
            </Text>
          </Box>

          <VStack spacing={5} align="stretch">
            <FormControl isRequired isInvalid={!!newPasswordError}>
              <FormLabel
                fontSize="xs"
                fontWeight="700"
                color="neutral.700"
                textTransform="uppercase"
                letterSpacing="0.08em"
                mb={1.5}
              >
                New Password
              </FormLabel>
              <InputGroup>
                <Input
                  placeholder="Enter new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  onBlur={() =>
                    setTouched((t) => ({ ...t, newPassword: true }))
                  }
                  onKeyDown={handleKeyDown}
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
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
                <InputRightElement h="48px" w="48px">
                  <Button
                    type="button"
                    variant="ghost"
                    color="neutral.600"
                    _hover={{ color: "neutral.800", bg: "transparent" }}
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {newPassword && (
                <Box mt={2}>
                  <Progress
                    value={strength.score}
                    size="xs"
                    borderRadius="full"
                    bg="#E0DEDA"
                    sx={{
                      "& > div": {
                        background: strength.color,
                        transition: "width 0.3s ease",
                      },
                    }}
                  />
                  <Text
                    fontSize="xs"
                    fontFamily="body"
                    color={strength.color}
                    mt={1}
                    fontWeight="600"
                  >
                    {strength.label ? `${strength.label} password` : ""}
                  </Text>
                </Box>
              )}

              {newPasswordError && (
                <FormErrorMessage fontSize="xs" fontFamily="body">
                  {newPasswordError}
                </FormErrorMessage>
              )}

              {newPassword && (
                <Box mt={3} p={4} bg="#F7F5F1" borderRadius="xl">
                  <VStack spacing={1.5} align="stretch">
                    <Req
                      met={newPassword.length >= 8}
                      label="At least 8 characters"
                    />
                    <Req
                      met={/[A-Z]/.test(newPassword)}
                      label="One uppercase letter"
                    />
                    <Req
                      met={/[a-z]/.test(newPassword)}
                      label="One lowercase letter"
                    />
                    <Req met={/\d/.test(newPassword)} label="One number" />
                    <Req
                      met={/[@$!%*#?&^()_\-+=]/.test(newPassword)}
                      label="One special character (@$!%*#?&…)"
                    />
                  </VStack>
                </Box>
              )}
            </FormControl>

            <FormControl isRequired isInvalid={!!confirmPasswordError}>
              <FormLabel
                fontSize="xs"
                fontWeight="700"
                color="neutral.700"
                textTransform="uppercase"
                letterSpacing="0.08em"
                mb={1.5}
              >
                Confirm Password
              </FormLabel>
              <InputGroup>
                <Input
                  placeholder="Confirm new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() =>
                    setTouched((t) => ({ ...t, confirmPassword: true }))
                  }
                  onKeyDown={handleKeyDown}
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
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
                <InputRightElement h="48px" w="48px">
                  <Button
                    type="button"
                    variant="ghost"
                    color="neutral.600"
                    _hover={{ color: "neutral.800", bg: "transparent" }}
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
              {confirmPasswordError && (
                <FormErrorMessage fontSize="xs" fontFamily="body">
                  {confirmPasswordError}
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
              loadingText="Resetting…"
              onClick={handleResetPassword}
            >
              Reset Password
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

export default ResetPassword;
