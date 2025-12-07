import {
  PrismaClient,
  UserRole,
  Condition,
  User,
  Category,
  DiscountType,
  DiscountScope,
  PromotionType,
  BadgeType,
  VoucherType,
} from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config();

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
  children: CategorySeed[];
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
  categorySlug?: string;
  parentCategorySlug?: string;
  childCategorySlug?: string;
}

interface StoreSeedData {
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

interface VoucherSeed {
  code: string;
  name: string;
  description: string;
  type: string;
  value: number;
  maxDiscount: number | null;
  minPurchase: number;
  usageLimit: number;
  expiryMonths: number;
}

interface BadgeSeed {
  type: string;
  name: string;
  description: string;
  color: string;
  storeIndex: number;
}

interface PromotionSeed {
  name: string;
  type: string;
  description: string;
  discount: number;
  durationMonths: number;
  storeIndex: number;
}

interface DiscountSeed {
  name: string;
  description: string;
  type: string;
  value: number;
  maxDiscount: number;
  minPurchase: number;
  scope: string;
  usageLimit: number;
  durationMonths?: number;
  durationDays?: number;
  storeIndex?: number;
  categorySlug?: string;
}

const usersData = loadJsonData<UserSeed[]>('users.json');
const categoriesData = loadJsonData<CategorySeed[]>('categories.json');
const productSeedData = loadJsonData<ProductSeed[]>('products.json');
const variantsData = loadJsonData<VariantsSeed[]>('variants.json');
const locationsData = loadJsonData<LocationSeed[]>('locations.json');
const storesData = loadJsonData<StoreSeedData[]>('stores.json');
const vouchersData = loadJsonData<VoucherSeed[]>('vouchers.json');
const badgesData = loadJsonData<BadgeSeed[]>('badges.json');
const promotionsData = loadJsonData<PromotionSeed[]>('promotions.json');
const discountsData = loadJsonData<DiscountSeed[]>('discounts.json');

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
  log: ['query', 'info', 'warn', 'error'],
});

