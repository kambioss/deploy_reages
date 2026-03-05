"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Calendar, FileText, Tag } from "lucide-react";

interface Actualite {
  id: string;
  titre: string;
  contenu: string;
  image?: string;
  auteur: string;
  date: string;
  categorie: string;
}

export default function ActualitesPage() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/actualites").then(r => r.json()).then(d => {
      if (d.actualites) setActualites(d.actualites);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <LayoutWrapper>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Actualités</h1>
            <p className="text-xl text-gray-500">Restez informé des dernières nouvelles du réseau REAAGESS</p>
          </div>

          {loading ? (
            <div className="text-center py-20"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div></div>
          ) : actualites.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <FileText size={64} className="mx-auto mb-4 opacity-30" />
              <p>Aucune actualité disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {actualites.map(a => (
                <article key={a.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  {a.image ? (
                    <img src={a.image} alt={a.titre} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                      <FileText size={48} className="text-white opacity-50" />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full flex items-center gap-1">
                        <Tag size={10} />{a.categorie}
                      </span>
                    </div>
                    <h2 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">{a.titre}</h2>
                    <p className="text-gray-500 text-sm mb-4 line-clamp-3">{a.contenu}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>{a.auteur}</span>
                      <span className="flex items-center gap-1"><Calendar size={12} />{new Date(a.date).toLocaleDateString("fr-FR")}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </LayoutWrapper>
  );
}
