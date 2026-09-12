import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Text,
} from "@chakra-ui/react";
import { Link, useLocation } from "react-router-dom";

import { ChevronRightIcon } from "@chakra-ui/icons";
import { useSelector } from "react-redux";

const PATH_LABELS = {
  "": "Home",
  about: "About",
  contact: "Contact",
  blog: "Blog",
  reviews: "Reviews",
  privacy: "Privacy Policy",
  terms: "Terms",
  faq: "FAQ",
  "shipping-info": "Shipping Info",
  "return-policy": "Return Policy",
  cookies: "Cookies",
  signup: "Sign Up",
  login: "Login",
  completeProfile: "Complete Profile",
  viewProfile: "View Profile",
  logout: "Logout",
  updateProfile: "Update Profile",
  deleteProfile: "Delete Profile",
  "forget-password": "Forgot Password",
  "verify-otp": "Verify OTP",
  "reset-password": "Reset Password",
  customization: "Customization",
  products: "Products",
  wishlist: "Wishlist",
  "shipping-address": "Shipping Address",
  checkout: "Checkout",
  "my-orders": "My Orders",
  orders: "My Orders",
  "owner-account": "Owner Account",
  "product-categories": "Product Categories",
  "post-blogs": "Blog Posts",
  "contact-messages": "Contact Messages",
  "frames-inventory": "Frames Inventory",
  "product-inventory": "Product Inventory",
  "artwork-image-inventory": "Artwork Image Inventory",
  "post-sizes": "Sizes",
  "post-frames": "Frames",
  "post-materials": "Materials",
  "post-backgrounds": "Backgrounds",
  "post-artwork-categories": "Artwork Categories",
  "post-artwork-categories-images": "Artwork Category Images",
  "get-artworks": "Get Artworks",
};

