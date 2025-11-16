import { NextResponse } from 'next/server';
import prisma from '../../../../db/prisma';
import crypto from 'crypto';

const MONNIFY_BASE = process.env.MONNIFY_BASE_URL || 'https://sandbox.monnify.com';
const API_KEY = process.env.MONNIFY_API_KEY;
const SECRET_KEY = process.env.MONNIFY_SECRET_KEY;
const PUBLIC_KEY = process.env.MONNIFY_PUBLIC_KEY;
const CONTRACT_CODE = process.env.MONNIFY_CONTRACT_CODE;
const REDIRECT_URL = process.env.MONNIFY_REDIRECT_URL || '';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { amount, customerName, customerEmail, customerPhone, meta } = body;

    if (!amount || !customerName || !customerEmail) {
      return NextResponse.json({ error: 'Missing payment data' }, { status: 400 });
    }

    // Create an order in DB (buyerId optional to allow guest)
    const order = await prisma.order.create({
      data: {
        totalAmount: Number(amount),
        paymentStatus: 'PENDING',
        deliveryAddress: '', // Will be updated when order items are attached
        customerName: customerName,
        customerEmail: customerEmail,
        customerPhone: customerPhone || undefined,
      },
    });

    const paymentReference = `FAM8-${crypto.randomUUID()}`;

    // Prepare Monnify init request (server-side)
    if (!API_KEY || !SECRET_KEY || !CONTRACT_CODE) {
      // Return order + public key so client can still attempt SDK init in sample mode
      return NextResponse.json({
        orderId: order.id,
        publicKey: PUBLIC_KEY || null,
        paymentReference,
        amount,
        contractCode: CONTRACT_CODE || null,
        customerName,
        customerEmail,
      });
    }

    const initUrl = `${MONNIFY_BASE}/transactions/init-transaction`;
    const payload = {
      amount: Number(amount),
      customerName,
      customerEmail,
      paymentReference,
      currencyCode: 'NGN',
      contractCode: CONTRACT_CODE,
      paymentDescription: meta?.description || 'FAM8 Payment',
      redirectUrl: REDIRECT_URL,
    };

    const auth = Buffer.from(`${API_KEY}:${SECRET_KEY}`).toString('base64');

    const resp = await fetch(initUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${auth}`,
      },
      body: JSON.stringify(payload),
    });

    const json = await resp.json();

    if (!resp.ok) {
      return NextResponse.json({ error: json }, { status: 502 });
    }

    // return necessary info to client (public key used client-side)
    return NextResponse.json({
      orderId: order.id,
      publicKey: PUBLIC_KEY || null,
      paymentReference,
      amount,
      contractCode: CONTRACT_CODE,
      customerName,
      customerEmail,
      monnify: json,
    });
  } catch (err) {
    console.error('Monnify init error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
