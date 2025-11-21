import { Heading, Section, Text } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/email-layout';
import { EmailButton } from './components/email-button';

interface PasswordResetEmailProps {
  customerName: string;
  resetUrl: string;
  expiresIn: string;
}

export function PasswordResetEmail({
  customerName,
  resetUrl,
  expiresIn,
}: PasswordResetEmailProps) {
  return (
    <EmailLayout preview="Reset your Snakzo password">
      <Heading style={heading}>🔒 Reset Your Password</Heading>

      <Text style={text}>Hi {customerName},</Text>

      <Text style={text}>
        We received a request to reset your password for your Snakzo account. If
        you didn't make this request, you can safely ignore this email.
      </Text>

      <Text style={text}>To reset your password, click the button below:</Text>

      <Section style={{ textAlign: 'center', marginTop: '24px' }}>
        <EmailButton href={resetUrl}>Reset Password</EmailButton>
      </Section>

      <Section style={warningBox}>
        <Text style={warningText}>
          ⚠️ This link will expire in {expiresIn}. If you need a new link,
          please request another password reset.
        </Text>
      </Section>

      <Text style={text}>
        If the button doesn't work, copy and paste this link into your browser:
      </Text>

      <Text style={linkText}>{resetUrl}</Text>

      <Text style={text}>For security reasons, we recommend that you:</Text>

      <Text style={listItem}>• Use a strong, unique password</Text>
      <Text style={listItem}>• Do not share your password with anyone</Text>
      <Text style={listItem}>
        • Enable two-factor authentication (when available)
      </Text>

      <Text style={text}>
        If you have any questions or concerns, please contact our support team.
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

const warningBox = {
  backgroundColor: '#fef3c7',
  border: '1px solid #f59e0b',
  borderRadius: '8px',
  padding: '16px',
  marginTop: '24px',
  marginBottom: '24px',
};

const warningText = {
  fontSize: '14px',
  color: '#92400e',
  margin: 0,
};

const linkText = {
  fontSize: '14px',
  color: '#3b82f6',
  wordBreak: 'break-all' as const,
  marginBottom: '16px',
};

const listItem = {
  fontSize: '14px',
  color: '#374151',
  marginBottom: '8px',
  paddingLeft: '8px',
};
