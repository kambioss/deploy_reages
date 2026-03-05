/**
 * REAAGESS — API Service Layer
 *
 * All frontend data fetching goes through these functions.
 * They call the Next.js API proxy routes (/api/...) which forward
 * requests to the Express backend on port 3001.
 *
 * Usage:
 *   const articles = await api.news.getAll();
 *   const projects = await api.projects.getAll();
 */

// ─────────────────────────────────────────────────────────────────────────────
// Base fetcher
// ─────────────────────────────────────────────────────────────────────────────
async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit,
  tags?: string[]
): Promise<T> {
  const url = `/api${endpoint}`;

  const res = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    next: tags ? { tags } : undefined,
    ...options,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new ApiError(
      errorData.error || `HTTP ${res.status}`,
      res.status,
      errorData
    );
  }

  return res.json();
}

// ─────────────────────────────────────────────────────────────────────────────
// Error class
// ─────────────────────────────────────────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: any
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Types (matching backend Prisma schema)
// ─────────────────────────────────────────────────────────────────────────────
export interface Article {
  id: string;
  title_fr: string;
  title_en?: string;
  content_fr: string;
  content_en?: string;
  excerpt_fr?: string;
  excerpt_en?: string;
  imageUrl?: string;
  category?: string;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  author?: { nom: string; prenom: string };
}

export interface Event {
  id: string;
  title_fr: string;
  title_en?: string;
  description_fr?: string;
  description_en?: string;
  location?: string;
  startDate: string;
  endDate?: string;
  imageUrl?: string;
  published: boolean;
}

export interface Project {
  id: string;
  title_fr: string;
  title_en?: string;
  description_fr?: string;
  description_en?: string;
  status: "ONGOING" | "COMPLETED" | "PLANNED";
  category?: string;
  imageUrl?: string;
  createdAt: string;
}

export interface Publication {
  id: string;
  title_fr: string;
  title_en?: string;
  abstract_fr?: string;
  abstract_en?: string;
  authors?: string;
  year?: number;
  type?: string;
  pdfUrl?: string;
  published: boolean;
}

export interface Member {
  id: string;
  nom: string;
  prenom: string;
  pays: string;
  fonction: string;
  secteurActivite: string;
  avatarUrl?: string;
  bio_fr?: string;
  bio_en?: string;
  role: string;
  createdAt: string;
}

export interface HomePageContent {
  hero?: {
    backgroundImages?: string[];
  };
  stats?: {
    members: number;
    countries: number;
    projects: number;
    publications: number;
  };
  featuredArticles?: Article[];
  featuredProjects?: Project[];
}

// ─────────────────────────────────────────────────────────────────────────────
// API namespaces
// ─────────────────────────────────────────────────────────────────────────────

