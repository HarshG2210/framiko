import "react-toastify/dist/ReactToastify.css";

import React, { Suspense, lazy } from "react";
import { Route, Routes } from "react-router-dom";

import AppInitializer from "./app/AppInitializer";
import { Box } from "@chakra-ui/react";
import CookieBanner from "./components/CookieBanner";
import DefaultLayout from "./layout/DefaultLayout";
import ErrorBoundary from "./components/ErrorBoundary";
import LoadingPage from "./components/LoadingPage";
import Logout from "./components/User/Logout";
import OwnerLayout from "./layout/OwnerLayout";
import PrivateRoute from "./routes/PrivateRoute";
import ShippingAddress from "./components/User/ShippingAddress";
import { ToastContainer } from "react-toastify";

const Home = lazy(() => import("./features/home/HomePage"));
const About = lazy(() => import("./features/static/pages/About"));
const Contact = lazy(() => import("./features/static/pages/Contact"));
const Blog = lazy(() => import("./features/static/pages/Blog"));
const BlogDetails = lazy(() => import("./features/static/pages/BlogDetails"));
const Review = lazy(() => import("./features/static/pages/Review"));
const Privacy = lazy(() => import("./features/static/pages/Privacy"));
const Terms = lazy(() => import("./features/static/pages/Terms"));
const Faq = lazy(() => import("./features/static/pages/Faq"));
const ShippingInfo = lazy(() => import("./features/static/pages/ShippingInfo"));
const ReturnPolicy = lazy(() => import("./features/static/pages/ReturnPolicy"));
const CookiesPage = lazy(() => import("./features/static/pages/Cookies"));
const Signup = lazy(() => import("./features/auth/pages/Signup"));
const VerifyOTP = lazy(() => import("./features/auth/pages/VerifyOTP"));
const Login = lazy(() => import("./features/auth/pages/Login"));
const CompleteProfile = lazy(() => import("./features/auth/pages/CompleteProfile"));
const ViewProfile = lazy(() => import("./features/profile/pages/ViewProfile"));
const UpdateProfile = lazy(() => import("./features/profile/pages/UpdateProfile"));
const UpdateProfilePicture = lazy(() => import("./features/profile/pages/UpdateProfilePicture"));
const DeleteProfile = lazy(() => import("./features/profile/pages/DeleteProfile"));
const ForgetPassword = lazy(() => import("./features/auth/pages/ForgotPassword"));
const VerifyForgetPasswordOTP = lazy(() => import("./features/auth/pages/VerifyForgetPasswordOTP"));
const ResetPassword = lazy(() => import("./features/auth/pages/ResetPassword"));
const Customization = lazy(() => import("./features/customization/pages/Customization"));
const FullscreenPreviewPage = lazy(() => import("./features/customization/pages/FullscreenPreviewPage"));
const ProductList = lazy(() => import("./features/products/pages/ProductList"));
const ProductDetails = lazy(() => import("./features/products/pages/ProductDetails"));
const WishlistPage = lazy(() => import("./features/wishlist/pages/WishlistPage"));
const Checkout = lazy(() => import("./features/checkout/pages/Checkout"));
const MyOrders = lazy(() => import("./features/orders/pages/MyOrders"));
const OrderDetails = lazy(() => import("./features/orders/pages/OrderDetails"));
const OwnerAccount = lazy(() => import("./features/admin/OwnerAccount"));


function App() {
  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <AppInitializer />
      <CookieBanner />

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        zIndex={9999}
      />
      <ErrorBoundary>
        <Suspense fallback={<LoadingPage message="Loading page..." />}>
          <Routes>
            <Route element={<DefaultLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetails />} />
              <Route path="/reviews" element={<Review />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/shipping-info" element={<ShippingInfo />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/cookies" element={<CookiesPage />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/verify-otp/:email" element={<VerifyOTP />} />
              <Route path="/login" element={<Login />} />
              <Route path="/completeProfile" element={<CompleteProfile />} />
              <Route path="/viewProfile" element={<ViewProfile />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/updateProfile" element={<UpdateProfile />} />
              <Route
                path="/updateProfilePicture"
                element={<UpdateProfilePicture />}
              />
              <Route path="/deleteProfile" element={<DeleteProfile />} />
              <Route path="/forget-password" element={<ForgetPassword />} />
              <Route
                path="/verify-otp/:email/reset"
                element={<VerifyForgetPasswordOTP />}
              />
              <Route path="/reset-password/:email" element={<ResetPassword />} />
              <Route path="/customization" element={<Customization />} />
              <Route path="/customization/fullscreen-preview" element={<FullscreenPreviewPage />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/wishlist" element={<WishlistPage />} />
              <Route path="/shipping-address" element={<ShippingAddress />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/orders" element={<MyOrders />} />
              <Route path="/orders/:id" element={<OrderDetails />} />
            </Route>
            <Route element={<OwnerLayout />}>
              <Route
                path="/owner-account/*"
                element={
                  <PrivateRoute>
                    <OwnerAccount />
                  </PrivateRoute>
                }
              />
            </Route>
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Box>
  );
}

export default App;
