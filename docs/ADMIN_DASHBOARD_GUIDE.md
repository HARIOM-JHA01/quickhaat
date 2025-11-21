# Admin Dashboard Quick Start Guide

## 🚀 Getting Started

### Accessing the Admin Dashboard

1. **Login as Admin**
   - Navigate to `/login`
   - Use credentials with `ADMIN` or `SUPER_ADMIN` role
   - After login, go to `/admin`

2. **First Time Setup**
   - Ensure your user has admin role in database:
   ```sql
   UPDATE "User" SET role = 'ADMIN' WHERE email = 'your@email.com';
   ```

---

## 📊 Dashboard Overview

### Main Dashboard (`/admin`)

**Features:**

- **Stats Cards:** Revenue, Orders, Customers, Products
- **Revenue Chart:** Monthly revenue trends (last 12 months)
- **Top Products:** Best-selling items with sales count
- **Recent Orders:** Latest 5 orders with customer info

**Quick Actions:**

- Click order numbers to view details (when implemented)
- Monitor real-time store performance
- Track growth trends

---

## 📦 Product Management

### Product List (`/admin/products`)

**Features:**

- View all products with pagination (10 per page)
- Search by product name or description
- See product details: image, name, category, brand, price, stock, reviews
- Filter by status (active/inactive)
- Quick actions: Edit, Delete

**Actions:**

1. **Search Products**
   - Enter search term in search bar
   - Press Enter or click Search button
   - Results update automatically

2. **Add New Product** (Coming Soon)
   - Click "Add Product" button
   - Fill out product form
   - Upload images
   - Set price and stock
   - Publish

3. **Edit Product** (Coming Soon)
   - Click "..." menu on product row
   - Select "Edit"
   - Update product information
   - Save changes

4. **Delete Product**
   - Click "..." menu on product row
   - Select "Delete"
   - Confirm deletion
   - Product removed from database

**Tips:**

- Use color-coded stock badges to identify low inventory
- Active/Inactive status shows product visibility on store
- Review count helps identify popular products

---

## 📋 Order Management

### Order List (`/admin/orders`)

**Features:**

- View all customer orders
- Pagination support (10 per page)
- Filter by order status
- See order details: number, customer, date, total, status

**Order Statuses:**

- 🟡 **PENDING** - Payment pending
- 🔵 **PROCESSING** - Being prepared
- 🟣 **SHIPPED** - On the way
- 🟢 **DELIVERED** - Completed
- 🔴 **CANCELLED** - Cancelled

**Actions (Coming Soon):**

- View full order details
- Update order status
- Print invoice
- Contact customer
- Track shipment

---

## 👥 Customer Management (Coming Soon)

**Planned Features:**

- Customer list with search
- Customer profile view
- Order history per customer
- Customer statistics
- Contact information

---

## 🏷️ Category & Brand Management (Coming Soon)

**Planned Features:**

- Create/edit/delete categories
- Create/edit/delete brands
- Upload category icons
- Manage category hierarchy
- Set featured categories

---

## 📊 Analytics (Coming Soon)

**Planned Features:**

- Sales reports
- Revenue trends
- Product performance
- Customer insights
- Export to Excel/CSV

---

## ⚙️ Settings (Coming Soon)

**Planned Features:**

- Store information
- Payment settings
- Shipping methods
- Email templates
- Tax configuration

---

## 🔍 Navigation

### Sidebar Menu

| Menu Item   | Route                | Status     |
| ----------- | -------------------- | ---------- |
| Dashboard   | `/admin`             | ✅ Ready   |
| Products    | `/admin/products`    | ✅ Ready   |
| Orders      | `/admin/orders`      | ✅ Ready   |
| Customers   | `/admin/customers`   | ⏳ Pending |
| Categories  | `/admin/categories`  | ⏳ Pending |
| Brands      | `/admin/brands`      | ⏳ Pending |
| Collections | `/admin/collections` | ⏳ Pending |
| Reviews     | `/admin/reviews`     | ⏳ Pending |
| Analytics   | `/admin/analytics`   | ⏳ Pending |
| Settings    | `/admin/settings`    | ⏳ Pending |

### Header Actions

- **Search Bar:** Global search (coming soon)
- **Notifications:** Bell icon for alerts (coming soon)
- **User Menu:** Profile and sign out

---

## 🔐 Security

### Access Control

- Only users with `ADMIN` or `SUPER_ADMIN` roles can access
- Automatic redirect to login if not authenticated
- Session-based authentication with NextAuth.js

### Best Practices

1. **Use Strong Passwords**
   - Minimum 8 characters
   - Include numbers and special characters

2. **Limit Admin Access**
   - Only give admin role to trusted users
   - Review admin user list regularly

3. **Monitor Activity**
   - Check recent orders regularly
   - Review product changes
   - Watch for suspicious activity

---

## 💡 Tips & Tricks

### Efficient Workflow

1. **Dashboard First**
   - Start your day at `/admin` dashboard
   - Check key metrics and recent orders
   - Identify any issues quickly

2. **Keyboard Shortcuts** (Future)
   - `Ctrl/Cmd + K` - Global search
   - `Ctrl/Cmd + P` - Add product
   - `Escape` - Close dialogs

3. **Bulk Operations** (Future)
   - Select multiple products
   - Update prices in bulk
   - Change status for multiple items

---

## 🐛 Troubleshooting

### Common Issues

1. **Can't Access Admin Panel**
   - Solution: Check if your user has admin role
   - SQL: `SELECT role FROM "User" WHERE email = 'your@email.com';`

2. **Products Not Loading**
   - Solution: Check database connection
   - Verify Prisma is configured correctly

3. **Images Not Showing**
   - Solution: Verify image URLs are correct
   - Check if images exist in storage

4. **Slow Performance**
   - Solution: Check database indexes
   - Optimize Prisma queries
   - Consider pagination limits

---

## 📞 Support

### Getting Help

- **Documentation:** Check `/docs/TASK_11_ADMIN_DASHBOARD_SUMMARY.md`
- **Issues:** Create GitHub issue with `admin` label
- **Developer:** Contact development team

### Reporting Bugs

Include:

1. What you were trying to do
2. What happened instead
3. Steps to reproduce
4. Screenshots if applicable
5. Browser and OS information

---

## 🔄 Updates & Roadmap

### Current Version: 0.1.0 (Beta)

**Implemented:**

- ✅ Dashboard analytics
- ✅ Product listing
- ✅ Order listing
- ✅ Role-based access control

**Coming Soon:**

- ⏳ Product creation/editing forms
- ⏳ Order status updates
- ⏳ Customer management
- ⏳ Advanced analytics
- ⏳ Bulk operations
- ⏳ Export functionality

### Version 1.0 Goals

- Complete CRUD for all entities
- Advanced filtering and search
- Bulk operations
- Export/Import features
- Mobile responsive design
- Email notifications
- Activity logs

---

## 📚 Additional Resources

- **Admin API Documentation:** Coming soon
- **Video Tutorials:** Coming soon
- **Best Practices Guide:** Coming soon

---

**Last Updated:** November 10, 2025  
**Dashboard Version:** 0.1.0 Beta  
**Status:** Active Development
