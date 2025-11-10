import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import Link from 'next/link';
import {
  User,
  MapPin,
  ShoppingBag,
  Heart,
  Lock,
  Settings,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth';

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const navigation = [
    {
      name: 'Profile',
      href: '/account',
      icon: User,
    },
    {
      name: 'Addresses',
      href: '/account/addresses',
      icon: MapPin,
    },
    {
      name: 'Orders',
      href: '/account/orders',
      icon: ShoppingBag,
    },
    {
      name: 'Wishlist',
      href: '/account/wishlist',
      icon: Heart,
    },
    {
      name: 'Security',
      href: '/account/security',
      icon: Lock,
    },
    {
      name: 'Settings',
      href: '/account/settings',
      icon: Settings,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="mt-2 text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-1">
            <div className="space-y-2 rounded-lg bg-white p-4 shadow-sm">
              {/* User Info */}
              <div className="mb-6 border-b pb-4">
                <div className="flex items-center space-x-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-purple-600 text-white">
                    <span className="text-lg font-semibold">
                      {session.user.name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase() || 'U'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {session.user.name || 'User'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {session.user.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900"
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                {/* Logout Button */}
                <form
                  action={async () => {
                    'use server';
                    await signOut({ redirectTo: '/' });
                  }}
                >
                  <Button
                    type="submit"
                    variant="ghost"
                    className="w-full justify-start space-x-3 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                  </Button>
                </form>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="lg:col-span-3">
            <div className="rounded-lg bg-white p-6 shadow-sm">{children}</div>
          </main>
        </div>
      </div>
    </div>
  );
}
