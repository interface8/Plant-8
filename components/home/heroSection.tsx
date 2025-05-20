export default function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-green-500 to-teal-500 text-white py-20">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Invest in Sustainable Agriculture with FAM 8
        </h1>
        <p className="text-xl mb-8">
          Empowering farmers, investors, and communities through innovative land
          investment opportunities.
        </p>
        <a
          href="/dashboard"
          className="bg-white text-green-500 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100"
        >
          Get Started
        </a>
      </div>
    </section>
  );
}
