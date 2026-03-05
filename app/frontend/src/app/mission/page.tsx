import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Card, CardContent } from "@/components/ui/card";
import {
  Lightbulb,
  Users,
  Rocket,
  GraduationCap,
  Target,
  TrendingUp,
} from "lucide-react";

export default function Mission() {
  const missions = [
    {
      icon: Users,
      title: "Fédérer les jeunes africains",
      description:
        "Créer une communauté dynamique de jeunes passionnés par les sciences spatiales et la géomatique à travers tout le continent africain",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Lightbulb,
      title: "Promouvoir l'innovation",
      description:
        "Encourager la créativité et l'innovation dans le domaine géospatial pour résoudre les défis africains",
      color: "from-cyan-500 to-teal-600",
    },
    {
      icon: TrendingUp,
      title: "Stimuler la recherche",
      description:
        "Développer et soutenir la recherche scientifique de qualité en géomatique et sciences spatiales",
      color: "from-teal-500 to-emerald-600",
    },
    {
      icon: GraduationCap,
      title: "Former les jeunes",
      description:
        "Offrir des formations de pointe en intelligence géospatiale pour préparer la nouvelle génération",
      color: "from-emerald-500 to-green-600",
    },
    {
      icon: Rocket,
      title: "Accompagner les grands projets",
      description:
        "Apporter notre expertise en ingénierie spatiale pour les projets stratégiques africains",
      color: "from-green-500 to-lime-600",
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
            src="https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?q=80&w=2071"
            alt="Mission spatiale"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-cyan-900/90 to-teal-900/95"></div>
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="inline-block mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl">
                <Target className="w-12 h-12" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Notre Mission
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-cyan-50 leading-relaxed">
            Les actions concrètes que nous menons pour transformer le paysage
            géospatial africain
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
          {/* Mission Statement Card */}
          <div className="mb-16">
            <Card className="border-0 shadow-2xl overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500"></div>
              <CardContent className="p-8 md:p-12 text-center bg-white">
                <div className="max-w-4xl mx-auto">
                  <p className="text-2xl md:text-3xl text-gray-800 leading-relaxed font-medium">
                    Fédérer les jeunes africains des sciences spatiales et de la
                    géomatique,
                    <span className="text-cyan-600">
                      {" "}
                      promouvoir l'innovation
                    </span>
                    ,
                    <span className="text-blue-600">
                      {" "}
                      stimuler la recherche
                    </span>
                    ,<span className="text-teal-600"> former les jeunes</span> à
                    l'intelligence géospatiale, et{" "}
                    <span className="text-emerald-600">
                      accompagner les grands projets africains
                    </span>{" "}
                    en ingénierie spatiale.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Mission Pillars Title */}
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nos 5 Piliers d'Action
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Chaque pilier représente un engagement fort envers le
              développement géospatial africain
            </p>
          </div>

          {/* Mission Cards Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {missions.map((mission, index) => (
              <Card
                key={index}
                className="border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white overflow-hidden group"
              >
                <div className={`h-2 bg-gradient-to-r ${mission.color}`}></div>
                <CardContent className="p-8">
                  <div className="mb-6">
                    <div
                      className={`w-16 h-16 bg-gradient-to-br ${mission.color} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                    >
                      <mission.icon className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    {mission.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {mission.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Impact Section */}
          <div className="bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600 rounded-2xl p-12 shadow-2xl text-white text-center">
            <Rocket className="w-16 h-16 mx-auto mb-6 animate-bounce" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Notre Impact
            </h2>
            <p className="text-xl text-cyan-50 max-w-3xl mx-auto leading-relaxed">
              À travers ces missions, nous visons à positionner l'Afrique comme
              un acteur majeur dans le domaine des sciences spatiales et de la
              géomatique, en développant une expertise locale de classe mondiale
              et en contribuant aux solutions innovantes pour le continent.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-2">
                500+
              </div>
              <div className="text-gray-600 font-medium">Jeunes formés</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 to-teal-600 mb-2">
                50+
              </div>
              <div className="text-gray-600 font-medium">Projets soutenus</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600 mb-2">
                15+
              </div>
              <div className="text-gray-600 font-medium">Pays partenaires</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-green-600 mb-2">
                100+
              </div>
              <div className="text-gray-600 font-medium">Collaborations</div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
