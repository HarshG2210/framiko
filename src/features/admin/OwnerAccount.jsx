import {
  FiBox,
  FiGrid,
  FiHome,
  FiImage,
  FiLayers,
  FiScissors,
  FiShoppingBag,
  FiUsers,
} from "react-icons/fi";
import { Route, Routes, useNavigate } from "react-router-dom";

import { AdminShell } from "../../layout/AdminUI";
import ArtworkImageInventory from "./inventory/ArtworkImageInventory";
import ContactMessages from "./pages/ContactMessages";
import Dashboard from "./pages/Dashboard";
import FrameInventory from "./inventory/FrameInventory";
import GetArtworks from "./forms/GetArtworks";
import Orders from "./pages/Orders";
import PostArtworkCategories from "./forms/PostArtworkCategories";
import PostArtworkCategoryImages from "./forms/PostArtworkCategoryImages";
import PostBackgrounds from "./forms/PostBackgrounds";
import PostBlogs from "./forms/PostBlogs";
import PostFrames from "./forms/PostFrames";
import PostMaterials from "./forms/PostMaterials";
import PostProductCategories from "./forms/PostProductCategories";
import PostProducts from "./forms/PostProducts";
import PostSizes from "./forms/PostSizes";
import ProductInventory from "./inventory/ProductInventory";
import UserDetails from "./pages/Users";
import { adminLogout } from "../../redux/slices/admin/adminAuthSlice";
import { useDispatch } from "react-redux";

const OwnerAccount = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navLinks = [
    {
      path: "",
      label: "Dashboard",
      icon: FiHome,
    },
    {
      path: "user-details",
      label: "Users",
      icon: FiUsers,
    },
    { path: "get-artworks", label: "Artworks", icon: FiImage },
    { path: "post-sizes", label: "Sizes", icon: FiBox },
    { path: "post-frames", label: "Frames", icon: FiGrid },
    { path: "post-materials", label: "Materials", icon: FiLayers },
    { path: "post-backgrounds", label: "Backgrounds", icon: FiScissors },
    {
      path: "post-artwork-categories",
      label: "Artwork Categories",
      icon: FiGrid,
    },
    {
      path: "post-artwork-categories-images",
      label: "Artwork Category Images",
      icon: FiImage,
    },
    {
      path: "frames-inventory",
      label: "Frames Inventory",
      icon: FiBox,
    },
    { path: "product-categories", label: "Product Categories", icon: FiGrid },
    { path: "products", label: "Products", icon: FiBox },
    { path: "post-blogs", label: "Blog Posts", icon: FiGrid },
    { path: "contact-messages", label: "Contact Messages", icon: FiUsers },

    {
      path: "orders",
      label: "Orders",
      icon: FiShoppingBag,
    },
  ];

  const handleLogout = () => {
    dispatch(adminLogout());
    navigate("/");
  };

  return (
    <AdminShell
      navLinks={navLinks}
      onLogout={handleLogout}
      title="Frames Admin"
    >
      <Routes>
        {/* ✅ DASHBOARD (DEFAULT) */}
        <Route path="/" element={<Dashboard />} />

        {/* EXISTING ROUTES */}
        <Route path="get-artworks" element={<GetArtworks />} />
        <Route path="post-sizes" element={<PostSizes />} />
        <Route path="post-frames" element={<PostFrames />} />
        <Route path="post-materials" element={<PostMaterials />} />
        <Route path="post-backgrounds" element={<PostBackgrounds />} />
        <Route
          path="post-artwork-categories"
          element={<PostArtworkCategories />}
        />
        <Route
          path="post-artwork-categories-images"
          element={<PostArtworkCategoryImages />}
        />
        <Route path="frames-inventory" element={<FrameInventory />} />

        <Route path="user-details" element={<UserDetails />} />
        <Route path="product-categories" element={<PostProductCategories />} />
        <Route path="products" element={<PostProducts />} />
        <Route path="post-blogs" element={<PostBlogs />} />
        <Route path="contact-messages" element={<ContactMessages />} />
        <Route path="orders" element={<Orders />} />

        {/* FALLBACK */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </AdminShell>
  );
};

export default OwnerAccount;
