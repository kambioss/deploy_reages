import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const payload = requireAdmin(request);
  if (!payload) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const users = await db.user.findMany({
    select: { id: true, nom: true, prenom: true, email: true, pays: true, fonction: true, role: true, isActive: true, createdAt: true, _count: { select: { enrollments: true } } },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ users });
}
