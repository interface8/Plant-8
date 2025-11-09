import prisma from "../prisma";

export async function seedBlogs() {
  console.log("📝 Seeding blogs...");

  // Get some products and product types to relate blogs to
  const products = await prisma.product.findMany({ take: 5 });
  const productTypes = await prisma.productType.findMany({ take: 3 });
  const admin = await prisma.user.findFirst({
    where: { email: "quadriayomiidey@gmail.com" },
  });

  if (!admin) {
    console.log("⚠️ Admin user not found, skipping blog seeding");
    return;
  }

  const blogs = [
    {
      title: "10 Tips for Successful Agricultural Investment",
      slug: "10-tips-for-successful-agricultural-investment",
      content: `<h2>Introduction</h2>
<p>Agricultural investment can be a lucrative venture when approached with the right knowledge and strategy. Here are 10 essential tips to help you succeed in this growing sector.</p>

<h2>1. Understand the Market</h2>
<p>Research market trends, demand patterns, and pricing fluctuations in the agricultural sector. Knowledge is power when it comes to investment decisions.</p>

<h2>2. Diversify Your Portfolio</h2>
<p>Don't put all your eggs in one basket. Spread your investments across different crops, locations, and farming methods to minimize risk.</p>

<h2>3. Partner with Experienced Farmers</h2>
<p>Work with farmers who have proven track records. Their expertise can significantly impact your investment's success.</p>

<h2>4. Consider Climate and Geography</h2>
<p>Different regions are suited for different crops. Ensure your investment aligns with the local climate and soil conditions.</p>

<h2>5. Monitor Your Investments Regularly</h2>
<p>Stay informed about the progress of your investments through regular updates and site visits when possible.</p>

<h2>6. Understand the Timeline</h2>
<p>Agricultural investments typically require patience. Know the growth cycles and expected harvest periods.</p>

<h2>7. Assess Infrastructure</h2>
<p>Good infrastructure (roads, storage, water supply) is crucial for agricultural success.</p>

<h2>8. Stay Informed About Technology</h2>
<p>Modern farming techniques and technology can significantly improve yields and efficiency.</p>

<h2>9. Consider Insurance Options</h2>
<p>Protect your investment against natural disasters and other unforeseen events.</p>

<h2>10. Start Small and Scale Up</h2>
<p>Begin with a manageable investment and expand as you gain experience and confidence.</p>

<h2>Conclusion</h2>
<p>With these tips in mind, you're better prepared to make informed decisions in agricultural investment. Remember, success comes with knowledge, patience, and careful planning.</p>`,
      excerpt: "Learn the essential strategies for making profitable agricultural investments with these expert tips covering everything from market research to risk management.",
      coverImage: "/images/investment-tips.jpg",
      category: "Investment Tips",
      tags: ["investment", "tips", "beginners", "agriculture", "portfolio"],
      status: "PUBLISHED",
      readTime: 7,
      publishedAt: new Date("2024-11-01"),
      authorId: admin.id,
      createdBy: admin.id,
    },
    {
      title: "The Rise of Organic Farming in Nigeria",
      slug: "rise-of-organic-farming-nigeria",
      content: `<h2>Introduction</h2>
<p>Organic farming is experiencing unprecedented growth in Nigeria, driven by increasing health consciousness and global demand for organic produce.</p>

<h2>Market Growth</h2>
<p>The organic farming market in Nigeria has grown by over 30% in the past three years, with both local and international demand rising steadily.</p>

<h2>Key Benefits</h2>
<ul>
<li>Higher market prices for organic products</li>
<li>Improved soil health and sustainability</li>
<li>Reduced chemical dependency</li>
<li>Better farmer health outcomes</li>
<li>Growing export opportunities</li>
</ul>

<h2>Challenges</h2>
<p>Despite the growth, organic farmers face challenges including certification costs, limited access to organic inputs, and the need for specialized knowledge.</p>

<h2>Investment Opportunities</h2>
<p>Investors are increasingly seeing organic farming as a viable long-term investment, with returns often exceeding conventional farming methods.</p>

<h2>Future Outlook</h2>
<p>Experts predict continued growth in the organic sector, making it an attractive option for agricultural investors.</p>`,
      excerpt: "Discover why organic farming is becoming one of the most promising agricultural sectors in Nigeria, with insights into market trends and investment potential.",
      coverImage: "/images/organic-farming.jpg",
      category: "Market Insights",
      tags: ["organic", "farming", "sustainability", "trends", "Nigeria"],
      status: "PUBLISHED",
      readTime: 5,
      publishedAt: new Date("2024-11-05"),
      authorId: admin.id,
      createdBy: admin.id,
    },
    {
      title: `How to Start Your Poultry Farm: A Comprehensive Guide`,
      slug: "how-to-start-poultry-farm-comprehensive-guide",
      content: `<h2>Getting Started</h2>
<p>Starting a poultry farm requires careful planning, adequate capital, and knowledge of best practices. This guide will walk you through the essential steps.</p>

<h2>1. Planning and Research</h2>
<p>Conduct thorough market research to understand demand, pricing, and competition in your target area.</p>

<h2>2. Choose Your Niche</h2>
<p>Decide whether to focus on egg production, meat production (broilers), or both. Each has different requirements and market dynamics.</p>

<h2>3. Location Selection</h2>
<p>Choose a location with good ventilation, access to water, and proximity to markets. Ensure it complies with local regulations.</p>

<h2>4. Housing and Equipment</h2>
<p>Invest in proper housing that provides adequate space, ventilation, and protection from predators and weather.</p>

<h2>5. Sourcing Quality Birds</h2>
<p>Purchase chicks or mature birds from reputable suppliers with good genetic stock.</p>

<h2>6. Feed and Nutrition</h2>
<p>Ensure access to quality feed and clean water. Proper nutrition is crucial for healthy, productive birds.</p>

<h2>7. Disease Management</h2>
<p>Implement biosecurity measures and vaccination programs to prevent disease outbreaks.</p>

<h2>8. Record Keeping</h2>
<p>Maintain detailed records of expenses, production, and health to make informed business decisions.</p>

<h2>Conclusion</h2>
<p>With proper planning and management, poultry farming can be a profitable venture. Start small, learn continuously, and scale gradually.</p>`,
      excerpt: "Everything you need to know about starting a successful poultry farm, from planning and setup to ongoing management and profitability.",
      coverImage: "/images/poultry.jpeg",
      category: "Farming Guide",
      tags: ["poultry", "farming", "guide", "business", "livestock"],
      status: "PUBLISHED",
      readTime: 8,
      publishedAt: new Date("2024-10-28"),
      productId: products.find(p => p.name.toLowerCase().includes("poultry"))?.id,
      authorId: admin.id,
      createdBy: admin.id,
    },
    {
      title: "Cocoa Farming: Nigeria's Golden Opportunity",
      slug: "cocoa-farming-nigeria-golden-opportunity",
      content: `<h2>Historical Context</h2>
<p>Nigeria was once the world's second-largest cocoa producer. Today, there's a renewed push to reclaim that position, creating exciting opportunities for investors.</p>

<h2>Current Market Status</h2>
<p>Global demand for cocoa continues to rise, driven by the chocolate industry and emerging uses in cosmetics and pharmaceuticals.</p>

<h2>Why Invest in Cocoa?</h2>
<ul>
<li>Stable international demand</li>
<li>Long-term investment with trees producing for 20+ years</li>
<li>Government support and incentives</li>
<li>Growing premium cocoa market</li>
<li>Export opportunities</li>
</ul>

<h2>Getting Started</h2>
<p>Cocoa farming requires patience as trees take 3-5 years to begin producing. However, once established, they provide consistent yields.</p>

<h2>Best Practices</h2>
<p>Successful cocoa farming involves proper shade management, regular pruning, pest control, and soil management.</p>

<h2>Investment Returns</h2>
<p>With proper management, cocoa farms can provide annual returns of 15-20% or more, making them attractive long-term investments.</p>

<h2>Future Prospects</h2>
<p>As global demand continues to grow and Nigeria invests in the sector, cocoa presents one of the most promising agricultural investment opportunities.</p>`,
      excerpt: "Explore why cocoa farming is experiencing a renaissance in Nigeria and how investors can benefit from this lucrative agricultural sector.",
      coverImage: "/images/cocoa.jpeg",
      category: "Product",
      tags: ["cocoa", "investment", "export", "premium", "Nigeria"],
      status: "PUBLISHED",
      readTime: 6,
      publishedAt: new Date("2024-10-15"),
      productId: products.find(p => p.name.toLowerCase().includes("cocoa"))?.id,
      authorId: admin.id,
      createdBy: admin.id,
    },
    {
      title: "Sustainable Farming Practices for the Future",
      slug: "sustainable-farming-practices-future",
      content: `<h2>Introduction</h2>
<p>Sustainable farming is no longer optional—it's essential for the future of agriculture and our planet. Learn about practices that benefit both farmers and the environment.</p>

<h2>Crop Rotation</h2>
<p>Rotating crops helps maintain soil health, reduces pest problems, and improves yields over time.</p>

<h2>Composting and Organic Fertilizers</h2>
<p>Reducing chemical fertilizer use through composting and organic alternatives improves soil quality and reduces environmental impact.</p>

<h2>Water Conservation</h2>
<p>Efficient irrigation systems and water management techniques are crucial, especially in regions facing water scarcity.</p>

<h2>Integrated Pest Management</h2>
<p>Using natural predators and targeted interventions instead of blanket pesticide application protects beneficial insects and reduces costs.</p>

<h2>Agroforestry</h2>
<p>Integrating trees into farming systems provides multiple benefits including soil protection, additional income sources, and carbon sequestration.</p>

<h2>Technology Integration</h2>
<p>Modern tools like soil sensors, weather stations, and precision agriculture help optimize resource use.</p>

<h2>Economic Benefits</h2>
<p>Sustainable practices often lead to reduced input costs, better long-term yields, and access to premium markets.</p>

<h2>Conclusion</h2>
<p>Sustainable farming is good for business and essential for our future. Investors and farmers alike should prioritize these practices.</p>`,
      excerpt: "Discover how sustainable farming practices are revolutionizing agriculture while providing better returns and protecting our environment for future generations.",
      coverImage: "/images/sustainable-farming.jpg",
      category: "Sustainability",
      tags: ["sustainability", "environment", "practices", "future", "organic"],
      status: "PUBLISHED",
      readTime: 7,
      publishedAt: new Date("2024-11-08"),
      productTypeId: productTypes[0]?.id,
      authorId: admin.id,
      createdBy: admin.id,
    },
    {
      title: "Understanding ROI in Agricultural Investments",
      slug: "understanding-roi-agricultural-investments",
      content: `<h2>What is ROI?</h2>
<p>Return on Investment (ROI) is a crucial metric for measuring the profitability of your agricultural investments.</p>

<h2>Calculating Agricultural ROI</h2>
<p>Agricultural ROI considers both direct returns (harvest value) and indirect benefits (land appreciation, tax benefits).</p>

<h2>Factors Affecting ROI</h2>
<ul>
<li>Crop selection and market prices</li>
<li>Weather and climate conditions</li>
<li>Farming practices and technology</li>
<li>Labor and input costs</li>
<li>Market access and timing</li>
</ul>

<h2>Typical ROI Ranges</h2>
<p>Different agricultural sectors offer varying ROI:
- Annual crops: 10-20%
- Perennial crops: 15-25%
- Livestock: 12-18%
- Organic farming: 20-30%</p>

<h2>Improving Your ROI</h2>
<p>Strategies include adopting modern farming techniques, diversifying crops, improving market access, and reducing waste.</p>

<h2>Long-term vs Short-term Returns</h2>
<p>Some investments like tree crops require patience but often provide better long-term returns.</p>

<h2>Risk Management</h2>
<p>Diversification, insurance, and careful planning help protect your ROI against unforeseen challenges.</p>`,
      excerpt: "Master the fundamentals of calculating and maximizing returns on agricultural investments with this detailed guide to ROI in the farming sector.",
      coverImage: "/images/roi-chart.jpg",
      category: "Investment Tips",
      tags: ["ROI", "returns", "investment", "calculation", "profit"],
      status: "PUBLISHED",
      readTime: 5,
      publishedAt: new Date("2024-10-20"),
      authorId: admin.id,
      createdBy: admin.id,
    },
  ];

  for (const blogData of blogs) {
    await prisma.blog.upsert({
      where: { slug: blogData.slug },
      update: blogData,
      create: blogData,
    });
  }

  const count = await prisma.blog.count();
  console.log(`✅ ${count} blogs seeded`);
}
