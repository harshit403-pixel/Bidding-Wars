
import AboutSection from "../shared/components/AboutSection";
import FeaturedAuctions from "../shared/components/FeaturedAuctions";
import Hero from "../shared/components/Hero";
import HowItWorks from "../shared/components/HowItWorks";
import LiveAuction from "../shared/components/LiveAuction";



function HomePage() {
    return (
       <div className="min-h-screen bg-[#F5F1EB] text-[#111111]">
            
            <Hero />
            <FeaturedAuctions/>
            <HowItWorks/>
            <LiveAuction/>

            <AboutSection/>
    
        </div>
    );
}

export default HomePage;