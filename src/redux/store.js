// src/store.js

import adminReducer from "./slices/admin/index";
import artworkCategoriesReducer from "./slices/artworkCategoriesSlice";
import artworkCategoryImagesReducer from "./slices/artworkCategoryImagesSlice";
import artworkImageInventoryReducer from "./slices/artworkImageInventorySlice";
import artworkWishlistReducer from "./slices/artworkWishlistSlice";
import artworksReducer from "./slices/artworksSlice";
import authReducer from "./slices/authSlice";
import backgroundsReducer from "./slices/backgroundsSlice";
import blogReducer from "./slices/blogSlice";
import cartReducer from "./slices/cartSlice";
import categoriesReducer from "./slices/categoriesSlice";
import checkoutReducer from "./slices/checkoutSlice";
import { configureStore } from "@reduxjs/toolkit";
import contactReducer from "./slices/contactSlice";
import customizedFinalImageReducer from "./slices/customizedFinalImageSlice";
import frameInventoryReducer from "./slices/frameInventorySlice";
import framePreviewReducer from "./slices/framePreviewSlice";
import framesReducer from "./slices/framesSlice";
import imageUploadReducer from "./slices/imageUploadSlice";
import materialsReducer from "./slices/materialsSlice";
import ordersReducer from "./slices/ordersSlice";
import previewDerivedReducer from "./slices/previewDerivedSlice";
import productCategoriesReducer from "./slices/productCategoriesSlice";
import productWishlistReducer from "./slices/productWishlistSlice";
import productsReducer from "./slices/productsSlice";
import shippingAddressReducer from "./slices/shippingAddressSlice";
import sizesReducer from "./slices/sizesSlice";
import userAuthReducer from "./slices/userAuthSlice";
import userDetailsReducer from "./slices/userDetailsSlice";
import wishlistReducer from "./slices/wishlistSlice";

const store = configureStore({
  reducer: {
    // ============ USER STATE ============
    userAuth: userAuthReducer,
    userDetails: userDetailsReducer,
    auth: authReducer,
    orders: ordersReducer,
    cart: cartReducer,
    shippingAddress: shippingAddressReducer,
    checkout: checkoutReducer,

    // ============ PRODUCT STATE ============
    products: productsReducer,
    productCategories: productCategoriesReducer,
    productWishlist: productWishlistReducer,
    frames: framesReducer,
    materials: materialsReducer,
    backgrounds: backgroundsReducer,
    sizes: sizesReducer,

    // ============ ARTWORK STATE ============
    artworks: artworksReducer,
    categories: categoriesReducer,
    artworkCategories: artworkCategoriesReducer,
    artworkCategoryImages: artworkCategoryImagesReducer,
    artworkWishlist: artworkWishlistReducer,
    artworkImageInventory: artworkImageInventoryReducer,
    wishlist: wishlistReducer,
    blog: blogReducer,
    contact: contactReducer,

    // ============ CUSTOMIZATION STATE ============
    framePreview: framePreviewReducer,
    customizedFinalImage: customizedFinalImageReducer,
    imageUpload: imageUploadReducer,
    previewDerived: previewDerivedReducer,
    frameInventory: frameInventoryReducer,

    // ============ ADMIN STATE (Namespace) ============
    admin: adminReducer,
  },
});

export default store;
