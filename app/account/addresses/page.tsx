import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AddressCard } from '@/components/account/address-card';
import { AddAddressDialog } from '@/components/account/add-address-dialog';
import { MapPin } from 'lucide-react';

export default async function AddressesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { isDefault: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">My Addresses</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage your shipping and billing addresses
          </p>
        </div>
        <AddAddressDialog />
      </div>

      {addresses.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <MapPin className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No addresses yet
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Add your first address to make checkout faster
          </p>
          <div className="mt-6">
            <AddAddressDialog />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard key={address.id} address={address} />
          ))}
        </div>
      )}
    </div>
  );
}
