# Quickhaat E-commerce Database Documentation

## Database Overview

This project uses **PostgreSQL** (hosted on Neon) with **Prisma ORM** for type-safe database access.

## Database Schema

### Core Tables

#### User Management

- **User**: Customer accounts with authentication and role-based access
- **Address**: Multiple shipping/billing addresses per user

#### Product Catalog

- **Product**: Main product information with pricing and inventory
- **ProductImage**: Multiple images per product
- **ProductVariant**: Product variations (size, color, etc.)
- **Category**: Hierarchical product categories
- **Brand**: Product brands
- **Collection**: Curated product collections
- **ProductCollection**: Many-to-many relationship between products and collections

#### Shopping Experience

- **Cart**: User shopping carts
- **CartItem**: Items in shopping carts
- **Wishlist**: Saved items for later

#### Order Management

- **Order**: Customer orders with status tracking
- **OrderItem**: Products in orders
- **Payment**: Payment processing and records
- **Shipment**: Shipping tracking information

#### Reviews & Feedback

- **Review**: Product reviews and ratings

#### Promotions

- **Coupon**: Discount codes and promotions

## Enums

- **UserRole**: `CUSTOMER`, `ADMIN`, `SUPER_ADMIN`
- **OrderStatus**: `PENDING`, `PROCESSING`, `CONFIRMED`, `SHIPPED`, `DELIVERED`, `CANCELLED`, `REFUNDED`
- **PaymentStatus**: `PENDING`, `PROCESSING`, `PAID`, `FAILED`, `REFUNDED`
- **PaymentMethod**: `CARD`, `PAYPAL`, `STRIPE`, `CASH_ON_DELIVERY`
- **ShipmentStatus**: `PENDING`, `PROCESSING`, `SHIPPED`, `IN_TRANSIT`, `DELIVERED`, `FAILED`
- **CouponType**: `PERCENTAGE`, `FIXED`, `FREE_SHIPPING`

## Available Scripts

```bash
# Run database migrations
bun run db:migrate

# Push schema changes without migrations
bun run db:push

# Seed database with initial data
bun run db:seed

# Open Prisma Studio (visual database editor)
bun run db:studio

# Reset database (caution: deletes all data)
bun run db:reset
```

## Prisma Client Usage

Import the Prisma client from `lib/prisma.ts`:

```typescript
import { prisma } from "@/lib/prisma";

// Example: Fetch all products
const products = await prisma.product.findMany({
  include: {
    images: true,
    category: true,
    brand: true,
  },
});

// Example: Create a new order
const order = await prisma.order.create({
  data: {
    userId: "user-id",
    addressId: "address-id",
    orderNumber: "ORD-12345",
    status: "PENDING",
    paymentStatus: "PENDING",
    paymentMethod: "CARD",
    subtotal: 299.99,
    total: 299.99,
    items: {
      create: [
        {
          productId: "product-id",
          name: "Wireless Headphones",
          quantity: 1,
          price: 299.99,
          total: 299.99,
        },
      ],
    },
  },
});
```

## Initial Data

The database is seeded with:

- 4 categories (Electronics, Fashion, Home & Living, Accessories)
- 3 brands (TechPro, StyleCo, HomeBase)
- 3 collections (Summer Essentials, Tech Innovations, Urban Style)
- 8 products with images
- 1 admin user (email: admin@quickhaat.com)

## Environment Variables

Required in `.env.local`:

```bash
DATABASE_URL="postgresql://..."
```

## Database Features

### Relationships

- User → Multiple Addresses, Orders, Reviews, Cart, Wishlist
- Product → Multiple Images, Variants, Categories, Collections, Reviews
- Order → Multiple OrderItems, Payment, Shipment
- Category → Hierarchical (parent-child relationships)

### Indexes

Optimized indexes on:

- User email
- Product slug, category, brand, active status
- Order user, number, status
- Review product, rating
- Cart and wishlist relationships

### Cascading Deletes

- Deleting a user removes their addresses, orders, reviews, cart, and wishlist
- Deleting a product removes its images, variants, and relationships
- Deleting an order removes its items, payment, and shipment

## Security Considerations

- Passwords should be hashed using bcrypt (seed example shows placeholder)
- Use row-level security in production
- Implement proper authentication middleware
- Validate all user inputs before database operations
- Use transactions for complex operations (e.g., order creation)

## Next Steps

1. Implement authentication (NextAuth.js recommended)
2. Create API routes for CRUD operations
3. Add server actions for form handling
4. Implement payment gateway integration
5. Add email notifications for orders
6. Set up automated backups
7. Implement search functionality
8. Add inventory management
