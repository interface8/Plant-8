import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/db/prisma';
import { z } from 'zod';
import { emitEvent } from '@/lib/socket';

const orderSchema = z.object({
  listingId: z.string().uuid(),
  quantityKg: z.number().positive(),
  pricePerKg: z.number().positive(),
});

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = orderSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error.format() }, { status: 400 });
  }

  const { listingId, quantityKg, pricePerKg } = validation.data;

  try {
    // Check if listing exists and has enough quantity
    const listing = await prisma.marketplaceListing.findUnique({
      where: { id: listingId },
    });

    if (!listing || listing.status !== 'ACTIVE' || listing.quantityKg < quantityKg) {
      return NextResponse.json({ error: 'Listing not available or insufficient quantity' }, { status: 400 });
    }

    const totalPrice = quantityKg * pricePerKg;

    const newOrder = await prisma.order.create({
      data: {
        listingId,
        buyerId: session.user.id,
        quantityKg,
        pricePerKg,
        totalPrice,
        status: 'PENDING',
      },
    });

    emitEvent('order:created', newOrder, 'marketplace:orders');
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
