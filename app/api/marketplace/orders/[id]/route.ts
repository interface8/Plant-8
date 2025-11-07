import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/db/prisma';
import { z } from 'zod';
import { emitEvent } from '@/lib/socket';

const updateOrderSchema = z.object({
  status: z.string(),
});

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const validation = updateOrderSchema.safeParse(body);

  if (!validation.success) {
    return NextResponse.json({ error: validation.error.format() }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({
        where: { id: params.id },
        include: { 
          orderItems: {
            include: {
              listing: {
                include: {
                  investment: {
                    select: {
                      userId: true
                    }
                  }
                }
              }
            }
          },
          buyer: true,
        }
    });

    if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Get all unique seller IDs from order items
    const sellerIds = order.orderItems.map(item => item.listing.investment.userId);
    
    // Allow buyer to cancel, or any seller to update status
    const isAuthorized = order.buyerId === session.user.id || sellerIds.includes(session.user.id);
    
    if (!isAuthorized) {
        return NextResponse.json({ error: 'Not authorized to update this order' }, { status: 403 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id: params.id },
      data: { status: validation.data.status },
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

    emitEvent('order:statusChanged', updatedOrder, 'marketplace:orders');
    return NextResponse.json(updatedOrder);
  } catch (error) {
    console.error(`Failed to update order ${params.id}:`, error);
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 });
  }
}
