import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  const evenement = await db.evenement.findUnique({ where: { id: params.id } });
  if (!evenement) return NextResponse.json({ error: 'Non trouvé' }, { status: 404 });
  return NextResponse.json({ evenement });
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const payload = requireAdmin(request);
  if (!payload) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const body = await request.json();
  const evenement = await db.evenement.update({
    where: { id: params.id },
    data: { ...body, date: body.date ? new Date(body.date) : undefined }
  });
  return NextResponse.json({ evenement });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  const payload = requireAdmin(request);
  if (!payload) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  await db.evenement.delete({ where: { id: params.id } });
  return NextResponse.json({ message: 'Supprimé' });
}
