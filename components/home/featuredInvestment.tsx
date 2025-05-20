import Image from "next/image";

export default function FeaturedInvestments() {
  // Mock data for carousel
  const investments = [
    {
      id: 1,
      title: "Organic Avocado Farm",
      roi: "12% ROI",
      image: "/images/avocado.jpg",
    },
    {
      id: 2,
      title: "Free-Range Poultry",
      roi: "10% ROI",
      image: "/images/poultry.jpg",
    },
    {
      id: 3,
      title: "Sustainable Cocoa Plantation",
      roi: "15% ROI",
      image: "/images/cocoa.jpg",
    },
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">
          Featured Opportunities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {investments.map((investment) => (
            <div
              key={investment.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <Image
                src={investment.image}
                alt={investment.title}
                width={500} // or set a fixed width
                height={192} // height roughly matches h-48 (48 * 4 = 192px)
                className="w-full h-48 object-cover"
                style={{ objectFit: "cover" }}
                priority // optional, depending on use
              />

              {/* <img
                src={investment.image}
                alt={investment.title}
                className="w-full h-48 object-cover"
              /> */}
              <div className="p-4">
                <h3 className="text-xl font-semibold">{investment.title}</h3>
                <p className="text-gray-600">{investment.roi}</p>
                <a
                  href={`/investments/${investment.id}`}
                  className="mt-4 inline-block text-green-500 font-semibold hover:underline"
                >
                  Learn More
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
