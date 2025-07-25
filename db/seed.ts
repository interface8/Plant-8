// import "dotenv/config";
// import prisma from "./prisma";
// import bcrypt from "bcryptjs";
// import crypto from "crypto";

// async function main() {
//   try {
//     // Seed Roles
//     const roles = await prisma.role.createMany({
//       data: [{ name: "USER" }, { name: "ADMIN" }],
//       skipDuplicates: true,
//     });
//     console.log(`Seeded ${roles.count} roles (USER, ADMIN)`);
//   } catch (error) {
//     console.error("Failed to seed roles:", error);
//     throw error;
//   }

//   try {
//     // Seed Address Types
//     const addresstype = await prisma.addressType.createMany({
//       data: [
//         { id: crypto.randomUUID(), name: "Home" },
//         { id: crypto.randomUUID(), name: "Work" },
//         { id: crypto.randomUUID(), name: "Other" },
//       ],
//       skipDuplicates: true,
//     });
//     console.log(`Seeded ${addresstype.count} addresstype (Home, Work, Others)`);
//   } catch (error) {
//     console.error("Failed to seed addresstype:", error);
//     throw error;
//   }

//   try {
//     // Seed ProductTypes - Step 1: Create or Fetch Durations and Classes
//     const threeMonthsId = crypto.randomUUID();
//     const sixMonthsId = crypto.randomUUID();
//     const oneYearId = crypto.randomUUID();
//     let cropId: string;
//     let livestockId: string;

//     // Check if Crop and Livestock exist, create if not
//     const existingCrop = await prisma.productType.findFirst({
//       where: { name: "Crop", category: "Class" },
//     });
//     if (existingCrop) {
//       cropId = existingCrop.id;
//     } else {
//       cropId = crypto.randomUUID();
//       await prisma.productType.create({
//         data: {
//           id: cropId,
//           name: "Crop",
//           category: "Class",
//           description: "Crop investments",
//         },
//       });
//     }

//     const existingLivestock = await prisma.productType.findFirst({
//       where: { name: "Livestock", category: "Class" },
//     });
//     if (existingLivestock) {
//       livestockId = existingLivestock.id;
//     } else {
//       livestockId = crypto.randomUUID();
//       await prisma.productType.create({
//         data: {
//           id: livestockId,
//           name: "Livestock",
//           category: "Class",
//           description: "Livestock investments",
//         },
//       });
//     }

//     // Create durations
//     await prisma.productType.createMany({
//       data: [
//         {
//           id: threeMonthsId,
//           name: "3 months",
//           category: "Duration",
//           description: "Short-term investment",
//         },
//         {
//           id: sixMonthsId,
//           name: "6 months",
//           category: "Duration",
//           description: "Mid-term investment",
//         },
//         {
//           id: oneYearId,
//           name: "1 year",
//           category: "Duration",
//           description: "Long-term investment",
//         },
//       ],
//       skipDuplicates: true,
//     });
//     console.log(`Seeded durations and classes`);

//     // Step 2: Create Categories
//     const cerealsId = crypto.randomUUID();
//     const tubersId = crypto.randomUUID();
//     const vegetablesId = crypto.randomUUID();
//     const legumesId = crypto.randomUUID();
//     const fruitsId = crypto.randomUUID();
//     const spicesId = crypto.randomUUID();
//     const ruminantsId = crypto.randomUUID();
//     const poultryId = crypto.randomUUID();

//     await prisma.productType.createMany({
//       data: [
//         // Crop Categories
//         {
//           id: cerealsId,
//           name: "Cereals",
//           category: "Category",
//           prevId: cropId,
//           description: "Grain crops cultivated for food",
//         },
//         {
//           id: tubersId,
//           name: "Tubers",
//           category: "Category",
//           prevId: cropId,
//           description: "Crops grown for their underground storage organs",
//         },
//         {
//           id: vegetablesId,
//           name: "Vegetables",
//           category: "Category",
//           prevId: cropId,
//           description: "Leafy, fruiting, or root vegetables",
//         },
//         {
//           id: legumesId,
//           name: "Legumes",
//           category: "Category",
//           prevId: cropId,
//           description: "Protein-rich crops with nitrogen-fixing capabilities",
//         },
//         {
//           id: fruitsId,
//           name: "Fruits",
//           category: "Category",
//           prevId: cropId,
//           description: "Edible reproductive parts of flowering plants",
//         },
//         {
//           id: spicesId,
//           name: "Spice Crops",
//           category: "Category",
//           prevId: cropId,
//           description: "Used for flavoring, coloring, or preserving food",
//         },
//         // Livestock Categories
//         {
//           id: ruminantsId,
//           name: "Ruminants",
//           category: "Category",
//           prevId: livestockId,
//           description: "Animals with multi-chambered stomachs",
//         },
//         {
//           id: poultryId,
//           name: "Poultry",
//           category: "Category",
//           prevId: livestockId,
//           description: "Domesticated birds raised for meat or eggs",
//         },
//       ],
//       skipDuplicates: true,
//     });
//     console.log(`Seeded categories`);

