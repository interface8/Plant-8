import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/db/prisma';
import { z } from 'zod';
import { emitEvent } from '@/lib/socket';

const listingSchema = z.object({
  investmentId: z.string().uuid(),
  productId: z.string().uuid(),
  quantityKg: z.number().positive(),
  pricePerKg: z.number().positive(),
  isNegotiable: z.boolean().optional(),
  harvestDate: z.string().datetime().or(z.date()),
  expiryDate: z.string().datetime().or(z.date()).optional(),
  description: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = listingSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error.format() }, { status: 400 });
  }

  const { investmentId, productId, quantityKg, pricePerKg, isNegotiable, harvestDate, expiryDate, description } = validation.data;

  try {
    // Verify the investment belongs to the user
    const investment = await prisma.investment.findUnique({
      where: { id: investmentId },
      select: { userId: true }
    });

    if (!investment || investment.userId !== session.user.id) {
      return NextResponse.json({ error: 'Investment not found or unauthorized' }, { status: 403 });
    }

    const totalValue = quantityKg * pricePerKg;
    const newListing = await prisma.marketplaceListing.create({
      data: {
        investmentId,
        productId,
        quantityKg,
        pricePerKg,
        totalValue,
        isNegotiable: isNegotiable ?? true,
        status: 'PENDING',
        harvestDate: new Date(harvestDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        description,
      },
      include: {
        product: true,
        investment: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              }
            }
          }
        }
      }
    });
    emitEvent('listing:created', newListing, 'marketplace:listings');
    return NextResponse.json(newListing, { status: 201 });
  } catch (error) {
    console.error('Failed to create listing:', error);
    return NextResponse.json({ error: 'Failed to create listing' }, { status: 500 });
  }
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const productId = searchParams.get('productId');

    const where: any = {};
    if (status) where.status = status;
    if (productId) where.productId = productId;

    try {
        const listings = await prisma.marketplaceListing.findMany({
            where,
            include: {
                product: {
                  include: {
                    ProductType: true,
                  }
                },
                investment: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                image: true,
                            }
                        }
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });
        return NextResponse.json(listings);
    } catch (error) {
        console.error('Failed to fetch listings:', error);
        return NextResponse.json({ error: 'Failed to fetch listings' }, { status: 500 });
    }
}
