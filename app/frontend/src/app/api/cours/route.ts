import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAdmin, requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const all = searchParams.get('all') === 'true';
  
  const payload = all ? requireAdmin(request) : null;
  
  const cours = await db.cours.findMany({
    where: all && payload ? {} : { published: true },
    include: { enrollments: { select: { id: true, status: true, userId: true } } },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json({ cours });
}

export async function POST(request: NextRequest) {
  const payload = requireAdmin(request);
  if (!payload) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const body = await request.json();
  const { titre, description, contenu, image, instructeur, duree, niveau, categorie, published, prix } = body;

  if (!titre || !description || !contenu || !instructeur || !duree || !niveau || !categorie) {
    return NextResponse.json({ error: 'Champs requis manquants' }, { status: 400 });
  }

  const cours = await db.cours.create({
    data: { titre, description, contenu, image, instructeur, duree, niveau, categorie, published: published || false, prix: prix || 0 }
  });

  return NextResponse.json({ cours }, { status: 201 });
}
