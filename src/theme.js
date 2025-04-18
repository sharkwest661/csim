// theme.js
import { extendTheme } from "@chakra-ui/react";

// Define the color palette with Azerbaijan flag colors and IT-themed colors
const colors = {
  brand: {
    blue: "#1A365D", // Dark blue (like Azerbaijan flag)
    red: "#E53E3E", // Red (like Azerbaijan flag)
    green: "#38A169", // Green (like Azerbaijan flag)
    code: "#2D3748", // Dark code color
    terminal: "#1A202C", // Terminal background
    highlight: "#4299E1", // Highlight color
  },
  // Add Azerbaijan flag colors
  azerbaijan: {
    blue: "#0033A0", // Blue from Azerbaijan flag
    red: "#EF3340", // Red from Azerbaijan flag
    green: "#00AF66", // Green from Azerbaijan flag
  },
};

// Define custom font sizes
const fontSizes = {
  xs: "0.75rem",
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.875rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
  "7xl": "4.5rem",
  "8xl": "6rem",
  "9xl": "8rem",
};

// Define custom component styles
const components = {
  Button: {
    // Define button variants
    variants: {
      primary: {
        bg: "azerbaijan.blue",
        color: "white",
        _hover: {
          bg: "blue.600",
        },
      },
      secondary: {
        bg: "azerbaijan.red",
        color: "white",
        _hover: {
          bg: "red.500",
        },
      },
      success: {
        bg: "azerbaijan.green",
        color: "white",
        _hover: {
          bg: "green.500",
        },
      },
    },
  },
  Heading: {
    baseStyle: {
      fontWeight: "bold",
      color: "gray.800",
      _dark: {
        color: "gray.100",
      },
    },
  },
  Card: {
    baseStyle: {
      p: "4",
      borderRadius: "lg",
      boxShadow: "md",
      bg: "white",
      _dark: {
        bg: "gray.700",
      },
    },
  },
};

// Create the custom theme
const theme = extendTheme({
  colors,
  fontSizes,
  components,
  styles: {
    global: {
      body: {
        bg: "gray.50",
        color: "gray.800",
        _dark: {
          bg: "gray.900",
          color: "gray.100",
        },
      },
    },
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});

export default theme;
