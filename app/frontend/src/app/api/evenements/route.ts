import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all') === 'true';
  const payload = all ? requireAdmin(request) : null;

  const evenements = await db.evenement.findMany({
    where: all && payload ? {} : { published: true },
    orderBy: { date: 'asc' }
  });
  return NextResponse.json({ evenements });
}

export async function POST(request: NextRequest) {
  const payload = requireAdmin(request);
  if (!payload) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const body = await request.json();
  const evenement = await db.evenement.create({ data: { ...body, date: new Date(body.date) } });
  return NextResponse.json({ evenement }, { status: 201 });
}
