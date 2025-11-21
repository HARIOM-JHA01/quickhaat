/**
 * Order Utility Functions
 * Helper functions for order processing, number generation, and status management
 */

import { OrderStatus, PaymentStatus, ShipmentStatus } from '@prisma/client';

/**
 * Generate a unique order number with format: QH-YYYYMMDD-XXXXX
 * Example: QH-20250110-00123
 */
export function generateOrderNumber(): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 99999)
    .toString()
    .padStart(5, '0');

  return `QH-${year}${month}${day}-${random}`;
}

/**
 * Get human-readable order status label
 */
export function getOrderStatusLabel(status: OrderStatus): string {
  const labels: Record<OrderStatus, string> = {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    CONFIRMED: 'Confirmed',
    SHIPPED: 'Shipped',
    DELIVERED: 'Delivered',
    CANCELLED: 'Cancelled',
    REFUNDED: 'Refunded',
  };
  return labels[status];
}

/**
 * Get order status color for UI
 */
export function getOrderStatusColor(status: OrderStatus): string {
  const colors: Record<OrderStatus, string> = {
    PENDING: 'text-yellow-600 bg-yellow-50',
    PROCESSING: 'text-blue-600 bg-blue-50',
    CONFIRMED: 'text-green-600 bg-green-50',
    SHIPPED: 'text-purple-600 bg-purple-50',
    DELIVERED: 'text-green-700 bg-green-100',
    CANCELLED: 'text-red-600 bg-red-50',
    REFUNDED: 'text-orange-600 bg-orange-50',
  };
  return colors[status];
}

/**
 * Get payment status label
 */
export function getPaymentStatusLabel(status: PaymentStatus): string {
  const labels: Record<PaymentStatus, string> = {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    PAID: 'Paid',
    FAILED: 'Failed',
    REFUNDED: 'Refunded',
  };
  return labels[status];
}

/**
 * Get payment status color for UI
 */
export function getPaymentStatusColor(status: PaymentStatus): string {
  const colors: Record<PaymentStatus, string> = {
    PENDING: 'text-yellow-600 bg-yellow-50',
    PROCESSING: 'text-blue-600 bg-blue-50',
    PAID: 'text-green-600 bg-green-50',
    FAILED: 'text-red-600 bg-red-50',
    REFUNDED: 'text-orange-600 bg-orange-50',
  };
  return colors[status];
}

/**
 * Get shipment status label
 */
export function getShipmentStatusLabel(status: ShipmentStatus): string {
  const labels: Record<ShipmentStatus, string> = {
    PENDING: 'Pending',
    PROCESSING: 'Processing',
    SHIPPED: 'Shipped',
    IN_TRANSIT: 'In Transit',
    DELIVERED: 'Delivered',
    FAILED: 'Failed',
  };
  return labels[status];
}

/**
 * Check if order can be cancelled
 */
export function canCancelOrder(status: OrderStatus): boolean {
  return status === 'PENDING' || status === 'PROCESSING';
}

/**
 * Check if order can be modified
 */
export function canModifyOrder(status: OrderStatus): boolean {
  return status === 'PENDING';
}

/**
 * Format order date for display
 */
export function formatOrderDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
}

/**
 * Calculate estimated delivery date (5-7 business days)
 */
export function getEstimatedDeliveryDate(orderDate?: Date): string {
  const date = orderDate || new Date();
  const deliveryDate = new Date(date);
  deliveryDate.setDate(deliveryDate.getDate() + 7);

  return new Intl.DateTimeFormat('en-IN', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(deliveryDate);
}

/**
 * Get order progress percentage based on status
 */
export function getOrderProgress(status: OrderStatus): number {
  const progress: Record<OrderStatus, number> = {
    PENDING: 10,
    PROCESSING: 25,
    CONFIRMED: 50,
    SHIPPED: 75,
    DELIVERED: 100,
    CANCELLED: 0,
    REFUNDED: 0,
  };
  return progress[status];
}

/**
 * Validate Indian postal code
 */
export function isValidIndianPostalCode(postalCode: string): boolean {
  const postalCodeRegex = /^[1-9][0-9]{5}$/;
  return postalCodeRegex.test(postalCode);
}

/**
 * Validate Indian phone number
 */
export function isValidIndianPhone(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  return phoneRegex.test(cleanPhone);
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');
  if (cleanPhone.length === 10) {
    return `${cleanPhone.slice(0, 5)} ${cleanPhone.slice(5)}`;
  }
  return phone;
}
