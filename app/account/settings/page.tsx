import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { SettingsForm } from '@/components/account/settings-form';
import { Settings as SettingsIcon, Bell, Mail } from 'lucide-react';

export default async function SettingsPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Account Settings</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage your preferences and notification settings
        </p>
      </div>

      {/* Settings Overview */}
      <div className="rounded-lg border border-gray-200 bg-linear-to-br from-purple-50 to-purple-100 p-6">
        <div className="flex items-start space-x-4">
          <div className="rounded-full bg-purple-500 p-3">
            <SettingsIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              Customize Your Experience
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Control how and when you receive notifications from us.
            </p>
          </div>
        </div>
      </div>

      {/* Email Preferences */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center space-x-3">
          <Mail className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Email Preferences
          </h3>
        </div>
        <SettingsForm userId={session.user.id} />
      </div>

      {/* Notification Settings */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center space-x-3">
          <Bell className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Notification Settings
          </h3>
        </div>
        <div className="space-y-4 text-sm text-gray-600">
          <p>
            We&apos;ll send you important updates about your orders and account.
            You can control marketing emails in the preferences above.
          </p>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h3 className="font-semibold text-red-900 mb-2">Danger Zone</h3>
        <p className="text-sm text-red-700 mb-4">
          Once you delete your account, there is no going back. Please be
          certain.
        </p>
        <button
          className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
          disabled
        >
          Delete Account (Coming Soon)
        </button>
      </div>
    </div>
  );
}
