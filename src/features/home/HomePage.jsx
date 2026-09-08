import { Box } from "@chakra-ui/react";
import ClientStoriesSection from "./components/ClientStoriesSection";
import CustomizationFlowSection from "./components/CustomizationFlowSection";
import Faq from "../static/pages/Faq";
import FeaturedCollectionsSection from "./components/FeaturedCollectionsSection";
import HeroSection from "./components/HeroSection";
import NewArrivalsSection from "./components/NewArrivalsSection";
import NewsletterSection from "./components/NewsletterSection";
import SpecialWinterSaleSection from "./components/SpecialWinterSaleSection";
import StatsBar from "./components/StatsBar";
import TrendingNowSection from "./components/TrendingNowSection";

const Home = () => {
  return (
    <Box bg="#ffffff">
      <HeroSection />
      <StatsBar />
      <CustomizationFlowSection />
      <FeaturedCollectionsSection />
      <TrendingNowSection />
      <SpecialWinterSaleSection />
      <NewArrivalsSection />
      <ClientStoriesSection />
      <Faq />
      <NewsletterSection />
    </Box>
  );
};

export default Home;
