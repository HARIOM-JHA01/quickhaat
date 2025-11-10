import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ProfileForm } from '@/components/account/profile-form';
import { User, Mail, Calendar } from 'lucide-react';

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      image: true,
      createdAt: true,
      _count: {
        select: {
          orders: true,
          reviews: true,
          wishlist: true,
        },
      },
    },
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Profile</h2>
        <p className="mt-1 text-sm text-gray-600">
          Manage your personal information
        </p>
      </div>

      {/* Profile Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-linear-to-br from-blue-50 to-blue-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {user._count.orders}
              </p>
            </div>
            <div className="rounded-full bg-blue-500 p-3">
              <User className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-linear-to-br from-purple-50 to-purple-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Reviews</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {user._count.reviews}
              </p>
            </div>
            <div className="rounded-full bg-purple-500 p-3">
              <Mail className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-linear-to-br from-pink-50 to-pink-100 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Wishlist</p>
              <p className="mt-1 text-2xl font-bold text-gray-900">
                {user._count.wishlist}
              </p>
            </div>
            <div className="rounded-full bg-pink-500 p-3">
              <Calendar className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Member Since */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex items-center space-x-2">
          <Calendar className="h-5 w-5 text-gray-500" />
          <span className="text-sm text-gray-600">
            Member since{' '}
            <span className="font-medium text-gray-900">
              {new Date(user.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </span>
        </div>
      </div>

      {/* Profile Form */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Personal Information
        </h3>
        <ProfileForm user={user} />
      </div>
    </div>
  );
}
