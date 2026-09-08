/* global process */

import {
  Box,
  Button,
  Heading,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";

import React from "react";
import { WarningIcon } from "@chakra-ui/icons";

const isDev =
  typeof process !== "undefined" &&
  process.env &&
  process.env.NODE_ENV === "development";
const isProd =
  typeof process !== "undefined" &&
  process.env &&
  process.env.NODE_ENV === "production";

/**
 * Error Boundary Component
 * Catches errors in child components and displays error UI
 */
class ErrorBoundaryBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorCount: 0,
    };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details to console in development
    if (isDev) {
      console.error("Error caught by Error Boundary:", error, errorInfo);
    }

    // Increment error count
    this.setState((prevState) => ({
      error,
      errorInfo,
      errorCount: prevState.errorCount + 1,
    }));

    // Log to external service in production
    if (isProd) {
      this.logErrorToService(error, errorInfo);
    }
  }
  // eslint-disable-next-line
  logErrorToService = (error, errorInfo) => {
    // TODO: Integrate with error tracking service like Sentry
    console.error("Logging error to external service:", error);
  };

  resetError = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    const { hasError, error, errorInfo, errorCount } = this.state;
    const { children, fallback, onError, colorProps } = this.props;

    // colorProps is injected by the functional wrapper which can use hooks
    const {
      bgColor = "white",
      borderColor = "red.200",
      textColor = "gray.800",
    } = colorProps || {};

    if (hasError) {
      // Call onError callback if provided
      if (onError) {
        onError(error, errorInfo);
      }

      // Use custom fallback if provided
      if (fallback) {
        return fallback(error, this.resetError);
      }

      // Default error UI
      return (
        <Box
          bg={bgColor}
          p={8}
          borderRadius="lg"
          borderLeft="4px solid"
          borderColor={borderColor}
          boxShadow="md"
          maxW="600px"
          mx="auto"
          mt={8}
          fontFamily="body"
        >
          <VStack spacing={4} align="flex-start">
            {/* Error Icon & Title */}
            <Box display="flex" alignItems="center" gap={3}>
              <WarningIcon color={borderColor} boxSize={6} />
              <Heading as="h1" size="md" color={borderColor} fontFamily="body">
                Oops! Something went wrong
              </Heading>
            </Box>

            {/* Error Message */}
            <Box>
              <Text fontWeight="bold" color={textColor} fontFamily="body">
                Error Details:
              </Text>
              <Text
                fontSize="sm"
                color="neutral.600"
                mt={2}
                bg="neutral.100"
                p={3}
                borderRadius="md"
                fontFamily="monospace"
                overflow="auto"
                maxH="200px"
              >
                {error?.toString()}
              </Text>
            </Box>

            {/* Development Info */}
            {isDev && errorInfo && (
              <Box w="100%">
                <Text fontWeight="bold" color={textColor} fontSize="sm" fontFamily="body">
                  Stack Trace:
                </Text>
                <Text
                  fontSize="xs"
                  color="neutral.600"
                  mt={2}
                  bg="neutral.100"
                  p={3}
                  borderRadius="md"
                  fontFamily="monospace"
                  overflow="auto"
                  maxH="250px"
                >
                  {errorInfo.componentStack}
                </Text>
              </Box>
            )}

            {/* Error Count Warning */}
            {errorCount > 2 && (
              <Box
                w="100%"
                bg="soft.50"
                p={3}
                borderRadius="md"
                borderLeft="3px solid"
                borderColor="brand.500"
              >
                <Text color="neutral.800" fontSize="sm" fontFamily="body">
                  ⚠️ Multiple errors detected ({errorCount}). Please refresh the
                  page or contact support if the problem persists.
                </Text>
              </Box>
            )}

            {/* Action Buttons */}
            <Box display="flex" gap={3} w="100%" flexWrap="wrap">
              <Button variant="solid" size="sm" onClick={this.resetError} fontFamily="body">
                Try Again
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => (window.location.href = "/")}
                fontFamily="body"
              >
                Go Home
              </Button>
              {isDev && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    console.error("Full error info:", error, errorInfo);
                    alert("Check console for full error details");
                  }}
                  fontFamily="body"
                >
                  View Console
                </Button>
              )}
            </Box>

            {/* Support Info */}
            <Box w="100%" pt={3} borderTopWidth="1px" borderColor="neutral.200">
              <Text fontSize="sm" color="neutral.600" fontFamily="body">
                💡 If this problem persists, please{" "}
                <Box as="span" color="brand.500" cursor="pointer">
                  contact support
                </Box>
              </Text>
            </Box>
          </VStack>
        </Box>
      );
    }

    return children;
  }
}

// Functional wrapper to provide color values via hooks to the class-based boundary
function ErrorBoundary(props) {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("red.200", "red.700");
  const textColor = useColorModeValue("gray.800", "gray.100");

  const colorProps = { bgColor, borderColor, textColor };

  return <ErrorBoundaryBase {...props} colorProps={colorProps} />;
}

export default ErrorBoundary;
