export default function Testimonials() {
  const testimonials = [
    {
      name: "John Doe",
      quote: "FAM 8 made investing in agriculture simple and profitable!",
      role: "Investor",
    },
    {
      name: "Jane Smith",
      quote: "The transparency and updates keep me confident in my investment.",
      role: "Farmer Partner",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          What Our Users Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 text-center"
            >
              <p className="text-gray-600 mb-4">
                &quot;{testimonial.quote}&quot;
              </p>
              <h3 className="text-lg font-semibold">{testimonial.name}</h3>
              <p className="text-gray-500">{testimonial.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
