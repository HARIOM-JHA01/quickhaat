import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { ChangePasswordForm } from '@/components/account/change-password-form';
import { Shield, Lock } from 'lucide-react';

export default async function SecurityPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Security</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage your password and account security
        </p>
      </div>

      {/* Security Overview */}
      <div className="rounded-lg border border-gray-200 bg-linear-to-br from-blue-50 to-blue-100 p-6">
        <div className="flex items-start space-x-4">
          <div className="rounded-full bg-blue-500 p-3">
            <Shield className="h-6 w-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">Account Security</h3>
            <p className="mt-1 text-sm text-gray-600">
              Keep your account secure by using a strong password and updating
              it regularly.
            </p>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-6 flex items-center space-x-3">
          <Lock className="h-5 w-5 text-gray-500" />
          <h3 className="text-lg font-semibold text-gray-900">
            Change Password
          </h3>
        </div>
        <ChangePasswordForm />
      </div>

      {/* Security Tips */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Security Tips</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Use a unique password that you don&apos;t use elsewhere</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>
              Use at least 8 characters with a mix of letters, numbers, and
              symbols
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Don&apos;t share your password with anyone</span>
          </li>
          <li className="flex items-start">
            <span className="mr-2">•</span>
            <span>Change your password regularly (every 3-6 months)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
