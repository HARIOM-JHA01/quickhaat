'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsFormProps {
  userId: string;
}

export function SettingsForm({ userId }: SettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [settings, setSettings] = useState({
    emailOrderUpdates: true,
    emailPromotions: false,
    emailNewsletter: false,
    emailReviewRequests: true,
  });

  useEffect(() => {
    // Fetch user settings
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/account/settings');
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setIsFetching(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/account/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update settings');
      }

      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to update settings'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailOrderUpdates">Order Updates</Label>
            <p className="text-sm text-gray-500">
              Receive emails about your order status and shipping updates
            </p>
          </div>
          <Switch
            id="emailOrderUpdates"
            checked={settings.emailOrderUpdates}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, emailOrderUpdates: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailPromotions">Promotional Emails</Label>
            <p className="text-sm text-gray-500">
              Receive emails about special offers and sales
            </p>
          </div>
          <Switch
            id="emailPromotions"
            checked={settings.emailPromotions}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, emailPromotions: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailNewsletter">Newsletter</Label>
            <p className="text-sm text-gray-500">
              Receive our weekly newsletter with tips and updates
            </p>
          </div>
          <Switch
            id="emailNewsletter"
            checked={settings.emailNewsletter}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, emailNewsletter: checked })
            }
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="emailReviewRequests">Review Requests</Label>
            <p className="text-sm text-gray-500">
              Receive emails asking you to review products you&apos;ve purchased
            </p>
          </div>
          <Switch
            id="emailReviewRequests"
            checked={settings.emailReviewRequests}
            onCheckedChange={(checked) =>
              setSettings({ ...settings, emailReviewRequests: checked })
            }
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Preferences
        </Button>
      </div>
    </form>
  );
}
