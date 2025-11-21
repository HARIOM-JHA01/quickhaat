'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

export default function UnsubscribeForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [selections, setSelections] = useState({
    promotions: true,
    newsletter: true,
    reviewRequests: true,
  });

  const handleUnsubscribe = async (type: string) => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/email/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, type }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to unsubscribe');
      }

      setIsSuccess(true);
      toast.success('Successfully unsubscribed');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to unsubscribe'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!email) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Request
          </h1>
          <p className="text-gray-600">
            No email address provided. Please use the unsubscribe link from your
            email.
          </p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8 text-center">
          <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Unsubscribed Successfully
          </h1>
          <p className="text-gray-600 mb-6">
            You have been removed from the selected email lists. You can update
            your preferences anytime from your account settings.
          </p>
          <Button onClick={() => (window.location.href = '/')}>
            Return to Homepage
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-sm p-8">
        <div className="text-center mb-8">
          <Mail className="h-12 w-12 text-blue-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Manage Email Preferences
          </h1>
          <p className="text-gray-600">
            We are sorry to see you go! Choose which emails you would like to
            unsubscribe from:
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Email: <strong>{email}</strong>
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="promotions"
                  checked={selections.promotions}
                  onCheckedChange={(checked) =>
                    setSelections({ ...selections, promotions: !!checked })
                  }
                />
                <div className="flex-1">
                  <Label
                    htmlFor="promotions"
                    className="font-semibold text-gray-900 cursor-pointer"
                  >
                    Promotional Emails
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Special offers, sales, and exclusive deals
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="newsletter"
                  checked={selections.newsletter}
                  onCheckedChange={(checked) =>
                    setSelections({ ...selections, newsletter: !!checked })
                  }
                />
                <div className="flex-1">
                  <Label
                    htmlFor="newsletter"
                    className="font-semibold text-gray-900 cursor-pointer"
                  >
                    Newsletter
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Weekly updates, tips, and company news
                  </p>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <Checkbox
                  id="reviewRequests"
                  checked={selections.reviewRequests}
                  onCheckedChange={(checked) =>
                    setSelections({ ...selections, reviewRequests: !!checked })
                  }
                />
                <div className="flex-1">
                  <Label
                    htmlFor="reviewRequests"
                    className="font-semibold text-gray-900 cursor-pointer"
                  >
                    Review Requests
                  </Label>
                  <p className="text-sm text-gray-600 mt-1">
                    Requests to review products you have purchased
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <Button
              onClick={() => {
                const typesToUnsubscribe: string[] = [];
                if (selections.promotions)
                  typesToUnsubscribe.push('promotions');
                if (selections.newsletter)
                  typesToUnsubscribe.push('newsletter');
                if (selections.reviewRequests)
                  typesToUnsubscribe.push('reviewRequests');

                if (typesToUnsubscribe.length === 0) {
                  toast.error('Please select at least one option');
                  return;
                }

                handleUnsubscribe(
                  typesToUnsubscribe.length === 3
                    ? 'all'
                    : typesToUnsubscribe[0]
                );
              }}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Unsubscribe from Selected
            </Button>

            <Button
              variant="outline"
              onClick={() => handleUnsubscribe('all')}
              disabled={isLoading}
              className="w-full"
            >
              Unsubscribe from All Marketing Emails
            </Button>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-900">
              <strong>Note:</strong> You will still receive important
              transactional emails like order confirmations and shipping
              updates. These cannot be turned off as they are essential for your
              orders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
