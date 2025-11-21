import { Heading, Section, Text } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/email-layout';
import { EmailButton } from './components/email-button';

interface OrderDeliveredEmailProps {
  orderNumber: string;
  customerName: string;
  deliveryDate: string;
}

export function OrderDeliveredEmail({
  orderNumber,
  customerName,
  deliveryDate,
}: OrderDeliveredEmailProps) {
  return (
    <EmailLayout preview={`Your order ${orderNumber} has been delivered!`}>
      <Heading style={heading}>✅ Order Delivered!</Heading>

      <Text style={text}>Hi {customerName},</Text>

      <Text style={text}>
        Great news! Your order <strong>#{orderNumber}</strong> was successfully
        delivered on <strong>{deliveryDate}</strong>.
      </Text>

      <Section style={celebrationBox}>
        <Text style={celebrationText}>🎉</Text>
        <Text style={celebrationMessage}>We hope you love your purchase!</Text>
      </Section>

      <Text style={text}>
        We'd love to hear about your experience. Your feedback helps us improve
        and helps other customers make informed decisions.
      </Text>

      <Section style={{ textAlign: 'center', marginTop: '24px' }}>
        <EmailButton
          href={`https://snakzo.com/account/orders/${orderNumber}/review`}
        >
          Leave a Review
        </EmailButton>
      </Section>

      <Text style={text}>
        If you have any issues with your order, please don't hesitate to contact
        our support team. We are here to help!
      </Text>

      <Text style={text}>Thank you for choosing Snakzo!</Text>
    </EmailLayout>
  );
}

// Styles
const heading = {
  fontSize: '28px',
  fontWeight: 'bold',
  color: '#111827',
  marginBottom: '16px',
};

const text = {
  fontSize: '16px',
  color: '#374151',
  lineHeight: '24px',
  marginBottom: '16px',
};

const celebrationBox = {
  backgroundColor: '#f0fdf4',
  border: '2px solid #10b981',
  borderRadius: '8px',
  padding: '32px',
  textAlign: 'center' as const,
  marginTop: '24px',
  marginBottom: '24px',
};

const celebrationText = {
  fontSize: '48px',
  marginBottom: '8px',
};

const celebrationMessage = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#111827',
};