//     // Step 3: Create Crops and Livestock
//     const productTypes = await prisma.productType.createMany({
//       data: [
//         // Crops
//         {
//           id: crypto.randomUUID(),
//           name: "Maize",
//           category: "Crop",
//           prevId: cerealsId,
//           durationId: threeMonthsId,
//           growthDuration: "3 months",
//           expectedReturnRate: 0.2,
//           description: "Maize crop, also known as Zea mays",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Rice",
//           category: "Crop",
//           prevId: cerealsId,
//           durationId: sixMonthsId,
//           growthDuration: "6 months",
//           expectedReturnRate: 0.18,
//           description: "Known as Oryza spp, a staple cereal crop",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Sorghum",
//           category: "Crop",
//           prevId: cerealsId,
//           durationId: sixMonthsId,
//           growthDuration: "6 months",
//           expectedReturnRate: 0.15,
//           description: "Drought-resistant cereal crop",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Wheat",
//           category: "Crop",
//           prevId: cerealsId,
//           durationId: sixMonthsId,
//           growthDuration: "6 months",
//           expectedReturnRate: 0.15,
//           description: "Triticum aestivum, a versatile grain",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Millet",
//           category: "Crop",
//           prevId: cerealsId,
//           durationId: threeMonthsId,
//           growthDuration: "3 months",
//           expectedReturnRate: 0.2,
//           description: "Small-seeded grasses cultivated as cereal crops",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Cassava",
//           category: "Crop",
//           prevId: tubersId,
//           durationId: sixMonthsId,
//           growthDuration: "6 months",
//           expectedReturnRate: 0.18,
//           description: "Manihot esculenta, starchy tuber crop",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Yam",
//           category: "Crop",
//           prevId: tubersId,
//           durationId: oneYearId,
//           growthDuration: "12 months",
//           expectedReturnRate: 0.22,
//           description: "Dioscorea spp, starchy tuber crop",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Sweet Potato",
//           category: "Crop",
//           prevId: tubersId,
//           durationId: sixMonthsId,
//           growthDuration: "6 months",
//           expectedReturnRate: 0.18,
//           description: "Ipomoea batatas, nutritious root crop",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Irish Potato",
//           category: "Crop",
//           prevId: tubersId,
//           durationId: threeMonthsId,
//           growthDuration: "3 months",
//           expectedReturnRate: 0.2,
//           description: "Solanum tuberosum, edible tuber",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Tomato",
//           category: "Crop",
//           prevId: vegetablesId,
//           durationId: threeMonthsId,
//           growthDuration: "3 months",
//           expectedReturnRate: 0.22,
//           description: "Lycopersicon esculentum, juicy fruit vegetable",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Pepper",
//           category: "Crop",
//           prevId: vegetablesId,
//           durationId: threeMonthsId,
//           growthDuration: "3 months",
//           expectedReturnRate: 0.21,
//           description: "Hot and sweet pepper variants",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Carrot",
//           category: "Crop",
//           prevId: vegetablesId,
//           durationId: threeMonthsId,
//           growthDuration: "3 months",
//           expectedReturnRate: 0.2,
//           description: "Root vegetable, typically orange",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Okra",
//           category: "Crop",
//           prevId: vegetablesId,
//           description: "Abelmoschus esculentum, edible seed pods",
//           durationId: threeMonthsId,
//           growthDuration: "3 months",
//           expectedReturnRate: 0.19,
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Lettuce",
//           category: "Crop",
//           prevId: vegetablesId,
//           durationId: threeMonthsId,
//           growthDuration: "3 months",
//           expectedReturnRate: 0.18,
//           description: "Leafy vegetable used in salads",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Cucumber",
//           category: "Crop",
//           prevId: vegetablesId,
//           durationId: threeMonthsId,
//           growthDuration: "3 months",
//           expectedReturnRate: 0.2,
//           description: "Edible fruit of Cucumis sativus",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Cowpea",
//           category: "Crop",
//           prevId: legumesId,
//           durationId: threeMonthsId,
//           growthDuration: "3 months",
//           expectedReturnRate: 0.19,
//           description: "Vigna unguiculata, black-eyed pea",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Soybean",
//           category: "Crop",
//           prevId: legumesId,
//           durationId: sixMonthsId,
//           growthDuration: "6 months",
//           expectedReturnRate: 0.17,
//           description: "High protein legume, Glycine max",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Groundnut",
//           category: "Crop",
//           prevId: legumesId,
//           durationId: threeMonthsId,
//           growthDuration: "3 months",
//           expectedReturnRate: 0.2,
//           description: "Oilseed legume, Arachis hypogaea",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Watermelon",
//           category: "Crop",
//           prevId: fruitsId,
//           durationId: threeMonthsId,
//           growthDuration: "3 months",
//           expectedReturnRate: 0.22,
//           description: "Citrullus lanatus, juicy red fruit",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Pineapple",
//           category: "Crop",
//           prevId: fruitsId,
//           durationId: sixMonthsId,
//           growthDuration: "6 months",
//           expectedReturnRate: 0.18,
//           description: "Ananas comosus, tropical fruit",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Banana",
//           category: "Crop",
//           prevId: fruitsId,
//           durationId: sixMonthsId,
//           growthDuration: "6 months",
//           expectedReturnRate: 0.19,
//           description: "Musa spp, edible tropical fruit",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Mango",
//           category: "Crop",
//           prevId: fruitsId,
//           durationId: oneYearId,
//           growthDuration: "12 months",
//           expectedReturnRate: 0.23,
//           description: "Mangifera indica, fleshy drupe fruit",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Onion",
//           category: "Crop",
//           prevId: spicesId,
//           durationId: threeMonthsId,
//           growthDuration: "3 months",
//           expectedReturnRate: 0.2,
//           description: "Allium cepa, bulb vegetable",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Garlic",
//           category: "Crop",
//           prevId: spicesId,
//           durationId: threeMonthsId,
//           growthDuration: "3 months",
//           expectedReturnRate: 0.19,
//           description: "Allium sativum, aromatic herb",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Ginger",
//           category: "Crop",
//           prevId: spicesId,
//           durationId: sixMonthsId,
//           growthDuration: "6 months",
//           expectedReturnRate: 0.18,
//           description: "Zingiber officinale, medicinal spice",
//         },
//         // Livestock
//         {
//           id: crypto.randomUUID(),
//           name: "Cattle",
//           category: "Livestock",
//           prevId: ruminantsId,
//           durationId: oneYearId,
//           growthDuration: "12 months",
//           expectedReturnRate: 0.25,
//           description: "Beef or dairy cattle",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Goats",
//           category: "Livestock",
//           prevId: ruminantsId,
//           durationId: sixMonthsId,
//           growthDuration: "6 months",
//           expectedReturnRate: 0.22,
//           description: "Goats for milk or meat",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Chickens",
//           category: "Livestock",
//           prevId: poultryId,
//           durationId: threeMonthsId,
//           growthDuration: "3 months",
//           expectedReturnRate: 0.2,
//           description: "Poultry for eggs or meat",
//         },
//         {
//           id: crypto.randomUUID(),
//           name: "Turkeys",
//           category: "Livestock",
//           prevId: poultryId,
//           durationId: sixMonthsId,
//           growthDuration: "6 months",
//           expectedReturnRate: 0.18,
//           description: "Poultry for meat",
//         },
//       ],
//       skipDuplicates: true,
//     });
//     console.log(`Seeded ${productTypes.count} crops and livestock`);

