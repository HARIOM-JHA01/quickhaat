import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const unsubscribeSchema = z.object({
  email: z.string().email('Invalid email address'),
  type: z.enum([
    'all',
    'promotions',
    'newsletter',
    'orderUpdates',
    'reviewRequests',
  ]),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, type } = unsubscribeSchema.parse(body);

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    // Update settings based on type
    const settingsToUpdate: Record<string, string> = {};

    if (type === 'all') {
      settingsToUpdate[`user:${user.id}:emailPromotions`] = 'false';
      settingsToUpdate[`user:${user.id}:emailNewsletter`] = 'false';
      settingsToUpdate[`user:${user.id}:emailReviewRequests`] = 'false';
      // Keep orderUpdates enabled for important notifications
    } else {
      const keyMap = {
        promotions: 'emailPromotions',
        newsletter: 'emailNewsletter',
        orderUpdates: 'emailOrderUpdates',
        reviewRequests: 'emailReviewRequests',
      };

      const settingKey = keyMap[type];
      if (settingKey) {
        settingsToUpdate[`user:${user.id}:${settingKey}`] = 'false';
      }
    }

    // Update all settings
    await Promise.all(
      Object.entries(settingsToUpdate).map(([key, value]) =>
        prisma.setting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        })
      )
    );

    return NextResponse.json({
      message: 'Successfully unsubscribed',
      type,
    });
  } catch (error) {
    console.error('Unsubscribe error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to unsubscribe' },
      { status: 500 }
    );
  }
}

// GET endpoint to check subscription status
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Email not found' }, { status: 404 });
    }

    // Get current settings
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: [
            `user:${user.id}:emailPromotions`,
            `user:${user.id}:emailNewsletter`,
            `user:${user.id}:emailOrderUpdates`,
            `user:${user.id}:emailReviewRequests`,
          ],
        },
      },
    });

    const subscriptions = {
      promotions: true,
      newsletter: true,
      orderUpdates: true,
      reviewRequests: true,
    };

    settings.forEach((setting) => {
      const key = setting.key.split(':')[2];
      if (key === 'emailPromotions')
        subscriptions.promotions = setting.value === 'true';
      if (key === 'emailNewsletter')
        subscriptions.newsletter = setting.value === 'true';
      if (key === 'emailOrderUpdates')
        subscriptions.orderUpdates = setting.value === 'true';
      if (key === 'emailReviewRequests')
        subscriptions.reviewRequests = setting.value === 'true';
    });

    return NextResponse.json(subscriptions);
  } catch (error) {
    console.error('Get subscription status error:', error);
    return NextResponse.json(
      { error: 'Failed to get subscription status' },
      { status: 500 }
    );
  }
}
