import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { setCacheHeaders, CACHE_DURATIONS } from '@/lib/api-cache';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await prisma.product.findUnique({
      where: {
        slug,
        isActive: true,
      },
      include: {
        images: {
          orderBy: {
            position: 'asc',
          },
        },
        variants: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        brand: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
          orderBy: {
            createdAt: 'desc',
          },
          take: 10,
        },
        _count: {
          select: {
            reviews: true,
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Calculate average rating
    const avgRating =
      product.reviews.length > 0
        ? product.reviews.reduce((acc, review) => acc + review.rating, 0) /
          product.reviews.length
        : 0;

    // Get related products from the same category
    const relatedProducts = product.categoryId
      ? await prisma.product.findMany({
          where: {
            categoryId: product.categoryId,
            isActive: true,
            NOT: {
              id: product.id,
            },
          },
          include: {
            images: {
              orderBy: {
                position: 'asc',
              },
              take: 1,
            },
            brand: {
              select: {
                name: true,
              },
            },
          },
          take: 4,
          orderBy: {
            createdAt: 'desc',
          },
        })
      : [];

    const response = NextResponse.json({
      ...product,
      avgRating,
      totalReviews: product._count.reviews,
      relatedProducts,
    });

    // Cache product data for 1 hour
    return setCacheHeaders(response, CACHE_DURATIONS.MEDIUM);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
