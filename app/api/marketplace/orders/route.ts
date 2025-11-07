import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/db/prisma';
import { z } from 'zod';
import { emitEvent } from '@/lib/socket';

const orderSchema = z.object({
  items: z.array(z.object({
    listingId: z.string().uuid(),
    quantityKg: z.number().positive(),
    pricePerKg: z.number().positive(),
  })).min(1, "At least one item is required"),
  deliveryAddress: z.string().min(1),
  customerName: z.string().optional(),
  customerEmail: z.string().email().optional(),
  customerPhone: z.string().optional(),
  notes: z.string().optional(),
});

export async function POST(request: Request) {
  const session = await auth();
  
  const body = await request.json();
  const validation = orderSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error.format() }, { status: 400 });
  }

  const { items, deliveryAddress, customerName, customerEmail, customerPhone, notes } = validation.data;

  try {
    // Validate all listings and check availability
    const listingIds = items.map(item => item.listingId);
    const listings = await prisma.marketplaceListing.findMany({
      where: { id: { in: listingIds } },
      include: {
        investment: {
          include: {
            product: true,
          },
        },
      },
    });

    if (listings.length !== items.length) {
      return NextResponse.json({ error: 'One or more listings not found' }, { status: 400 });
    }

    // Check each listing's availability and quantity
    for (const item of items) {
      const listing = listings.find(l => l.id === item.listingId);
      if (!listing || listing.status !== 'ACTIVE' || listing.quantityKg < item.quantityKg) {
        return NextResponse.json({ 
          error: `Listing ${listing?.investment?.product?.name || item.listingId} not available or insufficient quantity` 
        }, { status: 400 });
      }
    }

    // Calculate total amount
    const totalAmount = items.reduce((sum, item) => sum + (item.quantityKg * item.pricePerKg), 0);

    // Create order with order items in a transaction
    const newOrder = await prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          buyerId: session?.user?.id || null,
          totalAmount,
          deliveryAddress,
          customerName: customerName || session?.user?.name || null,
          customerEmail: customerEmail || session?.user?.email || null,
          customerPhone: customerPhone || null,
          notes,
          status: 'PENDING',
          paymentStatus: 'PENDING',
        },
      });

      // Create order items
      await tx.orderItem.createMany({
        data: items.map(item => ({
          orderId: order.id,
          listingId: item.listingId,
          quantityKg: item.quantityKg,
          pricePerKg: item.pricePerKg,
          subtotal: item.quantityKg * item.pricePerKg,
        })),
      });

      // Fetch the complete order with all relations
      return await tx.order.findUnique({
        where: { id: order.id },
        include: {
          orderItems: {
            include: {
              listing: {
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
                }
              }
            }
          },
          buyer: {
            select: {
              name: true,
              image: true,
            }
          }
        }
      });
    });

    emitEvent('order:created', newOrder, 'marketplace:orders');
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Failed to create order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const orders = await prisma.order.findMany({
      where: {
        buyerId: session.user.id,
      },
      include: {
        orderItems: {
          include: {
            listing: {
              include: {
                product: {
                  include: {
                    ProductType: true,
                  },
                },
                investment: {
                  include: {
                    user: {
                      select: {
                        name: true,
                        image: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
        buyer: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Failed to fetch orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}
