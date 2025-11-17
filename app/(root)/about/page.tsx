import Founder from "@/components/about/founder";
import DevelopmentTeam from "@/components/about/development-team";
import Location from "@/components/about/location";
import ContactForm from "@/components/about/contact-form";
import { Metadata } from "next";
import AboutFam8 from "@/components/about/about-fam8";

export const metadata: Metadata = {
  title: "About Us | FAM 8 - Farm Investment Platform",
  description:
    "Learn about FAM 8, Nigeria's premier farm investment platform. Meet our team, discover our mission, and get in touch with us.",
  keywords: "FAM 8, farm investment, agriculture, Nigeria, sustainable farming",
};

export const revalidate = 10;
export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">About FAM 8</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Empowering sustainable agriculture through innovative investment
            opportunities.
          </p>
        </div>
      </section>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
        <AboutFam8 />
        <Founder />
        <DevelopmentTeam />
        <Location />
        <ContactForm />
      </div>
    </div>
  );
}
