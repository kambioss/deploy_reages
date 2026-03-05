import { NextRequest, NextResponse } from 'next/server';
import { mapUser } from '@/lib/user-mapper';

const API_URL = process.env.API_URL || 'http://localhost:3001';

export async function GET(request: NextRequest) {
  try {
    const cookieToken = request.cookies.get('token')?.value;
    const authHeader = request.headers.get('authorization');
    const token = cookieToken || (authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null);

    if (!token) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
    }

    const backendRes = await fetch(`${API_URL}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await backendRes.json();

    if (!backendRes.ok) {
      return NextResponse.json(data, { status: backendRes.status });
    }

    return NextResponse.json({ user: mapUser(data.user) }, { status: 200 });
  } catch (err: any) {
    console.error('[ME PROXY ERROR]', err?.message);
    return NextResponse.json(
      { error: 'Impossible de contacter le serveur.' },
      { status: 503 }
    );
  }
}