import { Heading, Section, Text } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/email-layout';

interface NewsletterSubscriptionEmailProps {
  customerName: string;
}

export function NewsletterSubscriptionEmail({
  customerName,
}: NewsletterSubscriptionEmailProps) {
  return (
    <EmailLayout preview="You are subscribed to Snakzo newsletter!">
      <Heading style={heading}>📧 Newsletter Subscription Confirmed!</Heading>

      <Text style={text}>Hi {customerName},</Text>

      <Text style={text}>
        Thank you for subscribing to the Snakzo newsletter! You are now part of
        our exclusive community.
      </Text>

      <Section style={benefitsBox}>
        <Heading as="h2" style={subheading}>
          What You Will Receive:
        </Heading>

        <Text style={listItem}>✨ Exclusive deals and promotions</Text>
        <Text style={listItem}>🎁 Early access to new products</Text>
        <Text style={listItem}>💡 Shopping tips and guides</Text>
        <Text style={listItem}>📰 Company news and updates</Text>
      </Section>

      <Text style={text}>
        We promise to send you only valuable content and respect your inbox. You
        can update your preferences or unsubscribe at any time.
      </Text>

      <Text style={text}>
        Stay tuned for exciting updates!
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
  marginBottom: '12px',
};

const text = {
  fontSize: '16px',
  color: '#374151',
  lineHeight: '24px',
  marginBottom: '16px',
};

const benefitsBox = {
  backgroundColor: '#f0f9ff',
  border: '2px solid #3b82f6',
  borderRadius: '8px',
  padding: '24px',
  marginTop: '24px',
  marginBottom: '24px',
};

const listItem = {
  fontSize: '16px',
  color: '#374151',
  marginBottom: '12px',
};
