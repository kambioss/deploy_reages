import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Heart,
  Users,
  BookOpen,
  Award,
  Lightbulb,
  Shield,
  Globe2,
} from "lucide-react";

export default function Valeurs() {
  const valeurs = [
    {
      icon: Users,
      title: "Collaboration",
      description:
        "Travailler ensemble pour atteindre des résultats plus grands et créer des synergies entre experts africains",
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
    },
    {
      icon: BookOpen,
      title: "Partage des connaissances",
      description:
        "Diffuser le savoir et l'expertise pour le bénéfice de toute la communauté géospatiale africaine",
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
    },
    {
      icon: Award,
      title: "Excellence scientifique",
      description:
        "Viser la plus haute qualité dans nos travaux de recherche et nos réalisations techniques",
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      description:
        "Créer des solutions nouvelles, audacieuses et adaptées aux défis africains",
      color: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
    },
    {
      icon: Shield,
      title: "Responsabilité",
      description:
        "Agir avec intégrité, transparence et éthique dans toutes nos actions",
      color: "from-teal-500 to-cyan-600",
      bgColor: "bg-teal-50",
    },
    {
      icon: Globe2,
      title: "Engagement pour l'Afrique",
      description:
        "Contribuer activement au développement durable et à la souveraineté technologique du continent",
      color: "from-indigo-500 to-blue-600",
      bgColor: "bg-indigo-50",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero Section with Background Image */}
      <section className="relative h-[550px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1529070538774-1843cb3265df?q=80&w=2070"
            alt="Valeurs et collaboration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-pink-900/95 via-purple-900/90 to-indigo-900/95"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="inline-block mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full blur-2xl opacity-60 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl">
                <Heart className="w-12 h-12" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Nos Valeurs
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-pink-100 leading-relaxed">
            Les principes fondamentaux qui guident chacune de nos actions et
            nous unissent
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
              fill="#f9fafb"
              fillOpacity="1"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container mx-auto max-w-6xl">
          {/* Introduction */}
          <div className="text-center mb-16 max-w-3xl mx-auto">
            <p className="text-xl text-gray-700 leading-relaxed">
              Nos valeurs sont le socle de notre identité et de notre action.
              Elles reflètent notre engagement envers l'excellence, l'innovation
              et le développement de l'Afrique à travers les sciences spatiales
              et la géomatique.
            </p>
          </div>

          {/* Values Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {valeurs.map((valeur, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white overflow-hidden group"
              >
                <div className={`h-2 bg-gradient-to-r ${valeur.color}`}></div>
                <CardHeader className="text-center pb-4">
                  <div
                    className={`w-20 h-20 bg-gradient-to-br ${valeur.color} rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                  >
                    <valeur.icon className="h-10 w-10 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-gray-900">
                    {valeur.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center px-6 pb-8">
                  <p className="text-gray-600 leading-relaxed">
                    {valeur.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Impact Statement */}
          <div className="bg-gradient-to-br from-pink-600 via-purple-600 to-indigo-600 rounded-2xl p-12 shadow-2xl text-white text-center">
            <Heart className="w-16 h-16 mx-auto mb-6 animate-pulse" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Des Valeurs en Action
            </h2>
            <p className="text-xl text-pink-100 max-w-3xl mx-auto leading-relaxed mb-8">
              Ces valeurs ne sont pas de simples mots. Elles se traduisent
              concrètement dans nos projets, nos formations, nos collaborations
              et notre engagement quotidien envers la communauté géospatiale
              africaine.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-white/90">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <span className="font-medium">Plus de 500 membres actifs</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <span className="font-medium">15+ pays partenaires</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-white rounded-full"></div>
                <span className="font-medium">100+ projets collaboratifs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values in Practice Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            Nos Valeurs au Quotidien
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8 border-l-4 border-blue-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Dans nos formations
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Nous partageons les connaissances de manière collaborative et
                inclusive, en favorisant l'excellence scientifique et
                l'innovation pédagogique.
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-8 border-l-4 border-emerald-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Dans nos projets
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Nous appliquons nos valeurs d'innovation et de responsabilité
                pour créer des solutions durables adaptées aux réalités
                africaines.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8 border-l-4 border-purple-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Dans nos collaborations
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Nous cultivons un esprit de collaboration panafricaine, en
                mettant en réseau les talents et en favorisant les partenariats
                stratégiques.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8 border-l-4 border-orange-600">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Dans notre gouvernance
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Nous agissons avec intégrité et transparence, en plaçant
                l'intérêt collectif et le développement de l'Afrique au cœur de
                nos décisions.
              </p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
