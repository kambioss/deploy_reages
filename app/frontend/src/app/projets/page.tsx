"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";
import { TrendingUp } from "lucide-react";

interface Projet { id: string; titre: string; description: string; statut: string; partenaires: string; image?: string; }

export default function ProjetsPage() {
  const [projets, setProjets] = useState<Projet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/projets").then(r => r.json()).then(d => {
      if (d.projets) setProjets(d.projets);
    }).finally(() => setLoading(false));
  }, []);

  const statutConfig: any = {
    en_cours: { label: "En cours", color: "bg-green-100 text-green-700" },
    termine: { label: "Terminé", color: "bg-blue-100 text-blue-700" },
    planifie: { label: "Planifié", color: "bg-yellow-100 text-yellow-700" },
  };

  return (
    <LayoutWrapper>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Projets</h1>
            <p className="text-xl text-gray-500">Initiatives et projets de recherche en géomatique</p>
          </div>
          {loading ? (
            <div className="text-center py-20"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div></div>
          ) : projets.length === 0 ? (
            <div className="text-center py-20 text-gray-400"><TrendingUp size={64} className="mx-auto mb-4 opacity-30" /><p>Aucun projet disponible.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projets.map(p => {
                const s = statutConfig[p.statut] || statutConfig.en_cours;
                return (
                  <div key={p.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    {p.image && <img src={p.image} alt={p.titre} className="w-full h-48 object-cover" />}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.color}`}>{s.label}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-xl mb-2">{p.titre}</h3>
                      <p className="text-gray-500 mb-4">{p.description}</p>
                      {p.partenaires && <p className="text-sm text-gray-400">Partenaires: {p.partenaires}</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </LayoutWrapper>
  );
}
