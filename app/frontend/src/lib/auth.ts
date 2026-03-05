import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'reaagess-secret-key-2024';

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string; email: string; role: string };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(request: NextRequest) {
  const cookieToken = request.cookies.get('token')?.value;
  const authHeader = request.headers.get('authorization');
  const headerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;
  return cookieToken || headerToken || null;
}

export function requireAuth(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) return null;
  return verifyToken(token);
}

export function requireAdmin(request: NextRequest) {
  const payload = requireAuth(request);
  if (!payload) return null;
  if (payload.role !== 'admin') return null;
  return payload;
}
