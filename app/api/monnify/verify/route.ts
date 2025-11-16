import { NextResponse } from 'next/server';
import prisma from '../../../../db/prisma';

const MONNIFY_BASE = process.env.MONNIFY_BASE_URL || 'https://api.monnify.com/api/v2';
const API_KEY = process.env.MONNIFY_API_KEY;
const SECRET_KEY = process.env.MONNIFY_SECRET_KEY;

export async function POST(req: Request) {
  try {
    const { paymentReference, orderId } = await req.json();

    if (!paymentReference) {
      return NextResponse.json({ error: 'Missing paymentReference' }, { status: 400 });
    }

    if (!API_KEY || !SECRET_KEY) {
      // Dev mode: mark order as PAID for testing
      if (orderId) {
        await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: 'PAID', status: 'CONFIRMED' } });
      }
      return NextResponse.json({ status: 'PAID', debug: 'dev-mode' });
    }

    const url = `${MONNIFY_BASE}/transactions/${encodeURIComponent(paymentReference)}`;
    const auth = Buffer.from(`${API_KEY}:${SECRET_KEY}`).toString('base64');

    const resp = await fetch(url, { headers: { Authorization: `Basic ${auth}` } });
    const json = await resp.json();

    if (!resp.ok) {
      return NextResponse.json({ error: json }, { status: 502 });
    }

    const status = json.responseMessage || json.status || (json.response && json.response.paymentStatus) || 'UNKNOWN';

    if (orderId && status && status.toUpperCase().includes('PAID')) {
      await prisma.order.update({ where: { id: orderId }, data: { paymentStatus: 'PAID', status: 'CONFIRMED' } });
    }

    return NextResponse.json({ status: status, raw: json });
  } catch (err) {
    console.error('Monnify verify error', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
