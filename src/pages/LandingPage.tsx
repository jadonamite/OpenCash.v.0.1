import { useEffect } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import AnimationSection from "../components/AnimationSection";
import FeatureSection from "../components/FeatureSection";
import StatsSection from "../components/StatsSection";
import FAQSection from "../components/FAQSection";
import CallToAction from "../components/CallToAction";
import CryptoFlowDemo from "../components/move.tsx";
// import CryptoToCashAnimation from "../components/firstanimation";
import Footer from "../components/Footer";

const LandingPage = () => {
   useEffect(() => {
      // Update the page title
      document.title = "OpenCash | P2P Digital Asset Exchange";
   }, []);

   return (
      <div className="flex flex-col min-h-screen bg-gray-50 text-gray-800">
         <Navbar isLanding={true} />
         <main className="flex-grow">
            <HeroSection />
            <FeatureSection />

            <AnimationSection />
            <StatsSection />
            <FAQSection />
            {/* <CryptoToCashAnimation /> */}
            <CryptoFlowDemo />

            <CallToAction />
         </main>
         <Footer />
      </div>
   );
};

export default LandingPage;
