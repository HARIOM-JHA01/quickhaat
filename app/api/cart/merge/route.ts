import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// POST /api/cart/merge - Merge guest cart with user cart
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { guestCartItems } = body;

    if (!Array.isArray(guestCartItems)) {
      return NextResponse.json(
        { error: 'Invalid cart items format' },
        { status: 400 }
      );
    }

    // Get or create user's cart
    let cart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: { items: true },
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: { userId: session.user.id },
        include: { items: true },
      });
    }

    let mergedCount = 0;
    const errors: string[] = [];

    // Merge each guest cart item
    for (const guestItem of guestCartItems) {
      try {
        const { productId, variantId, quantity } = guestItem;

        // Verify product exists and is active
        const product = await prisma.product.findUnique({
          where: { id: productId },
          include: { variants: true },
        });

        if (!product || !product.isActive) {
          errors.push(`Product ${productId} not found or inactive`);
          continue;
        }

        // Check stock
        let availableStock = product.quantity;
        if (variantId) {
          const variant = product.variants.find((v) => v.id === variantId);
          if (variant) {
            availableStock = variant.quantity;
          }
        }

        if (availableStock < quantity) {
          errors.push(`Insufficient stock for product ${product.name}`);
          continue;
        }

        // Check if item already exists in user cart
        const existingItem = cart.items.find(
          (item) => item.productId === productId && item.variantId === variantId
        );

        if (existingItem) {
          // Update quantity (up to stock limit)
          const newQuantity = Math.min(
            existingItem.quantity + quantity,
            availableStock
          );

          await prisma.cartItem.update({
            where: { id: existingItem.id },
            data: { quantity: newQuantity },
          });
        } else {
          // Create new cart item
          await prisma.cartItem.create({
            data: {
              cartId: cart.id,
              productId,
              variantId,
              quantity: Math.min(quantity, availableStock),
            },
          });
        }

        mergedCount++;
      } catch (error) {
        console.error('Error merging cart item:', error);
        errors.push(`Failed to merge item ${guestItem.productId}`);
      }
    }

    // Get updated cart
    const updatedCart = await prisma.cart.findUnique({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                images: {
                  orderBy: { position: 'asc' },
                  take: 1,
                },
                brand: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });

    return NextResponse.json({
      message: `Successfully merged ${mergedCount} items`,
      errors: errors.length > 0 ? errors : undefined,
      cart: updatedCart,
    });
  } catch (error) {
    console.error('Error merging cart:', error);
    return NextResponse.json(
      { error: 'Failed to merge cart' },
      { status: 500 }
    );
  }
}
