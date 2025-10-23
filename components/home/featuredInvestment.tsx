import Image from "next/image";
import prisma from "@/db/prisma";

export default async function FeaturedInvestments() {
  // Fetch top 3 products by total investment amount (most invested in)
  const topProducts = await prisma.product.findMany({
    take: 3,
    include: {
      _count: {
        select: { investments: true }
      },
      investments: {
        select: {
          amount: true,
          status: true,
          expectedReturn: true,
          land: {
            select: {
              location: {
                select: {
                  name: true,
                  state: {
                    select: {
                      name: true
                    }
                  }
                }
              }
            }
          }
        },
        where: {
          status: {
            in: ['ACTIVE', 'COMPLETED']
          }
        }
      },
      images: { select: { url: true } },
    },
    orderBy: {
      investments: {
        _count: 'desc'
      }
    }
  });

  // Calculate total investment amount for each product
  const investments = topProducts.map((product) => {
    const images = Array.isArray(product.images) ? product.images.map((img: { url: string }) => img.url) : [];
    const totalInvestment = product.investments.reduce((sum: number, inv) => sum + inv.amount, 0);
    const investorCount = product._count.investments;
    
    // Get location from the first investment's land
    const firstInvestment = product.investments[0];
    const location = firstInvestment?.land?.location?.state?.name || 
                     firstInvestment?.land?.location?.name || 
                     "Nigeria";

    // Format minimum investment (using current market price or a default)
    const minInvestment = new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(product.currentMarketPricePerKg * 100); // Estimate per plot

    // Calculate average ROI from investments
    const avgExpectedReturn = product.investments.length > 0
      ? product.investments.reduce((sum: number, inv) => sum + (inv.expectedReturn || 0), 0) / product.investments.length
      : 0;

    return {
      id: product.id,
      title: product.name,
      roi: `${avgExpectedReturn.toFixed(1)}% ROI`,
      location: location,
      minInvestment: minInvestment,
  image: (images && images[0]) || "/images/default-farm.jpg",
      totalInvestment: totalInvestment,
      investorCount: investorCount,
      description: product.description || "",
    };
  });

  // Fallback to dummy data if no products found
  const displayInvestments = investments.length > 0 ? investments : [
    {
      id: "1",
      title: "Organic Avocado Farm",
      roi: "12% ROI",
      location: "Lagos",
      minInvestment: "₦1,000,000",
      image: "/images/avocado.jpeg",
      totalInvestment: 0,
      investorCount: 0,
      description: "High-quality organic avocado farming",
    },
    {
      id: "2",
      title: "Free-Range Poultry",
      roi: "10% ROI",
      location: "Abeokuta",
      minInvestment: "₦500,000",
      image: "/images/poultry.jpeg",
      totalInvestment: 0,
      investorCount: 0,
      description: "Sustainable poultry farming",
    },
    {
      id: "3",
      title: "Sustainable Cocoa Plantation",
      roi: "15% ROI",
      location: "Ikorodu",
      minInvestment: "₦2,000,000",
      image: "/images/cocoa.jpeg",
      totalInvestment: 0,
      investorCount: 0,
      description: "Premium cocoa plantation",
    },
  ];

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">
            Featured Investment Opportunities
          </h2>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover carefully vetted agricultural projects with strong returns
            and positive impact
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {displayInvestments.map((investment) => (
            <div
              key={investment.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
            >
              <div className="relative overflow-hidden">
                <Image
                  src={investment.image}
                  alt={investment.title}
                  width={500}
                  height={224}
                  className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold shadow-lg">
                  {investment.roi}
                </div>
                {investment.investorCount > 0 && (
                  <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                    {investment.investorCount} investor{investment.investorCount !== 1 ? 's' : ''}
                  </div>
                )}
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                  {investment.title}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {investment.description}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Location:</span>
                    <span className="font-medium">{investment.location}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Min. Investment:</span>
                    <span className="font-medium">
                      {investment.minInvestment}
                    </span>
                  </div>
                  {/* Total Invested removed as requested */}
                </div>
                <a
                  href={`/investments/${investment.id}`}
                  className="inline-block text-green-500 font-semibold hover:underline mt-4"
                >
                  Learn More →
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <a
            href="/investments/catalog"
            className="inline-block bg-gray-100 text-gray-800 px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-300"
          >
            View All Opportunities
          </a>
        </div>
      </div>
    </section>
  );
}
