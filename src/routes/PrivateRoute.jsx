import "react-toastify/dist/ReactToastify.css";

import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";

// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { adminLogin } from "../redux/slices/admin/adminAuthSlice";
import { useState } from "react";

const PrivateRoute = ({ children }) => {
  const adminState = useSelector(
    (state) => state.admin?.auth ?? state.adminAuth ?? {}
  );
  const { isAuthenticated, token, loading } = adminState;
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const bgColor = useColorModeValue("white", "gray.700");

  const handleChange = (e) => {
    setCredentials((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // This will ONLY hit the API, no static check
    dispatch(adminLogin(credentials));
  };

  // If not authenticated (no valid token), show login form
  if (!isAuthenticated || !token) {
    return (
      <Box
        p={6}
        bg={bgColor}
        borderRadius="md"
        boxShadow="lg"
        maxW="400px"
        mx="auto"
        mt={10}
      >
        <Heading size="md" mb={6} textAlign="center">
          Admin Login
        </Heading>
        <form onSubmit={handleLogin}>
          <VStack spacing={4} align="stretch">
            <FormControl isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                name="username"
                value={credentials.username}
                onChange={handleChange}
                placeholder="Enter username"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                name="password"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter password"
              />
            </FormControl>
            <Button
              type="submit"
              colorScheme="blue"
              width="full"
              isLoading={loading}
            >
              Login
            </Button>
          </VStack>
        </form>
        {/* If you already have ToastContainer at the app root, remove this */}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </Box>
    );
  }

  // Token exists => allow access
  return children;
};

export default PrivateRoute;
