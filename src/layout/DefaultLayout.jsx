// layouts/DefaultLayout.jsx
import { Box } from "@chakra-ui/react";
import Navbar from "../layout/Navbar";
import Footer from "../layout/Footer";
import Breadcrumbs from "../components/Breadcrumbs";
import { Outlet } from "react-router-dom";

export default function DefaultLayout() {
  return (
    <>
      <Navbar />
      <Box flex="1">
        <Breadcrumbs />
        <Outlet />
      </Box>
      <Footer />
    </>
  );
}
