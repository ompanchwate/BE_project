import CTA from "../components/Landing page/CTA";
import Features from "../components/Landing page/Features";
import Footer from "../components/Landing page/Footer";
import Hero from "../components/Landing page/Hero";
import HowItWorks from "../components/Landing page/HowItWorks";
import Navbar from "../components/Landing page/Navbar";
import TeamSection from "../components/Landing page/Team";
import Testimonials from "../components/Landing page/Testimonials";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <Testimonials />
      <CTA />
      <TeamSection />
      <Footer />
    </div>
  );
};

export default Index;
