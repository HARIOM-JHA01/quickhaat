import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: "Electronics",
        slug: "electronics",
        description: "Electronic devices and accessories",
        image: "https://picsum.photos/seed/electronics/400/300",
      },
    }),
    prisma.category.create({
      data: {
        name: "Fashion",
        slug: "fashion",
        description: "Clothing and fashion accessories",
        image: "https://picsum.photos/seed/fashion/400/300",
      },
    }),
    prisma.category.create({
      data: {
        name: "Home & Living",
        slug: "home-living",
        description: "Home decor and living essentials",
        image: "https://picsum.photos/seed/home/400/300",
      },
    }),
    prisma.category.create({
      data: {
        name: "Accessories",
        slug: "accessories",
        description: "Various accessories and gadgets",
        image: "https://picsum.photos/seed/accessories/400/300",
      },
    }),
  ]);

  console.log("✅ Created categories:", categories.length);

  const brands = await Promise.all([
    prisma.brand.create({
      data: {
        name: "TechPro",
        slug: "techpro",
        description: "Professional tech products",
      },
    }),
    prisma.brand.create({
      data: {
        name: "StyleCo",
        slug: "styleco",
        description: "Fashion and style essentials",
      },
    }),
    prisma.brand.create({
      data: {
        name: "HomeBase",
        slug: "homebase",
        description: "Home and living products",
      },
    }),
  ]);

  console.log("✅ Created brands:", brands.length);

  const collections = await Promise.all([
    prisma.collection.create({
      data: {
        name: "Summer Essentials",
        slug: "summer-essentials",
        description: "Must-have items for summer",
        image: "https://picsum.photos/seed/summer/600/400",
      },
    }),
    prisma.collection.create({
      data: {
        name: "Tech Innovations",
        slug: "tech-innovations",
        description: "Latest in technology",
        image: "https://picsum.photos/seed/tech/600/400",
      },
    }),
    prisma.collection.create({
      data: {
        name: "Urban Style",
        slug: "urban-style",
        description: "Modern urban fashion",
        image: "https://picsum.photos/seed/urban/600/400",
      },
    }),
  ]);

  console.log("✅ Created collections:", collections.length);

  const products = [
    {
      name: "Wireless Headphones",
      slug: "wireless-headphones",
      description: "Premium wireless headphones with noise cancellation",
      price: 299.99,
      comparePrice: 349.99,
      quantity: 50,
      isFeatured: true,
      categoryId: categories[0].id,
      brandId: brands[0].id,
      images: [
        {
          url: "https://picsum.photos/seed/headphones1/600/600",
          altText: "Headphones front",
          position: 0,
        },
        {
          url: "https://picsum.photos/seed/headphones2/600/600",
          altText: "Headphones side",
          position: 1,
        },
      ],
    },
    {
      name: "Smart Watch",
      slug: "smart-watch",
      description: "Fitness tracking smartwatch with heart rate monitor",
      price: 199.99,
      comparePrice: 249.99,
      quantity: 75,
      isFeatured: true,
      categoryId: categories[0].id,
      brandId: brands[0].id,
      images: [
        {
          url: "https://picsum.photos/seed/watch1/600/600",
          altText: "Watch display",
          position: 0,
        },
      ],
    },
    {
      name: "Designer Sunglasses",
      slug: "designer-sunglasses",
      description: "UV protection polarized sunglasses",
      price: 89.99,
      comparePrice: 129.99,
      quantity: 100,
      isFeatured: true,
      categoryId: categories[1].id,
      brandId: brands[1].id,
      images: [
        {
          url: "https://picsum.photos/seed/sunglasses1/600/600",
          altText: "Sunglasses front",
          position: 0,
        },
      ],
    },
    {
      name: "Leather Backpack",
      slug: "leather-backpack",
      description: "Premium leather backpack with laptop compartment",
      price: 149.99,
      comparePrice: 199.99,
      quantity: 30,
      categoryId: categories[3].id,
      brandId: brands[1].id,
      images: [
        {
          url: "https://picsum.photos/seed/backpack1/600/600",
          altText: "Backpack front",
          position: 0,
        },
      ],
    },
    {
      name: "Portable Power Bank",
      slug: "portable-power-bank",
      description: "20000mAh fast charging power bank",
      price: 49.99,
      comparePrice: 69.99,
      quantity: 150,
      categoryId: categories[3].id,
      brandId: brands[0].id,
      images: [
        {
          url: "https://picsum.photos/seed/powerbank1/600/600",
          altText: "Power bank",
          position: 0,
        },
      ],
    },
    {
      name: "LED Desk Lamp",
      slug: "led-desk-lamp",
      description: "Adjustable LED desk lamp with touch control",
      price: 39.99,
      comparePrice: 59.99,
      quantity: 80,
      categoryId: categories[2].id,
      brandId: brands[2].id,
      images: [
        {
          url: "https://picsum.photos/seed/lamp1/600/600",
          altText: "Desk lamp",
          position: 0,
        },
      ],
    },
    {
      name: "Ceramic Coffee Mug",
      slug: "ceramic-coffee-mug",
      description: "Handcrafted ceramic coffee mug 350ml",
      price: 19.99,
      comparePrice: 29.99,
      quantity: 200,
      categoryId: categories[2].id,
      brandId: brands[2].id,
      images: [
        {
          url: "https://picsum.photos/seed/mug1/600/600",
          altText: "Coffee mug",
          position: 0,
        },
      ],
    },
    {
      name: "Mechanical Keyboard",
      slug: "mechanical-keyboard",
      description: "RGB mechanical gaming keyboard with blue switches",
      price: 129.99,
      comparePrice: 159.99,
      quantity: 45,
      isFeatured: true,
      categoryId: categories[0].id,
      brandId: brands[0].id,
      images: [
        {
          url: "https://picsum.photos/seed/keyboard1/600/600",
          altText: "Mechanical keyboard",
          position: 0,
        },
      ],
    },
  ];

  for (const productData of products) {
    const { images, ...productInfo } = productData;
    const product = await prisma.product.create({
      data: {
        ...productInfo,
        images: {
          create: images,
        },
      },
    });
    console.log(`✅ Created product: ${product.name}`);
  }

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@quickhaat.com",
      name: "Admin User",
      password: "$2b$10$abcdefghijklmnopqrstuvwxyz1234567890",
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });

  console.log("✅ Created admin user:", adminUser.email);

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
