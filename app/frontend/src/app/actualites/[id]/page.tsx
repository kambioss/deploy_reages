"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, Share2, Clock } from "lucide-react";

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

const catColors: Record<string, string> = {
  "partenariat": "bg-purple-100 text-purple-700",
  "formation": "bg-emerald-100 text-emerald-700",
  "evenement": "bg-blue-100 text-blue-700",
  "publication": "bg-orange-100 text-orange-700",
  "actualite": "bg-cyan-100 text-cyan-700",
  "annonce": "bg-pink-100 text-pink-700",
};

function estimateReadTime(text: string) {
  const words = text.split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export default function ActualiteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [actualite, setActualite] = useState<Actualite | null>(null);
  const [related, setRelated] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/actualites/${id}`)
      .then(r => r.json())
      .then(data => {
        const item = data.actualite || data;
        if (item?.id) {
          setActualite(item);
          // Fetch related news
          fetch("/api/actualites")
            .then(r => r.json())
            .then(d => {
              const all: Actualite[] = d.actualites || d.data || [];
              setRelated(all.filter(a => a.id !== item.id).slice(0, 3));
            })
            .catch(() => {});
        } else {
          router.push("/actualites");
        }
      })
      .catch(() => router.push("/actualites"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh]">
          <div className="animate-spin w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  if (!actualite) return null;

  const dateStr = actualite.date
    ? new Date(actualite.date).toLocaleDateString("fr-FR", { dateStyle: "long" })
    : new Date(actualite.createdAt).toLocaleDateString("fr-FR", { dateStyle: "long" });

  const readTime = estimateReadTime(actualite.contenu);
  const colorKey = Object.keys(catColors).find(k => actualite.categorie?.toLowerCase().includes(k)) || "actualite";

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-[#0a1628] via-[#0d2444] to-[#0c3060] pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 container mx-auto px-6 max-w-4xl">
          <Link href="/actualites" className="inline-flex items-center gap-2 text-slate-400 hover:text-cyan-400 text-sm mb-8 transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Retour aux actualités
          </Link>

          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${catColors[colorKey] || "bg-gray-100 text-gray-700"}`}>
              <Tag size={11} />{actualite.categorie}
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 text-xs">
              <Calendar size={13} />{dateStr}
            </span>
            <span className="flex items-center gap-1.5 text-slate-400 text-xs">
              <Clock size={13} />{readTime} min de lecture
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight" style={{ textShadow: "0 2px 24px rgba(0,0,0,0.4)" }}>
            {actualite.titre}
          </h1>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {actualite.auteur?.[0] || "R"}
            </div>
            <div>
              <p className="text-white text-sm font-medium">{actualite.auteur || "REAAGESS"}</p>
              <p className="text-slate-400 text-xs">Rédacteur REAAGESS</p>
            </div>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 60" className="w-full h-auto" preserveAspectRatio="none">
            <path fill="white" d="M0,30 C240,60 480,0 720,30 C960,60 1200,0 1440,30 L1440,60 L0,60 Z" />
          </svg>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2">
              {actualite.image && (
                <div className="rounded-2xl overflow-hidden mb-10 shadow-lg">
                  <img src={actualite.image} alt={actualite.titre} className="w-full h-64 md:h-80 object-cover" />
                </div>
              )}

              <div className="prose prose-slate max-w-none">
                {actualite.contenu.split("\n").filter(Boolean).map((para, i) => (
                  <p key={i} className="text-slate-700 leading-relaxed mb-5 text-base font-sans">
                    {para}
                  </p>
                ))}
              </div>

              {/* Share */}
              <div className="mt-10 pt-8 border-t border-slate-100 flex items-center gap-4">
                <span className="text-sm font-medium text-slate-600 flex items-center gap-2"><Share2 size={15} /> Partager cet article</span>
                <button
                  onClick={() => navigator.clipboard?.writeText(window.location.href)}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg transition-colors"
                >
                  Copier le lien
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 space-y-6">
                <div className="bg-slate-50 rounded-2xl p-6">
                  <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">À propos</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-3">
                      <User size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      <div><p className="text-slate-400 text-xs">Auteur</p><p className="font-medium text-slate-800">{actualite.auteur || "REAAGESS"}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      <div><p className="text-slate-400 text-xs">Publié le</p><p className="font-medium text-slate-800">{dateStr}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Tag size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      <div><p className="text-slate-400 text-xs">Catégorie</p><p className="font-medium text-slate-800 capitalize">{actualite.categorie}</p></div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock size={15} className="text-slate-400 mt-0.5 flex-shrink-0" />
                      <div><p className="text-slate-400 text-xs">Temps de lecture</p><p className="font-medium text-slate-800">{readTime} minute{readTime > 1 ? "s" : ""}</p></div>
                    </div>
                  </div>
                </div>

                {related.length > 0 && (
                  <div>
                    <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Autres actualités</h3>
                    <div className="space-y-4">
                      {related.map(r => (
                        <Link key={r.id} href={`/actualites/${r.id}`} className="block group">
                          <div className="bg-white border border-slate-100 rounded-xl p-4 hover:shadow-md hover:border-cyan-200 transition-all">
                            <p className="text-xs text-slate-400 mb-1 capitalize">{r.categorie}</p>
                            <p className="text-sm font-semibold text-slate-800 group-hover:text-cyan-700 transition-colors line-clamp-2">{r.titre}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                <Link href="/actualites" className="block text-center text-sm text-cyan-600 hover:text-cyan-700 font-medium py-3 border border-cyan-200 rounded-xl hover:bg-cyan-50 transition-colors">
                  Voir toutes les actualités →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
