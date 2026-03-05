"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, MapPin, Clock, DollarSign, Search } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";

const AppelsOffresPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const appelsOffres = [
    {
      id: 1,
      title: "Expert en Télédétection - Projet Agri-SAT",
      organization: "REAAGESS",
      location: "Dakar, Sénégal",
      type: "Consultant",
      duration: "6 mois",
      deadline: "2024-04-15",
      status: "open",
      description: "Nous recherchons un expert en télédétection pour le développement de solutions agricoles basées sur les données satellites.",
      requirements: [
        "Doctorat en télédétection ou géomatique",
        "5+ ans d'expérience en télédétection agricole",
        "Maîtrise des logiciels de traitement d'images satellites",
        "Expérience en Afrique de l'Ouest"
      ],
      budget: "45-60K€",
      featured: true
    },
    {
      id: 2,
      title: "Formation SIG - Programme de Renforcement des Capacités",
      organization: "Ministère de l'Environnement",
      location: "Bamako, Mali",
      type: "Formateur",
      duration: "3 mois",
      deadline: "2024-04-10",
      status: "open",
      description: "Formation des agents techniques sur l'utilisation des SIG pour la gestion environnementale.",
      requirements: [
        "Expertise en SIG et télédétection",
        "Expérience en formation",
        "Connaissance des contextes environnementaux africains",
        "Bilingue (français/anglais)"
      ],
      budget: "25-35K€"
    }
  ];

  const filteredAppels = appelsOffres.filter(appel => {
    const matchesSearch = appel.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         appel.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || appel.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "open": return "bg-green-100 text-green-700";
      case "urgent": return "bg-red-100 text-red-700";
      case "closed": return "bg-gray-100 text-gray-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "open": return "Ouvert";
      case "urgent": return "Urgent";
      case "closed": return "Fermé";
      default: return status;
    }
  };

  const getDaysRemaining = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <LayoutWrapper>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-orange-600 to-red-600 text-white">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 py-20">
            <div className="max-w-4xl mx-auto text-center">
              <div className="flex justify-center mb-6">
                <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                  <Briefcase className="w-12 h-12" />
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-6">
                Appels d'Offres
              </h1>
              <p className="text-xl mb-8 text-orange-100">
                Découvrez les opportunités de collaboration et de consultation 
                dans le domaine de la géomatique et des sciences spatiales
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white shadow-sm sticky top-16 z-40">
          <div className="container mx-auto px-4 py-4">
            <nav className="flex items-center space-x-6">
              <Link href="/" className="flex items-center text-gray-600 hover:text-orange-600 transition-colors">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Accueil
              </Link>
              <span className="text-gray-400">/</span>
              <Link href="/carriere" className="text-gray-600 hover:text-orange-600 transition-colors">
                Carrières
              </Link>
              <span className="text-gray-400">/</span>
              <span className="text-orange-600 font-medium">Appels d'offres</span>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-12">
          {/* Search and Filter */}
          <div className="max-w-6xl mx-auto mb-12">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Rechercher un appel d'offre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="all">Tous les statuts</option>
                    <option value="open">Ouverts</option>
                    <option value="urgent">Urgents</option>
                    <option value="closed">Fermés</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* All Calls */}
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Appels d'offres disponibles ({filteredAppels.length})
            </h2>
            <div className="space-y-6">
              {filteredAppels.map(appel => (
                <div key={appel.id} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(appel.status)}`}>
                          {getStatusLabel(appel.status)}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {new Date(appel.deadline).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="text-gray-500 text-sm">
                          {getDaysRemaining(appel.deadline)} jours restants
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{appel.title}</h3>
                      <p className="text-gray-600 mb-4">{appel.description}</p>
                      
                      <div className="grid md:grid-cols-4 gap-4 text-sm text-gray-500 mb-4">
                        <div>
                          <div className="text-gray-700 font-medium">Organisation</div>
                          <div>{appel.organization}</div>
                        </div>
                        <div>
                          <div className="text-gray-700 font-medium">Localisation</div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-1" />
                            {appel.location}
                          </div>
                        </div>
                        <div>
                          <div className="text-gray-700 font-medium">Type</div>
                          <div>{appel.type}</div>
                        </div>
                        <div>
                          <div className="text-gray-700 font-medium">Budget</div>
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />
                            {appel.budget}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-900 mb-2">Compétences requises:</h4>
                        <div className="flex flex-wrap gap-2">
                          {appel.requirements.map((req, idx) => (
                            <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                              {req}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button className="flex-1 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors">
                      Postuler
                    </button>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      Détails
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default AppelsOffresPage;