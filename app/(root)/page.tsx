import Carousel from "@/components/carousel/carousel";
import FeaturedInvestments from "@/components/home/featuredInvestment";
import HeroSection from "@/components/home/heroSection";
import HowItWorks from "@/components/home/howItWork";
import Testimonials from "@/components/home/testimonials";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Carousel type="homepage" />
      <HeroSection />
      <FeaturedInvestments />
      <HowItWorks />
      <Testimonials />
    </div>
  );
}
