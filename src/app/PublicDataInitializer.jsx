import { fetchArtworkCategories } from "../redux/slices/artworkCategoriesSlice";
import { fetchArtworkCategoryImages } from "../redux/slices/artworkCategoryImagesSlice";
import { fetchFrames } from "../redux/slices/framesSlice";
import { fetchMaterials } from "../redux/slices/materialsSlice";
import { fetchProducts } from "../redux/slices/productsSlice";
import { fetchSizes } from "../redux/slices/sizesSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const PublicDataInitializer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchFrames());
    dispatch(fetchSizes());
    dispatch(fetchMaterials());
    dispatch(fetchArtworkCategories());
    dispatch(fetchArtworkCategoryImages());
  }, [dispatch]);

  return null;
};

export default PublicDataInitializer;
