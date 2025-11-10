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

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface OrderConfirmationEmailProps {
  orderNumber: string;
  customerName: string;
  orderDate: string;
  items: OrderItem[];
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
}

export function OrderConfirmationEmail({
  orderNumber,
  customerName,
  orderDate,
  items,
  subtotal,
  shipping,
  tax,
  total,
  shippingAddress,
}: OrderConfirmationEmailProps) {
  return (
    <EmailLayout preview={`Order ${orderNumber} confirmed`}>
      <Heading style={heading}>Order Confirmed!</Heading>

      <Text style={text}>Hi {customerName},</Text>

      <Text style={text}>
        Thank you for your order! We're getting your items ready for shipment.
        You'll receive another email when your order has shipped.
      </Text>

      <Section style={orderInfo}>
        <Row>
          <Column>
            <Text style={label}>Order Number</Text>
            <Text style={value}>{orderNumber}</Text>
          </Column>
          <Column>
            <Text style={label}>Order Date</Text>
            <Text style={value}>{orderDate}</Text>
          </Column>
        </Row>
      </Section>

      <Hr style={hr} />

      {/* Order Items */}
      <Section>
        <Heading as="h2" style={subheading}>
          Order Items
        </Heading>
        {items.map((item, index) => (
          <Section key={index} style={itemContainer}>
            <Row>
              <Column style={{ width: '70%' }}>
                <Text style={itemName}>{item.name}</Text>
                <Text style={itemDetails}>Quantity: {item.quantity}</Text>
              </Column>
              <Column style={{ width: '30%', textAlign: 'right' }}>
                <Text style={itemPrice}>${item.price.toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>
        ))}
      </Section>

      <Hr style={hr} />

      {/* Order Summary */}
      <Section style={summary}>
        <Row>
          <Column>
            <Text style={summaryLabel}>Subtotal</Text>
          </Column>
          <Column style={{ textAlign: 'right' }}>
            <Text style={summaryValue}>${subtotal.toFixed(2)}</Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={summaryLabel}>Shipping</Text>
          </Column>
          <Column style={{ textAlign: 'right' }}>
            <Text style={summaryValue}>${shipping.toFixed(2)}</Text>
          </Column>
        </Row>
        <Row>
          <Column>
            <Text style={summaryLabel}>Tax</Text>
          </Column>
          <Column style={{ textAlign: 'right' }}>
            <Text style={summaryValue}>${tax.toFixed(2)}</Text>
          </Column>
        </Row>
        <Hr style={hr} />
        <Row>
          <Column>
            <Text style={totalLabel}>Total</Text>
          </Column>
          <Column style={{ textAlign: 'right' }}>
            <Text style={totalValue}>${total.toFixed(2)}</Text>
          </Column>
        </Row>
      </Section>

      <Hr style={hr} />

      {/* Shipping Address */}
      <Section>
        <Heading as="h2" style={subheading}>
          Shipping Address
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

      <Section style={{ textAlign: 'center', marginTop: '32px' }}>
        <EmailButton
          href={`https://quickhaat.com/account/orders/${orderNumber}`}
        >
          View Order Details
        </EmailButton>
      </Section>

      <Text style={text}>
        If you have any questions, please contact our support team.
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

const orderInfo = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '24px',
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

const itemContainer = {
  marginBottom: '16px',
};

const itemName = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#111827',
  marginBottom: '4px',
};

const itemDetails = {
  fontSize: '14px',
  color: '#6b7280',
};

const itemPrice = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#111827',
};

const summary = {
  marginTop: '24px',
};

const summaryLabel = {
  fontSize: '14px',
  color: '#6b7280',
  marginBottom: '8px',
};

const summaryValue = {
  fontSize: '14px',
  color: '#111827',
  marginBottom: '8px',
};

const totalLabel = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#111827',
};

const totalValue = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#111827',
};

const address = {
  fontSize: '14px',
  color: '#374151',
  lineHeight: '20px',
};
