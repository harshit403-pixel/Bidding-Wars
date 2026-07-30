
import AboutSection from "../shared/components/AboutSection";
import FeaturedAuctions from "../shared/components/FeaturedAuctions";
import Footer from "../shared/components/Footer";
import Hero from "../shared/components/Hero";
import LiveAuction from "../shared/components/LiveAuction";
import Navbar from "../shared/components/Navbar";


function HomePage() {
    return (
       <div className="min-h-screen bg-[#F5F1EB] text-[#111111]">
            <Navbar />
            <Hero />
            <FeaturedAuctions/>
            <LiveAuction/>
            <AboutSection/>
            <Footer/>
        </div>
    );
}

export default HomePage;