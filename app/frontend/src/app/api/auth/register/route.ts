import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nom, prenom, email, password, pays, fonction, secteurActivite } = body;

    if (!nom || !prenom || !email || !password || !pays || !fonction || !secteurActivite) {
      return NextResponse.json({ error: 'Tous les champs sont requis' }, { status: 400 });
    }

    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email déjà utilisé' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    
    // First user becomes admin
    const userCount = await db.user.count();
    const role = userCount === 0 ? 'admin' : 'student';

    const user = await db.user.create({
      data: { nom, prenom, email, password: hashedPassword, pays, fonction, secteurActivite, role }
    });

    return NextResponse.json({
      message: 'Compte créé avec succès',
      user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: user.role }
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
