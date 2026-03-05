"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import {
  TrendingUp,
  MapPin,
  Clock,
  Search,
  ArrowRight,
  Star,
  Globe,
  Users,
  Bookmark,
} from "lucide-react";

interface Opportunite {
  id: string | number;
  titre?: string;
  title?: string;
  type?: string;
  organisation?: string;
  organization?: string;
  lieu?: string;
  location?: string;
  description?: string;
  dateLimit?: string;
  deadline?: string;
  avantages?: string[];
  benefits?: string;
  niveau?: string;
  featured?: boolean;
}

const STATIC_OPPS: Opportunite[] = [];

/*const STATIC_OPPS: Opportunite[] = [
  { id: 1, titre: "Bourse de recherche en Géomatique Appliquée", type: "Bourse", organisation: "REAAGESS & UNOOSA", lieu: "En ligne / International", description: "Bourse de recherche de 12 mois pour approfondir l'application de la télédétection aux enjeux climatiques africains.", dateLimit: "2026-05-01", avantages: ["Financement 24 000 €/an", "Encadrement expert", "Accès aux données satellites", "Réseau REAAGESS"], niveau: "Master/Doctorat", featured: true },
  { id: 2, titre: "Programme de Mentorat Géospatial Africain 2026", type: "Mentorat", organisation: "REAAGESS", lieu: "Hybride", description: "Rejoignez notre programme de mentorat annuel et bénéficiez de l'accompagnement de professionnels expérimentés en SIG et télédétection.", dateLimit: "2026-04-20", avantages: ["12 mois d'accompagnement", "Networking professionnel", "Projets réels"], niveau: "Tous niveaux" },
  { id: 3, titre: "Stage de Recherche — Analyse de données spatiales", type: "Stage", organisation: "IRD / REAAGESS", lieu: "Montpellier, France", description: "Stage de 6 mois au sein de l'IRD en partenariat avec REAAGESS pour développer des outils d'analyse de données géospatiales.", dateLimit: "2026-03-30", avantages: ["Gratification mensuelle", "Formation R & Python", "Co-publication"], niveau: "Master" },
  { id: 4, titre: "Appel à Volontaires — Cartographie participative", type: "Bénévolat", organisation: "OpenStreetMap Africa / REAAGESS", lieu: "Afrique de l'Ouest", description: "Rejoignez les équipes de cartographie participative pour améliorer la couverture des données OpenStreetMap en zones rurales.", avantages: ["Certification officielle", "Expérience terrain", "Réseau OSM"], niveau: "Débutant accepté" },
];
*/
const typeColors: Record<string, string> = {
  Bourse: "bg-yellow-100 text-yellow-700",
  Mentorat: "bg-purple-100 text-purple-700",
  Stage: "bg-blue-100 text-blue-700",
  Bénévolat: "bg-green-100 text-green-700",
};

