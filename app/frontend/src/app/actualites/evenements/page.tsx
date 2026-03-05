"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Calendar, MapPin, ExternalLink } from "lucide-react";

interface Evenement { id: string; titre: string; description: string; date: string; lieu: string; image?: string; lien?: string; }

export default function EvenementsPage() {
  const [evenements, setEvenements] = useState<Evenement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/evenements").then(r => r.json()).then(d => {
      if (d.evenements) setEvenements(d.evenements);
    }).finally(() => setLoading(false));
  }, []);

  const upcoming = evenements.filter(e => new Date(e.date) >= new Date());
  const past = evenements.filter(e => new Date(e.date) < new Date());

  return (
    <LayoutWrapper>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Événements</h1>
            <p className="text-xl text-gray-500">Conférences, formations et rencontres du réseau</p>
          </div>

          {loading ? (
            <div className="text-center py-20"><div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div></div>
          ) : evenements.length === 0 ? (
            <div className="text-center py-20 text-gray-400"><Calendar size={64} className="mx-auto mb-4 opacity-30" /><p>Aucun événement disponible.</p></div>
          ) : (
            <div className="space-y-12">
              {upcoming.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Événements à venir</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {upcoming.map(e => <EventCard key={e.id} event={e} />)}
                  </div>
                </div>
              )}
              {past.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-400 mb-6">Événements passés</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-70">
                    {past.map(e => <EventCard key={e.id} event={e} />)}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </LayoutWrapper>
  );
}

function EventCard({ event: e }: { event: any }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      {e.image && <img src={e.image} alt={e.titre} className="w-full h-40 object-cover" />}
      <div className="p-6">
        <h3 className="font-bold text-gray-900 text-lg mb-2">{e.titre}</h3>
        <p className="text-gray-500 text-sm mb-4 line-clamp-3">{e.description}</p>
        <div className="space-y-2 text-sm text-gray-400">
          <div className="flex items-center gap-2"><Calendar size={14} className="text-blue-500" />{new Date(e.date).toLocaleDateString("fr-FR", { dateStyle: "long" })}</div>
          <div className="flex items-center gap-2"><MapPin size={14} className="text-blue-500" />{e.lieu}</div>
        </div>
        {e.lien && (
          <a href={e.lien} target="_blank" rel="noopener noreferrer" className="mt-4 flex items-center gap-1 text-blue-600 text-sm hover:text-blue-700">
            <ExternalLink size={14} />En savoir plus
          </a>
        )}
      </div>
    </div>
  );
}