async function cleanup() {
  await prisma.orderItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.shipment.deleteMany();
  await prisma.order.deleteMany();
  await prisma.voucherUsage.deleteMany();
  await prisma.voucher.deleteMany();
  await prisma.badge.deleteMany();
  await prisma.promotion.deleteMany();
  await prisma.discount.deleteMany();
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
  try {
    await cleanup();

    const hashPassword = (pw: string) => bcrypt.hash(pw, 10);

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
      }

      createdUsers.push(user);
    }
    let sellerUsers = createdUsers.filter((u) => u.role === UserRole.USER);

    while (sellerUsers.length < 5) {
      const newUser = await prisma.user.create({
        data: {
          email: `seller${sellerUsers.length + 1}@gmail.com`,
          firstName: `Seller${sellerUsers.length + 1}`,
          lastName: 'Store',
          password: await hashPassword('password123'),
          phone: `0812345678${sellerUsers.length}`,
          role: UserRole.USER,
          isVerified: true,
          profile: { create: { bio: `Store owner ${sellerUsers.length + 1}` } },
          cart: { create: {} },
        },
      });
      sellerUsers.push(newUser);
    }

    async function createCategoryRecursive(
      categoryData: CategorySeed,
      parentId?: number,
      parentSlug?: string,
    ): Promise<Category> {
      const uniqueSlug = parentSlug
        ? `${parentSlug}-${categoryData.slug}`
        : categoryData.slug;

      const category = await prisma.category.create({
        data: {
          name: categoryData.name,
          slug: uniqueSlug,
          parentId: parentId,
        },
      });

      if (categoryData.children && categoryData.children.length > 0) {
        for (const childData of categoryData.children) {
          await createCategoryRecursive(childData, category.id, uniqueSlug);
        }
      }

      return category;
    }

    const createdCategories: Record<string, Category> = {};
    for (const categoryData of categoriesData) {
      const category = await createCategoryRecursive(categoryData);
      createdCategories[category.slug] = category;
    }

    const mensCategory = await prisma.category.findUnique({
      where: { slug: 'men' },
    });
    const womensCategory = await prisma.category.findUnique({
      where: { slug: 'women' },
    });
    const kidsCategory = await prisma.category.findUnique({
      where: { slug: 'kids' },
    });
    if (!mensCategory || !womensCategory || !kidsCategory)
      throw new Error('Could not find Men, Women, or Kids categories.');

    const allCategories = await prisma.category.findMany();
    const categoryMap = new Map<string, Category>();
    allCategories.forEach(cat => {
      categoryMap.set(cat.slug, cat);
    });

    const createdStores: Array<{
      id: number;
      name: string;
      slug: string;
      userId: number;
      isActive: boolean;
      isVerified: boolean;
      createdAt: Date;
      updatedAt: Date;
      totalProducts: number;
      totalSales: number;
      rating: number | null;
      locationId: number | null;
    }> = [];

    for (let i = 0; i < storesData.length; i++) {
      const storeSeed = storesData[i];
      const seller = sellerUsers[i];

      const storeLocation = await prisma.location.create({
        data: {
          ...storeSeed.location,
          recipient: seller.firstName + ' ' + seller.lastName,
          phone: seller.phone || storeSeed.location.phone,
        },
      });

      const store = await prisma.store.create({
        data: {
          name: storeSeed.name,
          slug: storeSeed.slug,
          isVerified: storeSeed.isVerified,
          user: { connect: { id: seller.id } },
          location: { connect: { id: storeLocation.id } },
          profile: {
            create: {
              bio: storeSeed.profile.bio,
              banner: storeSeed.profile.banner,
            },
          },
        },
      });
      createdStores.push(store);
    }
    const usedSlugs = new Set<string>();
    for (let i = 0; i < productSeedData.length; i++) {
      const product = productSeedData[i];
      
      let categoryId: number;
      let parentCategoryId: number | undefined;
      let childCategoryId: number | undefined;
      
      if (product.categorySlug) {
        const category = categoryMap.get(product.categorySlug);
        if (category) {
          categoryId = category.id;
        } else {
          categoryId = product.isForMen ? mensCategory.id : womensCategory.id;
        }
      } else {
        categoryId = product.isForMen ? mensCategory.id : womensCategory.id;
      }
      
      if (product.parentCategorySlug) {
        const parentCategory = categoryMap.get(product.parentCategorySlug);
        if (parentCategory) {
          parentCategoryId = parentCategory.id;
        }
      }
      
      if (product.childCategorySlug) {
        const childCategory = categoryMap.get(product.childCategorySlug);
        if (childCategory) {
          childCategoryId = childCategory.id;
        }
      }
      
      const storeIndex = i % createdStores.length;
      const store = createdStores[storeIndex];
      const seller = sellerUsers[storeIndex];
      const productName = product.name.trim();
      let newSlug = product.slug;

      if (usedSlugs.has(newSlug)) {
        const randomStr = Math.random().toString(36).substring(2, 8);
        newSlug = `${newSlug}-${randomStr}`;
      }
      usedSlugs.add(newSlug);

      const variantsToCreate = variantsData.find(
        (v) => v.key === product.variantsKey,
      )?.variants;
      if (!variantsToCreate) {
        continue;
      }

      const isTrending = i % 4 === 0 || (i % 7 === 0 && i % 3 !== 0);
      const isRecommended = i % 3 === 0 || (i % 5 === 0 && i % 4 !== 0);
      const viewCount = isTrending 
        ? Math.floor(Math.random() * 600) + 150 
        : isRecommended 
        ? Math.floor(Math.random() * 200) + 50 
        : Math.floor(Math.random() * 30);

      try {
        await prisma.product.create({
          data: {
            name: productName,
            slug: newSlug,
            description: product.description,
            images: product.images,
            isTrending,
            isRecommended,
            viewCount,
            seller: { connect: { id: seller.id } },
            category: { connect: { id: categoryId } },
            ...(parentCategoryId && { parentCategory: { connect: { id: parentCategoryId } } }),
            ...(childCategoryId && { childCategory: { connect: { id: childCategoryId } } }),
            store: { connect: { id: store.id } },
            variants: {
              create: variantsToCreate.map((v, variantIndex) => {
                const shouldHaveDiscount = (i % 3 === 0 && i % 4 !== 0) || (i % 5 === 0 && i % 7 !== 0);
                let finalPrice = v.price;
                let compareAtPrice: number | null = null;
                
                if (shouldHaveDiscount && variantIndex === 0) {
                  const discountPercentage = Math.floor(Math.random() * 25) + 5;
                  compareAtPrice = v.price;
                  finalPrice = Math.floor(v.price * (1 - discountPercentage / 100));
                }
                
                return {
                  ...v,
                  price: finalPrice,
                  condition: v.condition as Condition,
                  compareAtPrice: compareAtPrice as number | null,
                };
              }),
            },
          },
        });
      } catch (error: any) {
        if (error.code === 'P2002' && error.meta?.target?.includes('slug')) {
          const randomStr = Math.random().toString(36).substring(2, 8);
          newSlug = `${product.slug}-${randomStr}`;
          usedSlugs.add(newSlug);
          const isTrendingRetry = i % 4 === 0 || (i % 7 === 0 && i % 3 !== 0);
          const isRecommendedRetry = i % 3 === 0 || (i % 5 === 0 && i % 4 !== 0);
          const viewCountRetry = isTrendingRetry 
            ? Math.floor(Math.random() * 600) + 150 
            : isRecommendedRetry 
            ? Math.floor(Math.random() * 200) + 50 
            : Math.floor(Math.random() * 30);
          
          await prisma.product.create({
            data: {
              name: productName,
              slug: newSlug,
              description: product.description,
              images: product.images,
              isTrending: isTrendingRetry,
              isRecommended: isRecommendedRetry,
              viewCount: viewCountRetry,
              seller: { connect: { id: seller.id } },
              category: { connect: { id: categoryId } },
              ...(parentCategoryId && { parentCategory: { connect: { id: parentCategoryId } } }),
              ...(childCategoryId && { childCategory: { connect: { id: childCategoryId } } }),
              store: { connect: { id: store.id } },
              variants: {
                create: variantsToCreate.map((v, variantIndex) => {
                  const shouldHaveDiscount = (i % 3 === 0 && i % 4 !== 0) || (i % 5 === 0 && i % 7 !== 0);
                  let finalPrice = v.price;
                  let compareAtPrice: number | null = null;
                  
                  if (shouldHaveDiscount && variantIndex === 0) {
                    const discountPercentage = Math.floor(Math.random() * 25) + 5;
                    compareAtPrice = v.price;
                    finalPrice = Math.floor(v.price * (1 - discountPercentage / 100));
                  }
                  
                  return {
                    ...v,
                    price: finalPrice,
                    condition: v.condition as Condition,
                    compareAtPrice: compareAtPrice as number | null,
                  };
                }),
              },
            },
          });
        } else {
          throw error;
        }
      }
    }

    const vouchersPerStore = 3;
    for (let i = 0; i < createdStores.length; i++) {
      const store = createdStores[i];
      const startIndex = i * vouchersPerStore;
      const storeVouchers = vouchersData.slice(
        startIndex,
        startIndex + vouchersPerStore,
      );

      for (const voucherData of storeVouchers) {
        const expiryDate = new Date();
        expiryDate.setMonth(expiryDate.getMonth() + voucherData.expiryMonths);

        await prisma.voucher.create({
          data: {
            code: voucherData.code,
            name: voucherData.name,
            description: voucherData.description,
            type: voucherData.type as VoucherType,
            value: voucherData.value,
            maxDiscount: voucherData.maxDiscount,
            minPurchase: voucherData.minPurchase,
            usageLimit: voucherData.usageLimit,
            expiry: expiryDate,
            isActive: true,
            store: { connect: { id: store.id } },
          },
        });
      }
    }
    for (const badgeData of badgesData) {
      const store = createdStores[badgeData.storeIndex];
      if (!store) continue;

      await prisma.badge.create({
        data: {
          type: badgeData.type as BadgeType,
          name: badgeData.name,
          description: badgeData.description,
          color: badgeData.color,
          isActive: true,
          store: { connect: { id: store.id } },
        },
      });
    }
    for (const promotionData of promotionsData) {
      const store = createdStores[promotionData.storeIndex];
      if (!store) continue;

      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + promotionData.durationMonths);

      const products = await prisma.product.findMany({
        where: { storeId: store.id },
        take: 5,
      });

      await prisma.promotion.create({
        data: {
          name: promotionData.name,
          type: promotionData.type as PromotionType,
          description: promotionData.description,
          discount: promotionData.discount,
          startDate,
          endDate,
          isActive: true,
          store: { connect: { id: store.id } },
          products: {
            connect: products.map((p) => ({ id: p.id })),
          },
        },
      });
    }
    const allProducts = await prisma.product.findMany({ take: 10 });

    for (const discountData of discountsData) {
      const startDate = new Date();
      let endDate = new Date();

      if (discountData.durationMonths) {
        endDate.setMonth(endDate.getMonth() + discountData.durationMonths);
      } else if (discountData.durationDays) {
        endDate = new Date(
          Date.now() + discountData.durationDays * 24 * 60 * 60 * 1000,
        );
      }

      const discountCreateData: any = {
        name: discountData.name,
        description: discountData.description,
        type: discountData.type as DiscountType,
        value: discountData.value,
        maxDiscount: discountData.maxDiscount,
        minPurchase: discountData.minPurchase,
        scope: discountData.scope as DiscountScope,
        isActive: true,
        startDate,
        endDate,
        usageLimit: discountData.usageLimit,
      };

      if (
        discountData.scope === 'STORE' &&
        discountData.storeIndex !== undefined
      ) {
        const store = createdStores[discountData.storeIndex];
        if (store) {
          discountCreateData.store = { connect: { id: store.id } };
        }
      } else if (
        discountData.scope === 'CATEGORY' &&
        discountData.categorySlug
      ) {
        const category = await prisma.category.findUnique({
          where: { slug: discountData.categorySlug },
        });
        if (category) {
          discountCreateData.category = { connect: { id: category.id } };
        }
      } else if (discountData.scope === 'PRODUCT' && allProducts.length > 0) {
        const productIndex =
          discountsData.indexOf(discountData) % allProducts.length;
        discountCreateData.product = {
          connect: { id: allProducts[productIndex].id },
        };
      }

      await prisma.discount.create({ data: discountCreateData });
    }
  } catch (e) {
    if (e instanceof Error) {
    } else {
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
