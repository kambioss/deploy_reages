import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all') === 'true';
  const payload = all ? requireAdmin(request) : null;

  const projets = await db.projet.findMany({
    where: all && payload ? {} : { published: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ projets });
}

export async function POST(request: NextRequest) {
  const payload = requireAdmin(request);
  if (!payload) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const body = await request.json();
  const projet = await db.projet.create({ data: body });
  return NextResponse.json({ projet }, { status: 201 });
}
