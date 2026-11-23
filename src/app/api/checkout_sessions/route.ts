import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

/**
 * POST /api/checkout_sessions
 * Next.js API route that initiates a Stripe Checkout Session via the backend
 */
export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization') || '';
    const body = await req.json();

    const response = await fetch(`${API_BASE_URL}/payments/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.message || data?.error || 'Failed to create checkout session' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      url: data?.data?.url || data?.url,
      sessionId: data?.data?.sessionId || data?.sessionId,
      data: data?.data,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Internal server error creating checkout session' },
      { status: 500 }
    );
  }
}
