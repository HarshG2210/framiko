# 🎨 FRAMES - Complete App Flow & Architecture

## 📋 Table of Contents
1. [App Overview](#app-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Overview](#architecture-overview)
4. [Entry Point & Initialization](#entry-point--initialization)
5. [Routing Structure](#routing-structure)
6. [State Management](#state-management)
7. [Core UI Flow](#core-ui-flow)
8. [API & Services](#api--services)
9. [Environment & Configuration](#environment--configuration)
10. [Getting Started](#getting-started)
11. [Project Structure](#project-structure)
12. [How the App Works](#how-the-app-works)
13. [Notes](#notes)

---

## App Overview

**FRAMES** is a **customizable photo frame e-commerce platform** built with React and Vite. It allows users to:
- Browse and purchase products, frames, and artwork
- Customize frames and artwork with their own images
- Choose materials, sizes, and preview a final design
- Add products to wishlist and cart
- Complete checkout with shipping details
- Manage profile data and order history
- Admin users manage inventory, content, and orders

### Key Features
- User authentication, signup, and OTP verification
- Product and artwork browsing
- Customization engine
- Cart, wishlist, and checkout flow
- Order history and profile pages
- Admin dashboard for content management

---

## Technology Stack

### Frontend & UI
- React 18.3.1
- React Router 7.5.3
- Chakra UI 2.8.2
- Framer Motion 7.10.3

### State & Data
- Redux Toolkit 2.8.1
- React-Redux 9.2.0
- Axios 1.9.0

### Image & Customization
- Konva 9.3.20
- React-Konva 18.2.16
- html-to-image 1.11.13
- html2canvas 1.4.1
- react-image-crop 11.0.10
- react-easy-crop 5.4.2
- use-image 1.1.1

### Utilities
- React-Toastify 11.0.5
- React-Countup 6.5.3
- Recharts 3.6.0
- React-Icons 5.5.0
- react-intersection-observer 10.0.2

### Build Tooling
- Vite 6.3.5
- ESLint 9.25.0

---

## Architecture Overview

The app is structured in layers:

- `src/main.jsx` — application bootstrap
- `src/App.jsx` — routes, layouts, and global UI wrappers
- `src/app/` — initialization logic for public and user data
- `src/layout/` — navigation, footer, and admin shell layouts
- `src/features/` — feature-specific pages and components
- `src/redux/` — Redux store and slices
- `src/services/` — Axios clients and API wrappers
- `src/utils/` — shared constants and helpers

---

## Entry Point & Initialization

### `src/main.jsx`

This file mounts the React app and includes:
- `React.StrictMode`
- `ChakraProvider`
- `Provider` (Redux store)
- `BrowserRouter`

### `src/App.jsx`

The main app component includes:
- `AppInitializer`
- `CookieBanner`
- `ToastContainer`
- `ErrorBoundary`
- `Routes` for public and admin areas

### `src/app/AppInitializer.jsx`

Loads both initialization flows:
- `PublicDataInitializer`
- `AuthDataInitializer`

### `src/app/PublicDataInitializer.jsx`

Dispatches public data fetch requests on mount:
- `fetchProducts()`
- `fetchFrames()`
- `fetchSizes()`
- `fetchMaterials()`
- `fetchArtworkCategories()`
- `fetchArtworkCategoryImages()`

### `src/app/AuthDataInitializer.jsx`

Checks local storage for `auth_token` and restores session data:
- `viewProfile()`
- `fetchProductWishlist()`
- `fetchArtworkWishlist()`
- `fetchCartItems()`

---

## Routing Structure

### Public & User Routes

- `/` → Home
- `/about` → About
- `/contact` → Contact
- `/blog` → Blog list
- `/blog/:id` → Blog details
- `/reviews` → Review page
- `/privacy`, `/terms`, `/faq`, `/shipping-info`, `/return-policy`, `/cookies`
- `/signup` → Signup
- `/login` → Login
- `/verify-otp/:email` → OTP verification
- `/completeProfile` → Complete profile
- `/forget-password` → Forgot password
- `/verify-otp/:email/reset` → Reset password OTP
- `/reset-password/:email` → Reset password
- `/products` → Product listing
- `/products/:id` → Product details
- `/customization` → Customization page
- `/customization/fullscreen-preview` → Fullscreen preview
- `/wishlist` → Wishlist
- `/shipping-address` → Shipping address
- `/checkout` → Checkout flow
- `/my-orders`, `/orders` → Order history
- `/orders/:id` → Order details

### Admin Routes

- `/owner-account/*` → Admin dashboard
- Protected by `PrivateRoute`
- Includes dashboard, orders, users, inventory, products, categories, blogs, and contact messages

---

## State Management

The Redux store is configured in `src/redux/store.js` with slices for:
- `userAuth`, `userDetails`, `auth`, `orders`, `cart`, `checkout`
- `products`, `productCategories`, `productWishlist`
- `frames`, `materials`, `backgrounds`, `sizes`
- `artworks`, `categories`, `artworkCategories`, `artworkCategoryImages`, `artworkWishlist`
- `blog`, `contact`
- `framePreview`, `customizedFinalImage`, `imageUpload`, `previewDerived`, `frameInventory`
- `admin`

Redux Toolkit async thunks handle API calls, loading state, and toast notifications.

---

## Core UI Flow

### Home Page

`src/features/home/HomePage.jsx` renders a landing experience with:
- Hero section
- Stats bar
- Customization flow preview
- Featured collections
- Trending products
- Seasonal promotions
- New arrivals
- Client stories
- FAQ and newsletter

### Product Browsing

Products are loaded into Redux and displayed across the listing and detail pages.
Users can add products to cart or wishlist.

### Customization

The `/customization` page includes:
- category selection
- video preview button
- frame preview canvas

It provides a workspace for creating custom frame/image combinations.

### Cart & Wishlist

The navbar exposes:
- cart drawer with item count
- wishlist access

Cart actions are handled through API calls using user auth tokens.

### Checkout

`src/features/checkout/pages/Checkout.jsx` uses a step-based flow:
- `AddressStep`
- `ReviewStep`
- `ConfirmationStep`

When leaving checkout, `resetCheckout()` clears checkout state.

### User Profile & Auth

Login is implemented in `src/features/auth/pages/Login.jsx` and `redux/slices/userAuthSlice.js`.
After login, the app:
- stores tokens in local storage
- refreshes profile, cart, and wishlist
- updates navbar user menu

### Admin Access

`src/routes/PrivateRoute.jsx` guards admin routes.
If an admin token is missing, it shows an admin login form.
After login, the `/owner-account/*` area is available.

---

## API & Services

### Axios clients

`src/services/api/axiosInstance.js` defines:
- `publicApi` for unauthenticated calls
- `userApi` for authenticated user calls
- `adminApi` for authenticated admin calls

Both authenticated clients attach JWT tokens from local storage.

### Error handling

Global response handling covers:
- network failures
- 401 unauthorized
- 403 forbidden
- 404 not found
- 500 server errors
- 429 rate limits

### Auth storage

`src/services/authStorage.js` stores:
- user tokens: `auth_token`, `auth_refresh_token`
- admin token: `admin_auth_token`

### API exports

`src/services/api/index.js` exports API layers like:
- `authApi`, `productsApi`, `cartApi`, `checkoutApi`, `ordersApi`, `wishlistApi`, `customizationApi`, `reviewsApi`
- admin API wrappers for users, orders, analytics, and inventory

---

## Environment & Configuration

The app supports Vite env variables:
- `VITE_API_BASE` — API base URL
- `VITE_IMAGE_API_BASE` — image/media base URL

Defaults:
- API base: `/`
- Image base: `/media`

---

## Getting Started

Install dependencies:
```bash
npm install
```

Run development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

---

## Project Structure

- `src/main.jsx` — app bootstrap
- `src/App.jsx` — routes and global wrappers
- `src/app/` — initialization and startup logic
- `src/layout/` — nav, footer, and admin shell layouts
- `src/features/` — feature pages and components
- `src/redux/` — store and slices
- `src/services/` — API clients and auth helpers
- `src/utils/` — shared constants and utilities

---

## How the App Works

1. `main.jsx` renders the app with theme, store, and routing.
2. `AppInitializer` loads public catalog data and restores the authenticated session.
3. Public pages and product data become available immediately.
4. Authenticated users have their profile, cart, and wishlist restored.
5. Users browse products, customize frames, add items to cart, and checkout.
6. Admins sign in through the protected `/owner-account/*` route and manage content.

---

## Notes

- This repository is a React frontend application.
- Backend services are expected behind `VITE_API_BASE`.
- Admin auth is stored under `admin_auth_token` in local storage.
