"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Users, MapPin, Briefcase, Mail, Search, Filter } from "lucide-react";
import { useState } from "react";
import Navbar from "@/components/Navbar";

export default function MembresPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPays, setSelectedPays] = useState("Tous");

  const membres = [
    {
      id: 1,
      nom: "Dr. Awa Diop",
      pays: "Sénégal",
      fonction: "Chercheuse en ressources en eau",
      secteur: "Recherche",
      email: "awa.diop@reaages.org",
      specialite: "Hydrologie",
      avatar: "AD",
    },
    {
      id: 2,
      nom: "M. Koffi Kouadio",
      pays: "Côte d'Ivoire",
      fonction: "Expert en assainissement",
      secteur: "Consulting",
      email: "k.kouadio@reaages.org",
      specialite: "Assainissement urbain",
      avatar: "KK",
    },
    {
      id: 3,
      nom: "Mme. Fatima Zahra",
      pays: "Maroc",
      fonction: "Ingénieure environnementale",
      secteur: "Technologie",
      email: "f.zahra@reaages.org",
      specialite: "Traitement des eaux",
      avatar: "FZ",
    },
    {
      id: 4,
      nom: "Dr. Samuel Osei",
      pays: "Ghana",
      fonction: "Spécialiste en développement durable",
      secteur: "ONG",
      email: "s.osei@reaages.org",
      specialite: "Développement rural",
      avatar: "SO",
    },
    {
      id: 5,
      nom: "Mme. Aisha Bello",
      pays: "Nigeria",
      fonction: "Coordinatrice de projets",
      secteur: "Gestion de projet",
      email: "a.bello@reaages.org",
      specialite: "Eau et assainissement",
      avatar: "AB",
    },
    {
      id: 6,
      nom: "Dr. Jean-Pierre Mugisha",
      pays: "Rwanda",
      fonction: "Expert en politiques publiques",
      secteur: "Gouvernement",
      email: "jp.mugisha@reaages.org",
      specialite: "Gouvernance de l'eau",
      avatar: "JPM",
    },
  ];

  const paysList = ["Tous", ...Array.from(new Set(membres.map((m) => m.pays)))];

  const filteredMembres = membres.filter((membre) => {
    const matchSearch =
      membre.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membre.fonction.toLowerCase().includes(searchTerm.toLowerCase()) ||
      membre.specialite.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPays = selectedPays === "Tous" || membre.pays === selectedPays;
    return matchSearch && matchPays;
  });

  return (
    <>
      <Navbar />
      <div className="min-h-screen">
        {/* Hero Section with Background Image */}
        <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?q=80&w=2070"
              alt="Réseau de professionnels"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/90 via-teal-800/85 to-cyan-900/90"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 text-center text-white">
            <div className="inline-block mb-6">
              <div className="flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full">
                <Users className="w-10 h-10" />
              </div>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Membres du Réseau
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto mb-8 text-gray-100">
              Découvrez les experts et professionnels qui composent notre réseau
              africain
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-12">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-4xl font-bold mb-2">500+</div>
                <div className="text-sm text-gray-200">Membres actifs</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-4xl font-bold mb-2">15+</div>
                <div className="text-sm text-gray-200">Pays représentés</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-4xl font-bold mb-2">25+</div>
                <div className="text-sm text-gray-200">Secteurs d'activité</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                <div className="text-4xl font-bold mb-2">100+</div>
                <div className="text-sm text-gray-200">
                  Projets collaboratifs
                </div>
              </div>
            </div>
          </div>

          {/* Decorative Wave */}
          <div className="absolute bottom-0 left-0 right-0 z-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 120"
              className="w-full h-auto"
            >
              <path
                fill="#f9fafb"
                fillOpacity="1"
                d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
              ></path>
            </svg>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-8 px-4 bg-gray-50 border-b border-gray-200">
          <div className="container mx-auto">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search Bar */}
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <input
                    type="text"
                    placeholder="Rechercher un membre..."
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Country Filter */}
                <div className="relative min-w-[200px]">
                  <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <select
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white appearance-none"
                    value={selectedPays}
                    onChange={(e) => setSelectedPays(e.target.value)}
                  >
                    {paysList.map((pays) => (
                      <option key={pays} value={pays}>
                        {pays}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <p className="text-sm text-gray-600 mt-4 text-center">
                {filteredMembres.length} membre(s) trouvé(s)
              </p>
            </div>
          </div>
        </section>

        {/* Membres Grid */}
        <section className="py-12 px-4 bg-gray-50">
          <div className="container mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredMembres.length > 0 ? (
                filteredMembres.map((membre) => (
                  <Card
                    key={membre.id}
                    className="hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white border-0"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          {/* Avatar with gradient */}
                          <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {membre.avatar}
                          </div>
                          <div>
                            <CardTitle className="text-lg mb-1">
                              {membre.nom}
                            </CardTitle>
                            <p className="text-sm text-gray-600">
                              {membre.fonction}
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center">
                            <MapPin className="h-4 w-4 text-emerald-600" />
                          </div>
                          <span>{membre.pays}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-8 h-8 bg-cyan-50 rounded-lg flex items-center justify-center">
                            <Briefcase className="h-4 w-4 text-cyan-600" />
                          </div>
                          <span>{membre.secteur}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Mail className="h-4 w-4 text-blue-600" />
                          </div>
                          <span className="truncate">{membre.email}</span>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap gap-2 mb-4">
                          <Badge
                            variant="secondary"
                            className="bg-emerald-100 text-emerald-700"
                          >
                            {membre.specialite}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="border-emerald-600 text-emerald-600"
                          >
                            Membre actif
                          </Badge>
                        </div>

                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-600"
                        >
                          Voir le profil
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-20">
                  <div className="max-w-md mx-auto">
                    <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-xl text-gray-500 mb-2">
                      Aucun membre trouvé
                    </p>
                    <p className="text-gray-400">
                      Essayez de modifier vos critères de recherche
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 px-4 bg-gradient-to-br from-emerald-600 to-cyan-600">
          <div className="container mx-auto text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Rejoignez notre réseau
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto text-emerald-50">
              Faites partie d'une communauté dynamique de professionnels engagés
              pour l'eau et l'environnement en Afrique
            </p>
            <Button
              size="lg"
              className="bg-white text-emerald-600 hover:bg-gray-100 font-semibold px-8 py-6 text-lg"
            >
              Devenir membre
            </Button>
          </div>
        </section>
      </div>
    </>
  );
}
