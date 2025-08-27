import {
  PrismaClient,
  UserRole,
  Condition,
  User,
  Category,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';

function loadJsonData<T>(filename: string): T {
  const jsonPath = path.join(__dirname, 'data', filename);
  const fileContent = fs.readFileSync(jsonPath, 'utf-8');
  return JSON.parse(fileContent) as T;
}

interface LocationSeed {
  ownerEmail: string;
  label: string;
  recipient: string;
  phone: string;
  province: string;
  city: string;
  district: string;
  subDistrict: string;
  postalCode: string;
  address: string;
  isDefault: boolean;
  biteship_area_id: string;
}

interface UserSeed {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phone: string;
  role: keyof typeof UserRole;
  isVerified: boolean;
  profileBio: string;
}

interface CategorySeed {
  name: string;
  slug: string;
  children: { name: string; slug: string }[];
}

interface StoreSeed {
  name: string;
  slug: string;
  isVerified: boolean;
  profile: { bio: string; banner: string };
  location: {
    label: string;
    recipient: string;
    phone: string;
    province: string;
    city: string;
    district: string;
    subDistrict: string;
    postalCode: string;
    address: string;
    biteship_area_id: string;
  };
}

interface VariantData {
  name: string;
  price: number;
  stock: number;
  condition: keyof typeof Condition;
  weight: number;
  length: number;
  width: number;
  height: number;
}

interface VariantsSeed {
  key: string;
  variants: VariantData[];
}

interface ProductSeed {
  name: string;
  slug: string;
  description: string;
  isForMen: boolean;
  images: string[];
  variantsKey: string;
}

const usersData = loadJsonData<UserSeed[]>('users.json');
const categoriesData = loadJsonData<CategorySeed[]>('categories.json');
const storeData = loadJsonData<StoreSeed>('store.json');
const productSeedData = loadJsonData<ProductSeed[]>('products.json');
const variantsData = loadJsonData<VariantsSeed[]>('variants.json');
const locationsData = loadJsonData<LocationSeed[]>('locations.json');

const prisma = new PrismaClient();

async function cleanup() {
  await prisma.orderItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.variant.deleteMany();
  await prisma.product.deleteMany();
  await prisma.userProfile.deleteMany();
  await prisma.storeProfile.deleteMany();
  await prisma.store.deleteMany();
  await prisma.location.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.shippingRate.deleteMany();
}

async function main() {
  console.log(`🚀 Starting to seed...`);
  try {
    await cleanup();
    console.log('✅ Database cleaned.');

    const hashPassword = (pw: string) => bcrypt.hash(pw, 10);

    console.log('Creating users from users.json...');
    const createdUsers: User[] = [];
    for (const userData of usersData) {
      const user = await prisma.user.create({
        data: {
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          password: await hashPassword(userData.password),
          phone: userData.phone,
          role: userData.role as UserRole,
          isVerified: userData.isVerified,
          profile: { create: { bio: userData.profileBio } },
          cart: { create: {} },
        },
      });

      const userLocations = locationsData.filter(
        (loc) => loc.ownerEmail === userData.email,
      );
      if (userLocations.length > 0) {
        // <<< PERBAIKAN FINAL DI SINI
        const locationsToCreate = userLocations.map((loc) => ({
          label: loc.label,
          recipient: loc.recipient,
          phone: loc.phone,
          province: loc.province,
          city: loc.city,
          district: loc.district,
          subDistrict: loc.subDistrict,
          postalCode: loc.postalCode,
          address: loc.address,
          isDefault: loc.isDefault,
          biteship_area_id: loc.biteship_area_id,
          userId: user.id,
        }));

        await prisma.location.createMany({
          data: locationsToCreate,
        });
        // <<< AKHIR PERBAIKAN FINAL

        console.log(
          `📍 Created ${userLocations.length} locations for ${user.email}`,
        );
      }

      createdUsers.push(user);
    }
    const sellerUser = createdUsers.find((u) => u.email === 'user@gmail.com');
    if (!sellerUser)
      throw new Error('Seller user (user@gmail.com) not found in seed data.');

    console.log('Creating categories from categories.json...');
    type CategoryWithChildren = Category & { childCategories: Category[] };
    const createdCategories: Record<string, CategoryWithChildren> = {};
    for (const categoryData of categoriesData) {
      const parent = await prisma.category.create({
        data: {
          name: categoryData.name,
          slug: categoryData.slug,
          childCategories: { create: categoryData.children },
        },
        include: { childCategories: true },
      });
      createdCategories[parent.slug] = parent;
    }
    const mensCategory = createdCategories['fashion'].childCategories.find(
      (c) => c.slug === 'mens-fashion',
    );
    const womensCategory = createdCategories['fashion'].childCategories.find(
      (c) => c.slug === 'womens-fashion',
    );
    if (!mensCategory || !womensCategory)
      throw new Error('Could not find fashion child categories.');

    console.log('Creating store from store.json...');
    const levinShopLocation = await prisma.location.create({
      data: storeData.location,
    });
    const levinStore = await prisma.store.create({
      data: {
        name: storeData.name,
        slug: storeData.slug,
        isVerified: storeData.isVerified,
        user: { connect: { id: sellerUser.id } },
        location: { connect: { id: levinShopLocation.id } },
        profile: { create: storeData.profile },
      },
    });
    console.log(`🏪 Created store: ${levinStore.name}.`);

    console.log('Creating products and variants from JSON files...');
    for (const product of productSeedData) {
      const categoryId = product.isForMen ? mensCategory.id : womensCategory.id;

      const variantsToCreate = variantsData.find(
        (v) => v.key === product.variantsKey,
      )?.variants;
      if (!variantsToCreate) {
        console.warn(
          `Variants for key '${product.variantsKey}' not found. Skipping product "${product.name}".`,
        );
        continue;
      }

      await prisma.product.create({
        data: {
          name: product.name,
          slug: product.slug,
          description: product.description,
          images: product.images,
          seller: { connect: { id: sellerUser.id } },
          category: { connect: { id: categoryId } },
          store: { connect: { id: levinStore.id } },
          variants: {
            create: variantsToCreate.map((v) => ({
              ...v,
              condition: v.condition as Condition,
            })),
          },
        },
      });
      console.log(
        `📦 Created product: "${product.name}" with ${variantsToCreate.length} variants.`,
      );
    }

    console.log('\nSeeding finished successfully. ✅');
  } catch (e) {
    if (e instanceof Error) {
      console.error('An error occurred during seeding:', e.message);
    } else {
      console.error('An unknown error occurred during seeding:', e);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
