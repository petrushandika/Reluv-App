// import {
//   PrismaClient,
//   UserRole,
//   Condition,
//   User,
//   Category,
// } from '@prisma/client';
// import * as bcrypt from 'bcrypt';
// import * as fs from 'fs';
// import * as path from 'path';

// function loadJsonData<T>(filename: string): T {
//   const jsonPath = path.join(__dirname, 'data', filename);
//   const fileContent = fs.readFileSync(jsonPath, 'utf-8');
//   return JSON.parse(fileContent) as T;
// }

// interface UserSeed {
//   email: string;
//   firstName: string;
//   lastName: string;
//   password: string;
//   phone: string;
//   role: keyof typeof UserRole;
//   isVerified: boolean;
//   profileBio: string;
// }

// interface CategorySeed {
//   name: string;
//   slug: string;
//   children: { name: string; slug: string }[];
// }

// interface StoreSeed {
//   name: string;
//   slug: string;
//   isVerified: boolean;
//   profile: { bio: string; banner: string };
// }

// interface LocationSeed {
//   ownerEmail: string;
//   label: string;
//   recipient: string;
//   phone: string;
//   province: string;
//   city: string;
//   district: string;
//   subDistrict: string;
//   postalCode: string;
//   address: string;
//   isDefault: boolean;
//   biteship_area_id: string;
// }

// interface ProductSeed {
//   name: string;
//   slug: string;
//   description: string;
//   isForMen: boolean;
//   images: string[];
// }

// const usersData = loadJsonData<UserSeed[]>('users.json');
// const categoriesData = loadJsonData<CategorySeed[]>('categories.json');
// const storeData = loadJsonData<StoreSeed>('store.json');
// const productSeedData = loadJsonData<ProductSeed[]>('products.json');
// const locationsData = loadJsonData<LocationSeed[]>('locations.json');

// const prisma = new PrismaClient();

// async function cleanup() {
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
//   await prisma.userProfile.deleteMany();
//   await prisma.storeProfile.deleteMany();
//   await prisma.store.deleteMany();
//   await prisma.location.deleteMany();
//   await prisma.cart.deleteMany();
//   await prisma.category.deleteMany();
//   await prisma.user.deleteMany();
//   await prisma.shippingRate.deleteMany();
// }

// async function main() {
//   try {
//     await cleanup();

//     const hashPassword = (pw: string) => bcrypt.hash(pw, 10);

//     console.log('Creating users from users.json...');
//     const createdUsers: User[] = [];
//     for (const userData of usersData) {
//       const user = await prisma.user.create({
//         data: {
//           email: userData.email,
//           firstName: userData.firstName,
//           lastName: userData.lastName,
//           password: await hashPassword(userData.password),
//           phone: userData.phone,
//           role: userData.role as UserRole,
//           isVerified: userData.isVerified,
//           profile: { create: { bio: userData.profileBio } },
//           cart: { create: {} },
//         },
//       });
//       createdUsers.push(user);
//       console.log(`👤 Created user: ${user.email}`);
//     }
//     const levinUser = createdUsers.find((u) => u.email === 'user@gmail.com');
//     if (!levinUser) throw new Error('Levin user not found in seed data.');

//     console.log('Creating categories from categories.json...');
//     type CategoryWithChildren = Category & { childCategories: Category[] };
//     const createdCategories: Record<string, CategoryWithChildren> = {};
//     for (const categoryData of categoriesData) {
//       const parent = await prisma.category.create({
//         data: {
//           name: categoryData.name,
//           slug: categoryData.slug,
//           childCategories: { create: categoryData.children },
//         },
//         include: { childCategories: true },
//       });
//       createdCategories[parent.slug] = parent;
//     }
//     const mensCategory = createdCategories['fashion'].childCategories.find(
//       (c) => c.slug === 'mens-fashion',
//     );
//     const womensCategory = createdCategories['fashion'].childCategories.find(
//       (c) => c.slug === 'womens-fashion',
//     );
//     if (!mensCategory || !womensCategory)
//       throw new Error('Could not find fashion child categories.');

//     console.log('Creating locations from locations.json...');
//     const createdLocations: Record<string, number> = {};
//     for (const locData of locationsData) {
//       const user = createdUsers.find((u) => u.email === locData.ownerEmail);
//       if (!user) {
//         console.warn(
//           `User with email ${locData.ownerEmail} not found for location. Skipping.`,
//         );
//         continue;
//       }
//       const location = await prisma.location.create({
//         data: {
//           label: locData.label,
//           recipient: locData.recipient,
//           phone: locData.phone,
//           province: locData.province,
//           city: locData.city,
//           district: locData.district,
//           subDistrict: locData.subDistrict,
//           postalCode: locData.postalCode,
//           address: locData.address,
//           isDefault: locData.isDefault,
//           biteship_area_id: locData.biteship_area_id,
//           user: { connect: { id: user.id } },
//         },
//       });
//       createdLocations[locData.label] = location.id;
//       console.log(
//         `📍 Created location: "${locData.label}" for ${locData.ownerEmail}`,
//       );
//     }
//     const levinShopLocationId = createdLocations['Kantor'];
//     if (!levinShopLocationId)
//       throw new Error("LevinShop's location ('Kantor') not found.");

//     console.log('Creating store from store.json...');
//     const levinStore = await prisma.store.create({
//       data: {
//         name: storeData.name,
//         slug: storeData.slug,
//         isVerified: storeData.isVerified,
//         user: { connect: { id: levinUser.id } },
//         location: { connect: { id: levinShopLocationId } },
//         profile: { create: storeData.profile },
//       },
//     });
//     console.log(`🏪 Created store: ${levinStore.name}.`);

//     console.log('Creating products from product.json...');
//     for (const product of productSeedData) {
//       const categoryId = product.isForMen ? mensCategory.id : womensCategory.id;
//       await prisma.product.create({
//         data: {
//           name: product.name,
//           slug: product.slug,
//           description: product.description,
//           images: product.images,
//           weight: 400,
//           length: 30,
//           width: 25,
//           height: 5,
//           seller: { connect: { id: levinUser.id } },
//           category: { connect: { id: categoryId } },
//           store: { connect: { id: levinStore.id } },
//           variants: {
//             create: { price: 299000, stock: 20, condition: Condition.NEW },
//           },
//         },
//       });
//       console.log(`📦 Created product: "${product.name}"`);
//     }
//   } catch (e) {
//     if (e instanceof Error) {
//       console.error('An error occurred during seeding:', e.message);
//     } else {
//       console.error('An unknown error occurred during seeding:', e);
//     }
//     process.exit(1);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// main();
