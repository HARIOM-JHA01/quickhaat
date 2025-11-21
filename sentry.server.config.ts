import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://2700fb536c947d9c96a1702c3c33d8d7@o4509577132834816.ingest.de.sentry.io/4510340657643600',
  tracesSampleRate: 1,
  enableLogs: true,
  sendDefaultPii: true,
});
