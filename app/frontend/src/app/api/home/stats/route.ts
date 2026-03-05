import { NextRequest, NextResponse } from 'next/server';
import { proxyRequest } from '@/lib/proxy';

/**
 * GET /api/home/stats
 * Returns aggregate stats for the homepage (members, countries, projects, publications).
 * Proxied to backend — falls back to static defaults if backend is unavailable.
 */
export async function GET(request: NextRequest) {
  try {
    const res = await proxyRequest(request, '/api/home/stats');
    return res;
  } catch {
    // Graceful fallback with static numbers
    return NextResponse.json({
      members: 200,
      countries: 15,
      projects: 45,
      publications: 80,
    });
  }
}
