import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';
import { z } from 'zod';
import {
  sendOrderShippedEmail,
  sendOrderDeliveredEmail,
} from '@/lib/email-helpers';

const orderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        address: true,
        items: {
          include: {
            product: {
              include: {
                images: { take: 1 },
              },
            },
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const validatedData = orderStatusSchema.parse(body);

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        address: true,
      },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Update order status
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: validatedData.status,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        address: true,
        items: {
          include: {
            product: {
              include: {
                images: { take: 1 },
              },
            },
          },
        },
      },
    });

    // Send email notifications based on status change (async, don't wait)
    if (existingOrder.status !== validatedData.status) {
      (async () => {
        try {
          // Send order shipped email
          if (validatedData.status === OrderStatus.SHIPPED) {
            await sendOrderShippedEmail({
              to: order.user.email,
              orderNumber: order.orderNumber,
              customerName: order.user.name || 'Customer',
              carrier: 'Standard Shipping', // TODO: Add carrier field to order
              trackingNumber: 'TRK' + order.orderNumber, // TODO: Add tracking number field
              trackingUrl: `https://quickhaat.com/account/orders/${order.id}`,
              estimatedDelivery: new Date(
                Date.now() + 5 * 24 * 60 * 60 * 1000
              ).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
              shippingAddress: {
                street: order.address.street,
                city: order.address.city,
                state: order.address.state,
                postalCode: order.address.postalCode,
                country: order.address.country,
              },
            });
            console.log(`Order shipped email sent to ${order.user.email}`);
          }

          // Send order delivered email
          if (validatedData.status === OrderStatus.DELIVERED) {
            await sendOrderDeliveredEmail({
              to: order.user.email,
              orderNumber: order.orderNumber,
              customerName: order.user.name || 'Customer',
              deliveryDate: new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
            });
            console.log(`Order delivered email sent to ${order.user.email}`);
          }
        } catch (emailError) {
          console.error('Error sending order status email:', emailError);
          // Don't fail the status update if email fails
        }
      })();
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error updating order:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.issues },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}
