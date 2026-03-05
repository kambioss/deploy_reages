import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const payload = requireAdmin(request);
  if (!payload) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const body = await request.json();
  const actualite = await db.actualite.update({ where: { id: params.id }, data: body });
  return NextResponse.json({ actualite });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const payload = requireAdmin(request);
  if (!payload) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  await db.actualite.delete({ where: { id: params.id } });
  return NextResponse.json({ message: 'Supprimé' });
}
