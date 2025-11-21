import { Heading, Section, Text, Row, Column } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/email-layout';
import { EmailButton } from './components/email-button';

interface CartItem {
  name: string;
  price: number;
  image?: string;
}

interface AbandonedCartEmailProps {
  customerName: string;
  items: CartItem[];
  cartUrl: string;
}

export function AbandonedCartEmail({
  customerName,
  items,
  cartUrl,
}: AbandonedCartEmailProps) {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <EmailLayout preview="You left something in your cart!">
      <Heading style={heading}>🛒 Your Cart is Waiting!</Heading>

      <Text style={text}>Hi {customerName},</Text>

      <Text style={text}>
        We noticed you left some items in your cart. Do not miss out on these
        great products!
      </Text>

      <Section style={cartBox}>
        <Heading as="h2" style={subheading}>
          Items in Your Cart
        </Heading>
        {items.slice(0, 3).map((item, index) => (
          <Section key={index} style={itemContainer}>
            <Row>
              <Column>
                <Text style={itemTitle}>{item.name}</Text>
              </Column>
              <Column style={{ textAlign: 'right' }}>
                <Text style={itemPrice}>${item.price.toFixed(2)}</Text>
              </Column>
            </Row>
          </Section>
        ))}
        {items.length > 3 && (
          <Text style={moreItems}>
            +{items.length - 3} more {items.length - 3 === 1 ? 'item' : 'items'}
          </Text>
        )}
      </Section>

      <Section style={totalBox}>
        <Row>
          <Column>
            <Text style={totalLabel}>Cart Total:</Text>
          </Column>
          <Column style={{ textAlign: 'right' }}>
            <Text style={totalValue}>${total.toFixed(2)}</Text>
          </Column>
        </Row>
      </Section>

      <Section style={{ textAlign: 'center', marginTop: '32px' }}>
        <EmailButton href={cartUrl}>Complete Your Purchase</EmailButton>
      </Section>

      <Section style={urgencyBox}>
        <Text style={urgencyText}>
          ⏰ <strong>Hurry!</strong> Items in your cart are selling fast and may
          go out of stock soon.
        </Text>
      </Section>

      <Text style={text}>Questions? Our support team is here to help!</Text>
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
  marginBottom: '16px',
};

const text = {
  fontSize: '16px',
  color: '#374151',
  lineHeight: '24px',
  marginBottom: '16px',
};

const cartBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  marginTop: '24px',
};

const itemContainer = {
  marginBottom: '12px',
  paddingBottom: '12px',
  borderBottom: '1px solid #e5e7eb',
};

const itemTitle = {
  fontSize: '16px',
  color: '#111827',
  marginBottom: '4px',
};

const itemPrice = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#111827',
};

const moreItems = {
  fontSize: '14px',
  color: '#6b7280',
  fontStyle: 'italic' as const,
  marginTop: '8px',
};

const totalBox = {
  backgroundColor: '#eff6ff',
  borderRadius: '8px',
  padding: '16px',
  marginTop: '16px',
};

const totalLabel = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#111827',
};

const totalValue = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#3b82f6',
};

const urgencyBox = {
  backgroundColor: '#fef2f2',
  border: '1px solid #ef4444',
  borderRadius: '8px',
  padding: '16px',
  marginTop: '24px',
  marginBottom: '24px',
};

const urgencyText = {
  fontSize: '14px',
  color: '#991b1b',
  textAlign: 'center' as const,
  margin: 0,
};