/** Authentication */
export const authApi = {
  login: (email: string, password: string) =>
    apiFetch<{ user: Member; token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  register: (data: Record<string, string>) =>
    apiFetch<{ user: Member; message: string }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: () =>
    apiFetch<{ user: Member }>("/auth/me"),

  logout: () =>
    apiFetch<void>("/auth/logout", { method: "POST" }),
};

/** News / Actualités */
export const newsApi = {
  getAll: (params?: { page?: number; limit?: number; category?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.category) qs.set("category", params.category);
    return apiFetch<{ articles: Article[]; total: number; page: number }>(
      `/actualites?${qs}`,
      undefined,
      ["news"]
    );
  },

  getById: (id: string) =>
    apiFetch<{ article: Article }>(`/actualites/${id}`, undefined, ["news"]),

  create: (data: Partial<Article>) =>
    apiFetch<{ article: Article }>("/actualites", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Article>) =>
    apiFetch<{ article: Article }>(`/actualites/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/actualites/${id}`, { method: "DELETE" }),
};

/** Events / Événements */
export const eventsApi = {
  getAll: (params?: { page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    return apiFetch<{ events: Event[]; total: number }>(
      `/evenements?${qs}`,
      undefined,
      ["events"]
    );
  },

  getById: (id: string) =>
    apiFetch<{ event: Event }>(`/evenements/${id}`, undefined, ["events"]),

  create: (data: Partial<Event>) =>
    apiFetch<{ event: Event }>("/evenements", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Event>) =>
    apiFetch<{ event: Event }>(`/evenements/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/evenements/${id}`, { method: "DELETE" }),
};

/** Projects */
export const projectsApi = {
  getAll: (params?: { status?: string; page?: number; limit?: number }) => {
    const qs = new URLSearchParams();
    if (params?.status) qs.set("status", params.status);
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    return apiFetch<{ projects: Project[]; total: number }>(
      `/projets?${qs}`,
      undefined,
      ["projects"]
    );
  },

  getById: (id: string) =>
    apiFetch<{ project: Project }>(`/projets/${id}`, undefined, ["projects"]),

  create: (data: Partial<Project>) =>
    apiFetch<{ project: Project }>("/projets", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Project>) =>
    apiFetch<{ project: Project }>(`/projets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/projets/${id}`, { method: "DELETE" }),
};

/** Publications */
export const publicationsApi = {
  getAll: (params?: { page?: number; limit?: number; type?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.type) qs.set("type", params.type);
    return apiFetch<{ publications: Publication[]; total: number }>(
      `/publications?${qs}`,
      undefined,
      ["publications"]
    );
  },

  getById: (id: string) =>
    apiFetch<{ publication: Publication }>(`/publications/${id}`),

  create: (data: Partial<Publication>) =>
    apiFetch<{ publication: Publication }>("/publications", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: string, data: Partial<Publication>) =>
    apiFetch<{ publication: Publication }>(`/publications/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/publications/${id}`, { method: "DELETE" }),
};

/** Members / Users */
export const membersApi = {
  getAll: (params?: { page?: number; limit?: number; pays?: string }) => {
    const qs = new URLSearchParams();
    if (params?.page) qs.set("page", String(params.page));
    if (params?.limit) qs.set("limit", String(params.limit));
    if (params?.pays) qs.set("pays", params.pays);
    return apiFetch<{ users: Member[]; total: number }>(
      `/users?${qs}`,
      undefined,
      ["members"]
    );
  },

  getById: (id: string) =>
    apiFetch<{ user: Member }>(`/users/${id}`, undefined, ["members"]),

  update: (id: string, data: Partial<Member>) =>
    apiFetch<{ user: Member }>(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: string) =>
    apiFetch<void>(`/users/${id}`, { method: "DELETE" }),
};

/** Homepage (aggregate endpoint) */
export const homeApi = {
  /** Fetch all data needed for the homepage in one call (if backend supports it)
   *  Falls back to individual calls. */
  getData: async (): Promise<HomePageContent> => {
    try {
      return await apiFetch<HomePageContent>("/home", undefined, ["home"]);
    } catch {
      // Fallback: fetch individually
      const [newsData, projectsData, publicationsData] = await Promise.allSettled([
        newsApi.getAll({ limit: 3 }),
        projectsApi.getAll({ limit: 3 }),
        publicationsApi.getAll({ limit: 3 }),
      ]);

      return {
        featuredArticles:
          newsData.status === "fulfilled" ? newsData.value.articles : [],
        featuredProjects:
          projectsData.status === "fulfilled" ? projectsData.value.projects : [],
      };
    }
  },

  /** Fetch basic stats for the homepage */
  getStats: () =>
    apiFetch<{
      members: number;
      countries: number;
      projects: number;
      publications: number;
    }>("/home/stats", undefined, ["stats"]).catch(() => ({
      members: 200,
      countries: 15,
      projects: 45,
      publications: 80,
    })),
};

// ─────────────────────────────────────────────────────────────────────────────
// Default export (all APIs grouped)
// ─────────────────────────────────────────────────────────────────────────────
export const api = {
  auth: authApi,
  news: newsApi,
  events: eventsApi,
  projects: projectsApi,
  publications: publicationsApi,
  members: membersApi,
  home: homeApi,
};

export default api;
