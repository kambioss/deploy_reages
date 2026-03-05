import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all') === 'true';
  const payload = all ? requireAdmin(request) : null;

  const articles = await db.article.findMany({
    where: all && payload ? {} : { published: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ articles });
}

export async function POST(request: NextRequest) {
  const payload = requireAdmin(request);
  if (!payload) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const body = await request.json();
  const article = await db.article.create({ data: body });
  return NextResponse.json({ article }, { status: 201 });
}