//     // Seed Products
//     const productData = [
//       {
//         name: "Maize Grain",
//         description: "High-quality maize",
//         imageUrl: "/images/maize.jpg",
//         price: 2.5,
//         type: "Maize",
//       },
//       {
//         name: "Rice Grain",
//         description: "Premium rice",
//         imageUrl: "/images/rice.jpg",
//         price: 3.0,
//         type: "Rice",
//       },
//       {
//         name: "Sorghum Grain",
//         description: "Drought-resistant grain",
//         imageUrl: "/images/sorghum.jpg",
//         price: 2.8,
//         type: "Sorghum",
//       },
//       {
//         name: "Wheat Grain",
//         description: "Versatile wheat",
//         imageUrl: "/images/wheat.jpg",
//         price: 2.7,
//         type: "Wheat",
//       },
//       {
//         name: "Millet Grain",
//         description: "Nutritious millet",
//         imageUrl: "/images/millet.jpg",
//         price: 2.9,
//         type: "Millet",
//       },
//       {
//         name: "Cassava Root",
//         description: "Starchy cassava",
//         imageUrl: "/images/cassava.jpg",
//         price: 1.5,
//         type: "Cassava",
//       },
//       {
//         name: "Yam Tuber",
//         description: "Starchy yam",
//         imageUrl: "/images/yam.jpg",
//         price: 2.0,
//         type: "Yam",
//       },
//       {
//         name: "Sweet Potato",
//         description: "Nutritious sweet potato",
//         imageUrl: "/images/sweet-potato.jpg",
//         price: 1.8,
//         type: "Sweet Potato",
//       },
//       {
//         name: "Irish Potato",
//         description: "Edible potato",
//         imageUrl: "/images/irish-potato.jpg",
//         price: 2.0,
//         type: "Irish Potato",
//       },
//       {
//         name: "Tomato Fruit",
//         description: "Juicy tomatoes",
//         imageUrl: "/images/tomato.jpg",
//         price: 3.5,
//         type: "Tomato",
//       },
//       {
//         name: "Pepper Pods",
//         description: "Hot and sweet peppers",
//         imageUrl: "/images/pepper.jpg",
//         price: 3.0,
//         type: "Pepper",
//       },
//       {
//         name: "Carrot Root",
//         description: "Orange carrots",
//         imageUrl: "/images/carrot.jpg",
//         price: 2.5,
//         type: "Carrot",
//       },
//       {
//         name: "Okra Pods",
//         description: "Edible okra pods",
//         imageUrl: "/images/okra.jpg",
//         price: 2.8,
//         type: "Okra",
//       },
//       {
//         name: "Lettuce Leaves",
//         description: "Fresh lettuce",
//         imageUrl: "/images/lettuce.jpg",
//         price: 2.0,
//         type: "Lettuce",
//       },
//       {
//         name: "Cucumber Fruit",
//         description: "Crisp cucumbers",
//         imageUrl: "/images/cucumber.jpg",
//         price: 2.5,
//         type: "Cucumber",
//       },
//       {
//         name: "Cowpea Seeds",
//         description: "Black-eyed peas",
//         imageUrl: "/images/cowpea.jpg",
//         price: 2.7,
//         type: "Cowpea",
//       },
//       {
//         name: "Soybean Seeds",
//         description: "High-protein soybeans",
//         imageUrl: "/images/soybean.jpg",
//         price: 3.0,
//         type: "Soybean",
//       },
//       {
//         name: "Groundnut Seeds",
//         description: "Oil-rich groundnuts",
//         imageUrl: "/images/groundnut.jpg",
//         price: 3.2,
//         type: "Groundnut",
//       },
//       {
//         name: "Watermelon Fruit",
//         description: "Juicy watermelon",
//         imageUrl: "/images/watermelon.jpg",
//         price: 1.5,
//         type: "Watermelon",
//       },
//       {
//         name: "Pineapple Fruit",
//         description: "Sweet pineapple",
//         imageUrl: "/images/pineapple.jpg",
//         price: 2.5,
//         type: "Pineapple",
//       },
//       {
//         name: "Banana Fruit",
//         description: "Tropical bananas",
//         imageUrl: "/images/banana.jpg",
//         price: 2.0,
//         type: "Banana",
//       },
//       {
//         name: "Mango Fruit",
//         description: "Fleshy mangoes",
//         imageUrl: "/images/mango.jpg",
//         price: 3.0,
//         type: "Mango",
//       },
//       {
//         name: "Onion Bulbs",
//         description: "Flavorful onions",
//         imageUrl: "/images/onion.jpg",
//         price: 2.5,
//         type: "Onion",
//       },
//       {
//         name: "Garlic Bulbs",
//         description: "Aromatic garlic",
//         imageUrl: "/images/garlic.jpg",
//         price: 3.5,
//         type: "Garlic",
//       },
//       {
//         name: "Ginger Root",
//         description: "Medicinal ginger",
//         imageUrl: "/images/ginger.jpg",
//         price: 4.0,
//         type: "Ginger",
//       },
//       {
//         name: "Beef Cattle",
//         description: "Premium beef cattle",
//         imageUrl: "/images/cattle.jpg",
//         price: 10.0,
//         type: "Cattle",
//       },
//       {
//         name: "Goat Meat",
//         description: "Organic goat meat",
//         imageUrl: "/images/goats.jpg",
//         price: 8.0,
//         type: "Goats",
//       },
//       {
//         name: "Chicken Meat",
//         description: "Fresh chicken",
//         imageUrl: "/images/chickens.jpg",
//         price: 5.0,
//         type: "Chickens",
//       },
//       {
//         name: "Turkey Meat",
//         description: "Lean turkey meat",
//         imageUrl: "/images/turkeys.jpg",
//         price: 6.0,
//         type: "Turkeys",
//       },
//     ];

