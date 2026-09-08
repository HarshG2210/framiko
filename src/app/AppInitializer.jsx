import AuthDataInitializer from "./AuthDataInitializer";
import PublicDataInitializer from "./PublicDataInitializer";

const AppInitializer = () => {
  return (
    <>
      <PublicDataInitializer />
      <AuthDataInitializer />
    </>
  );
};

export default AppInitializer;