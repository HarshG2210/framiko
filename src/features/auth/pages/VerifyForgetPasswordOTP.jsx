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
  resendForgetPasswordOTP,
  verifyForgetPasswordOTP,
} from "../../../redux/slices/userAuthSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

const VerifyForgetPasswordOTP = () => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [resendAttempts, setResendAttempts] = useState(0);
  const [otpToken, setOtpToken] = useState(null);
  const [lastResendTime, setLastResendTime] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = useParams();
  const { loading, error } = useSelector((state) => state.userAuth);
  const inputRefs = useRef([]);
  const passedOtpToken = location.state?.otp_token || otpToken;

  useEffect(() => {
    if (passedOtpToken) {
      setOtpToken(passedOtpToken);
    }
  }, [passedOtpToken]);

  const handleVerifyOTP = () => {
    const otpValue = otp.join("");
    if (!email) {
      toast.error("Email Address is missing", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/forget-password");
      return;
    }
    if (!otpToken) {
      toast.error("OTP token is missing. Please request a new OTP.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!otpValue) {
      toast.error("OTP is required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!/^\d{4}$/.test(otpValue)) {
      toast.error("Please enter a valid 4-digit OTP", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const verificationData = {
      email,
      otp: otpValue,
      otp_token: otpToken,
    };

    dispatch(verifyForgetPasswordOTP(verificationData))
      .unwrap()
      .then(() => {
        navigate(`/reset-password/${email}`);
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const handleResendOTP = () => {
    if (!email || email === ":email" || otpToken === null) {
      toast.error("Email is Required", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (lastResendTime && resendAttempts >= 4) {
      const hoursSinceLastAttempt =
        (Date.now() - lastResendTime) / (1000 * 60 * 60);
      if (hoursSinceLastAttempt < 24) {
        toast.error("Resend option will be available after 24 hours", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      } else {
        setResendAttempts(0);
      }
    }

    if (resendAttempts >= 4) {
      toast.error("Maximum resend attempts reached. Please try again later.", {
        position: "top-right",
        autoClose: 3000,
      });
      setLastResendTime(Date.now());
      return;
    }

    dispatch(clearError());
    const resendData = {
      email,
      otp_token: otpToken,
    };

    dispatch(resendForgetPasswordOTP(resendData))
      .unwrap()
      .then((response) => {
        if (response.otp_token) {
          setOtpToken(response.otp_token);
        }
        setResendAttempts((prev) => prev + 1);
        setLastResendTime(Date.now());
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;

    const nextOtp = [...otp];
    nextOtp[index] = value.slice(-1);
    setOtp(nextOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (event, index) => {
    if (event.key === "Backspace" && !otp[index] && index > 0) {
      const previousOtp = [...otp];
      previousOtp[index - 1] = "";
      setOtp(previousOtp);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (event) => {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 4);
    if (!pasted) return;

    const nextOtp = Array(4).fill("");
    pasted.split("").forEach((digit, index) => {
      nextOtp[index] = digit;
    });
    setOtp(nextOtp);
    inputRefs.current[Math.min(pasted.length, 3)]?.focus();
  };

  const cardBg = useColorModeValue("white", "neutral.900");
  const pageBg = useColorModeValue("#fff", "neutral.800");
  const inputBg = useColorModeValue("neutral.50", "neutral.700");
  const borderColor = useColorModeValue("neutral.200", "neutral.600");
  // const headingColor = useColorModeValue("neutral.900", "neutral.50");
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
              Verify Reset OTP
            </Text>
            <Text fontSize="sm" color={copyColor} lineHeight="1.6">
              Enter the OTP sent to {email}
            </Text>
          </Box>

          <VStack spacing={5} align="stretch">
            {resendAttempts > 0 && (
              <Text color="orange.500" fontSize="sm" textAlign="center">
                Resend attempts: {resendAttempts}/3
              </Text>
            )}

            <FormControl isRequired>
              <FormLabel
                fontSize="xs"
                fontWeight="700"
                color="neutral.700"
                textTransform="uppercase"
                letterSpacing="0.08em"
                mb={1.5}
              >
                OTP
              </FormLabel>
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={{ base: 2, sm: 3 }}
                onPaste={handleOtpPaste}
              >
                {otp.map((digit, index) => (
                  <Input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, index)}
                    onKeyDown={(e) => handleOtpKeyDown(e, index)}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    textAlign="center"
                    maxLength={1}
                    borderRadius="xl"
                    bg={inputBg}
                    border="1px solid"
                    borderColor={borderColor}
                    fontSize="lg"
                    fontWeight="700"
                    fontFamily="body"
                    h={{ base: "48px", sm: "56px" }}
                    w={{ base: "44px", sm: "56px" }}
                    _placeholder={{ color: "neutral.400" }}
                    _hover={{ borderColor: "neutral.400" }}
                    _focus={{
                      borderColor: "brand.500",
                      boxShadow: "none",
                      bg: "white",
                    }}
                  />
                ))}
              </Box>
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
              loadingText="verifying reset otp..."
              onClick={handleVerifyOTP}
              isDisabled={loading}
            >
              Verify OTP
            </Button>

            <Button
              variant="ghost"
              color="neutral.700"
              onClick={handleResendOTP}
              fontSize="sm"
              fontFamily="body"
              isLoading={loading}
              isDisabled={loading || resendAttempts >= 3}
              _hover={{ color: "neutral.900", bg: "transparent" }}
            >
              {resendAttempts >= 3 ? "Try again later" : "Resend OTP"}
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

export default VerifyForgetPasswordOTP;
