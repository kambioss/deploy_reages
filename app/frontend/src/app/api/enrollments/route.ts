import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth, requireAdmin } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const payload = requireAuth(request);
  if (!payload) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all') === 'true';

  if (all) {
    const adminPayload = requireAdmin(request);
    if (!adminPayload) return NextResponse.json({ error: 'Admin requis' }, { status: 403 });
    
    const enrollments = await db.enrollment.findMany({
      include: {
        user: { select: { id: true, nom: true, prenom: true, email: true, pays: true } },
        cours: { select: { id: true, titre: true, categorie: true, niveau: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json({ enrollments });
  }

  // User's own enrollments
  const enrollments = await db.enrollment.findMany({
    where: { userId: payload.userId },
    include: { cours: true },
    orderBy: { createdAt: 'desc' }
  });
  return NextResponse.json({ enrollments });
}

export async function POST(request: NextRequest) {
  const payload = requireAuth(request);
  if (!payload) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const { coursId } = await request.json();
  if (!coursId) return NextResponse.json({ error: 'coursId requis' }, { status: 400 });

  const existing = await db.enrollment.findUnique({
    where: { userId_coursId: { userId: payload.userId, coursId } }
  });
  if (existing) return NextResponse.json({ error: 'Déjà inscrit à ce cours' }, { status: 409 });

  const enrollment = await db.enrollment.create({
    data: { userId: payload.userId, coursId, status: 'pending' }
  });
  return NextResponse.json({ enrollment }, { status: 201 });
}
