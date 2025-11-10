import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateOrderNumber } from "@/lib/order-utils";
import {
  calculateSubtotal,
  calculateTax,
  calculateShipping,
} from "@/lib/cart-utils";

// GET /api/orders - Get all orders for the logged-in user
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                  orderBy: { position: "asc" },
                },
              },
            },
          },
        },
        address: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST /api/orders - Create a new order
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { addressId, paymentMethod, notes } = body;

    // Validate required fields
    if (!addressId || !paymentMethod) {
      return NextResponse.json(
        { error: "Address and payment method are required" },
        { status: 400 }
      );
    }

    // Get user's cart with items
    const cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  take: 1,
                  orderBy: { position: "asc" },
                },
              },
            },
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Verify address belongs to user
    const address = await prisma.address.findFirst({
      where: {
        id: addressId,
        userId: session.user.id,
      },
    });

    if (!address) {
      return NextResponse.json({ error: "Invalid address" }, { status: 400 });
    }

    // Validate stock for all items
    for (const item of cart.items) {
      if (!item.product.isActive) {
        return NextResponse.json(
          { error: `${item.product.name} is no longer available` },
          { status: 400 }
        );
      }

      if (item.product.quantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.product.name}` },
          { status: 400 }
        );
      }
    }

    // Calculate order totals
    const subtotal = calculateSubtotal(cart.items);
    const tax = calculateTax(subtotal);
    const shippingCost = calculateShipping(subtotal);
    const discount = 0; // TODO: Apply coupon codes
    const total = subtotal + tax + shippingCost - discount;

    // Generate unique order number
    let orderNumber = generateOrderNumber();
    let orderExists = await prisma.order.findUnique({
      where: { orderNumber },
    });

    // Regenerate if duplicate (very unlikely)
    while (orderExists) {
      orderNumber = generateOrderNumber();
      orderExists = await prisma.order.findUnique({
        where: { orderNumber },
      });
    }

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: session.user.id,
          addressId,
          paymentMethod,
          subtotal,
          tax,
          shippingCost,
          discount,
          total,
          notes: notes || null,
          status:
            paymentMethod === "CASH_ON_DELIVERY" ? "CONFIRMED" : "PENDING",
          paymentStatus:
            paymentMethod === "CASH_ON_DELIVERY" ? "PENDING" : "PENDING",
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              name: item.product.name,
              sku: item.product.sku,
              quantity: item.quantity,
              price: item.product.price,
              total: item.product.price * item.quantity,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: {
                    take: 1,
                    orderBy: { position: "asc" },
                  },
                },
              },
            },
          },
          address: true,
        },
      });

      // Reduce product inventory
      for (const item of cart.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              decrement: item.quantity,
            },
          },
        });
      }

      // Clear the cart
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      return newOrder;
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
