import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const settingsSchema = z.object({
  emailOrderUpdates: z.boolean().optional(),
  emailPromotions: z.boolean().optional(),
  emailNewsletter: z.boolean().optional(),
  emailReviewRequests: z.boolean().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user settings from the Setting table
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: [
            `user:${session.user.id}:emailOrderUpdates`,
            `user:${session.user.id}:emailPromotions`,
            `user:${session.user.id}:emailNewsletter`,
            `user:${session.user.id}:emailReviewRequests`,
          ],
        },
      },
    });

    // Convert settings to object with default values
    const settingsObj = {
      emailOrderUpdates: true,
      emailPromotions: false,
      emailNewsletter: false,
      emailReviewRequests: true,
    };

    settings.forEach((setting) => {
      const key = setting.key.split(':')[2] as keyof typeof settingsObj;
      if (key in settingsObj) {
        settingsObj[key] = setting.value === 'true';
      }
    });

    return NextResponse.json(settingsObj);
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = settingsSchema.parse(body);

    // Update each setting
    const updatePromises = Object.entries(validatedData).map(([key, value]) => {
      return prisma.setting.upsert({
        where: {
          key: `user:${session.user.id}:${key}`,
        },
        update: {
          value: String(value),
        },
        create: {
          key: `user:${session.user.id}:${key}`,
          value: String(value),
        },
      });
    });

    await Promise.all(updatePromises);

    return NextResponse.json({ message: 'Settings updated successfully' });
  } catch (error) {
    console.error('Update settings error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}
