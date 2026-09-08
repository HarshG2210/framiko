import { fetchArtworkWishlist } from "../redux/slices/artworkWishlistSlice";
import { fetchCartItems } from "../redux/slices/cartSlice";
import { fetchProductWishlist } from "../redux/slices/productWishlistSlice";
import { loadAuthData } from "../services/authStorage";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { viewProfile } from "../redux/slices/userAuthSlice";

const AuthDataInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const { token } = loadAuthData();

    if (!token) return;

    dispatch(viewProfile());
    dispatch(fetchProductWishlist());
    dispatch(fetchArtworkWishlist());
    dispatch(fetchCartItems());
  }, [dispatch]);

  return null;
};

export default AuthDataInitializer;
