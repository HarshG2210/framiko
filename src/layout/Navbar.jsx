import {
  Avatar,
  Badge,
  Box,
  Button,
  Image as ChakraImage,
  Link as ChakraLink,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  HStack,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { FiHeart, FiMenu, FiShoppingCart, FiUser } from "react-icons/fi";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import CartDrawer from "../features/cart/components/CartDrawer";
import { fetchCartItems } from "../redux/slices/cartSlice";
import logoImage from "../assets/images/Framiko_Logo/New_Framiko_Logo.svg";
import { normalizeMediaUrl } from "../utils/constant";
import { useEffect } from "react";
import { viewProfile } from "../redux/slices/userAuthSlice";

const Navbar = () => {
  const { user, token } = useSelector((state) => state.userAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoggedIn = !!token;

  const cartItems = useSelector((s) => s.cart.cartItems);

  useEffect(() => {
    if (token) {
      dispatch(viewProfile());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (token) {
      dispatch(fetchCartItems());
    }
  }, [dispatch, token]);

  const {
    isOpen: isCartOpen,
    onOpen: openCart,
    onClose: closeCart,
  } = useDisclosure();

  const {
    isOpen: isDrawerOpen,
    onOpen: openDrawer,
    onClose: closeDrawer,
  } = useDisclosure();

  const navItems = [
    { label: "Products", to: "/products" },
    { label: "Customization", to: "/customization" },
    { label: "Blogs", to: "/blog" },
    { label: "Contact Us", to: "/contact" },
  ];

  return (
    <>
      <Box
        as="header"
        width="full"
        bg="white"
        position="sticky"
        top="0"
        zIndex="1000"
        borderBottom="1px solid"
        borderColor="neutral.200"
      >
        <Flex
          maxW="1440px"
          mx="auto"
          px={{ base: 4, md: 6, lg: 8 }}
          py={{ base: 3, md: 4 }}
          align="center"
          justify="space-between"
          gap={{ base: 2, lg: 4 }}
        >
          <HStack
            spacing={{ base: 3, md: 4 }}
            align="center"
            minW={{ lg: "180px" }}
          >
            <IconButton
              icon={<FiMenu />}
              variant="ghost"
              fontSize="22px"
              display={{ base: "flex", lg: "none" }}
              onClick={openDrawer}
              aria-label="Open menu"
              color="neutral.900"
              _hover={{ bg: "transparent" }}
            />

            <Link to="/">
              <ChakraImage
                src={logoImage}
                alt="Framiko Logo"
                width={{ base: "120px", sm: "140px", md: "160px", lg: "180px" }}
                height={{ base: "32px", sm: "38px", md: "42px", lg: "46px" }}
                objectFit="contain"
                transition="all 0.2s ease"
                _hover={{ transform: "scale(1.02)" }}
              />
            </Link>
          </HStack>

          <HStack
            as="nav"
            spacing={{ base: 6, md: 8, lg: 10 }}
            display={{ base: "none", lg: "flex" }}
            flex="1"
            justify="center"
            align="center"
            fontSize="16px"
            fontWeight="500"
            color="neutral.700"
            letterSpacing="0.01em"
          >
            {navItems.map((item) => (
              <ChakraLink
                key={item.label}
                as={Link}
                to={item.to}
                color="neutral.800"
                fontFamily="body"
                _hover={{ color: "neutral.800", textDecoration: "none" }}
                _focus={{ boxShadow: "none" }}
              >
                {item.label}
              </ChakraLink>
            ))}
          </HStack>

          <HStack
            spacing={{ base: 2, md: 3 }}
            minW={{ lg: "180px" }}
            justify="flex-end"
          >
            <IconButton
              icon={<FiHeart />}
              variant="ghost"
              fontSize="20px"
              color="neutral.900"
              aria-label="Wishlist"
              onClick={() => navigate("/wishlist")}
              borderRadius="full"
              _hover={{ bg: "transparent" }}
            />

            <Box position="relative">
              <IconButton
                icon={<FiShoppingCart />}
                variant="ghost"
                fontSize="20px"
                color="neutral.900"
                aria-label="Cart"
                onClick={openCart}
                borderRadius="full"
                _hover={{ bg: "transparent" }}
              />

              <Badge
                position="absolute"
                top="-6px"
                right="-4px"
                bg="brand.500"
                color="white"
                borderRadius="full"
                fontSize="10px"
                minW="18px"
                h="18px"
                display="inline-flex"
                alignItems="center"
                justifyContent="center"
                border="2px solid white"
              >
                {cartItems.length}
              </Badge>
            </Box>

            {isLoggedIn ? (
              <Menu>
                <MenuButton>
                  <Avatar
                    size="sm"
                    src={
                      user?.profile_picture
                        ? normalizeMediaUrl(user.profile_picture)
                        : ""
                    }
                    border="1px solid"
                    borderColor="neutral.200"
                  />
                </MenuButton>
                <MenuList>
                  <ChakraLink
                    as={Link}
                    to="/viewProfile"
                    _hover={{ textDecoration: "none" }}
                  >
                    <MenuItem
                      _hover={{ bg: "transparent" }}
                      _focus={{ bg: "transparent" }}
                    >
                      View Profile
                    </MenuItem>
                  </ChakraLink>
                  <ChakraLink
                    as={Link}
                    to="/wishlist"
                    _hover={{ textDecoration: "none" }}
                  >
                    <MenuItem
                      _hover={{ bg: "transparent" }}
                      _focus={{ bg: "transparent" }}
                    >
                      Wishlist
                    </MenuItem>
                  </ChakraLink>
                  <ChakraLink
                    as={Link}
                    to="/logout"
                    _hover={{ textDecoration: "none" }}
                  >
                    <MenuItem
                      _hover={{ bg: "transparent" }}
                      _focus={{ bg: "transparent" }}
                    >
                      Logout
                    </MenuItem>
                  </ChakraLink>
                </MenuList>
              </Menu>
            ) : (
              <IconButton
                icon={<FiUser />}
                variant="ghost"
                fontSize="20px"
                color="neutral.900"
                aria-label="Login"
                onClick={() => navigate("/login")}
                borderRadius="full"
                _hover={{ bg: "transparent" }}
              />
            )}
          </HStack>
        </Flex>
      </Box>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />

      {/* ================= MOBILE & TABLET DRAWER ================= */}
      <Drawer placement="left" isOpen={isDrawerOpen} onClose={closeDrawer}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>
            <ChakraImage
              src={logoImage}
              alt="Framico Logo"
              width={{
                base: "120px",
                sm: "140px",
                md: "160px",
              }}
              height={{
                base: "40px",
                sm: "46px",
                md: "52px",
              }}
              objectFit="contain"
              transition="all 0.2s"
              _hover={{ transform: "scale(1.05)" }}
            />
          </DrawerHeader>

          <DrawerBody>
            <VStack align="stretch" spacing={4}>
              <ChakraLink as={Link} to="/products" onClick={closeDrawer}>
                Products
              </ChakraLink>

              <ChakraLink as={Link} to="/customization" onClick={closeDrawer}>
                Customization
              </ChakraLink>

              <ChakraLink as={Link} to="/blog" onClick={closeDrawer}>
                Blogs
              </ChakraLink>
              <ChakraLink as={Link} to="/contact" onClick={closeDrawer}>
                Contact
              </ChakraLink>

              <Box pt={4}>
                {!isLoggedIn ? (
                  <Button
                    w="100%"
                    variant="solid"
                    size="md"
                    fontFamily="body"
                    onClick={() => {
                      closeDrawer();
                      navigate("/login");
                    }}
                  >
                    Sign In
                  </Button>
                ) : (
                  <Button
                    w="100%"
                    variant="solid"
                    size="md"
                    fontFamily="body"
                    onClick={() => {
                      closeDrawer();
                      navigate("/viewProfile");
                    }}
                  >
                    View Profile
                  </Button>
                )}
              </Box>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Navbar;
