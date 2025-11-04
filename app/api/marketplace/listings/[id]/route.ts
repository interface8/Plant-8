import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/db/prisma';
import { z } from 'zod';
import { emitEvent } from '@/lib/socket';

const updateListingSchema = z.object({
  pricePerKg: z.number().positive().optional(),
  status: z.string().optional(),
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = updateListingSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error.format() }, { status: 400 });
  }

  try {
    const listing = await prisma.marketplaceListing.findUnique({
        where: { id: params.id },
    });

    if (!listing || listing.investorId !== session.user.id) {
        return NextResponse.json({ error: 'Listing not found or not owned by user' }, { status: 404 });
    }

    const updatedListing = await prisma.marketplaceListing.update({
      where: { id: params.id },
      data: validation.data,
    });

    emitEvent('listing:updated', updatedListing, 'marketplace:listings');
    return NextResponse.json(updatedListing);
  } catch (error) {
    console.error(`Failed to update listing ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update listing' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    const session = await auth();
    if (!session?.user?.id) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const listing = await prisma.marketplaceListing.findUnique({
            where: { id: params.id },
        });

        if (!listing || listing.investorId !== session.user.id) {
            return NextResponse.json({ error: 'Listing not found or not owned by user' }, { status: 404 });
        }

        await prisma.marketplaceListing.delete({
            where: { id: params.id },
        });

        emitEvent('listing:deleted', { id: params.id }, 'marketplace:listings');
        return NextResponse.json({ message: 'Listing deleted' });
    } catch (error) {
        console.error(`Failed to delete listing ${params.id}:`, error);
        return NextResponse.json({ error: 'Failed to delete listing' }, { status: 500 });
    }
}
