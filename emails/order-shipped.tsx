import {
  Heading,
  Hr,
  Section,
  Text,
  Row,
  Column,
} from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/email-layout';
import { EmailButton } from './components/email-button';

interface OrderShippedEmailProps {
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
}

export function OrderShippedEmail({
  orderNumber,
  customerName,
  carrier,
  trackingNumber,
  trackingUrl,
  estimatedDelivery,
  shippingAddress,
}: OrderShippedEmailProps) {
  return (
    <EmailLayout preview={`Your order ${orderNumber} has shipped!`}>
      <Heading style={heading}>📦 Your Order Has Shipped!</Heading>

      <Text style={text}>Hi {customerName},</Text>

      <Text style={text}>
        Great news! Your order has been shipped and is on its way to you.
      </Text>

      <Section style={trackingBox}>
        <Row>
          <Column>
            <Text style={label}>Order Number</Text>
            <Text style={value}>{orderNumber}</Text>
          </Column>
          <Column>
            <Text style={label}>Carrier</Text>
            <Text style={value}>{carrier}</Text>
          </Column>
        </Row>
        <Row style={{ marginTop: '16px' }}>
          <Column>
            <Text style={label}>Tracking Number</Text>
            <Text style={value}>{trackingNumber}</Text>
          </Column>
          <Column>
            <Text style={label}>Estimated Delivery</Text>
            <Text style={value}>{estimatedDelivery}</Text>
          </Column>
        </Row>
      </Section>

      <Section style={{ textAlign: 'center', marginTop: '24px' }}>
        <EmailButton href={trackingUrl}>Track Your Package</EmailButton>
      </Section>

      <Hr style={hr} />

      <Section>
        <Heading as="h2" style={subheading}>
          Shipping To
        </Heading>
        <Text style={address}>
          {shippingAddress.street}
          <br />
          {shippingAddress.city}, {shippingAddress.state}{' '}
          {shippingAddress.postalCode}
          <br />
          {shippingAddress.country}
        </Text>
      </Section>

      <Text style={text}>
        Thanks for shopping with us! If you have any questions about your
        shipment, please don't hesitate to contact us.
      </Text>
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

const subheading = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#111827',
  marginBottom: '12px',
};

const text = {
  fontSize: '16px',
  color: '#374151',
  lineHeight: '24px',
  marginBottom: '16px',
};

const trackingBox = {
  backgroundColor: '#f0f9ff',
  border: '2px solid #3b82f6',
  borderRadius: '8px',
  padding: '20px',
  marginTop: '24px',
};

const label = {
  fontSize: '12px',
  color: '#6b7280',
  textTransform: 'uppercase' as const,
  marginBottom: '4px',
};

const value = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#111827',
};

const hr = {
  borderColor: '#e5e7eb',
  margin: '24px 0',
};

const address = {
  fontSize: '14px',
  color: '#374151',
  lineHeight: '20px',
};
