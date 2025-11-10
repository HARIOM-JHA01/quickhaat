import { Resend } from 'resend';

if (!process.env.RESEND_API_KEY) {
  throw new Error('RESEND_API_KEY is not defined in environment variables');
}

export const resend = new Resend(process.env.RESEND_API_KEY);

// Email configuration
export const EMAIL_CONFIG = {
  from: process.env.EMAIL_FROM || 'Quickhaat <noreply@taxurge.com>',
  replyTo: process.env.EMAIL_REPLY_TO || 'support@taxurge.com',
};

// Email attachment type
export interface EmailAttachment {
  filename: string;
  content: Buffer | string;
  contentType?: string;
}

// Email sending helper with error handling and attachment support
export async function sendEmail({
  to,
  subject,
  react,
  attachments,
}: {
  to: string | string[];
  subject: string;
  react: React.ReactElement;
  attachments?: EmailAttachment[];
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: EMAIL_CONFIG.from,
      to,
      subject,
      react,
      attachments: attachments?.map((att) => ({
        filename: att.filename,
        content: att.content,
        ...(att.contentType && { content_type: att.contentType }),
      })),
    });

    if (error) {
      console.error('Email sending error:', error);
      throw new Error(`Failed to send email: ${error.message}`);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
