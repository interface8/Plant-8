export default function HowItWorks() {
  const steps = [
    {
      title: "Browse Opportunities",
      description: "Explore a variety of agricultural investment projects.",
    },
    {
      title: "Invest Securely",
      description:
        "Choose your investment and fund securely through our platform.",
    },
    {
      title: "Track Progress",
      description:
        "Monitor project updates and financial performance in real-time.",
    },
    {
      title: "Earn Returns",
      description: "Receive your ROI and reinvest or withdraw your earnings.",
    },
  ];

  return (
    <section className="bg-gray-100 py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="text-center">
              <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
