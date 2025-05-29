export default function Testimonials() {
  const testimonials = [
    {
      name: "John Doe",
      quote:
        "FAM 8 made investing in agriculture simple and profitable! The transparency and regular updates give me complete confidence in my investments.",
      role: "Tech Investor",
      rating: 5,
      investment: "$15,000",
    },
    {
      name: "Jane Smith",
      quote:
        "The platform's transparency and detailed progress updates keep me confident in my investment decisions. Great returns and social impact!",
      role: "Farmer Partner",
      rating: 5,
      investment: "$8,500",
    },
    {
      name: "Michael Chen",
      quote:
        "Excellent platform for sustainable investing. The team is responsive and the projects are well-managed with consistent returns.",
      role: "Retail Investor",
      rating: 5,
      investment: "$5,000",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            What Our Investors Say
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Join thousands of satisfied investors who are earning returns while
            making a positive impact
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl shadow-md p-6 sm:p-8 text-center hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              {/* Rating Stars */}
              <div className="flex justify-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-5 h-5 text-yellow-400"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              <blockquote className="text-sm sm:text-base text-gray-700 mb-6 leading-relaxed italic">
                &quot;{testimonial.quote}&quot;
              </blockquote>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                  {testimonial.name}
                </h3>
                <p className="text-sm text-gray-500 mb-2">{testimonial.role}</p>
                <p className="text-xs text-green-600 font-medium">
                  Invested: {testimonial.investment}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <p className="text-sm sm:text-base text-gray-600 mb-4">
            Join over 500+ satisfied investors
          </p>
          <a
            href="/testimonials"
            className="inline-block text-green-600 font-semibold hover:text-green-700 transition-colors duration-300"
          >
            Read More Success Stories →
          </a>
        </div>
      </div>
    </section>
  );
}
