import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  clearError,
  login,
  viewProfile,
} from "../../../redux/slices/userAuthSlice";
import { useDispatch, useSelector } from "react-redux";

import { loadAuthData } from "../../../services/authStorage";
import { toast } from "react-toastify";
import { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.userAuth);

  /* ─── inline validation ─────────────────────────────────────────────── */
  const emailError = (() => {
    if (!touched.email) return "";
    if (!email.trim()) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return "Enter a valid email address (e.g. you@example.com)";
    return "";
  })();

  const passwordError = (() => {
    if (!touched.password) return "";
    if (!password) return "Password is required";
    if (password.length < 1) return "Password cannot be empty";
    return "";
  })();

  /* ─── submit ─────────────────────────────────────────────────────────── */
  const handleLogin = () => {
    // Touch all fields to reveal any hidden errors
    setTouched({ email: true, password: true });

    // Email checks
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

    // Password checks
    if (!password) {
      toast.error("Password is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (password.length < 1) {
      toast.error("Password cannot be empty", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Whitespace-only password guard
    if (!password.trim()) {
      toast.error("Password cannot be only spaces", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    dispatch(clearError());
    dispatch(login({ email: email.trim(), password }))
      .unwrap()
      .then(() => {
        const { token: loginToken } = loadAuthData();
        if (!loginToken) return Promise.resolve();
        return dispatch(viewProfile()).unwrap();
      })
      .then(() => {
        if (user?.profile_completed) {
          navigate("/");
        } else {
          navigate("/completeProfile");
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        toast.error(
          err?.message ||
            err?.detail ||
            "Login failed. Please check your credentials and try again.",
          { position: "top-right", autoClose: 4000 },
        );
      });
  };

  /* ─── Enter key support ─────────────────────────────────────────────── */
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !loading) handleLogin();
  };

  /* ─── design tokens (unchanged) ────────────────────────────────────── */
  const cardBg = useColorModeValue("white", "neutral.900");
  const pageBg = useColorModeValue("#fff", "neutral.800");
  const inputBg = useColorModeValue("neutral.50", "neutral.700");
  const borderColor = useColorModeValue("neutral.200", "neutral.600");
  const copyColor = useColorModeValue("gray.500", "neutral.300");

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
              User Login
            </Text>
            <Text fontSize="sm" color={copyColor} lineHeight="1.6">
              Enter your credentials to log in
            </Text>
          </Box>

          <VStack spacing={5} align="stretch">
            {/* ── Email ── */}
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
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                onKeyDown={handleKeyDown}
                type="email"
                autoComplete="email"
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

            {/* ── Password ── */}
            <FormControl isRequired isInvalid={!!passwordError}>
              <FormLabel
                fontSize="xs"
                fontWeight="700"
                color="neutral.700"
                textTransform="uppercase"
                letterSpacing="0.08em"
                mb={1.5}
              >
                Password
              </FormLabel>
              <InputGroup>
                <Input
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                  onKeyDown={handleKeyDown}
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
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
              {passwordError && (
                <FormErrorMessage fontSize="xs" fontFamily="body">
                  {passwordError}
                </FormErrorMessage>
              )}
            </FormControl>

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
              loadingText="Logging in…"
              onClick={handleLogin}
            >
              Log In
            </Button>

            <Text textAlign="center" fontSize="sm" color={copyColor}>
              Don't have an account?{" "}
              <Link
                to="/signup"
                style={{ color: "#404040", fontWeight: 700, textDecoration: "none" }}
              >
                Sign Up
              </Link>
            </Text>
            <Text textAlign="center" fontSize="sm" color={copyColor}>
              Forgot password?{" "}
              <Link
                to="/forget-password"
                style={{ color: "#404040", fontWeight: 700, textDecoration: "none" }}
              >
                Reset Password
              </Link>
            </Text>

            {/* ── Server / Redux error ── */}
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

export default Login;
