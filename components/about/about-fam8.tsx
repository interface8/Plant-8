import { Leaf, TrendingUp, Users, Shield } from "lucide-react";

export default function AboutFam8() {
  const features = [
    {
      icon: <Leaf className="w-8 h-8 text-green-600" />,
      title: "Sustainable Agriculture",
      description:
        "We promote eco-friendly farming practices that protect our environment while maximizing yields.",
    },
    {
      icon: <TrendingUp className="w-8 h-8 text-green-600" />,
      title: "Profitable Investments",
      description:
        "Our platform offers attractive returns through carefully selected agricultural projects and partnerships.",
    },
    {
      icon: <Users className="w-8 h-8 text-green-600" />,
      title: "Community Driven",
      description:
        "We support local farmers and communities, creating sustainable economic opportunities.",
    },
    {
      icon: <Shield className="w-8 h-8 text-green-600" />,
      title: "Secure Platform",
      description:
        "Advanced security measures and transparent reporting ensure your investments are protected.",
    },
  ];

  return (
    <section className="bg-white rounded-2xl shadow-lg p-8 lg:p-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
          What is FAM 8?
        </h2>
        <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
          FAM 8 is Nigeria&apos;s premier digital farm investment platform that
          connects investors with profitable agricultural opportunities. We
          leverage technology to make farming investments accessible,
          transparent, and rewarding for everyone.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
        {features.map((feature, index) => (
          <div
            key={index}
            className="text-center group hover:transform hover:scale-105 transition-all duration-300"
          >
            <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              {feature.icon}
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      <div className="bg-gradient-to-r from-green-600 to-teal-600 rounded-xl p-8 text-white text-center">
        <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
        <p className="text-lg leading-relaxed">
          To democratize agricultural investment in Nigeria by providing a
          secure, transparent, and profitable platform that empowers both
          investors and farmers to build a sustainable future together.
        </p>
      </div>
    </section>
  );
}
