// layouts/OwnerLayout.jsx
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export default function OwnerLayout() {
  return (
    <Box flex="1">
      <Outlet />
    </Box>
  );
}
