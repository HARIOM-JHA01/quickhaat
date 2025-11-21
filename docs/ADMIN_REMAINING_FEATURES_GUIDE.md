# Admin Dashboard - Remaining Features Implementation Guide

## Overview

This document provides implementation guidance for the remaining admin dashboard features:

1. Collection Management (in progress)
2. Coupon Management
3. Review Moderation
4. Analytics and Reports
5. Settings Page

---

## 1. Collection Management

### Schema Note

The `Collection` model uses a many-to-many relationship with `Product` through `ProductCollection`:

- Collections DO NOT have `isFeatured` field
- Products are linked via `ProductCollection` with a `position` field for ordering

### Files Created (need fixes):

- ✅ `/app/admin/collections/page.tsx`
- ✅ `/app/admin/collections/new/page.tsx`
- ✅ `/app/admin/collections/[id]/edit/page.tsx`
- ✅ `/components/admin/collections/collections-table.tsx`
- ✅ `/components/admin/collections/collections-table-skeleton.tsx`
- ⚠️ `/components/admin/collections/collection-form.tsx` (needs type fixes)
- ⚠️ `/app/api/admin/collections/route.ts` (needs `isFeatured` removed)
- ✅ `/app/api/admin/collections/[id]/route.ts`

### Required Fixes:

**1. Remove `isFeatured` from collection-form.tsx schema:**

```typescript
const collectionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  description: z.string().optional(),
  image: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  isActive: z.boolean(),
  productIds: z.array(z.string()),
});
```

**2. Fix collection API routes:**

- Remove all `isFeatured` references from both route files
- Use `ProductCollection` for product associations instead of direct connect

**3. Update admin sidebar navigation:**
Add Collections link to `/components/admin/admin-sidebar.tsx`:

```typescript
{
  name: "Collections",
  href: "/admin/collections",
  icon: FolderKanban,
},
```

---

## 2. Coupon Management

### Database Schema (check if exists):

```prisma
model Coupon {
  id                String    @id @default(cuid())
  code              String    @unique
  description       String?
  discountType      String    // "PERCENTAGE" | "FIXED_AMOUNT" | "FREE_SHIPPING"
  discountValue     Float
  minPurchaseAmount Float?
  maxDiscountAmount Float?
  usageLimit        Int?
  usedCount         Int       @default(0)
  expiresAt         DateTime?
  isActive          Boolean   @default(true)
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt

  orders            Order[]

  @@index([code])
  @@index([isActive])
}
```

### Files to Create:

**Pages:**

- `/app/admin/coupons/page.tsx` - List coupons with filters
- `/app/admin/coupons/new/page.tsx` - Create coupon
- `/app/admin/coupons/[id]/edit/page.tsx` - Edit coupon

**Components:**

- `/components/admin/coupons/coupons-table.tsx` - Coupons table with activate/deactivate
- `/components/admin/coupons/coupon-form.tsx` - Create/edit form with validation
- `/components/admin/coupons/coupon-generator.tsx` - Bulk coupon code generator

**API Routes:**

- `/app/api/admin/coupons/route.ts` - GET (list), POST (create)
- `/app/api/admin/coupons/[id]/route.ts` - GET, PATCH, DELETE
- `/app/api/admin/coupons/validate/route.ts` - POST to validate coupon code

### Key Features:

- Code validation (unique, format rules)
- Expiration date handling
- Usage limits and tracking
- Discount type selection (percentage, fixed, free shipping)
- Min/max purchase amounts
- Bulk code generation
- Active/inactive toggle

---

## 3. Review Moderation

### Database Schema (already exists):

```prisma
model Review {
  id        String   @id @default(cuid())
  rating    Int
  title     String?
  comment   String
  isApproved Boolean @default(false)  // Add if missing
  isFlagged  Boolean @default(false)  // Add if missing
  productId String
  userId    String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  product   Product @relation(...)
  user      User    @relation(...)
}
```

### Files to Create:

**Pages:**

- `/app/admin/reviews/page.tsx` - List all reviews with filters

**Components:**

- `/components/admin/reviews/reviews-table.tsx` - Reviews table with approve/reject/delete
- `/components/admin/reviews/review-detail-dialog.tsx` - Full review details modal
- `/components/admin/reviews/reviews-filters.tsx` - Filter by status, rating, product

**API Routes:**

- `/app/api/admin/reviews/route.ts` - GET (list with filters)
- `/app/api/admin/reviews/[id]/route.ts` - PATCH (approve/reject), DELETE
- `/app/api/admin/reviews/[id]/flag/route.ts` - PATCH (flag/unflag)

### Key Features:

- Filter by: status (pending, approved, rejected), rating, product, date range
- Bulk approve/reject
- Flag management
- Search by keyword
- Pagination
- Quick actions (approve, reject, delete, flag)

---

## 4. Analytics and Reports

### Files to Create:

**Pages:**

- `/app/admin/analytics/page.tsx` - Main analytics dashboard

**Components:**

- `/components/admin/analytics/sales-overview.tsx` - Total sales, revenue, orders
- `/components/admin/analytics/revenue-chart.tsx` - Line chart (daily/weekly/monthly)
- `/components/admin/analytics/top-products-chart.tsx` - Bar chart of best sellers
- `/components/admin/analytics/customer-metrics.tsx` - New vs returning customers
- `/components/admin/analytics/category-distribution.tsx` - Pie chart of sales by category
- `/components/admin/analytics/recent-activity.tsx` - Latest orders, products, reviews
- `/components/admin/analytics/export-reports.tsx` - Export data as CSV/Excel

