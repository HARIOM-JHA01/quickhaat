import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface EmailLayoutProps {
  preview: string;
  children: React.ReactNode;
}

export function EmailLayout({ preview, children }: EmailLayoutProps) {
  return (
    <Html>
      <Head />
      <Preview>{preview}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Header */}
          <Section style={header}>
            <Img
              src="https://quickhaat.com/logo.png"
              width="120"
              height="40"
              alt="Quickhaat"
              style={logo}
            />
          </Section>

          {/* Content */}
          <Section style={content}>{children}</Section>

          {/* Footer */}
          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} Quickhaat. All rights reserved.
            </Text>
            <Text style={footerText}>
              <Link href="https://quickhaat.com" style={footerLink}>
                Visit our store
              </Link>
              {' · '}
              <Link href="https://quickhaat.com/account" style={footerLink}>
                My Account
              </Link>
              {' · '}
              <Link href="https://quickhaat.com/help" style={footerLink}>
                Help Center
              </Link>
            </Text>
            <Text style={footerText}>
              <Link
                href="{{unsubscribeUrl}}"
                style={{ ...footerLink, color: '#999' }}
              >
                Unsubscribe from these emails
              </Link>
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const header = {
  padding: '32px 24px',
  borderBottom: '1px solid #e5e7eb',
};

const logo = {
  margin: '0 auto',
  display: 'block',
};

const content = {
  padding: '24px',
};

const footer = {
  padding: '24px',
  borderTop: '1px solid #e5e7eb',
};

const footerText = {
  color: '#6b7280',
  fontSize: '12px',
  lineHeight: '16px',
  margin: '8px 0',
  textAlign: 'center' as const,
};

const footerLink = {
  color: '#3b82f6',
  textDecoration: 'none',
};
