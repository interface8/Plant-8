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

  const { investmentId, productId, quantityKg, pricePerKg, isNegotiable } = validation.data;

  try {
    const totalValue = quantityKg * pricePerKg;
    const newListing = await prisma.marketplaceListing.create({
      data: {
        investorId: session.user.id,
        investmentId,
        productId,
        quantityKg,
        pricePerKg,
        totalValue,
        isNegotiable,
        status: 'PENDING',
      },
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
                product: true,
                investor: {
                    select: {
                        name: true,
                        image: true,
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
