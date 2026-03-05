import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  const payload = requireAuth(request);
  if (!payload) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const user = await db.user.findUnique({
    where: { id: payload.userId },
    select: { id: true, nom: true, prenom: true, email: true, pays: true, fonction: true, secteurActivite: true, role: true, isActive: true, createdAt: true }
  });

  if (!user) return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
  return NextResponse.json({ user });
}
