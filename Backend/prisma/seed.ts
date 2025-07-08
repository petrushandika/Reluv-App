// import { PrismaClient, UserRole, Condition } from '@prisma/client';

// const prisma = new PrismaClient();

// async function cleanup() {
//   console.log('🧹 Cleaning up the database...');
//   await prisma.orderItem.deleteMany();
//   await prisma.cartItem.deleteMany();
//   await prisma.review.deleteMany();
//   await prisma.wishlist.deleteMany();
//   await prisma.notification.deleteMany();
//   await prisma.payment.deleteMany();
//   await prisma.shipment.deleteMany();
//   await prisma.order.deleteMany();
//   await prisma.variant.deleteMany();
//   await prisma.product.deleteMany();
//   await prisma.profile.deleteMany();
//   await prisma.store.deleteMany();
//   await prisma.location.deleteMany();
//   await prisma.cart.deleteMany();
//   await prisma.category.deleteMany();
//   await prisma.user.deleteMany();
//   await prisma.shippingRate.deleteMany();
//   console.log('✅ Database cleaned.');
// }

// async function main() {
//   console.log(`🚀 Starting to seed...`);

//   try {
//     await cleanup();

//     const user1 = await prisma.user.create({
//       data: {
//         email: 'john.doe@example.com',
//         firstName: 'John',
//         lastName: 'Doe',
//         password: 'password123',
//         role: UserRole.USER,
//         isVerified: true,
//       },
//     });

//     const user2 = await prisma.user.create({
//       data: {
//         email: 'jane.smith@example.com',
//         firstName: 'Jane',
//         lastName: 'Smith',
//         password: 'password123',
//         role: UserRole.USER,
//         isVerified: true,
//       },
//     });

//     const adminUser = await prisma.user.create({
//       data: {
//         email: 'admin@example.com',
//         firstName: 'Admin',
//         lastName: 'User',
//         password: 'adminpassword',
//         role: UserRole.ADMIN,
//         isVerified: true,
//       },
//     });

//     console.log(
//       `👤 Created users: ${user1.firstName}, ${user2.firstName}, and ${adminUser.firstName}`,
//     );

//     const parentCategory = await prisma.category.create({
//       data: {
//         name: 'Fashion',
//         slug: 'fashion',
//         childCategories: {
//           create: [
//             { name: "Men's Clothing", slug: 'mens-clothing' },
//             { name: "Women's Clothing", slug: 'womens-clothing' },
//           ],
//         },
//       },
//       include: { childCategories: true },
//     });

//     const electronicsCategory = await prisma.category.create({
//       data: { name: 'Electronics', slug: 'electronics' },
//     });

//     console.log(
//       `📚 Created categories: ${parentCategory.name} and ${electronicsCategory.name}`,
//     );

//     const user2Location = await prisma.location.create({
//       data: {
//         userId: user2.id,
//         label: "Jane's Home",
//         recipient: 'Jane Smith',
//         phone: '089876543210',
//         province: 'Banten',
//         city: 'South Tangerang',
//         district: 'Serpong',
//         subDistrict: 'BSD',
//         postalCode: '15310',
//         address: 'Jl. Boulevard BSD No. 42',
//         isDefault: true,
//       },
//     });

//     const store1Location = await prisma.location.create({
//       data: {
//         label: "John's Store Warehouse",
//         recipient: 'John Store',
//         phone: '081234567891',
//         province: 'West Java',
//         city: 'Bandung',
//         district: 'Sukajadi',
//         subDistrict: 'Pasteur',
//         postalCode: '40161',
//         address: 'Jl. Dr. Djunjunan No. 169',
//         isDefault: true,
//       },
//     });

//     console.log(`📍 Created user and store locations.`);

//     const store1 = await prisma.store.create({
//       data: {
//         name: "John's Preloved Goods",
//         slug: 'johns-preloved-goods',
//         isVerified: true,
//         user: {
//           connect: {
//             id: user1.id,
//           },
//         },
//         location: {
//           connect: {
//             id: store1Location.id,
//           },
//         },
//       },
//     });

//     const store2 = await prisma.store.create({
//       data: {
//         name: "Jane's Corner",
//         slug: 'janes-corner',
//         isVerified: true,
//         user: {
//           connect: {
//             id: user2.id,
//           },
//         },
//       },
//     });

//     console.log(`🏪 Created stores: ${store1.name} and ${store2.name}`);

//     await prisma.profile.create({
//       data: {
//         userId: user1.id,
//         storeId: store1.id,
//         bio: 'Selling quality preloved goods.',
//         avatar: 'https://i.pravatar.cc/150?u=john.doe',
//       },
//     });

