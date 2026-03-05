"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";
import { useAuth } from "@/lib/auth-context";
import { useRouter } from "next/navigation";
import { BookOpen, Clock, User, ChevronRight, CheckCircle, Loader2 } from "lucide-react";

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
  enrollments: { userId: string; status: string }[];
}

export default function FormationsPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const [cours, setCours] = useState<Cours[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, string>>({});

  useEffect(() => { fetchCours(); }, []);

  async function fetchCours() {
    try {
      const res = await fetch("/api/cours");
      if (res.ok) {
        const data = await res.json();
        setCours(data.cours);
      }
    } catch {}
    setLoading(false);
  }

  async function handleEnroll(coursId: string) {
    if (!isAuthenticated) { router.push("/login"); return; }
    setEnrolling(coursId);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ coursId })
      });
      const data = await res.json();
      if (res.ok) {
        setMessages(m => ({ ...m, [coursId]: "Inscription soumise ! En attente de validation." }));
        fetchCours();
      } else {
        setMessages(m => ({ ...m, [coursId]: data.error }));
      }
    } catch {
      setMessages(m => ({ ...m, [coursId]: "Erreur réseau" }));
    }
    setEnrolling(null);
  }

  function getEnrollmentStatus(c: Cours) {
    if (!user) return null;
    return c.enrollments.find(e => e.userId === user.id) || null;
  }

  const niveauColors: Record<string, string> = {
    debutant: "bg-green-100 text-green-700",
    intermediaire: "bg-yellow-100 text-yellow-700",
    avance: "bg-red-100 text-red-700",
  };

  return (
    <LayoutWrapper>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Formations & Cours</h1>
            <p className="text-xl text-gray-500 max-w-2xl mx-auto">
              Développez vos compétences en géomatique et sciences spatiales avec nos formations expertes.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
            </div>
          ) : cours.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <BookOpen size={64} className="mx-auto mb-4 opacity-30" />
              <p>Aucune formation disponible pour le moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cours.map((c) => {
                const enrollment = getEnrollmentStatus(c);
                return (
                  <div key={c.id} className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                    {c.image ? (
                      <img src={c.image} alt={c.titre} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <BookOpen size={48} className="text-white opacity-50" />
                      </div>
                    )}
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${niveauColors[c.niveau] || "bg-gray-100 text-gray-600"}`}>
                          {c.niveau}
                        </span>
                        <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{c.categorie}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 text-lg mb-2 line-clamp-2">{c.titre}</h3>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-3">{c.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                        <span className="flex items-center gap-1"><User size={12} />{c.instructeur}</span>
                        <span className="flex items-center gap-1"><Clock size={12} />{c.duree}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-blue-600">
                          {c.prix === 0 ? "Gratuit" : `${c.prix.toLocaleString()} FCFA`}
                        </span>
                        {enrollment ? (
                          <span className={`flex items-center gap-1 text-sm px-3 py-1 rounded-lg ${
                            enrollment.status === "approved" ? "bg-green-100 text-green-700" :
                            enrollment.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                            "bg-red-100 text-red-700"
                          }`}>
                            <CheckCircle size={14} />
                            {enrollment.status === "approved" ? "Validé" : enrollment.status === "pending" ? "En attente" : "Refusé"}
                          </span>
                        ) : (
                          <button
                            onClick={() => handleEnroll(c.id)}
                            disabled={enrolling === c.id}
                            className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-60"
                          >
                            {enrolling === c.id ? <Loader2 size={14} className="animate-spin" /> : <ChevronRight size={14} />}
                            S'inscrire
                          </button>
                        )}
                      </div>
                      {messages[c.id] && (
                        <p className={`mt-2 text-xs ${messages[c.id].includes("Inscription") ? "text-green-600" : "text-red-600"}`}>
                          {messages[c.id]}
                        </p>
                      )}
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
