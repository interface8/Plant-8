import prisma from "../prisma";

export async function seedMarketplace() {
  console.log("🌱 Seeding marketplace listings...");

  try {
    // First, check if we have any investments at all
    const investmentCount = await prisma.investment.count();
    
    if (investmentCount === 0) {
      console.log("⚠️  No investments found. Creating sample investments for marketplace...");
      
      // Get products and users to create investments
      const products = await prisma.product.findMany({
        take: 5,
        include: {
          ProductType: true,
          duration: true,
        },
      });

      const users = await prisma.user.findMany({
        where: {
          roles: {
            some: {
              role: {
                name: {
                  in: ["FARMER", "INVESTOR"],
                },
              },
            },
          },
        },
        take: 10, // Increased to get more users
      });

      if (products.length === 0) {
        console.log("⚠️  No products found. Cannot create marketplace listings.");
        console.log("💡 Make sure products are seeded first.");
        return;
      }

      if (users.length === 0) {
        console.log("⚠️  No users with FARMER or INVESTOR role found. Cannot create marketplace listings.");
        console.log("💡 Make sure users with FARMER/INVESTOR roles are seeded first.");
        console.log("💡 Run: npm run seed to create default users with these roles.");
        return;
      }

      console.log(`📦 Creating sample investments from ${products.length} products and ${users.length} users...`);

      // Create sample investments
      const createdInvestments = [];
      for (let i = 0; i < Math.min(10, products.length * 2); i++) {
        const product = products[i % products.length];
        const user = users[i % users.length];
        
        const amount = Math.round(50000 + Math.random() * 200000);
        const expectedReturn = Math.round(amount * (1.2 + Math.random() * 0.3));
        const estimatedHarvestQuantity = Math.round(100 + Math.random() * 400);

        const investment = await prisma.investment.create({
          data: {
            userId: user.id,
            productId: product.id,
            productTypeId: product.productTypeId,
            plotSize: `${Math.ceil(Math.random() * 5)} acres`,
            numberOfPlots: Math.ceil(Math.random() * 3),
            numberOfTerms: 1,
            numberOfFarmers: Math.ceil(Math.random() * 5),
            amount: amount,
            expectedReturn: expectedReturn,
            progress: Math.floor(Math.random() * 100),
            status: i % 3 === 0 ? "COMPLETED" : "ACTIVE",
            totalCost: Math.round(amount * 0.8),
            estimatedRevenue: Math.round(expectedReturn * 1.1),
            adjustedRevenue: expectedReturn,
            netReturn: expectedReturn - amount,
            roiPercent: ((expectedReturn - amount) / amount) * 100,
            roiPerDay: 0.5 + Math.random() * 0.5,
            adjustedYield: 1.0 + Math.random() * 0.5,
            effectiveDaysToHarvest: 60 + Math.floor(Math.random() * 90),
            estimatedHarvestQuantity: estimatedHarvestQuantity,
            createdBy: user.id,
          },
        });
        createdInvestments.push(investment);
      }

      console.log(`✅ Created ${createdInvestments.length} sample investments for marketplace`);
    }

    // Get all completed investments to create listings from
    const completedInvestments = await prisma.investment.findMany({
      where: {
        status: "COMPLETED",
      },
      include: {
        product: {
          include: {
            ProductType: true,
          },
        },
        user: true,
      },
      take: 20,
    });

    if (completedInvestments.length === 0) {
      console.log("⚠️  No completed investments found. Creating sample listings with available investments...");
      
      // Get any investments for demo purposes
      const anyInvestments = await prisma.investment.findMany({
        include: {
          product: {
            include: {
              ProductType: true,
            },
          },
          user: true,
        },
        take: 10,
      });

      for (const investment of anyInvestments) {
        if (!investment.product || !investment.user) continue;

        const basePrice = investment.expectedReturn || 5000;
        const estimatedQuantity = investment.estimatedHarvestQuantity || 100;
        const pricePerKg = Math.round((basePrice / estimatedQuantity) * (0.8 + Math.random() * 0.4));
        const quantityKg = Math.round(estimatedQuantity * (0.5 + Math.random() * 0.5));
        const totalValue = pricePerKg * quantityKg;

        await prisma.marketplaceListing.upsert({
          where: {
            investmentId: investment.id,
          },
          update: {},
          create: {
            investmentId: investment.id,
            productId: investment.productId,
            quantityKg: quantityKg,
            pricePerKg: pricePerKg,
            totalValue: totalValue,
            status: Math.random() > 0.3 ? "ACTIVE" : "PENDING",
            isNegotiable: Math.random() > 0.5,
            harvestDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            expiryDate: new Date(Date.now() + (30 + Math.random() * 60) * 24 * 60 * 60 * 1000),
            marketRating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
            description: `Fresh ${investment.product.name} harvested from our farm. High quality produce ready for immediate delivery. Grown using sustainable farming practices.`,
          },
        });
      }

      console.log(`✅ Created ${anyInvestments.length} marketplace listings from investments`);
    } else {
      // Create listings from completed investments
      for (const investment of completedInvestments) {
        if (!investment.product || !investment.user) continue;

        const basePrice = investment.expectedReturn || 5000;
        const estimatedQuantity = investment.estimatedHarvestQuantity || 100;
        const pricePerKg = Math.round((basePrice / estimatedQuantity) * (0.8 + Math.random() * 0.4));
        const quantityKg = Math.round(estimatedQuantity * (0.5 + Math.random() * 0.5));
        const totalValue = pricePerKg * quantityKg;

        await prisma.marketplaceListing.upsert({
          where: {
            investmentId: investment.id,
          },
          update: {},
          create: {
            investmentId: investment.id,
            productId: investment.productId,
            quantityKg: quantityKg,
            pricePerKg: pricePerKg,
            totalValue: totalValue,
            status: "ACTIVE",
            isNegotiable: Math.random() > 0.5,
            harvestDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
            expiryDate: new Date(Date.now() + (30 + Math.random() * 60) * 24 * 60 * 60 * 1000),
            marketRating: parseFloat((3.5 + Math.random() * 1.5).toFixed(1)),
            description: `Premium quality ${investment.product.name} from completed harvest. Fresh and ready for delivery.`,
          },
        });
      }

      console.log(`✅ Created ${completedInvestments.length} marketplace listings`);
    }

    // Verify listings were created
    const totalListings = await prisma.marketplaceListing.count();
    console.log(`📊 Total marketplace listings in database: ${totalListings}`);

    if (totalListings === 0) {
      console.log("⚠️  Warning: No marketplace listings were created. Please check if investments and products exist.");
      return;
    }

    // Create some sample orders
    const listings = await prisma.marketplaceListing.findMany({
      where: {
        status: "ACTIVE",
      },
      take: 5,
    });

    const buyers = await prisma.user.findMany({
      where: {
        roles: {
          some: {
            role: {
              name: "CUSTOMER",
            },
          },
        },
      },
      take: 3,
    });

    if (buyers.length > 0 && listings.length > 0) {
      console.log(`📦 Creating sample orders with multiple items...`);
      
      for (let i = 0; i < Math.min(2, Math.floor(listings.length / 2)); i++) {
        const isAnonymous = Math.random() > 0.5;
        const buyer = isAnonymous ? null : buyers[i % buyers.length];
        
        // Select 1-3 random listings for this order
        const numItems = Math.min(1 + Math.floor(Math.random() * 3), listings.length);
        const orderListings = [];
        const usedIndices = new Set();
        
        while (orderListings.length < numItems) {
          const randomIndex = Math.floor(Math.random() * listings.length);
          if (!usedIndices.has(randomIndex)) {
            usedIndices.add(randomIndex);
            orderListings.push(listings[randomIndex]);
          }
        }
        
        let totalAmount = 0;
        const orderItemsData = [];
        
        for (const listing of orderListings) {
          const quantityKg = Math.min(
            Math.round(listing.quantityKg * (0.2 + Math.random() * 0.3)),
            listing.quantityKg
          );
          const subtotal = quantityKg * listing.pricePerKg;
          totalAmount += subtotal;
          
          orderItemsData.push({
            listingId: listing.id,
            quantityKg,
            pricePerKg: listing.pricePerKg,
            subtotal,
          });
        }

        // Create order with order items
        const order = await prisma.order.create({
          data: {
            buyerId: buyer?.id,
            totalAmount,
            status: ["PENDING", "CONFIRMED", "DELIVERED"][Math.floor(Math.random() * 3)] as any,
            paymentStatus: Math.random() > 0.3 ? "PAID" : "PENDING",
            deliveryAddress: `${Math.floor(Math.random() * 999) + 1} Farm Road, Lagos, Nigeria`,
            customerName: isAnonymous ? `Anonymous Customer ${i + 1}` : undefined,
            customerEmail: isAnonymous ? `customer${i + 1}@example.com` : undefined,
            customerPhone: isAnonymous ? `+234${Math.floor(Math.random() * 9000000000) + 1000000000}` : undefined,
            notes: "Please deliver fresh produce. Call before delivery.",
          },
        });

        // Create order items
        for (const itemData of orderItemsData) {
          await prisma.orderItem.create({
            data: {
              orderId: order.id,
              ...itemData,
            },
          });
        }
      }

      console.log(`✅ Created sample orders with multiple items (including anonymous buyers)`);
    }

    console.log("✅ Marketplace seeding completed!");
  } catch (error) {
    console.error("❌ Error seeding marketplace:", error);
    throw error;
  }
}
