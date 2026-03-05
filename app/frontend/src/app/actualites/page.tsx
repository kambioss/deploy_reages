"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { FileText, Calendar, ArrowRight, Tag, Search } from "lucide-react";
import Link from "next/link";

interface Actualite {
  id: string;
  titre: string;
  auteur: string;
  categorie: string;
  date?: string;
  createdAt: string;
  contenu: string;
  image?: string;
}

// Fallback static data when no backend data is available
const STATIC_ACTUALITES: Actualite[] = [
  { id: "1", titre: "REAAGESS signe un partenariat avec l'Agence Spatiale Africaine", createdAt: "2026-02-15", categorie: "Partenariat", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop", auteur: "REAAGESS", contenu: "Un accord de collaboration stratégique pour renforcer les capacités géospatiales africaines a été signé lors du sommet de Nairobi." },
  { id: "2", titre: "Lancement du programme de formation en télédétection avancée", createdAt: "2026-02-10", categorie: "Formation", image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=400&h=250&fit=crop", auteur: "REAAGESS", contenu: "REAAGESS ouvre les inscriptions pour sa nouvelle formation certifiante en télédétection appliquée aux enjeux africains." },
  { id: "3", titre: "Conférence internationale de géomatique africaine 2026 — Save the date", createdAt: "2026-02-05", categorie: "Événement", image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop", auteur: "REAAGESS", contenu: "La 3ème édition de la conférence annuelle de REAAGESS aura lieu à Abidjan en juin 2026." },
  { id: "4", titre: "Nouveau rapport : état des données géospatiales ouvertes en Afrique", createdAt: "2026-02-01", categorie: "Publication", image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=400&h=250&fit=crop", auteur: "REAAGESS", contenu: "REAAGESS publie son rapport annuel sur l'accessibilité et la qualité des données géospatiales open-source sur le continent africain." },
  { id: "5", titre: "Appel à projets : Géomatique et Changement Climatique 2026", createdAt: "2026-01-25", categorie: "Appel à projets", image: "https://images.unsplash.com/photo-1614728263952-84ea256f9d1d?w=400&h=250&fit=crop", auteur: "REAAGESS", contenu: "REAAGESS lance un appel à projets pour soutenir des initiatives géospatiales innovantes liées à l'adaptation au changement climatique." },
  { id: "6", titre: "Webinaire : Introduction au Machine Learning pour la télédétection", createdAt: "2026-01-20", categorie: "Formation", image: "https://images.unsplash.com/photo-1614728263952-84ea256f9d1d?w=400&h=250&fit=crop", auteur: "REAAGESS", contenu: "Inscrivez-vous au prochain webinaire de REAAGESS sur l'application des algorithmes ML à l'analyse des images satellitaires." },
];

const catColors: Record<string, string> = {
  "Partenariat": "bg-purple-100 text-purple-700",
  "Formation": "bg-emerald-100 text-emerald-700",
  "Événement": "bg-blue-100 text-blue-700",
  "Publication": "bg-orange-100 text-orange-700",
  "Appel à projets": "bg-cyan-100 text-cyan-700",
  "partenariat": "bg-purple-100 text-purple-700",
  "formation": "bg-emerald-100 text-emerald-700",
  "evenement": "bg-blue-100 text-blue-700",
  "publication": "bg-orange-100 text-orange-700",
  "actualite": "bg-cyan-100 text-cyan-700",
};

function getDate(a: Actualite) {
  const d = a.date || a.createdAt;
  return new Date(d).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

function getExcerpt(contenu: string, max = 140) {
  const stripped = contenu.replace(/<[^>]+>/g, "");
  return stripped.length > max ? stripped.slice(0, max) + "…" : stripped;
}

export default function Actualites() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("Tous");

  useEffect(() => {
    fetch("/api/actualites")
      .then(r => r.json())
      .then(data => {
        const items: Actualite[] = data.actualites || data.data || [];
        setActualites(items.length > 0 ? items : STATIC_ACTUALITES);
      })
      .catch(() => setActualites(STATIC_ACTUALITES))
      .finally(() => setLoading(false));
  }, []);

  const categories = ["Tous", ...Array.from(new Set(actualites.map(a => a.categorie).filter(Boolean)))];

  const filtered = actualites.filter(a => {
    const matchCat = activeFilter === "Tous" || a.categorie === activeFilter;
    const matchSearch = !search || a.titre.toLowerCase().includes(search.toLowerCase()) || a.contenu.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = filtered[0];
  const rest = filtered.slice(1);

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        icon={<FileText className="w-10 h-10 text-white" />}
        label="Actualités"
        title="Actualités REAAGESS"
        subtitle="Restez informé des dernières nouvelles, publications et événements du réseau"
        gradient="from-[#0a1628] via-[#0c1a40] to-[#0a2030]"
      />

      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">

          {/* Search + Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher une actualité..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${activeFilter === cat ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-cyan-500 border-t-transparent rounded-full mx-auto mb-3" />
              <p className="text-slate-400 text-sm">Chargement des actualités...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <FileText size={48} className="mx-auto mb-4 opacity-30" />
              <p>Aucune actualité trouvée.</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <div className="mb-10">
                  <Link href={`/actualites/${featured.id}`}>
                    <div className="card-hover group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm grid md:grid-cols-2 cursor-pointer">
                      <div className="relative overflow-hidden h-64 md:h-auto">
                        <img
                          src={featured.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&h=400&fit=crop"}
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                        <span className="absolute top-4 left-4 bg-cyan-500 text-white text-xs font-bold px-3 py-1 rounded-full">À LA UNE</span>
                      </div>
                      <div className="p-8 flex flex-col justify-center">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-4 w-fit font-sans ${catColors[featured.categorie] || "bg-gray-100 text-gray-600"}`}>
                          <Tag className="h-3 w-3" />{featured.categorie}
                        </span>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-cyan-700 transition-colors">{featured.titre}</h2>
                        <p className="text-slate-500 text-sm leading-relaxed mb-4 font-sans">{getExcerpt(featured.contenu, 200)}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-slate-400" />
                            <span className="text-xs text-slate-400 font-sans">{getDate(featured)}</span>
                          </div>
                          <span className="inline-flex items-center gap-1.5 text-cyan-600 font-semibold text-sm group-hover:text-cyan-700">
                            Lire la suite <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )}

              {/* Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rest.map((a, i) => (
                  <Link
                    key={a.id}
                    href={`/actualites/${a.id}`}
                    className="card-hover group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-md transition-all"
                    style={{ animationDelay: `${i * 80}ms` }}
                  >
                    <div className="relative overflow-hidden h-44">
                      <img
                        src={a.image || "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop"}
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full font-sans ${catColors[a.categorie] || "bg-white/90 text-gray-700"}`}>
                        {a.categorie}
                      </span>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <Calendar className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-xs text-slate-400 font-sans">{getDate(a)}</span>
                      </div>
                      <h3 className="font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-cyan-700 transition-colors">{a.titre}</h3>
                      <p className="text-slate-500 text-sm leading-relaxed font-sans line-clamp-3">{getExcerpt(a.contenu)}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-cyan-600 font-semibold text-xs hover:text-cyan-700 transition-colors font-sans">
                        Lire la suite <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
