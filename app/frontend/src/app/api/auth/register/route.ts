import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Map frontend fields to backend fields
    const backendBody = {
      email: body.email,
      password: body.password,
      first_name: body.prenom || body.first_name || '',
      last_name: body.nom || body.last_name || '',
      country: body.pays || body.country || '',
      function: body.fonction || body.function || '',
      sector: body.secteurActivite || body.sector || '',
      phone: body.phone || '',
      organization: body.organization || '',
    };

    const backendRes = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(backendBody),
    });

    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    console.error('[REGISTER PROXY ERROR]', err?.message);
    return NextResponse.json(
      { error: 'Impossible de contacter le serveur. Vérifiez que le backend est démarré.' },
      { status: 503 }
    );
  }
}
