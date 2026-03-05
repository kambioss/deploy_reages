/**
 * Normalise un user venant du backend PostgreSQL (snake_case)
 * vers le format attendu par le frontend (camelCase FR).
 */
export function mapUser(raw: any) {
  if (!raw) return null;
  return {
    id:              raw.id,
    email:           raw.email,
    nom:             raw.last_name  ?? raw.nom  ?? '',
    prenom:          raw.first_name ?? raw.prenom ?? '',
    pays:            raw.country    ?? raw.pays  ?? '',
    fonction:        raw.function   ?? raw.fonction ?? '',
    secteurActivite: raw.sector     ?? raw.secteurActivite ?? '',
    role:            raw.role       ?? 'member',
    isActive:        raw.is_active  ?? raw.isActive ?? true,
    createdAt:       raw.created_at ?? raw.createdAt ?? null,
  };
}