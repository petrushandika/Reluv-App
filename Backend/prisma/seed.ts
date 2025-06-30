import {
  PrismaClient,
  UserRole,
  Condition,
  OrderStatus,
  PaymentStatus,
  ShipmentStatus,
} from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🚀 Starting seeder...');

  const password = await hash('password123', 10);

  const user1 = await prisma.user.upsert({
    where: { email: 'budi.admin@example.com' },
    update: {},
    create: {
      email: 'budi.admin@example.com',
      firstName: 'Budi',
      lastName: 'Admin',
      password: password,
      role: UserRole.ADMIN,
      isVerified: true,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'citra.user@example.com' },
    update: {},
    create: {
      email: 'citra.user@example.com',
      firstName: 'Citra',
      lastName: 'User',
      password: password,
      role: UserRole.USER,
      isVerified: true,
    },
  });

  console.log(`✅ Created users: ${user1.firstName} and ${user2.firstName}`);

  const parentCategory = await prisma.category.upsert({
    where: { slug: 'fashion' },
    update: {},
    create: { name: 'Fashion', slug: 'fashion' },
  });

  const category1 = await prisma.category.upsert({
    where: { slug: 'fashion-pria' },
    update: {},
    create: {
      name: 'Fashion Pria',
      slug: 'fashion-pria',
      parentId: parentCategory.id,
    },
  });

  const category2 = await prisma.category.upsert({
    where: { slug: 'elektronik' },
    update: {},
    create: { name: 'Elektronik', slug: 'elektronik' },
  });

  console.log(
    `✅ Created categories: ${parentCategory.name}, ${category1.name}, ${category2.name}`,
  );

  const address1 = await prisma.address.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      label: 'Alamat Toko',
      recipient: 'Budi Admin',
      phone: '081234567890',
      province: 'DKI Jakarta',
      city: 'Jakarta Selatan',
      district: 'Tebet',
      subDistrict: 'Tebet Timur',
      postalCode: '12820',
      fullAddress: 'Jl. Tebet Raya No. 10',
      userId: user1.id,
      isDefault: true,
    },
  });

  const address2 = await prisma.address.upsert({
    where: { id: 2 },
    update: {},
    create: {
      id: 2,
      label: 'Rumah',
      recipient: 'Citra User',
      phone: '089876543210',
      province: 'Jawa Barat',
      city: 'Bandung',
      district: 'Coblong',
      subDistrict: 'Dago',
      postalCode: '40135',
      fullAddress: 'Jl. Dago Asri No. 5',
      userId: user2.id,
      isDefault: true,
    },
  });

  console.log(`✅ Created addresses for users.`);

  const store1 = await prisma.store.upsert({
    where: { slug: 'budis-gadget-store' },
    update: {},
    create: {
      name: "Budi's Gadget Store",
      slug: 'budis-gadget-store',
      ownerId: user1.id,
      addressId: address1.id,
      isVerified: true,
    },
  });

  const store2 = await prisma.store.upsert({
    where: { slug: 'citras-fashion-corner' },
    update: {},
    create: {
      name: "Citra's Fashion Corner",
      slug: 'citras-fashion-corner',
      ownerId: user2.id,
      addressId: address2.id,
      isVerified: false,
    },
  });

  console.log(`✅ Created stores: ${store1.name} and ${store2.name}`);

  await prisma.profile.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      bio: 'Administrator for this awesome marketplace. Menjual gadget elektronik terbaru dan terpercaya.',
      avatar: 'https://i.pravatar.cc/150?u=budi',
      banner: '/images/banner-gadget.jpg',
      userId: user1.id,
      storeId: store1.id,
    },
  });

  await prisma.profile.upsert({
    where: { userId: user2.id },
    update: {},
    create: {
      bio: 'I love shopping for unique items! Menjual pakaian preloved berkualitas tinggi.',
      avatar: 'https://i.pravatar.cc/150?u=citra',
      banner: '/images/banner-fashion.jpg',
      userId: user2.id,
      storeId: store2.id,
    },
  });

  console.log(`✅ Created store profiles.`);

  const product1 = await prisma.product.create({
    data: {
      name: 'Laptop Pro Max 14 inch',
      slug: 'laptop-pro-max-14-inch',
      description: 'Laptop super kencang untuk para profesional.',
      images: ['/images/laptop1.jpg', '/images/laptop2.jpg'],
      sellerId: user1.id,
      categoryId: category2.id,
      storeId: store1.id,
      weight: 2000,
      isPreloved: false,
      variants: {
        create: [
          {
            name: '16GB RAM / 512GB SSD',
            price: 25000000,
            stock: 10,
            condition: Condition.NEW,
            sku: 'LPM14-16-512',
          },
          {
            name: '32GB RAM / 1TB SSD',
            price: 35000000,
            stock: 5,
            condition: Condition.NEW,
            sku: 'LPM14-32-1TB',
          },
        ],
      },
    },
    include: { variants: true },
  });

  const product2 = await prisma.product.create({
    data: {
      name: 'Kemeja Flanel Preloved',
      slug: 'kemeja-flanel-preloved',
      description: 'Kemeja flanel bekas, kondisi masih sangat baik.',
      images: ['/images/flanel1.jpg'],
      sellerId: user2.id,
      categoryId: category1.id,
      storeId: store2.id,
      weight: 300,
      isPreloved: true,
      variants: {
        create: [
          {
            name: 'Ukuran L',
            price: 150000,
            stock: 1,
            condition: Condition.LIKE_NEW,
            conditionNote: 'Hanya dipakai 2 kali.',
            sku: 'KFP-L',
          },
          {
            name: 'Ukuran M',
            price: 140000,
            stock: 1,
            condition: Condition.GOOD,
            conditionNote: 'Ada sedikit noda di lengan.',
            sku: 'KFP-M',
          },
        ],
      },
    },
    include: { variants: true },
  });

  console.log(
    `✅ Created products: ${product1.name} and ${product2.name} with their variants.`,
  );

  await prisma.wishlist.create({
    data: { userId: user2.id, productId: product1.id },
  });
  await prisma.wishlist.create({
    data: { userId: user1.id, productId: product2.id },
  });
  console.log('✅ Created wishlist data.');

  await prisma.review.create({
    data: {
      rating: 5,
      comment: 'Barangnya mantap, pengiriman super cepat!',
      productId: product1.id,
      authorId: user2.id,
    },
  });
  await prisma.review.create({
    data: {
      rating: 4,
      comment: 'Kainnya bagus, sesuai deskripsi.',
      productId: product2.id,
      authorId: user1.id,
    },
  });
  console.log('✅ Created review data.');

  await prisma.cart.create({
    data: {
      userId: user2.id,
      items: {
        create: [
          { variantId: product2.variants[0].id, quantity: 1 },
          { variantId: product1.variants[0].id, quantity: 1 },
        ],
      },
    },
  });
  console.log(`✅ Created cart with items for user ${user2.firstName}.`);

  const laptopVariant = product1.variants[0];
  const itemsAmount = laptopVariant.price;
  const shippingCost = 25000;
  const totalAmount = itemsAmount + shippingCost;

  const order1 = await prisma.order.create({
    data: {
      orderNumber: `ORD-${Date.now()}`,
      totalAmount,
      itemsAmount,
      shippingCost,
      status: OrderStatus.PAID,
      buyerId: user2.id,
      addressId: address2.id,
      items: {
        create: {
          variantId: laptopVariant.id,
          quantity: 1,
          price: laptopVariant.price,
          total: itemsAmount,
        },
      },
      payment: {
        create: {
          amount: totalAmount,
          status: PaymentStatus.PAID,
          midtrans_order_id: `midtrans-${Date.now()}`,
          method: 'BCA Virtual Account',
          paidAt: new Date(),
        },
      },
      shipment: {
        create: {
          courier: 'JNE',
          service: 'REG',
          status: ShipmentStatus.AWAITING_PICKUP,
          trackingNumber: `JNE-${Date.now()}`,
        },
      },
    },
  });

  const kemejaVariant = product2.variants[1];
  const itemsAmount2 = kemejaVariant.price * 2;
  const shippingCost2 = 10000;
  const totalAmount2 = itemsAmount2 + shippingCost2;

  const order2 = await prisma.order.create({
    data: {
      orderNumber: `ORD-${Date.now() + 1}`,
      totalAmount: totalAmount2,
      itemsAmount: itemsAmount2,
      shippingCost: shippingCost2,
      status: OrderStatus.PENDING,
      buyerId: user1.id,
      addressId: address1.id,
      items: {
        create: {
          variantId: kemejaVariant.id,
          quantity: 2,
          price: kemejaVariant.price,
          total: itemsAmount2,
        },
      },
      payment: {
        create: {
          amount: totalAmount2,
          status: PaymentStatus.PENDING,
          midtrans_order_id: `midtrans-${Date.now() + 1}`,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
        },
      },
    },
  });

  console.log(
    `✅ Created orders: ${order1.orderNumber} and ${order2.orderNumber}`,
  );

  await prisma.notification.createMany({
    data: [
      {
        userId: user2.id,
        title: 'Pesanan Dibayar',
        body: `Pembayaran untuk pesanan ${order1.orderNumber} telah berhasil.`,
        type: 'ORDER_STATUS',
      },
      {
        userId: user1.id,
        title: 'Selamat Datang!',
        body: 'Terima kasih telah bergabung di platform kami.',
        type: 'GENERAL_INFO',
      },
    ],
  });
  console.log('✅ Created notification data.');

  await prisma.shippingRate.createMany({
    data: [
      {
        originAreaId: 'ID-JK-12820',
        destinationAreaId: 'ID-JB-40135',
        courierCode: 'jne',
        serviceCode: 'REG',
        serviceName: 'Reguler',
        price: 15000,
        minWeight: 1,
        maxWeight: 1000,
        estimatedDays: '2-3',
      },
      {
        originAreaId: 'ID-JK-12820',
        destinationAreaId: 'ID-JB-40135',
        courierCode: 'sicepat',
        serviceCode: 'BEST',
        serviceName: 'Besok Sampai',
        price: 25000,
        minWeight: 1,
        maxWeight: 1000,
        estimatedDays: '1',
      },
    ],
  });
  console.log('✅ Created shipping rate data.');
}

async function runSeed() {
  try {
    await main();
    console.log('🎉 Seeding finished successfully.');
  } catch (error) {
    console.error('❌ Seeding failed.');
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error('An unknown error occurred:', error);
    }
    process.exit(1);
  } finally {
    await prisma.$disconnect();
    console.log('👋 Prisma client disconnected.');
  }
}

runSeed();