const formatLabel = (segment, parentSegment) => {
  if (segment === "") return "Home";
  if (segment === "orders" && parentSegment === "owner-account")
    return "Orders";
  if (PATH_LABELS[segment]) return PATH_LABELS[segment];

  if (/^\d+$/.test(segment)) {
    if (parentSegment === "orders") return `Order ${segment}`;
    if (parentSegment === "products") return `Product ${segment}`;
    if (parentSegment === "blog") return `Blog ${segment}`;
    return "Details";
  }

  if (parentSegment === "verify-otp") return "Verify OTP";
  if (parentSegment === "reset-password") return "Reset Password";

  return segment
    .replace(/-/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
};

const getAuthFlowItems = (pathname) => {
  const verifyOtpMatch = pathname.match(/^\/verify-otp\/([^/]+)$/);
  const verifyOtpResetMatch = pathname.match(/^\/verify-otp\/([^/]+)\/reset$/);
  const resetPasswordMatch = pathname.match(/^\/reset-password\/([^/]+)$/);

  if (pathname === "/signup") {
    return [{ label: "Sign Up", to: "/signup" }];
  }

  if (pathname === "/login") {
    return [
      { label: "Sign Up", to: "/signup" },
      { label: "Verify OTP", to: null },
      { label: "Login", to: "/login" },
    ];
  }

  if (pathname === "/completeProfile") {
    return [
      { label: "Sign Up", to: "/signup" },
      { label: "Verify OTP", to: null },
      { label: "Login", to: "/login" },
      { label: "Complete Profile", to: "/completeProfile" },
    ];
  }

  if (verifyOtpMatch) {
    return [
      { label: "Sign Up", to: "/signup" },
      { label: "Verify OTP", to: pathname },
    ];
  }

  if (verifyOtpResetMatch) {
    return [
      { label: "Forgot Password", to: "/forget-password" },
      { label: "Verify OTP", to: pathname },
    ];
  }

  if (pathname === "/forget-password") {
    return [{ label: "Forgot Password", to: "/forget-password" }];
  }

  if (resetPasswordMatch) {
    const email = resetPasswordMatch[1];
    return [
      { label: "Forgot Password", to: "/forget-password" },
      { label: "Verify OTP", to: `/verify-otp/${email}` },
      { label: "Reset Password", to: pathname },
    ];
  }

  return null;
};

const getBreadcrumbItems = (pathname) => {
  const authItems = getAuthFlowItems(pathname);
  if (authItems) {
    return [{ label: "Home", to: "/" }, ...authItems];
  }

  const segments = pathname.split("/").filter(Boolean);
  const items = [{ label: "Home", to: "/" }];

  segments.forEach((segment, index) => {
    const parent = index > 0 ? segments[index - 1] : "";
    const to = `/${segments.slice(0, index + 1).join("/")}`;
    const label = formatLabel(segment, parent);
    items.push({ label, to });
  });

  return items;
};

const breadcrumbTextStyles = {
  fontSize: { base: "xs", md: "sm" },
  color: "neutral.800",
  fontWeight: "semibold",
  fontFamily: "body",
  whiteSpace: "nowrap",
  maxW: { base: "100%", md: "none" },
};

const breadcrumbLinkStyles = {
  fontSize: { base: "xs", md: "sm" },
  color: "neutral.700",
  fontFamily: "body",
  whiteSpace: "nowrap",
  maxW: { base: "100%", md: "none" },
  display: "inline-block",
  _hover: { color: "neutral.800", textDecoration: "none" },
  _focus: { boxShadow: "none" },
};

export default function Breadcrumbs() {
  const location = useLocation();

  // Call hooks in top-level order to satisfy React rules
  const step = useSelector((state) => state.checkout?.step || null);

  // hide only on the exact homepage
  if (location.pathname === "/") {
    return null;
  }

  // If user is on the checkout page, show current step using redux state
  if (location.pathname === "/checkout") {
    const steps = [
      "Shipping Address",
      "Create Order",
      "Confirmation",
    ];

    // items: Home, Checkout, then each step
    const items = [
      { label: "Home", to: "/" },
      { label: "Checkout", to: "/checkout" },
      ...steps.map((s) => ({ label: s, to: "/checkout" })),
    ];

    const currentIndex = 1 + (step || 1); // Home=0, Checkout=1, steps start at 2

    return (
      <Box
        bg="neutral.50"
        borderBottom="1px solid"
        borderColor="neutral.200"
        py={3}
        px={{ base: 4, md: 6 }}
        mb={6}
        fontFamily="body"
        w="100%"
        maxW="100%"
        overflowX="auto"
        sx={{
          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
        }}
      >
        <Breadcrumb
          spacing={{ base: "6px", md: "8px" }}
          separator={
            <ChevronRightIcon color="neutral.500" boxSize={{ base: 4, md: 5 }} />
          }
          flexWrap="wrap"
          overflow="visible"
          maxW="100%"
        >
          {items.map((item, index) => {
            const isCurrent = index === currentIndex;
            const isBefore = index < currentIndex;
            return (
              <BreadcrumbItem
                key={item.label + index}
                isCurrentPage={isCurrent}
                display="inline-flex"
                alignItems="center"
                minW={0}
                maxW={{ base: "100%", md: "none" }}
              >
                {isCurrent ? (
                  <Text {...breadcrumbTextStyles} noOfLines={1}>
                    {item.label}
                  </Text>
                ) : isBefore ? (
                  <BreadcrumbLink as={Link} to={item.to} {...breadcrumbLinkStyles}>
                    {item.label}
                  </BreadcrumbLink>
                ) : (
                  <Text fontSize={{ base: "xs", md: "sm" }} color="neutral.500" fontFamily="body" whiteSpace="nowrap" noOfLines={1}>
                    {item.label}
                  </Text>
                )}
              </BreadcrumbItem>
            );
          })}
        </Breadcrumb>
      </Box>
    );
  }

  const items = getBreadcrumbItems(location.pathname);

  return (
    <Box
      bg="neutral.50"
      borderBottom="1px solid"
      borderColor="neutral.200"
      py={3}
      px={{ base: 4, md: 6 }}
      mb={6}
      fontFamily="body"
      w="100%"
      maxW="100%"
      overflowX="auto"
      sx={{
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Breadcrumb
        spacing={{ base: "6px", md: "8px" }}
        separator={
          <ChevronRightIcon color="neutral.500" boxSize={{ base: 4, md: 5 }} />
        }
        flexWrap="wrap"
        overflow="visible"
        maxW="100%"
      >
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const hasValidLink = Boolean(item.to);
          return (
            <BreadcrumbItem
              key={`${item.label}-${index}`}
              isCurrentPage={isLast}
              display="inline-flex"
              alignItems="center"
              minW={0}
              maxW={{ base: "100%", md: "none" }}
            >
              {isLast || !hasValidLink ? (
                <Text {...breadcrumbTextStyles} noOfLines={1}>
                  {item.label}
                </Text>
              ) : (
                <BreadcrumbLink as={Link} to={item.to} {...breadcrumbLinkStyles}>
                  {item.label}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>
    </Box>
  );
}
