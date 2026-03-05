"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { BookOpen, Clock, User, ChevronRight, CheckCircle, Loader2, Search, Filter } from "lucide-react";

interface Cours {
  id: string;
  titre: string;
  description: string;
  instructeur: string;
  duree: string;
  niveau: string;
  categorie: string;
  image?: string;
  prix: number;
  enrollments?: { userId: string; status: string }[];
}

const niveauColors: Record<string, string> = {
  debutant: "bg-green-100 text-green-700",
  intermediaire: "bg-yellow-100 text-yellow-700",
  avance: "bg-red-100 text-red-700",
};

export default function FormationsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [cours, setCours] = useState<Cours[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [niveauFilter, setNiveauFilter] = useState("tous");

  useEffect(() => { fetchCours(); }, []);

  async function fetchCours() {
    try {
      const res = await fetch("/api/cours");
      if (res.ok) { const data = await res.json(); setCours(data.cours || data.data || []); }
    } catch {}
    setLoading(false);
  }

  async function handleEnroll(coursId: string) {
    if (!isAuthenticated) { router.push("/login"); return; }
    setEnrolling(coursId);
    try {
      const res = await fetch("/api/enrollments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ coursId }) });
      const data = await res.json();
      if (res.ok) { setMessages(m => ({ ...m, [coursId]: "Inscription soumise ! En attente de validation." })); fetchCours(); }
      else setMessages(m => ({ ...m, [coursId]: data.error }));
    } catch { setMessages(m => ({ ...m, [coursId]: "Erreur réseau" })); }
    setEnrolling(null);
  }

  function getEnrollmentStatus(c: Cours) {
    if (!user || !c.enrollments) return null;
    return c.enrollments.find(e => e.userId === user.id) || null;
  }

  const filtered = cours.filter(c => {
    const matchSearch = !search || c.titre.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase());
    const matchNiveau = niveauFilter === "tous" || c.niveau === niveauFilter;
    return matchSearch && matchNiveau;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        icon={<BookOpen className="w-10 h-10 text-white" />}
        label="Formations"
        title="Formations & Cours"
        subtitle="Développez vos compétences en géomatique et sciences spatiales avec nos formations expertes"
        gradient="from-blue-700 via-blue-800 to-indigo-900"
      />

      <section className="py-20 px-6">
        <div className="container mx-auto max-w-6xl">

          {/* Search + filter bar */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Rechercher une formation..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              {[{ v: "tous", l: "Tous niveaux" }, { v: "debutant", l: "Débutant" }, { v: "intermediaire", l: "Intermédiaire" }, { v: "avance", l: "Avancé" }].map(n => (
                <button key={n.v} onClick={() => setNiveauFilter(n.v)} className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors whitespace-nowrap ${niveauFilter === n.v ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>
                  {n.l}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" /></div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400"><BookOpen size={64} className="mx-auto mb-4 opacity-30" /><p>{cours.length === 0 ? "Aucune formation disponible pour le moment." : "Aucun résultat pour cette recherche."}</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((c, i) => {
                const enrollment = getEnrollmentStatus(c);
                return (
                  <div key={c.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 border border-slate-100 group" style={{ animationDelay: `${i * 80}ms` }}>
                    {c.image ? (
                      <img src={c.image} alt={c.titre} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <BookOpen size={48} className="text-white opacity-50" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${niveauColors[c.niveau] || "bg-gray-100 text-gray-600"}`}>{c.niveau}</span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{c.categorie}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">{c.titre}</h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-3">{c.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                        <span className="flex items-center gap-1"><User size={12} />{c.instructeur}</span>
                        <span className="flex items-center gap-1"><Clock size={12} />{c.duree}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-600">{c.prix === 0 ? "Gratuit" : `${c.prix.toLocaleString()} FCFA`}</span>
                        {enrollment ? (
                          <span className={`flex items-center gap-1 text-sm px-3 py-1 rounded-lg ${enrollment.status === "approved" ? "bg-green-100 text-green-700" : enrollment.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                            <CheckCircle size={14} />{enrollment.status === "approved" ? "Validé" : enrollment.status === "pending" ? "En attente" : "Refusé"}
                          </span>
                        ) : (
                          <button onClick={() => handleEnroll(c.id)} disabled={enrolling === c.id} className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-60">
                            {enrolling === c.id ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} />}
                            S&apos;inscrire
                          </button>
                        )}
                      </div>
                      {messages[c.id] && <p className={`mt-2 text-xs ${messages[c.id].includes("Inscription") ? "text-green-600" : "text-red-600"}`}>{messages[c.id]}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
