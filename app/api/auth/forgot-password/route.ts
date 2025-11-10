import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import crypto from 'crypto';
import { sendPasswordResetEmail } from '@/lib/email-helpers';

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = forgotPasswordSchema.parse(body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { message: 'If an account exists, a reset link has been sent' },
        { status: 200 }
      );
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour
    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // TODO: Store reset token in database
    // await prisma.user.update({
    //   where: { email },
    //   data: {
    //     resetToken,
    //     resetTokenExpiry,
    //   },
    // });

    // Send password reset email (async, don't wait)
    (async () => {
      try {
        await sendPasswordResetEmail({
          to: user.email,
          customerName: user.name || 'Customer',
          resetUrl,
          expiresIn: '1 hour',
        });
        console.log(`Password reset email sent to ${user.email}`);
      } catch (emailError) {
        console.error('Error sending password reset email:', emailError);
        // Don't fail the request if email fails
      }
    })();

    console.log('Password reset requested for:', email);
    console.log('Reset token:', resetToken);
    console.log('Reset link:', resetUrl);

    return NextResponse.json(
      { message: 'If an account exists, a reset link has been sent' },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0].message },
        { status: 400 }
      );
    }

    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'An error occurred' }, { status: 500 });
  }
}
