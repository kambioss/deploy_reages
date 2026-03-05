"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import ReagessHeroSlider from "@/components/ReagessHeroSlider";
import LayoutWrapper from "@/components/LayoutWrapper";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  Satellite,
  Users,
  BookOpen,
  Globe,
  Target,
  Lightbulb,
  Heart,
  ArrowRight,
  Calendar,
  TrendingUp,
  TreePine,
  Droplets,
  AlertTriangle,
  Wheat,
  Waves,
} from "lucide-react";
import HeroSlider from "@/components/HeroSlider";

export default function ReagessHome() {
  return (
    <LayoutWrapper>
      <Navbar />
      {/* Hero Section with Slider */}
      <section className="relative">
        <ReagessHeroSlider />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex items-center pointer-events-none">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="mb-6">
                <span className="inline-block px-6 py-3 bg-blue-600/80 backdrop-blur-sm text-white text-lg font-semibold rounded-full shadow-lg">
                  Réseau Africain
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight drop-shadow-2xl">
                Bienvenue sur <span className="text-cyan-300">REAAGESS</span>
              </h1>
              <p className="text-2xl md:text-3xl text-blue-50 mb-12 leading-relaxed drop-shadow-lg max-w-4xl">
                Le réseau africain des acteurs de la géomatique et des sciences
                spatiales
              </p>
              <p className="text-xl md:text-2xl text-blue-100 mb-12 leading-relaxed drop-shadow-lg max-w-4xl">
                Recherche, Formation, Analyse et Application Géospatiale au
                service du développement durable
              </p>
              <div className="flex flex-col sm:flex-row gap-6 pointer-events-auto">
                <Button
                  asChild
                  size="lg"
                  className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all"
                >
                  <Link href="/register">
                    Rejoindre le réseau
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-semibold px-8 py-4 text-lg border-2 border-white/30 shadow-xl"
                >
                  <Link href="/actualites">Découvrir nos activités</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Domaines d'expertise */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Domaines d'expertise
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Des solutions géospatiales innovantes pour les défis du
              développement africain
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <MapPin className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">
                  Cartographie et SIG
                </CardTitle>
                <CardDescription className="text-lg">
                  Analyse précise des territoires
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  Systèmes d'information géographique avancés pour une
                  cartographie précise et une aide à la décision territoriale.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Satellite className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">
                  Télédétection par Satellite
                </CardTitle>
                <CardDescription className="text-lg">
                  Surveillance et analyse spatiale
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  Suivi et analyse de l'environnement et de l'occupation du sol
                  grâce aux technologies spatiales.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <TreePine className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">
                  Suivi de la Dégradation Forestière
                </CardTitle>
                <CardDescription className="text-lg">
                  Gestion et protection des forêts
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  Aide à la décision pour la gestion durable et la protection
                  des écosystèmes forestiers.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <AlertTriangle className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">
                  Surveillance de la Sécheresse
                </CardTitle>
                <CardDescription className="text-lg">
                  Gouvernance territoriale
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  Aide à la décision et gouvernance territoriale pour la gestion
                  des risques de sécheresse.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Waves className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">
                  Gestion des Inondations
                </CardTitle>
                <CardDescription className="text-lg">
                  Prévention et gestion
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  Aide à la décision pour la gestion territoriale face aux
                  risques d'inondation.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader className="text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-lime-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                  <Wheat className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">
                  Agriculture Intelligente
                </CardTitle>
                <CardDescription className="text-lg">
                  Outils numériques agricoles
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-gray-600 leading-relaxed">
                  Solutions numériques pour une agriculture durable et optimisée
                  grâce aux données satellites.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Qui sommes-nous */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Qui sommes-nous ?
              </h2>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                <span className="font-semibold text-blue-600">REAAGESS</span>{" "}
                (Réseau Africain des Acteurs de la Géomatique et des Sciences
                Spatiales) est une initiative panafricaine dédiée à la promotion
                des sciences spatiales et de la géomatique en Afrique.
              </p>

              <p className="text-xl text-gray-700 leading-relaxed mb-6">
                Nous fédérons jeunes professionnels, chercheurs et passionnés du
                domaine géospatial pour favoriser la collaboration, le partage
                de connaissances et l'innovation.
              </p>

              <p className="text-xl text-gray-700 leading-relaxed mb-8">
                Nos activités incluent la formation des acteurs du secteur, la
                publication de travaux de recherche, ainsi que le développement
                de projets innovants en géomatique et sciences spatiales.
              </p>

              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg">
                <p className="text-xl text-blue-900 font-medium leading-relaxed">
                  Notre vision : mettre les technologies spatiales et
                  l'intelligence géospatiale au service du développement
                  durable, de la gouvernance territoriale et de l'excellence
                  scientifique en Afrique.
                </p>
              </div>
            </div>

            <div className="text-center mt-8">
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
              >
                <Link href="/a-propos">
                  En savoir plus
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Vision, Mission, Valeurs */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">
                  Notre Vision
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Être un réseau panafricain de référence en sciences spatiales
                  et géomatique, capable de fédérer les talents et de contribuer
                  à un développement durable et souverain de l'Afrique grâce aux
                  technologies géospatiales.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">
                  Notre Mission
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Fédérer les jeunes africains des sciences spatiales et de la
                  géomatique, promouvoir l'innovation, stimuler la recherche,
                  former les jeunes à l'intelligence géospatiale, accompagner
                  les grands projets africains en ingénierie spatiale.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-gray-900">
                  Nos Valeurs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="text-gray-600 leading-relaxed space-y-2">
                  <li>• Collaboration</li>
                  <li>• Partage des connaissances</li>
                  <li>• Excellence scientifique</li>
                  <li>• Innovation</li>
                  <li>• Responsabilité</li>
                  <li>
                    • Engagement pour le développement durable de l'Afrique
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pourquoi nous rejoindre */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pourquoi nous rejoindre ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les avantages de faire partie du réseau REAAGESS
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">
                  Accès aux données
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Chaque membre bénéficie d'accès aux données géospatiales
                  mobilisées par le réseau pour ses projets et recherches.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">
                  Pôles thématiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Faites partie d'un pôle dédié à votre spécialité et collaborez
                  avec des experts du domaine.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">
                  Échange de compétences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Participez à des formations, webinaires et ateliers pour
                  enrichir vos connaissances.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">
                  Rencontres annuelles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Participez à des activités présentielle dans chaque pays
                  membre, à tour de rôle.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">
                  Discussions approfondies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Contribuez à des échanges rigoureux sur l'intelligence
                  géospatiale et les technologies innovantes.
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">
                  Collaboration africaine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed">
                  Travaillez avec des passionnés et experts à l'échelle
                  continentale pour stimuler l'innovation.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4"
            >
              <Link href="/pourquoi-nous-rejoindre">
                En savoir plus
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </LayoutWrapper>
  );
}
