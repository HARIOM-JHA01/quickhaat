import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { WishlistItem } from '@/components/account/wishlist-item';
import { Heart } from 'lucide-react';

export default async function WishlistPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const wishlist = await prisma.wishlist.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        include: {
          images: {
            take: 1,
            orderBy: { position: 'asc' },
          },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">My Wishlist</h2>
        <p className="mt-1 text-sm text-gray-600">
          {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
          <Heart className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Your wishlist is empty
          </h3>
          <p className="mt-2 text-sm text-gray-600">
            Save items you love to buy them later
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {wishlist.map((item) => (
            <WishlistItem key={item.id} wishlistItem={item} />
          ))}
        </div>
      )}
    </div>
  );
}