//     for (const product of productData) {
//       const productType = await prisma.productType.findFirst({
//         where: { name: product.type },
//       });
//       if (productType) {
//         await prisma.product.create({
//           data: {
//             id: crypto.randomUUID(),
//             name: product.name,
//             description: product.description,
//             imageUrl: product.imageUrl,
//             currentMarketPricePerKg: product.price,
//             productTypeId: productType.id,
//             productClassId: productType.id,
//           },
//         });
//       } else {
//         console.warn(`ProductType not found for product: ${product.name}`);
//       }
//     }
//     console.log(`Seeded ${productData.length} products`);

//     // Seed Admin User
//     const adminId = "581b8e3d-8958-4133-8ce9-d0db66a37af4";
//     const adminRole = await prisma.role.findUnique({
//       where: { name: "ADMIN" },
//     });
//     if (!adminRole) throw new Error("ADMIN role not found");

//     const hashedAdminPassword = await bcrypt.hash("Qa12345678$", 12);
//     await prisma.user.upsert({
//       where: { id: adminId },
//       update: {},
//       create: {
//         id: adminId,
//         name: "Quadri",
//         email: "quadriayomiidey@gmail.com",
//         password: hashedAdminPassword,
//         createdBy: adminId,
//         roles: {
//           create: {
//             roleId: adminRole.id,
//             assignedBy: adminId,
//           },
//         },
//       },
//     });
//     console.log(`Seeded admin user: quadriayomiidey@gmail.com`);

