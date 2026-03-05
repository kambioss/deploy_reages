import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Users,
  Target,
  Lightbulb,
  Heart,
  Globe,
  Award,
  Rocket,
} from "lucide-react";
import Link from "next/link";

export default function APropos() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072"
            alt="Sciences spatiales et géomatique"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-indigo-800/90 to-purple-900/95"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="inline-block mb-6">
            <div className="flex items-center justify-center w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full border-4 border-white/30">
              <Globe className="w-12 h-12" />
            </div>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Qui sommes-nous ?
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-100">
            Découvrez le réseau qui façonne l'avenir des sciences spatiales et
            de la géomatique en Afrique
          </p>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full h-auto"
          >
            <path
              fill="#ffffff"
              fillOpacity="1"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          {/* Introduction */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl shadow-xl p-8 md:p-12 mb-16">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              <span className="font-bold text-blue-600 text-2xl">REAAGESS</span>{" "}
              (Réseau Africain des Acteurs de la Géomatique et des Sciences
              Spatiales) est une initiative panafricaine dédiée à la promotion
              des sciences spatiales et de la géomatique en Afrique.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Nous fédérons jeunes professionnels, chercheurs et passionnés du
              domaine géospatial pour favoriser la collaboration, le partage de
              connaissances et l'innovation.
            </p>
            <p className="text-lg text-gray-700 leading-relaxed mb-8">
              Nos activités incluent la formation des acteurs du secteur, la
              publication de travaux de recherche, ainsi que le développement de
              projets innovants en géomatique et sciences spatiales.
            </p>

            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-8 rounded-xl shadow-lg">
              <div className="flex items-start gap-4">
                <Rocket className="w-8 h-8 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-2xl font-bold mb-3">Notre Vision</h3>
                  <p className="text-lg leading-relaxed text-blue-50">
                    Mettre les technologies spatiales et l'intelligence
                    géospatiale au service du développement durable, de la
                    gouvernance territoriale et de l'excellence scientifique en
                    Afrique.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Key Values Grid */}
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
              Nos Valeurs Fondamentales
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-blue-50 to-white">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Users className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Collaboration
                  </h3>
                  <p className="text-gray-600">
                    Fédérer les acteurs du secteur géospatial africain
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-indigo-50 to-white">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Lightbulb className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Innovation
                  </h3>
                  <p className="text-gray-600">
                    Développer des solutions géospatiales innovantes
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-purple-50 to-white">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Award className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Excellence
                  </h3>
                  <p className="text-gray-600">
                    Promouvoir l'excellence scientifique en Afrique
                  </p>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br from-pink-50 to-white">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Heart className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Engagement
                  </h3>
                  <p className="text-gray-600">
                    Servir le développement durable du continent
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Mission & Vision Cards */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Target className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Notre Mission
                  </h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span>
                      Former et renforcer les capacités des acteurs du secteur
                      géospatial
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span>
                      Publier et diffuser les travaux de recherche en géomatique
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span>
                      Développer des projets innovants pour le développement de
                      l'Afrique
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-1">•</span>
                    <span>
                      Créer des synergies entre professionnels et chercheurs
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-xl overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <CardContent className="p-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Nos Objectifs
                  </h3>
                </div>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold mt-1">•</span>
                    <span>Contribuer à la souveraineté spatiale africaine</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold mt-1">•</span>
                    <span>
                      Faciliter l'accès aux données et technologies géospatiales
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold mt-1">•</span>
                    <span>
                      Promouvoir l'utilisation des sciences spatiales pour le
                      développement
                    </span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-600 font-bold mt-1">•</span>
                    <span>
                      Renforcer la coopération panafricaine dans le secteur
                    </span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Prêt à rejoindre l'aventure ?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Faites partie du réseau qui transforme le paysage géospatial
              africain
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold px-8"
              >
                <Link href="/pourquoi-nous-rejoindre">
                  Pourquoi nous rejoindre
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10 font-semibold px-8"
              >
                <Link href="/contact">Nous contacter</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
