import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    50: "#FFE6E6",
    100: "#F5D0D8",
    200: "#E8A8B8",
    300: "#D48098",
    400: "#C05878",
    500: "#590854",
    600: "#4A0745",
    700: "#400736",
    800: "#2E0526",
    900: "#1C0317",
  },
  neutral: {
    50: "#FBFBFB",
    100: "#F5F5F5",
    200: "#EAEAEA",
    300: "#D4D4D4",
    400: "#A3A3A3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#000000",
  },
  beige: {
    50: "#FBF8F3",
    100: "#F5EFE6",
    200: "#EDE4D4",
    300: "#D8C4A2",
    400: "#C4A97E",
    500: "#B08F5A",
  },
  soft: {
    50: "#FFE6E6",
    100: "#FFD6D6",
  },
};

const fonts = {
  heading: `"Satoshi", Inter, system-ui, sans-serif`,
  body: `"Satoshi", Inter, system-ui, sans-serif`,
};

const components = {
  Button: {
    baseStyle: {
      fontFamily: "body",
      fontWeight: "500",
      borderRadius: "full",
      textTransform: "none",
      transition: "none",
      _focus: { boxShadow: "none" },
      _hover: { bg: "inherit" },
      _active: { bg: "inherit" },
    },
    sizes: {
      sm: { fontSize: "sm", h: "36px", px: 5 },
      md: { fontSize: "sm", h: "44px", px: 6 },
      lg: { fontSize: "md", h: "52px", px: 8 },
    },
    variants: {
      solid: {
        bg: "neutral.900",
        color: "white",
        _hover: { bg: "neutral.900" },
        _active: { bg: "neutral.900" },
        _disabled: { opacity: 0.5, cursor: "not-allowed" },
      },
      outline: {
        bg: "white",
        color: "neutral.900",
        border: "1.5px solid",
        borderColor: "neutral.300",
        _hover: { bg: "white", borderColor: "neutral.300" },
      },
      ghost: {
        bg: "transparent",
        color: "neutral.800",
        _hover: { bg: "transparent" },
      },
      brand: {
        bg: "brand.500",
        color: "white",
        _hover: { bg: "brand.500" },
        _active: { bg: "brand.500" },
      },
    },
    defaultProps: {
      variant: "solid",
      size: "md",
    },
  },
  IconButton: {
    baseStyle: {
      borderRadius: "full",
      transition: "none",
      _focus: { boxShadow: "none" },
      _hover: { bg: "transparent" },
      _active: { bg: "transparent" },
    },
  },
  Icon: {
    baseStyle: {
      display: "inline-block",
      verticalAlign: "middle",
      flexShrink: 0,
    },
  },
  Input: {
    defaultProps: {
      focusBorderColor: "brand.500",
    },
  },
  Heading: {
    baseStyle: {
      fontFamily: "heading",
      fontWeight: "700",
      color: "neutral.900",
    },
  },
};

const styles = {
  global: {
    "html, body": {
      bg: "neutral.50",
      color: "neutral.900",
      fontFamily: "body",
    },
    body: {
      lineHeight: "1.5",
      WebkitFontSmoothing: "antialiased",
    },
    ".chakra-icon, .chakra-icon svg": {
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round",
    },
    "*::selection": {
      bg: "#FFE6E6",
      color: "#400736",
    },
  },
};

const theme = extendTheme({ colors, fonts, components, styles });

export default theme;