"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Globe, Tag } from "lucide-react";

interface Article { id: string; titre: string; resume: string; auteur: string; categorie: string; image?: string; tags: string; createdAt: string; }

export default function PublicationsPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/articles").then(r => r.json()).then(d => {
      if (d.articles) setArticles(d.articles);
    }).finally(() => setLoading(false));
  }, []);

  return (
    <LayoutWrapper>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Publications</h1>
            <p className="text-xl text-gray-500">Articles, rapports et études du réseau REAAGESS</p>
          </div>
          {loading ? (
            <div className="text-center py-20"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div></div>
          ) : articles.length === 0 ? (
            <div className="text-center py-20 text-gray-400"><Globe size={64} className="mx-auto mb-4 opacity-30" /><p>Aucune publication disponible.</p></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map(a => (
                <div key={a.id} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                  {a.image && <img src={a.image} alt={a.titre} className="w-full h-40 object-cover rounded-xl mb-4" />}
                  <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">{a.categorie}</span>
                  <h3 className="font-bold text-gray-900 text-lg mt-3 mb-2">{a.titre}</h3>
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3">{a.resume}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{a.auteur}</span>
                    <span>{new Date(a.createdAt).toLocaleDateString("fr-FR")}</span>
                  </div>
                  {a.tags && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {a.tags.split(",").filter(Boolean).map((tag, i) => (
                        <span key={i} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded flex items-center gap-1">
                          <Tag size={9} />{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </LayoutWrapper>
  );
}
