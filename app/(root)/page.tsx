import FeaturedInvestments from "@/components/home/featuredInvestment";
import HeroSection from "@/components/home/heroSection";
import HowItWorks from "@/components/home/howItWork";
import Testimonials from "@/components/home/testimonials";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <HeroSection />
      <FeaturedInvestments />
      <HowItWorks />
      <Testimonials />
    </div>
  );
}