//     await prisma.profile.create({
//       data: {
//         userId: user2.id,
//         storeId: store2.id,
//         bio: "The best collection for women's fashion.",
//         avatar: 'https://i.pravatar.cc/150?u=jane.smith',
//       },
//     });

//     console.log(`👨‍💼 Created profiles for store owners.`);

//     const product1 = await prisma.product.create({
//       data: {
//         name: 'Preloved Flannel Shirt',
//         slug: 'preloved-flannel-shirt-01',
//         description: 'Preloved flannel shirt in like-new condition. Size L.',
//         images: ['/images/flanel1.jpg', '/images/flanel2.jpg'],
//         isPreloved: true,
//         sellerId: user1.id,
//         categoryId: parentCategory.childCategories[0].id,
//         storeId: store1.id,
//         variants: {
//           create: {
//             price: 120000,
//             compareAtPrice: 250000,
//             stock: 1,
//             condition: Condition.LIKE_NEW,
//             conditionNote: 'Only worn twice.',
//             sku: 'SKU-FLANNEL-01',
//           },
//         },
//       },
//       include: { variants: true },
//     });

//     const product2 = await prisma.product.create({
//       data: {
//         name: 'Vintage Evening Gown',
//         slug: 'vintage-evening-gown-01',
//         description:
//           'Elegant vintage evening gown from the 80s. Good condition.',
//         images: ['/images/dress1.jpg'],
//         isPreloved: true,
//         sellerId: user2.id,
//         categoryId: parentCategory.childCategories[1].id,
//         storeId: store2.id,
//         variants: {
//           create: {
//             price: 350000,
//             stock: 1,
//             condition: Condition.GOOD,
//             conditionNote: "There's a small, faint stain on the bottom.",
//             sku: 'SKU-DRESS-01',
//           },
//         },
//       },
//       include: { variants: true },
//     });

//     const product3 = await prisma.product.create({
//       data: {
//         name: 'New Gaming Headphones',
//         slug: 'new-gaming-headphones-01',
//         description:
//           'New, sealed gaming headphones. Clear sound and great bass.',
//         images: ['/images/headphone1.jpg'],
//         isPreloved: false,
//         sellerId: user1.id,
//         categoryId: electronicsCategory.id,
//         storeId: store1.id,
//         variants: {
//           create: {
//             price: 450000,
//             stock: 10,
//             condition: Condition.NEW,
//             sku: 'SKU-HEADPHONE-01',
//           },
//         },
//       },
//       include: { variants: true },
//     });

//     console.log(
//       `📦 Created products: "${product1.name}", "${product2.name}", and "${product3.name}"`,
//     );

//     await prisma.review.create({
//       data: {
//         rating: 5,
//         comment: 'The item is great, matches the description. Friendly seller!',
//         productId: product1.id,
//         authorId: user2.id,
//       },
//     });

//     console.log(`⭐ Created a review.`);

//     await prisma.cart.create({
//       data: {
//         userId: user2.id,
//         items: {
//           create: {
//             variantId: product3.variants[0].id,
//             quantity: 1,
//           },
//         },
//       },
//     });

//     console.log(`🛒 Created a cart for ${user2.firstName}.`);

//     await prisma.wishlist.create({
//       data: {
//         userId: user1.id,
//         productId: product2.id,
//       },
//     });

//     console.log(`❤️ Added an item to ${user1.firstName}'s wishlist.`);

//     const order1 = await prisma.order.create({
//       data: {
//         orderNumber: `ORD-${Date.now()}`,
//         totalAmount: 129000,
//         itemsAmount: 120000,
//         shippingCost: 9000,
//         status: 'PAID',
//         buyerId: user2.id,
//         locationId: user2Location.id,
//         items: {
//           create: {
//             variantId: product1.variants[0].id,
//             quantity: 1,
//             price: product1.variants[0].price,
//             total: product1.variants[0].price * 1,
//           },
//         },
//         payment: {
//           create: {
//             amount: 129000,
//             status: 'PAID',
//             method: 'BCA Virtual Account',
//             midtrans_order_id: `midtrans-${Date.now()}`,
//             paidAt: new Date(),
//           },
//         },
//         shipment: {
//           create: {
//             courier: 'JNE',
//             service: 'REG',
//             status: 'IN_TRANSIT',
//             trackingNumber: `JNE${Date.now()}`,
//           },
//         },
//       },
//     });

//     console.log(`🧾 Created a complete order: ${order1.orderNumber}`);
//     console.log(`\nSeeding finished successfully. ✅`);
//   } catch (e) {
//     console.error('An error occurred during seeding:', e);
//     process.exit(1);
//   } finally {
//     console.log('🔌 Disconnecting Prisma Client...');
//     await prisma.$disconnect();
//   }
// }

// main();
