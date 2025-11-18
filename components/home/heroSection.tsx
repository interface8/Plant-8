import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-green-600 to-teal-600 text-white py-10 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Invest in Sustainable Agriculture with FAM 8
        </h1>
        <p className="text-xl mb-8">
          Empowering farmers, investors, and communities through innovative land
          investment opportunities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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
