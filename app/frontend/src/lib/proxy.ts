import { NextRequest, NextResponse } from 'next/server';

const API_URL = process.env.API_URL || 'http://localhost:3001';

/**
 * Forward a Next.js request to the Express backend.
 * Preserves method, headers (auth cookie/bearer), body, and query params.
 */
export async function proxyRequest(
  request: NextRequest,
  backendPath: string,
  { stripAuth = false }: { stripAuth?: boolean } = {}
): Promise<NextResponse> {
  const url = new URL(request.url);
  const targetUrl = `${API_URL}${backendPath}${url.search}`;

  // Forward auth token from cookie or Authorization header
  const cookieToken = request.cookies.get('token')?.value;
  const authHeader = request.headers.get('authorization');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (!stripAuth) {
    if (cookieToken) headers['Authorization'] = `Bearer ${cookieToken}`;
    else if (authHeader) headers['Authorization'] = authHeader;
  }

  const hasBody = !['GET', 'HEAD', 'DELETE'].includes(request.method);
  let body: string | undefined;
  if (hasBody) {
    try { body = await request.text(); } catch {}
  }

  try {
    const backendRes = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: body || undefined,
    });

    const data = await backendRes.json().catch(() => ({}));
    return NextResponse.json(data, { status: backendRes.status });
  } catch (err: any) {
    console.error(`[PROXY ERROR] ${request.method} ${backendPath}:`, err?.message);
    return NextResponse.json(
      { error: 'Impossible de contacter le serveur. Vérifiez que le backend est démarré.' },
      { status: 503 }
    );
  }
}