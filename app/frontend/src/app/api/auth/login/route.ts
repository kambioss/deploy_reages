import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const backendRes = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    // Poser le cookie httpOnly avec le token retourné par le backend
    const response = NextResponse.json(data, { status: 200 });

    if (data.token) {
      response.cookies.set('token', data.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
      });
    }

    return response;
  } catch (err: any) {
    console.error('[LOGIN PROXY ERROR]', err?.message);
    return NextResponse.json(
      { error: 'Impossible de contacter le serveur. Vérifiez que le backend est démarré.' },
      { status: 503 }
    );
  }
}