export default function OpportunitesPage() {
  const [opps, setOpps] = useState<Opportunite[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Tous");

  useEffect(() => {
    fetch("/api/opportunites")
      .then((r) => r.json())
      .then((data) => {
        const items = data.opportunites || data.data || [];
        setOpps(items.length > 0 ? items : STATIC_OPPS);
      })
      .catch(() => setOpps(STATIC_OPPS))
      .finally(() => setLoading(false));
  }, []);

  const types = [
    "Tous",
    ...(Array.from(
      new Set(opps.map((o) => o.type).filter(Boolean)),
    ) as string[]),
  ];

  const filtered = opps.filter((o) => {
    const titre = o.titre || o.title || "";
    const desc = o.description || "";
    const matchSearch =
      !search ||
      titre.toLowerCase().includes(search.toLowerCase()) ||
      desc.toLowerCase().includes(search.toLowerCase());
    const matchType = typeFilter === "Tous" || o.type === typeFilter;
    return matchSearch && matchType;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        icon={<TrendingUp className="w-10 h-10 text-white" />}
        label="Opportunités"
        title="Opportunités de Carrière"
        subtitle="Bourses, stages, mentorat et bénévolat — explorez toutes les voies pour grandir avec REAAGESS"
        gradient="from-emerald-600 via-teal-700 to-cyan-800"
      />

      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          {/* Stats rapides */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            {[
              {
                label: "Bourses actives",
                value: opps.filter((o) => o.type === "Bourse").length,
                Icon: Star,
                color: "text-yellow-600",
              },
              {
                label: "Programmes mentorat",
                value: opps.filter((o) => o.type === "Mentorat").length,
                Icon: Users,
                color: "text-purple-600",
              },
              {
                label: "Stages disponibles",
                value: opps.filter((o) => o.type === "Stage").length,
                Icon: Globe,
                color: "text-blue-600",
              },
              {
                label: "Bénévolat",
                value: opps.filter((o) => o.type === "Bénévolat").length,
                Icon: Bookmark,
                color: "text-green-600",
              },
            ].map((s, i) => (
              <div
                key={i}
                className="bg-white border border-slate-100 rounded-xl p-4 shadow-sm text-center"
              >
                <s.Icon size={22} className={`mx-auto mb-2 ${s.color}`} />
                <div className="text-2xl font-bold text-slate-900">
                  {s.value}
                </div>
                <div className="text-xs text-slate-400">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Rechercher une opportunité..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {types.map((t) => (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${typeFilter === t ? "bg-emerald-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <TrendingUp size={64} className="mx-auto mb-4 opacity-30" />
              <p>Aucune opportunité disponible pour le moment.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map((o, i) => {
                const titre = o.titre || o.title || "";
                const org = o.organisation || o.organization || "";
                const lieu = o.lieu || o.location || "";
                const deadline = o.dateLimit || o.deadline;
                const avantages: string[] =
                  o.avantages ||
                  (o.benefits
                    ? o.benefits.split(",").map((s) => s.trim())
                    : []);

                return (
                  <div
                    key={o.id}
                    className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-7 border ${o.featured ? "border-emerald-200 ring-1 ring-emerald-100" : "border-slate-100"}`}
                  >
                    <div className="flex flex-wrap items-start gap-3 mb-4">
                      {o.type && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${typeColors[o.type] || "bg-gray-100 text-gray-700"}`}
                        >
                          {o.type}
                        </span>
                      )}
                      {o.featured && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                          ⭐ Recommandé
                        </span>
                      )}
                      {o.niveau && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                          {o.niveau}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {titre}
                    </h3>
                    <p className="text-slate-600 mb-5 leading-relaxed text-sm">
                      {o.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-5">
                      {org && (
                        <div>
                          <p className="text-slate-400 text-xs mb-1">
                            Organisation
                          </p>
                          <p className="font-medium text-slate-800">{org}</p>
                        </div>
                      )}
                      {lieu && (
                        <div>
                          <p className="text-slate-400 text-xs mb-1 flex items-center gap-1">
                            <MapPin size={11} />
                            Localisation
                          </p>
                          <p className="font-medium text-slate-800">{lieu}</p>
                        </div>
                      )}
                      {deadline && (
                        <div>
                          <p className="text-slate-400 text-xs mb-1 flex items-center gap-1">
                            <Clock size={11} />
                            Date limite
                          </p>
                          <p className="font-medium text-slate-800">
                            {new Date(deadline).toLocaleDateString("fr-FR", {
                              dateStyle: "long",
                            })}
                          </p>
                        </div>
                      )}
                    </div>

                    {avantages.length > 0 && (
                      <div className="mb-5">
                        <p className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                          Avantages
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {avantages.map((av, idx) => (
                            <span
                              key={idx}
                              className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-medium"
                            >
                              {av}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                        Postuler <ArrowRight size={15} />
                      </button>
                      <button className="px-5 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors">
                        En savoir plus
                      </button>
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