//     // Seed Other Users
//     const userRole = await prisma.role.findUnique({ where: { name: "USER" } });
//     if (!userRole) throw new Error("USER role not found");

//     const users = [
//       {
//         name: "Mojisola",
//         email: "mojisola@mailinator.com",
//         password: "Mojisola@25",
//       },
//       {
//         name: "Uthman",
//         email: "giwauthman8@gmail.com",
//         password: "Interface8$",
//       },
//     ];
//     for (const userData of users) {
//       const hashedPassword = await bcrypt.hash(userData.password, 12);
//       await prisma.user.upsert({
//         where: { email: userData.email },
//         update: {},
//         create: {
//           id: crypto.randomUUID(),
//           name: userData.name,
//           email: userData.email,
//           password: hashedPassword,
//           createdBy: adminId,
//           roles: {
//             create: {
//               roleId: userRole.id,
//               assignedBy: adminId,
//             },
//           },
//         },
//       });
//     }
//     console.log(`Seeded users: ${users.map((u) => u.email).join(", ")}`);

//     // Seed Investments
//     const maizeId = (
//       await prisma.productType.findFirst({ where: { name: "Maize" } })
//     )?.id;
//     const cattleId = (
//       await prisma.productType.findFirst({ where: { name: "Cattle" } })
//     )?.id;
//     const maizeProductId = (
//       await prisma.product.findFirst({ where: { name: "Maize Grain" } })
//     )?.id;
//     const cattleProductId = (
//       await prisma.product.findFirst({ where: { name: "Beef Cattle" } })
//     )?.id;
//     const userId = (
//       await prisma.user.findFirst({
//         where: { email: "mojisola@mailinator.com" },
//       })
//     )?.id;

//     if (
//       !maizeId ||
//       !cattleId ||
//       !maizeProductId ||
//       !cattleProductId ||
//       !userId
//     ) {
//       throw new Error("Required records for investments not found");
//     }

//     const investments = await prisma.investment.createMany({
//       data: [
//         {
//           id: crypto.randomUUID(),
//           userId,
//           productId: maizeProductId,
//           productTypeId: maizeId,
//           amount: 1000.0,
//           expectedReturn: 1200.0,
//           progress: 50,
//           status: "ACTIVE",
//         },
//         {
//           id: crypto.randomUUID(),
//           userId,
//           productId: cattleProductId,
//           productTypeId: cattleId,
//           amount: 5000.0,
//           expectedReturn: 6250.0,
//           progress: 30,
//           status: "ACTIVE",
//         },
//       ],
//       skipDuplicates: true,
//     });
//     console.log(`Seeded ${investments.count} investments`);
//   } catch (error) {
//     console.error("Seeding error:", error);
//     throw error;
//   }
// }

// main()
//   .catch((e) => {
//     console.error("Seeding error:", e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//     console.log("Prisma client disconnected");
//   });
