import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
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
import { Link, useNavigate } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { clearError, signup } from "../../../redux/slices/userAuthSlice";
import { useDispatch, useSelector } from "react-redux";

import { toast } from "react-toastify";
import { useState } from "react";

/* ─── Password strength calculator ─────────────────────────────────────────── */
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

/* ─── Password requirement row ──────────────────────────────────────────────── */
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

/* ─── Signup ────────────────────────────────────────────────────────────────── */
const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [touched, setTouched] = useState({});
  const role = "owner";

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.userAuth);

  /* ─── inline validation ── */
  const emailError = (() => {
    if (!touched.email) return "";
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return "Enter a valid email address";
    return "";
  })();

  const passwordError = (() => {
    if (!touched.password) return "";
    if (!password) return "Password is required";
    if (password.length < 8) return "At least 8 characters required";
    if (!/[A-Za-z]/.test(password)) return "Must contain at least one letter";
    if (!/\d/.test(password)) return "Must contain at least one number";
    if (!/[@$!%*#?&^()_\-+=]/.test(password))
      return "Must contain at least one special character (@$!%*#?&…)";
    return "";
  })();

  const confirmError = (() => {
    if (!touched.confirm) return "";
    if (!confirmPassword) return "Please confirm your password";
    if (confirmPassword !== password) return "Passwords do not match";
    return "";
  })();

  const strength = getPasswordStrength(password);

  /* ─── submit ── */
  const handleSignup = () => {
    // Touch all fields to show all errors at once
    setTouched({ email: true, password: true, confirm: true });

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
    if (
      !/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^()_\-+=])[A-Za-z\d@$!%*#?&^()_\-+=]{8,}$/.test(
        password.trim(),
      )
    ) {
      toast.error(
        "Password must be at least 8 characters with letters, numbers, and a special character",
        { position: "top-right", autoClose: 4000 },
      );
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords don't match", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    dispatch(clearError());
    dispatch(signup({ email: email.trim(), password, role }))
      .unwrap()
      .then((response) => {
        navigate(`/verify-otp/${email.trim()}`, {
          state: { otp_token: response.otp_token },
        });
      })
      .catch((err) => {
        console.error("Signup error:", err);
        // toast.error(err?.message || "Signup failed. Please try again.", {
        //   position: "top-right",
        //   autoClose: 3000,
        // });
      });
  };

  const cardBg = useColorModeValue("white", "neutral.900");
  const pageBg = useColorModeValue("#fff", "neutral.800");

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
              Create Account
            </Text>
            <Text
              fontSize="sm"
              color="neutral.600"
              fontFamily="body"
              lineHeight="1.6"
            >
              Fill in the details below to register as an owner
            </Text>
          </Box>

          <VStack spacing={5} align="stretch">
            {/* ── Email ── */}
            <FormControl isRequired isInvalid={!!emailError}>
              <FormLabel
                fontSize="xs"
                fontWeight="700"
                color="neutral.700"
                fontFamily="body"
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
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                type="email"
                borderRadius="xl"
                bg="neutral.50"
                border="1px solid"
                borderColor="neutral.200"
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

            {/* ── Password ── */}
            <FormControl isRequired isInvalid={!!passwordError}>
              <FormLabel
                fontSize="xs"
                fontWeight="700"
                color="neutral.700"
                fontFamily="body"
                textTransform="uppercase"
                letterSpacing="0.08em"
                mb={1.5}
              >
                Password
              </FormLabel>
              <InputGroup>
                <Input
                  placeholder="Min 8 chars, letters, numbers & symbol"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  type={showPassword ? "text" : "password"}
                  borderRadius="xl"
                  bg="neutral.50"
                  border="1px solid"
                  borderColor="neutral.200"
                  fontSize="sm"
                  h="48px"
                  pr="48px"
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
                  <Box
                    as="button"
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    color="neutral.500"
                    _hover={{ color: "neutral.800" }}
                    transition="color 0.2s"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Box>
                </InputRightElement>
              </InputGroup>

              {/* Password strength bar */}
              {password && (
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
                    {strength.label} password
                  </Text>
                </Box>
              )}

              {passwordError && (
                <FormErrorMessage fontSize="xs" fontFamily="body">
                  {passwordError}
                </FormErrorMessage>
              )}

              {/* Requirements checklist — shown when typing */}
              {touched.password && password && (
                <Box mt={3} p={4} bg="#F7F5F1" borderRadius="xl">
                  <VStack spacing={1.5} align="stretch">
                    <Req
                      met={password.length >= 8}
                      label="At least 8 characters"
                    />
                    <Req
                      met={/[A-Z]/.test(password)}
                      label="One uppercase letter"
                    />
                    <Req
                      met={/[a-z]/.test(password)}
                      label="One lowercase letter"
                    />
                    <Req met={/\d/.test(password)} label="One number" />
                    <Req
                      met={/[@$!%*#?&^()_\-+=]/.test(password)}
                      label="One special character (@$!%*#?&…)"
                    />
                  </VStack>
                </Box>
              )}
            </FormControl>

            {/* ── Confirm Password ── */}
            <FormControl isRequired isInvalid={!!confirmError}>
              <FormLabel
                fontSize="xs"
                fontWeight="700"
                color="neutral.700"
                fontFamily="body"
                textTransform="uppercase"
                letterSpacing="0.08em"
                mb={1.5}
              >
                Confirm Password
              </FormLabel>
              <InputGroup>
                <Input
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, confirm: true }))}
                  type={showConfirmPassword ? "text" : "password"}
                  borderRadius="xl"
                  bg="neutral.50"
                  border="1px solid"
                  borderColor={
                    touched.confirm && confirmPassword
                      ? confirmPassword === password
                        ? "green.500"
                        : "red.500"
                      : "neutral.200"
                  }
                  fontSize="sm"
                  h="48px"
                  pr="48px"
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
                  <Box
                    as="button"
                    type="button"
                    onClick={() => setShowConfirmPassword((v) => !v)}
                    color="neutral.500"
                    _hover={{ color: "neutral.800" }}
                    transition="color 0.2s"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    {showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                  </Box>
                </InputRightElement>
              </InputGroup>

              {/* Match indicator */}
              {touched.confirm && confirmPassword && !confirmError && (
                <FormHelperText>
                  <HStack spacing={1}>
                    <Icon as={FiCheck} color="#38A169" fontSize="12px" />
                    <Text fontSize="xs" color="#38A169" fontFamily="body">
                      Passwords match
                    </Text>
                  </HStack>
                </FormHelperText>
              )}

              {confirmError && (
                <FormErrorMessage fontSize="xs" fontFamily="body">
                  {confirmError}
                </FormErrorMessage>
              )}
            </FormControl>

            {/* ── Server error ── */}
            {error && (
              <Box
                bg="red.50"
                border="1px solid"
                borderColor="red.200"
                borderRadius="xl"
                px={4}
                py={3}
              >
                <Text
                  color="red.600"
                  fontSize="sm"
                  fontFamily="'Inter', sans-serif"
                >
                  {error}
                </Text>
              </Box>
            )}

            {/* ── Submit ── */}
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
              loadingText="Creating account…"
              onClick={handleSignup}
              isDisabled={loading}
            >
              Create Account
            </Button>

            {/* ── Login link ── */}
            <Text
              textAlign="center"
              fontSize="sm"
              color="neutral.600"
              fontFamily="body"
            >
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#404040", fontWeight: 700, textDecoration: "none" }}>
                Log In
              </Link>
            </Text>
          </VStack>
        </Box>
      </Box>
    </Box>
  );
};

export default Signup;