**API Routes:**

- `/app/api/admin/analytics/overview/route.ts` - Summary metrics
- `/app/api/admin/analytics/sales/route.ts` - Sales data with date range
- `/app/api/admin/analytics/products/route.ts` - Top products data
- `/app/api/admin/analytics/customers/route.ts` - Customer metrics
- `/app/api/admin/analytics/export/route.ts` - Generate CSV/Excel reports

### Key Metrics:

- Total revenue (today, week, month, year)
- Total orders
- Average order value
- Total products sold
- New customers
- Top selling products
- Revenue by category
- Order status distribution
- Conversion rate

### Chart Types:

- Line charts (revenue over time)
- Bar charts (top products, categories)
- Pie charts (order status, categories)
- KPI cards (revenue, orders, customers)

### Date Range Filters:

- Today
- Last 7 days
- Last 30 days
- Last 3 months
- Last year
- Custom date range

---

## 5. Settings Page

### Files to Create:

**Pages:**

- `/app/admin/settings/page.tsx` - Settings with tabs

**Components:**

- `/components/admin/settings/general-settings.tsx` - Site name, logo, description
- `/components/admin/settings/shipping-settings.tsx` - Shipping zones, rates
- `/components/admin/settings/tax-settings.tsx` - Tax rates by region
- `/components/admin/settings/email-settings.tsx` - SMTP config, email templates
- `/components/admin/settings/payment-settings.tsx` - Payment gateway config
- `/components/admin/settings/notification-settings.tsx` - Email/SMS notifications

**API Routes:**

- `/app/api/admin/settings/route.ts` - GET, PATCH settings
- `/app/api/admin/settings/test-email/route.ts` - POST test email

### Database Schema:

```prisma
model Setting {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String   // JSON string
  category  String   // "general", "shipping", "tax", etc.
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  @@index([category])
  @@index([key])
}
```

### Setting Categories:

**1. General:**

- Site name
- Site description
- Logo URL
- Favicon URL
- Default currency
- Timezone
- Language

**2. Shipping:**

- Free shipping threshold
- Shipping zones (JSON)
- Flat rate shipping
- Local pickup options

**3. Tax:**

- Enable/disable tax
- Tax calculation method
- Tax rates by region (JSON)
- Display prices with/without tax

**4. Email:**

- SMTP host, port, user, password
- From email, from name
- Email templates (order confirmation, shipping, etc.)
- Enable/disable specific emails

**5. Payment:**

- Stripe public/secret keys
- Payment methods enabled
- Currency

**6. Notifications:**

- Admin notification email
- Low stock alerts
- New order notifications
- New review notifications

---

## Implementation Priority

### Phase 1 (Essential):

1. ✅ Fix Collection Management (remove `isFeatured`, fix types)
2. ✅ Coupon Management
3. ✅ Review Moderation

### Phase 2 (Important):

4. ✅ Analytics and Reports (basic metrics)
5. ✅ Settings Page (core settings)

### Phase 3 (Enhancement):

6. Advanced analytics (forecasting, trends)
7. Bulk operations for all entities
8. Image uploads for collections/categories
9. Advanced email template editor
10. Notification system

---

## Common Patterns

### Admin Authorization Check:

```typescript
const session = await auth();
if (!session?.user || session.user.role !== 'ADMIN') {
  redirect('/login');
}
```

### API Route Authorization:

```typescript
const session = await auth();
if (!session?.user || session.user.role !== 'ADMIN') {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}
```

### Pagination Helper:

```typescript
const page = parseInt(searchParams.get('page') || '1');
const limit = parseInt(searchParams.get('limit') || '10');
const skip = (page - 1) * limit;

const [items, total] = await prisma.$transaction([
  prisma.model.findMany({ skip, take: limit }),
  prisma.model.count(),
]);
```

### Toast Notifications:

```typescript
import { toast } from 'sonner';

toast.success('Operation successful');
toast.error('Operation failed');
toast.loading('Processing...');
```

---

## Next Steps

1. **Fix Collection Management:**
   - Remove `isFeatured` from all collection files
   - Fix TypeScript type errors in `collection-form.tsx`
   - Update edit page to not select `name` from ProductCollection

2. **Add Coupon Model (if missing):**

   ```bash
   # Add Coupon model to prisma/schema.prisma
   # Run migration
   bunx prisma migrate dev --name add-coupons
   ```

3. **Create Remaining Features:**
   - Follow the structure above for each feature
   - Reuse patterns from existing admin pages
   - Test each feature before moving to next

4. **Update Admin Sidebar:**
   - Add navigation links for all new pages
   - Group related features (Products, Orders, Marketing, Settings)

5. **Update TASKS.md:**
   - Mark completed features as done
   - Update progress percentage

---

## Testing Checklist

- [ ] Collections: Create, edit, delete, toggle active, associate products
- [ ] Coupons: Create, validate, apply discount, track usage, expire
- [ ] Reviews: List, approve, reject, flag, delete
- [ ] Analytics: View metrics, filter by date, export reports
- [ ] Settings: Update each category, test email, save successfully

---

**Last Updated:** November 10, 2025
**Status:** Collection Management in progress, others pending
