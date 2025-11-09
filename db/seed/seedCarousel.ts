import prisma from "../prisma";

export async function seedCarousel() {
  console.log("🎠 Seeding carousel...");

  // Check if carousel already has data
  const existingCount = await prisma.carousel.count();
  if (existingCount > 0) {
    console.log(`⚠️ Carousel already has ${existingCount} slides, skipping seed`);
    return;
  }

  const carouselSlides = [
    {
      title: "Invest in Sustainable Agriculture",
      description: "Join thousands of investors earning up to 15% ROI on agricultural investments",
      imageUrl: "/images/carousel-farm.jpg",
      link: "/investments/catalog",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-12-31"),
      isActive: true,
      type: "homepage" as const,
      sortOrder: 1,
    },
    {
      title: "Premium Cocoa Plantations",
      description: "High-yield cocoa farming with guaranteed returns and expert management",
      imageUrl: "/images/cocoa.jpeg",
      link: "/investments/product",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-12-31"),
      isActive: true,
      type: "homepage" as const,
      sortOrder: 2,
    },
    {
      title: "Organic Farming Revolution",
      description: "Be part of the organic farming movement with certified sustainable practices",
      imageUrl: "/images/avocado.jpeg",
      link: "/investments/catalog",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-12-31"),
      isActive: true,
      type: "homepage" as const,
      sortOrder: 3,
    },
    {
      title: "Free-Range Poultry Farms",
      description: "Invest in ethical poultry farming with consistent monthly returns",
      imageUrl: "/images/poultry.jpeg",
      link: "/investments/catalog",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-12-31"),
      isActive: true,
      type: "homepage" as const,
      sortOrder: 4,
    },
    {
      title: "Track Your Investment Growth",
      description: "Real-time dashboard to monitor your agricultural portfolio performance",
      imageUrl: "/images/dashboard-preview.jpg",
      link: "/dashboard",
      startDate: new Date("2024-01-01"),
      endDate: new Date("2025-12-31"),
      isActive: true,
      type: "homepage" as const,
      sortOrder: 5,
    },
  ];

  await prisma.carousel.createMany({
    data: carouselSlides,
    skipDuplicates: true,
  });

  const count = await prisma.carousel.count();
  console.log(`✅ ${count} carousel slides seeded`);
}
