import { sendEmail, EmailAttachment } from './email';
import { OrderConfirmationEmail } from '../emails/order-confirmation';
import { OrderShippedEmail } from '../emails/order-shipped';
import { OrderDeliveredEmail } from '../emails/order-delivered';
import { PasswordResetEmail } from '../emails/password-reset';
import { EmailVerificationEmail } from '../emails/email-verification';
import { WelcomeEmail } from '../emails/welcome';
import { NewsletterSubscriptionEmail } from '../emails/newsletter-subscription';
import { ReviewRequestEmail } from '../emails/review-request';
import { AbandonedCartEmail } from '../emails/abandoned-cart';

// Order Confirmation (with optional invoice attachment)
export async function sendOrderConfirmationEmail(data: {
  to: string;
  orderNumber: string;
  customerName: string;
  orderDate: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  invoiceBuffer?: Buffer; // Optional PDF invoice attachment
}) {
  const attachments: EmailAttachment[] = [];

  // Add invoice PDF if provided
  if (data.invoiceBuffer) {
    attachments.push({
      filename: `invoice-${data.orderNumber}.pdf`,
      content: data.invoiceBuffer,
      contentType: 'application/pdf',
    });
  }

  return await sendEmail({
    to: data.to,
    subject: `Order Confirmation - #${data.orderNumber}`,
    react: OrderConfirmationEmail(data),
    attachments: attachments.length > 0 ? attachments : undefined,
  });
}

// Order Shipped
export async function sendOrderShippedEmail(data: {
  to: string;
  orderNumber: string;
  customerName: string;
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  estimatedDelivery: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
}) {
  return await sendEmail({
    to: data.to,
    subject: `Your Order Has Shipped - #${data.orderNumber}`,
    react: OrderShippedEmail(data),
  });
}

// Order Delivered
export async function sendOrderDeliveredEmail(data: {
  to: string;
  orderNumber: string;
  customerName: string;
  deliveryDate: string;
}) {
  return await sendEmail({
    to: data.to,
    subject: `Order Delivered - #${data.orderNumber}`,
    react: OrderDeliveredEmail(data),
  });
}

// Password Reset
export async function sendPasswordResetEmail(data: {
  to: string;
  customerName: string;
  resetUrl: string;
  expiresIn?: string;
}) {
  return await sendEmail({
    to: data.to,
    subject: 'Reset Your Password - Quickhaat',
    react: PasswordResetEmail({
      ...data,
      expiresIn: data.expiresIn || '1 hour',
    }),
  });
}

// Email Verification
export async function sendEmailVerificationEmail(data: {
  to: string;
  customerName: string;
  verificationUrl: string;
  expiresIn?: string;
}) {
  return await sendEmail({
    to: data.to,
    subject: 'Verify Your Email - Quickhaat',
    react: EmailVerificationEmail({
      ...data,
      expiresIn: data.expiresIn || '24 hours',
    }),
  });
}

// Welcome Email
export async function sendWelcomeEmail(data: {
  to: string;
  customerName: string;
}) {
  return await sendEmail({
    to: data.to,
    subject: 'Welcome to Quickhaat! 🎉',
    react: WelcomeEmail(data),
  });
}

// Newsletter Subscription
export async function sendNewsletterSubscriptionEmail(data: {
  to: string;
  customerName: string;
}) {
  return await sendEmail({
    to: data.to,
    subject: 'Newsletter Subscription Confirmed - Quickhaat',
    react: NewsletterSubscriptionEmail(data),
  });
}

// Review Request
export async function sendReviewRequestEmail(data: {
  to: string;
  customerName: string;
  orderNumber: string;
  productName: string;
  productImage?: string;
  reviewUrl: string;
}) {
  return await sendEmail({
    to: data.to,
    subject: 'How was your experience? Share your review',
    react: ReviewRequestEmail(data),
  });
}

// Abandoned Cart
export async function sendAbandonedCartEmail(data: {
  to: string;
  customerName: string;
  items: Array<{
    name: string;
    price: number;
    image?: string;
  }>;
  cartUrl: string;
}) {
  return await sendEmail({
    to: data.to,
    subject: 'Your Cart is Waiting! 🛒',
    react: AbandonedCartEmail(data),
  });
}
