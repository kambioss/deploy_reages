import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const payload = requireAdmin(request);
  if (!payload) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { status } = await request.json();
  if (!['pending', 'approved', 'rejected'].includes(status)) {
    return NextResponse.json({ error: 'Statut invalide' }, { status: 400 });
  }

  const enrollment = await db.enrollment.update({
    where: { id: params.id },
    data: { status },
    include: { user: { select: { nom: true, prenom: true, email: true } }, cours: { select: { titre: true } } }
  });
  return NextResponse.json({ enrollment });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const payload = requireAdmin(request);
  if (!payload) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  await db.enrollment.delete({ where: { id: params.id } });
  return NextResponse.json({ message: 'Inscription supprimée' });
}
