import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import {
  DeleteConfirmationModal,
  EmbeddedDeleteAccount,
} from "../components/DeleteAccountSection";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import EmbeddedEditProfile from "../components/EmbeddedEditProfile";
import MyOrders from "../../orders/pages/MyOrders";
import OrderDetails from "../../orders/pages/OrderDetails";
import ProfilePictureModal from "../components/ProfilePictureModal";
import ShippingAddress from "../../../components/User/ShippingAddress";
import { loadAuthData } from "../../../services/authStorage";
import { normalizeMediaUrl } from "../../../utils/constant";
import { viewProfile } from "../../../redux/slices/userAuthSlice";

/* ---------------- shared style helpers (presentational only) ---------------- */

const eyebrowStyle = {
  fontSize: "xs",
  fontWeight: 700,
  letterSpacing: "0.14em",
  textTransform: "uppercase",
  color: "gold.700",
};

const NAV_ITEMS = [
  { key: "overview", label: "Overview" },
  { key: "edit", label: "Edit Profile" },
  { key: "addresses", label: "Addresses" },
  { key: "orders", label: "My Orders" },
];

const ViewProfile = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const { user } = useSelector((state) => state.userAuth);
  const { token } = loadAuthData();

  // local navigation via panels
  const hasFetched = useRef(false);
  const [selectedTab, setSelectedTab] = useState("overview");
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [pictureRefreshKey, setPictureRefreshKey] = useState(Date.now());
  const [isPictureRefreshing, setIsPictureRefreshing] = useState(false);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();
  const {
    isOpen: isPictureOpen,
    onOpen: onPictureOpen,
    onClose: onPictureClose,
  } = useDisclosure();

  useEffect(() => {
    if (!hasFetched.current) {
      hasFetched.current = true;
      if (!token) {
        toast({
          title: "Please login to use Add to Cart",
          status: "warning",
        });
        return;
      }
      dispatch(viewProfile())
        .unwrap()
        .then(() => {})
        .catch((err) => {
          console.log("profile view error :-- ", err);
        });
    }
  }, [dispatch, token, toast]);

  const profilePicturePath = user?.profile_picture;
  const profilePictureUrl = profilePicturePath
    ? (() => {
        const baseUrl = normalizeMediaUrl(profilePicturePath);
        return `${baseUrl}${baseUrl.includes("?") ? "&" : "?"}cache=${pictureRefreshKey}`;
      })()
    : undefined;

  // Called after the profile picture modal successfully uploads a new image.
  // We re-fetch the user from the backend so Redux has the latest
  // profile_picture path, then bump the cache-busting key so the browser
  // doesn't serve a stale cached image. The Avatar below is also remounted
  // (via its `key` prop) so it doesn't hold on to a previous load/error
  // state and require a hard reload to pick up the change.
  const handlePictureSaved = async () => {
    setIsPictureRefreshing(true);
    try {
      await dispatch(viewProfile()).unwrap();
    } catch (err) {
      console.log("profile refresh after picture update error :-- ", err);
    } finally {
      setPictureRefreshKey(Date.now());
      setIsPictureRefreshing(false);
    }
  };

  const panelTitle =
    (selectedTab === "overview" && "Profile Overview") ||
    (selectedTab === "edit" && "Edit Profile") ||
    (selectedTab === "addresses" && "Shipping Addresses") ||
    (selectedTab === "orders" && "My Orders") ||
    (selectedTab === "order-details" && "Order Details") ||
    (selectedTab === "delete" && "Delete Account") ||
    "";

  return (
    <Box p={{ base: 4, sm: 6, lg: 8 }} bg="neutral.50" minH="100vh">
      <Flex
        maxW="1200px"
        mx="auto"
        gap={{ base: 4, md: 6, lg: 8 }}
        align="flex-start"
        direction={{ base: "column", lg: "row" }}
      >
        {/* Left column: Profile card */}
        <Box
          w={{ base: "100%", lg: "320px" }}
          maxW={{ lg: "320px" }}
          flexShrink={0}
          bg="white"
          borderRadius="2xl"
          border="1px solid"
          borderColor="neutral.200"
          overflow="hidden"
          position={{ base: "static", lg: "sticky" }}
          top={{ lg: "8" }}
        >
          <Box p={{ base: 4, sm: 5, md: 6 }}>
            <VStack spacing={4} align="stretch">
              <Box textAlign="center">
                <Box
                  display="inline-block"
                  p="4px"
                  borderRadius="full"
                  bgGradient="linear(to-br, gold.300, rose.300)"
                  mb={4}
                  position="relative"
                >
                  <Avatar
                    key={profilePictureUrl || "no-avatar"}
                    size={{ base: "xl", md: "2xl" }}
                    name={`${user?.user?.first_name || ""} ${
                      user?.user?.last_name || ""
                    }`}
                    src={profilePictureUrl}
                    border="3px solid white"
                    opacity={isPictureRefreshing ? 0.6 : 1}
                    transition="opacity 0.2s ease"
                  />
                  <Box
                    position="absolute"
                    bottom={0}
                    right={0}
                    bg="gold.500"
                    borderRadius="full"
                    w={{ base: "28px", md: "32px" }}
                    h={{ base: "28px", md: "32px" }}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                    _hover={{ bg: "gold.600", transform: "scale(1.1)" }}
                    transition="all 0.2s ease"
                    onClick={onPictureOpen}
                    border="2px solid white"
                    title="Edit profile picture"
                  >
                    <Text fontSize="sm" color="white">
                      ✏️
                    </Text>
                  </Box>
                </Box>
                <Heading
                  size={{ base: "md", md: "lg" }}
                  mb={1}
                  color="neutral.900"
                  fontFamily="body"
                >
                  {user?.user?.first_name || ""} {user?.user?.last_name || ""}
                </Heading>
                <Text color="neutral.500" fontSize="sm" fontFamily="body">
                  {user?.user?.email}
                </Text>
              </Box>

              <Divider borderColor="neutral.200" />

              <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={3}>
                <Box bg="gold.50" borderRadius="lg" px={3} py={2.5}>
                  <Text
                    fontSize="10px"
                    color="gold.700"
                    fontWeight={700}
                    textTransform="uppercase"
                    letterSpacing="0.06em"
                  >
                    Mobile
                  </Text>
                  <Text
                    fontWeight={700}
                    fontSize="sm"
                    color="neutral.800"
                    mt={0.5}
                  >
                    {user?.phone_number || "—"}
                  </Text>
                </Box>

                <Box bg="rose.50" borderRadius="lg" px={3} py={2.5}>
                  <Text
                    fontSize="10px"
                    color="rose.700"
                    fontWeight={700}
                    textTransform="uppercase"
                    letterSpacing="0.06em"
                  >
                    Member Since
                  </Text>
                  <Text
                    fontWeight={700}
                    fontSize="sm"
                    color="neutral.800"
                    mt={0.5}
                  >
                    {user?.created_at
                      ? new Date(user.created_at).toLocaleDateString()
                      : "—"}
                  </Text>
                </Box>
              </SimpleGrid>

              <Divider borderColor="neutral.200" />

              <VStack spacing={1.5} align="stretch">
                <Text {...eyebrowStyle} px={2} mb={1}>
                  Account
                </Text>
                {NAV_ITEMS.map((item) => {
                  const isActive = selectedTab === item.key;
                  return (
                    <Button
                      key={item.key}
                      size={{ base: "sm", md: "md" }}
                      justifyContent="flex-start"
                      variant={isActive ? "solid" : "ghost"}
                      borderLeft="3px solid"
                      borderColor={isActive ? "gold.600" : "transparent"}
                      borderRadius="lg"
                      fontFamily="body"
                      onClick={() => {
                        if (item.key === "orders") setSelectedOrderId(null);
                        setSelectedTab(item.key);
                      }}
                    >
                      {item.label}
                    </Button>
                  );
                })}
              </VStack>

              <Divider borderColor="neutral.200" />

              <Button
                size={{ base: "sm", md: "md" }}
                variant={selectedTab === "delete" ? "danger" : "ghost"}
                justifyContent="flex-start"
                borderRadius="lg"
                fontFamily="body"
                onClick={() => setSelectedTab("delete")}
              >
                Delete Account
              </Button>
            </VStack>
          </Box>
        </Box>

        {/* Right column: Panels */}
        <Box
          flex={1}
          w="100%"
          bg="white"
          borderRadius="2xl"
          border="1px solid"
          borderColor="neutral.200"
          p={{ base: 4, sm: 5, md: 8 }}
        >
          <Box
            mb={5}
            display="flex"
            flexDirection={{ base: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ base: "flex-start", sm: "center" }}
            gap={3}
          >
            <Box>
              <Text {...eyebrowStyle} mb={1}>
                My Account
              </Text>
              <Heading
                size={{ base: "md", md: "lg" }}
                color="neutral.900"
                fontFamily="body"
              >
                {panelTitle}
              </Heading>
            </Box>
            <Badge
              bg="neutral.100"
              color="neutral.600"
              borderRadius="full"
              px={3}
              py={1}
              fontSize="10px"
              textTransform="uppercase"
              letterSpacing="0.06em"
            >
              Account
            </Badge>
          </Box>

          <Divider mb={6} borderColor="neutral.200" />

          {/* Content area */}
          <Box minH={{ base: "auto", md: "400px" }}>
            {selectedTab === "overview" && (
              <Box>
                <Text mb={5} color="neutral.500" fontSize="sm">
                  Quick information about your account. Edit details or manage
                  addresses and orders from the left.
                </Text>
                <Stack spacing={3}>
                  <Box
                    p={4}
                    borderRadius="lg"
                    bg="neutral.50"
                    border="1px solid"
                    borderColor="neutral.200"
                  >
                    <Text fontSize="xs" color="neutral.500" mb={0.5}>
                      Full name
                    </Text>
                    <Text fontWeight={700} color="neutral.900">
                      {user?.user?.first_name || ""}{" "}
                      {user?.user?.last_name || ""}
                    </Text>
                  </Box>

                  <Box
                    p={4}
                    borderRadius="lg"
                    bg="neutral.50"
                    border="1px solid"
                    borderColor="neutral.200"
                  >
                    <Text fontSize="xs" color="neutral.500" mb={0.5}>
                      Email
                    </Text>
                    <Text fontWeight={700} color="neutral.900">
                      {user?.user?.email}
                    </Text>
                  </Box>
                </Stack>
              </Box>
            )}

            {selectedTab === "edit" && <EmbeddedEditProfile />}

            {selectedTab === "addresses" && <ShippingAddress />}

            {selectedTab === "orders" && (
              <MyOrders
                onViewDetails={(orderId) => {
                  setSelectedOrderId(orderId);
                  setSelectedTab("order-details");
                }}
              />
            )}

            {selectedTab === "order-details" && (
              <Box>
                <Button
                  variant="outline"
                  borderRadius="xl"
                  fontFamily="body"
                  onClick={() => {
                    setSelectedOrderId(null);
                    setSelectedTab("orders");
                  }}
                  size="md"
                  _disabled={{ opacity: 0.5, cursor: "not-allowed" }}
                >
                  Back to orders
                </Button>
                <OrderDetails orderId={selectedOrderId} embedded />
              </Box>
            )}

            {selectedTab === "delete" && (
              <EmbeddedDeleteAccount onOpenModal={onDeleteOpen} />
            )}
          </Box>
        </Box>
      </Flex>

      {/* Modal for delete confirmation (shared) */}
      <DeleteConfirmationModal isOpen={isDeleteOpen} onClose={onDeleteClose} />
      <ProfilePictureModal
        isOpen={isPictureOpen}
        onClose={onPictureClose}
        profilePictureUrl={profilePictureUrl}
        onSaved={handlePictureSaved}
      />
    </Box>
  );
};

export default ViewProfile;
