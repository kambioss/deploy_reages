"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, FileText, Download, Calendar, Eye } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";

const RapportsPage = () => {
  const rapports = [
    {
      id: 1,
      title: "Rapport Annuel 2024 - REAAGESS",
      description:
        "Bilan complet des activités et réalisations du réseau REAAGESS pour l'année 2024",
      date: "2024-03-15",
      size: "3.2 MB",
      format: "PDF",
      pages: 124,
      downloads: 1250,
      category: "Annuel",
      featured: true,
    },
    {
      id: 2,
      title: "Rapport d'Activité - Projet Télédétection Sénégal",
      description:
        "Résultats et impacts du projet de télédétection pour l'agriculture au Sénégal",
      date: "2024-02-28",
      size: "2.8 MB",
      format: "PDF",
      pages: 67,
      downloads: 890,
      category: "Projet",
    },
    {
      id: 3,
      title: "Rapport Technique - SIG et Gestion de l'Eau",
      description:
        "Guide technique sur l'utilisation des SIG pour la gestion intégrée des ressources en eau",
      date: "2024-01-20",
      size: "5.1 MB",
      format: "PDF",
      pages: 89,
      downloads: 2100,
      category: "Technique",
    },
    {
      id: 4,
      title: "Rapport de Recherche - Analyse des Changements Climatiques",
      description:
        "Étude sur l'impact des changements climatiques sur les ressources en eau en Afrique de l'Ouest",
      date: "2023-12-15",
      size: "4.7 MB",
      format: "PDF",
      pages: 156,
      downloads: 3400,
      category: "Recherche",
    },
    {
      id: 5,
      title: "Rapport d'Évaluation - Programme de Formation 2023",
      description:
        "Bilan du programme de formation et impact sur les compétences des participants",
      date: "2023-11-30",
      size: "2.1 MB",
      format: "PDF",
      pages: 45,
      downloads: 670,
      category: "Formation",
    },
  ];

  const categories = [
    { name: "Annuel", count: 1, color: "bg-blue-100 text-blue-700" },
    { name: "Projet", count: 1, color: "bg-green-100 text-green-700" },
    { name: "Technique", count: 1, color: "bg-purple-100 text-purple-700" },
    { name: "Recherche", count: 1, color: "bg-orange-100 text-orange-700" },
    { name: "Formation", count: 1, color: "bg-red-100 text-red-700" },
  ];

  const getCategoryColor = (category: string) => {
    const cat = categories.find((c) => c.name === category);
    return cat ? cat.color : "bg-gray-100 text-gray-700";
  };

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-slate-600 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                  <FileText className="w-12 h-12" />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-6">Rapports d'Activité</h1>
              <p className="text-xl mb-8 text-blue-100">
                Consultez nos rapports annuels, techniques et de projets pour
                découvrir l'impact et les réalisations de REAAGESS
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white shadow-sm sticky top-16 z-40">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center space-x-6">
              <Link
                href="/"
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Accueil
              </Link>
              <span className="text-gray-400">/</span>
              <Link
                href="/publications"
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                Publications
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-blue-600 font-medium">
                Rapports d'activité
              </span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Statistics */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">25+</div>
                <div className="text-gray-600">Rapports publiés</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  15K+
                </div>
                <div className="text-gray-600">Téléchargements</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  500+
                </div>
                <div className="text-gray-600">Pages totales</div>
              </div>
              <div className="bg-white rounded-xl shadow-sm p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">5</div>
                <div className="text-gray-600">Catégories</div>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Catégories de rapports
              </h2>
              <div className="flex flex-wrap gap-3">
                {categories.map((cat, index) => (
                  <span
                    key={index}
                    className={`${cat.color} px-4 py-2 rounded-full text-sm font-medium`}
                  >
                    {cat.name} ({cat.count})
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Featured Report */}
          {rapports
            .filter((r) => r.featured)
            .map((rapport) => (
              <div key={rapport.id} className="max-w-6xl mx-auto mb-12">
                <div className="bg-gradient-to-r from-blue-600 to-slate-600 rounded-2xl p-8 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
                      Rapport vedette
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${getCategoryColor(rapport.category)}`}
                    >
                      {rapport.category}
                    </span>
                  </div>
                  <h2 className="text-3xl font-bold mb-4">{rapport.title}</h2>
                  <p className="text-blue-100 mb-6">{rapport.description}</p>
                  <div className="grid md:grid-cols-4 gap-4 mb-6">
                    <div>
                      <div className="text-sm text-blue-200">Date</div>
                      <div className="font-semibold">
                        {new Date(rapport.date).toLocaleDateString("fr-FR")}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-blue-200">Taille</div>
                      <div className="font-semibold">{rapport.size}</div>
                    </div>
                    <div>
                      <div className="text-sm text-blue-200">Pages</div>
                      <div className="font-semibold">{rapport.pages}</div>
                    </div>
                    <div>
                      <div className="text-sm text-blue-200">
                        Téléchargements
                      </div>
                      <div className="font-semibold">{rapport.downloads}</div>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <button className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors flex items-center">
                      <Download className="w-5 h-5 mr-2" />
                      Télécharger le PDF
                    </button>
                    <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-lg font-medium hover:bg-white/30 transition-colors flex items-center">
                      <Eye className="w-5 h-5 mr-2" />
                      Aperçu en ligne
                    </button>
                  </div>
                </div>
              </div>
            ))}

          {/* All Reports */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Tous les rapports
            </h2>
            <div className="space-y-6">
              {rapports
                .filter((r) => !r.featured)
                .map((rapport) => (
                  <div
                    key={rapport.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(rapport.category)}`}
                          >
                            {rapport.category}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {new Date(rapport.date).toLocaleDateString("fr-FR")}
                          </span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {rapport.title}
                        </h3>
                        <p className="text-gray-600 mb-4">
                          {rapport.description}
                        </p>

                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span className="flex items-center">
                            <FileText className="w-4 h-4 mr-1" />
                            {rapport.pages} pages
                          </span>
                          <span className="flex items-center">
                            <Download className="w-4 h-4 mr-1" />
                            {rapport.downloads} téléchargements
                          </span>
                          <span>{rapport.size}</span>
                          <span>{rapport.format}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                        <Download className="w-4 h-4 mr-2" />
                        Télécharger
                      </button>
                      <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center">
                        <Eye className="w-4 h-4 mr-2" />
                        Aperçu
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </LayoutWrapper>
  );
};

export default RapportsPage;
