import { Heading, Section, Text, Row, Column } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/email-layout';
import { EmailButton } from './components/email-button';

interface ReviewRequestEmailProps {
  customerName: string;
  orderNumber: string;
  productName: string;
  productImage?: string;
  reviewUrl: string;
}

export function ReviewRequestEmail({
  customerName,
  orderNumber,
  productName,
  reviewUrl,
}: ReviewRequestEmailProps) {
  return (
    <EmailLayout preview="We'd love your feedback!">
      <Heading style={heading}>⭐ How Was Your Experience?</Heading>

      <Text style={text}>Hi {customerName},</Text>

      <Text style={text}>
        We hope you are enjoying your recent purchase! Your feedback is
        incredibly valuable to us and helps other customers make informed
        decisions.
      </Text>

      <Section style={productBox}>
        <Text style={productTitle}>{productName}</Text>
        <Text style={orderInfo}>Order #{orderNumber}</Text>
      </Section>

      <Text style={text}>
        Would you mind taking a moment to share your experience? It only takes a
        minute!
      </Text>

      <Section style={{ textAlign: 'center', marginTop: '24px' }}>
        <EmailButton href={reviewUrl}>Write a Review</EmailButton>
      </Section>

      <Section style={incentiveBox}>
        <Text style={incentiveText}>
          🎁 <strong>Bonus:</strong> Reviews help our community and may earn you
          reward points for future purchases!
        </Text>
      </Section>

      <Text style={text}>
        Thank you for being a valued customer!
        <br />
        The Snakzo Team
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

const text = {
  fontSize: '16px',
  color: '#374151',
  lineHeight: '24px',
  marginBottom: '16px',
};

const productBox = {
  backgroundColor: '#f9fafb',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  padding: '20px',
  textAlign: 'center' as const,
  marginTop: '24px',
  marginBottom: '24px',
};

const productTitle = {
  fontSize: '18px',
  fontWeight: '600',
  color: '#111827',
  marginBottom: '8px',
};

const orderInfo = {
  fontSize: '14px',
  color: '#6b7280',
};

const incentiveBox = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  padding: '16px',
  marginTop: '24px',
  marginBottom: '24px',
};

const incentiveText = {
  fontSize: '14px',
  color: '#92400e',
  textAlign: 'center' as const,
  margin: 0,
};
