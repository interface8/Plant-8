export default function HowItWorks() {
  const steps = [
    {
      title: "Browse Opportunities",
      description:
        "Explore a variety of carefully vetted agricultural investment projects with detailed information and projections.",
      icon: "🔍",
    },
    {
      title: "Invest Securely",
      description:
        "Choose your investment amount and fund securely through our encrypted platform with multiple payment options.",
      icon: "🔒",
    },
    {
      title: "Track Progress",
      description:
        "Monitor project updates, financial performance, and impact metrics in real-time through your dashboard.",
      icon: "📊",
    },
    {
      title: "Earn Returns",
      description:
        "Receive your ROI quarterly and choose to reinvest for compound growth or withdraw your earnings.",
      icon: "💰",
    },
  ];

  return (
    <section className="bg-gray-50 py-12 sm:py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            How It Works
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Start your agricultural investment journey in four simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center group">
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 mb-4">
                <div className="bg-green-100 text-green-600 rounded-full w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center mx-auto mb-4 sm:mb-6 text-2xl sm:text-3xl group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                  {step.icon}
                </div>
                <div className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                  {index + 1}
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-gray-900">
                  {step.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="hidden lg:block">
          <div className="flex justify-center items-center mt-8 space-x-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-green-300 text-2xl">
                →
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
