import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const cours = await db.cours.findUnique({
    where: { id: params.id },
    include: { enrollments: { include: { user: { select: { id: true, nom: true, prenom: true, email: true } } } } }
  });
  if (!cours) return NextResponse.json({ error: 'Cours non trouvé' }, { status: 404 });
  return NextResponse.json({ cours });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const payload = requireAdmin(request);
  if (!payload) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const body = await request.json();
  const cours = await db.cours.update({ where: { id: params.id }, data: body });
  return NextResponse.json({ cours });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const payload = requireAdmin(request);
  if (!payload) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  await db.cours.delete({ where: { id: params.id } });
  return NextResponse.json({ message: 'Cours supprimé' });
}
