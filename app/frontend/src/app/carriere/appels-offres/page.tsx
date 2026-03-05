"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PageHero from "@/components/PageHero";
import {
  Briefcase,
  MapPin,
  Clock,
  DollarSign,
  Search,
  ArrowRight,
  Calendar,
  Building,
} from "lucide-react";

interface AppelOffre {
  id: string | number;
  title?: string;
  titre?: string;
  organization?: string;
  organisation?: string;
  location?: string;
  lieu?: string;
  type?: string;
  duration?: string;
  duree?: string;
  deadline?: string;
  dateLimit?: string;
  status?: string;
  statut?: string;
  description?: string;
  requirements?: string[];
  competences?: string;
  budget?: string;
  featured?: boolean;
}

const STATIC_APPELS: AppelOffre[] = [];

function getStatusColor(s: string) {
  if (s === "open" || s === "ouvert") return "bg-green-100 text-green-700";
  if (s === "urgent") return "bg-red-100 text-red-700";
  return "bg-gray-100 text-gray-500";
}
function getStatusLabel(s: string) {
  if (s === "open") return "Ouvert";
  if (s === "urgent") return "Urgent";
  if (s === "closed") return "Fermé";
  return s;
}
function getDaysRemaining(deadline?: string) {
  if (!deadline) return null;
  const diff = Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / 86400000,
  );
  return diff;
}

export default function AppelsOffresPage() {
  const [appels, setAppels] = useState<AppelOffre[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    fetch("/api/appels-offres")
      .then((r) => r.json())
      .then((data) => {
        const items = data.appels || data.data || [];
        setAppels(items.length > 0 ? items : STATIC_APPELS);
      })
      .catch(() => setAppels(STATIC_APPELS))
      .finally(() => setLoading(false));
  }, []);

  const filtered = appels.filter((a) => {
    const titre = a.titre || a.title || "";
    const desc = a.description || "";
    const matchSearch =
      !search ||
      titre.toLowerCase().includes(search.toLowerCase()) ||
      desc.toLowerCase().includes(search.toLowerCase());
    const status = a.statut || a.status || "open";
    const matchStatus = statusFilter === "all" || status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        icon={<Briefcase className="w-10 h-10 text-white" />}
        label="Carrières"
        title="Appels d'Offres"
        subtitle="Découvrez les opportunités de collaboration et de consultation dans le domaine de la géomatique et des sciences spatiales"
        gradient="from-orange-600 via-red-600 to-rose-700"
      />

      <section className="py-20 px-6">
        <div className="container mx-auto max-w-5xl">
          {/* Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-10">
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                placeholder="Rechercher un appel d'offre..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex gap-2">
              {[
                { v: "all", l: "Tous" },
                { v: "open", l: "Ouverts" },
                { v: "urgent", l: "Urgents" },
                { v: "closed", l: "Fermés" },
              ].map((s) => (
                <button
                  key={s.v}
                  onClick={() => setStatusFilter(s.v)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${statusFilter === s.v ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                >
                  {s.l}
                </button>
              ))}
            </div>
          </div>

          <p className="text-slate-500 text-sm mb-6 font-sans">
            {filtered.length} appel{filtered.length > 1 ? "s" : ""} d&apos;offre
            {filtered.length > 1 ? "s" : ""} disponible
            {filtered.length > 1 ? "s" : ""}
          </p>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full mx-auto" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <Briefcase size={64} className="mx-auto mb-4 opacity-30" />
              <p>Aucun appel d&apos;offre disponible.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map((a) => {
                const titre = a.titre || a.title || "";
                const org = a.organisation || a.organization || "";
                const lieu = a.lieu || a.location || "";
                const status = a.statut || a.status || "open";
                const deadline = a.deadline || a.dateLimit;
                const daysLeft = getDaysRemaining(deadline);
                const reqs: string[] =
                  a.requirements ||
                  (a.competences
                    ? a.competences.split(",").map((s) => s.trim())
                    : []);
                return (
                  <div
                    key={a.id}
                    className={`bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-7 border ${a.featured ? "border-orange-200 ring-1 ring-orange-100" : "border-slate-100"}`}
                  >
                    <div className="flex flex-wrap items-start gap-3 mb-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(status)}`}
                      >
                        {getStatusLabel(status)}
                      </span>
                      {a.featured && (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">
                          ⭐ Mis en avant
                        </span>
                      )}
                      {deadline && (
                        <span
                          className={`flex items-center gap-1.5 text-xs font-medium ${daysLeft !== null && daysLeft < 7 ? "text-red-600" : "text-slate-500"}`}
                        >
                          <Calendar size={12} />
                          Date limite :{" "}
                          {new Date(deadline).toLocaleDateString("fr-FR")}
                          {daysLeft !== null && daysLeft > 0 && (
                            <span className="ml-1">({daysLeft}j restants)</span>
                          )}
                          {daysLeft !== null && daysLeft <= 0 && (
                            <span className="ml-1 text-red-500">(Expiré)</span>
                          )}
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {titre}
                    </h3>
                    <p className="text-slate-600 mb-5 leading-relaxed text-sm">
                      {a.description}
                    </p>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-5">
                      {org && (
                        <div>
                          <p className="text-slate-400 text-xs mb-1 flex items-center gap-1">
                            <Building size={11} />
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
                      {(a.type || a.duree || a.duration) && (
                        <div>
                          <p className="text-slate-400 text-xs mb-1 flex items-center gap-1">
                            <Clock size={11} />
                            Durée
                          </p>
                          <p className="font-medium text-slate-800">
                            {a.duree || a.duration || a.type}
                          </p>
                        </div>
                      )}
                      {a.budget && (
                        <div>
                          <p className="text-slate-400 text-xs mb-1 flex items-center gap-1">
                            <DollarSign size={11} />
                            Budget
                          </p>
                          <p className="font-medium text-slate-800">
                            {a.budget}
                          </p>
                        </div>
                      )}
                    </div>

                    {reqs.length > 0 && (
                      <div className="mb-5">
                        <p className="text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wider">
                          Compétences requises
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {reqs.map((req, idx) => (
                            <span
                              key={idx}
                              className="bg-slate-100 text-slate-700 px-3 py-1 rounded-full text-xs"
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2">
                        Postuler <ArrowRight size={15} />
                      </button>
                      <button className="px-5 py-2.5 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-700 text-sm font-medium transition-colors">
                        Détails
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
