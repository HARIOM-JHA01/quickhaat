'use client';

import * as Sentry from '@sentry/nextjs';
import Error from 'next/error';
import { useEffect } from 'react';

export default function GlobalError({ error }: { error: Error }) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center px-4 bg-background">
          <div className="text-center space-y-6 max-w-md">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Application Error</h2>
              <p className="text-muted-foreground">
                A critical error has occurred. Please refresh the page or
                contact support if the problem persists.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
