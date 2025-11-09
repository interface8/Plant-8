import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-10 md:py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Invest in Sustainable Agriculture with FAM 8
        </h1>
        <p className="text-xl mb-8">
          Empowering farmers, investors, and communities through innovative land
          investment opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link
            href="/sign-in"
            className="bg-white text-green-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started
          </Link>
          <Link
            href="/how-it-works"
            className="bg-white/10 backdrop-blur-sm border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
          >
            How It Works
          </Link>
        </div>
      </div>
    </section>
  );
}
