import { Heading, Section, Text } from '@react-email/components';
import * as React from 'react';
import { EmailLayout } from './components/email-layout';
import { EmailButton } from './components/email-button';

interface EmailVerificationEmailProps {
  customerName: string;
  verificationUrl: string;
  expiresIn: string;
}

export function EmailVerificationEmail({
  customerName,
  verificationUrl,
  expiresIn,
}: EmailVerificationEmailProps) {
  return (
    <EmailLayout preview="Verify your email address">
      <Heading style={heading}>✉️ Verify Your Email</Heading>

      <Text style={text}>Hi {customerName},</Text>

      <Text style={text}>
        Welcome to Quickhaat! To complete your registration and start shopping,
        please verify your email address.
      </Text>

      <Section style={{ textAlign: 'center', marginTop: '24px' }}>
        <EmailButton href={verificationUrl}>Verify Email Address</EmailButton>
      </Section>

      <Section style={infoBox}>
        <Text style={infoText}>
          This verification link will expire in {expiresIn}. If you need a new
          link, please request another verification email.
        </Text>
      </Section>

      <Text style={text}>
        If the button doesn't work, copy and paste this link into your browser:
      </Text>

      <Text style={linkText}>{verificationUrl}</Text>

      <Text style={text}>
        If you didn't create an account with Quickhaat, you can safely ignore
        this email.
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

const infoBox = {
  backgroundColor: '#eff6ff',
  border: '1px solid #3b82f6',
  borderRadius: '8px',
  padding: '16px',
  marginTop: '24px',
  marginBottom: '24px',
};

const infoText = {
  fontSize: '14px',
  color: '#1e40af',
  margin: 0,
};

const linkText = {
  fontSize: '14px',
  color: '#3b82f6',
  wordBreak: 'break-all' as const,
  marginBottom: '16px',
};
