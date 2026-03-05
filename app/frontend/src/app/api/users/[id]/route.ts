import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const payload = requireAdmin(request);
  if (!payload) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const body = await request.json();
  const { role, isActive } = body;
  const user = await db.user.update({
    where: { id: params.id },
    data: { role, isActive },
    select: { id: true, nom: true, prenom: true, email: true, role: true, isActive: true }
  });
  return NextResponse.json({ user });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const payload = requireAdmin(request);
  if (!payload) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  await db.user.delete({ where: { id: params.id } });
  return NextResponse.json({ message: 'Utilisateur supprimé' });
}
