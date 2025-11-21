import { Heading, Section, Text, Row, Column } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/email-layout';
import { EmailButton } from './components/email-button';

interface WelcomeEmailProps {
  customerName: string;
}

export function WelcomeEmail({ customerName }: WelcomeEmailProps) {
  return (
    <EmailLayout preview="Welcome to Snakzo!">
      <Heading style={heading}>🎉 Welcome to Snakzo!</Heading>

      <Text style={text}>Hi {customerName},</Text>

      <Text style={text}>
        Thank you for joining Snakzo! We are thrilled to have you as part of our
        community. Get ready to discover amazing products and enjoy a seamless
        shopping experience.
      </Text>

      <Section style={benefitsBox}>
        <Heading as="h2" style={subheading}>
          What You Can Do Now:
        </Heading>

        <Row style={{ marginBottom: '16px' }}>
          <Column>
            <Text style={benefitTitle}>🛍️ Shop Our Collection</Text>
            <Text style={benefitText}>
              Browse thousands of products across all categories
            </Text>
          </Column>
        </Row>

        <Row style={{ marginBottom: '16px' }}>
          <Column>
            <Text style={benefitTitle}>❤️ Create Your Wishlist</Text>
            <Text style={benefitText}>Save your favorite items for later</Text>
          </Column>
        </Row>

        <Row style={{ marginBottom: '16px' }}>
          <Column>
            <Text style={benefitTitle}>📦 Track Your Orders</Text>
            <Text style={benefitText}>
              Stay updated on all your purchases in one place
            </Text>
          </Column>
        </Row>

        <Row>
          <Column>
            <Text style={benefitTitle}>💰 Exclusive Deals</Text>
            <Text style={benefitText}>
              Get access to special offers and promotions
            </Text>
          </Column>
        </Row>
      </Section>

      <Section style={{ textAlign: 'center', marginTop: '32px' }}>
        <EmailButton href="https://snakzo.com/shop">Start Shopping</EmailButton>
      </Section>

      <Text style={text}>
        If you have any questions or need assistance, our support team is always
        here to help.
      </Text>

      <Text style={text}>
        Happy shopping!
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

const benefitsBox = {
  backgroundColor: '#f9fafb',
  borderRadius: '8px',
  padding: '24px',
  marginTop: '24px',
};

const benefitTitle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#111827',
  marginBottom: '4px',
};

const benefitText = {
  fontSize: '14px',
  color: '#6b7280',
  marginTop: '0',
};
