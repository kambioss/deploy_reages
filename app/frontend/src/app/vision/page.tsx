import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Target,
  Eye,
  Telescope,
  Sparkles,
  Globe2,
  TrendingUp,
  Shield,
} from "lucide-react";

export default function Vision() {
  const visionPillars = [
    {
      icon: Globe2,
      title: "Réseau Panafricain",
      description:
        "Devenir la référence continentale en matière de sciences spatiales et géomatique",
      color: "from-purple-500 to-indigo-600",
    },
    {
      icon: Sparkles,
      title: "Excellence & Innovation",
      description:
        "Fédérer les meilleurs talents africains pour innover et exceller",
      color: "from-indigo-500 to-blue-600",
    },
    {
      icon: TrendingUp,
      title: "Développement Durable",
      description:
        "Contribuer au développement durable de l'Afrique par les technologies géospatiales",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Shield,
      title: "Souveraineté Africaine",
      description:
        "Renforcer l'autonomie technologique et la souveraineté spatiale du continent",
      color: "from-cyan-500 to-teal-600",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero Section with Background Image */}
      <section className="relative h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2011"
            alt="Vision de l'espace"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/95 via-indigo-900/90 to-blue-900/95"></div>
        </div>

        {/* Animated Stars Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-white rounded-full animate-pulse delay-300"></div>
          <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-700"></div>
          <div className="absolute top-2/3 right-1/4 w-2 h-2 bg-white rounded-full animate-pulse delay-500"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="inline-block mb-8">
            <div className="relative">
              {/* Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full blur-2xl opacity-60 animate-pulse"></div>
              {/* Main Icon */}
              <div className="relative w-28 h-28 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center border-4 border-white/40 shadow-2xl">
                <Telescope className="w-14 h-14" />
              </div>
              {/* Orbiting Eye Icon */}
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center border-2 border-white/60 shadow-xl animate-bounce">
                <Eye className="w-6 h-6" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Notre Vision
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-purple-100 leading-relaxed">
            L'ambition qui guide notre action quotidienne vers un avenir spatial
            africain
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
          {/* Vision Statement Card */}
          <div className="mb-16">
            <Card className="border-0 shadow-2xl overflow-hidden">
              <div className="h-3 bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500"></div>
              <CardContent className="p-10 md:p-16 text-center bg-gradient-to-br from-purple-50/50 to-indigo-50/50">
                <div className="max-w-4xl mx-auto">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full mb-6 shadow-lg">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <p className="text-2xl md:text-3xl text-gray-800 leading-relaxed font-medium mb-6">
                    Être un{" "}
                    <span className="text-purple-600 font-bold">
                      réseau panafricain de référence
                    </span>{" "}
                    en sciences spatiales et géomatique, capable de{" "}
                    <span className="text-indigo-600 font-bold">
                      fédérer les talents
                    </span>{" "}
                    et de contribuer à un
                    <span className="text-blue-600 font-bold">
                      {" "}
                      développement durable et souverain
                    </span>{" "}
                    de l'Afrique grâce aux{" "}
                    <span className="text-cyan-600 font-bold">
                      technologies géospatiales
                    </span>
                    .
                  </p>
                  <div className="flex items-center justify-center gap-2 text-purple-600">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-semibold">Vision 2030</span>
                    <Sparkles className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Vision Pillars Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Les Piliers de Notre Vision
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Quatre axes stratégiques pour transformer notre vision en réalité
            </p>
          </div>

          {/* Vision Pillars Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {visionPillars.map((pillar, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white overflow-hidden group"
              >
                <div className={`h-2 bg-gradient-to-r ${pillar.color}`}></div>
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div
                      className={`flex-shrink-0 w-16 h-16 bg-gradient-to-br ${pillar.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}
                    >
                      <pillar.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {pillar.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Timeline Section */}
          <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 md:p-12 mb-16">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">
                Notre Horizon 2030
              </h2>
              <p className="text-lg text-gray-600">
                Les étapes clés pour réaliser notre vision
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-2">
                  2025
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Consolidation</h4>
                <p className="text-gray-600 text-sm">
                  Renforcement du réseau et établissement de partenariats
                  stratégiques
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-600 mb-2">
                  2027
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Expansion</h4>
                <p className="text-gray-600 text-sm">
                  Extension à l'ensemble du continent et lancement de programmes
                  majeurs
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-2">
                  2030
                </div>
                <h4 className="font-bold text-gray-900 mb-2">Leadership</h4>
                <p className="text-gray-600 text-sm">
                  Référence mondiale en sciences spatiales et géomatique
                  africaines
                </p>
              </div>
            </div>
          </div>

          {/* Impact Card */}
          <Card className="border-0 shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 p-10 md:p-12 text-white text-center">
              <div className="flex items-center justify-center gap-3 mb-6">
                <Sparkles className="w-8 h-8 animate-pulse" />
                <h2 className="text-3xl md:text-4xl font-bold">
                  L'Impact que Nous Visons
                </h2>
                <Sparkles className="w-8 h-8 animate-pulse" />
              </div>
              <p className="text-xl text-purple-100 max-w-3xl mx-auto leading-relaxed mb-8">
                En réalisant cette vision, nous aspirons à faire de l'Afrique un
                continent pionnier dans l'utilisation des technologies spatiales
                pour résoudre ses propres défis, créer des opportunités
                économiques et affirmer sa place dans l'économie spatiale
                mondiale.
              </p>
              <div className="flex flex-wrap justify-center gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <span>Autonomie technologique</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <span>Création d'emplois</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-white rounded-full"></div>
                  <span>Innovation durable</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>
      <Footer />
    </div>
  );
}
