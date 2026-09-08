import { Box, Button, Heading, Text, VStack } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";

import { logout } from "../../redux/slices/userAuthSlice";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.userAuth);

  const handleLogout = () => {
    dispatch(logout())
      .unwrap()
      .then(() => {
        navigate("/login");
      })
      .catch((err) => {
        console.log("error", err);
      });
  };

  return (
    <Box
      p={8}
      bg="neutral.50"
      minH="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      fontFamily="body"
    >
      <VStack
        spacing={6}
        w={{ base: "90%", md: "450px" }}
        bg="white"
        p={8}
        borderRadius="lg"
        boxShadow="md"
        border="1px solid"
        borderColor="neutral.200"
      >
        <Heading as="h2" size="xl" color="neutral.900" textAlign="center" fontFamily="body">
          Logout
        </Heading>
        <Text color="neutral.600" fontSize="sm" textAlign="center" fontFamily="body">
          Are you sure you want to log out?
        </Text>
        <Button
          variant="solid"
          isLoading={loading}
          onClick={handleLogout}
          w="full"
          fontFamily="body"
        >
          Logout
        </Button>
        {error && (
          <Text color="red.500" fontSize="sm" textAlign="center" fontFamily="body">
            {error}
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default Logout;
