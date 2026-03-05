import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import {
  Target,
  Users,
  Lightbulb,
  TrendingUp,
  GraduationCap,
  Rocket,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const missions = [
  {
    icon: Users,
    title: "Fédérer les jeunes africains",
    description:
      "Créer une communauté dynamique de jeunes passionnés par les sciences spatiales et la géomatique à travers tout le continent africain.",
    color: "from-blue-600 to-cyan-500",
  },
  {
    icon: Lightbulb,
    title: "Promouvoir l'innovation",
    description:
      "Encourager la créativité et l'innovation dans le domaine géospatial pour résoudre les défis africains contemporains.",
    color: "from-cyan-600 to-teal-500",
  },
  {
    icon: TrendingUp,
    title: "Stimuler la recherche",
    description:
      "Développer et soutenir la recherche scientifique de qualité en géomatique et sciences spatiales appliquées.",
    color: "from-teal-600 to-emerald-500",
  },
  {
    icon: GraduationCap,
    title: "Former les jeunes",
    description:
      "Offrir des formations de pointe en intelligence géospatiale pour préparer la nouvelle génération de leaders africains.",
    color: "from-emerald-600 to-green-500",
  },
  {
    icon: Rocket,
    title: "Accompagner les grands projets",
    description:
      "Apporter notre expertise en ingénierie spatiale pour les projets stratégiques africains à fort impact territorial.",
    color: "from-green-600 to-lime-500",
  },
  {
    icon: Target,
    title: "Développer des partenariats",
    description:
      "Tisser des alliances solides avec des institutions internationales pour renforcer la capacité géospatiale africaine.",
    color: "from-purple-600 to-indigo-500",
  },
];

export default function Mission() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        icon={<Target className="w-10 h-10 text-white" />}
        label="REAAGESS"
        title="Notre Mission"
        subtitle="Les actions concrètes que nous menons pour transformer le paysage géospatial africain"
      />

      {/* Mission statement */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-emerald-500" />
            <div className="p-10 md:p-16 text-center bg-white">
              <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-display font-medium max-w-4xl mx-auto">
                Fédérer les jeunes africains des sciences spatiales et de la
                géomatique,{" "}
                <span className="text-cyan-600">
                  promouvoir l&apos;innovation
                </span>
                , <span className="text-blue-600">stimuler la recherche</span>,{" "}
                <span className="text-teal-600">former les jeunes</span> à
                l&apos;intelligence géospatiale, et{" "}
                <span className="text-emerald-600">
                  accompagner les grands projets africains
                </span>{" "}
                en ingénierie spatiale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5 pillars */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <div className="section-label mx-auto w-fit">Nos piliers</div>
            <h2 className="section-h2 text-slate-900">
              Nos 6 piliers d&apos;action
            </h2>
            <p className="text-slate-500 text-lg mt-4 max-w-xl mx-auto font-sans">
              Chaque pilier représente un engagement fort envers le
              développement géospatial africain
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((m, i) => (
              <div
                key={i}
                className="card-hover group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm overflow-hidden"
              >
                <div
                  className={`w-14 h-14 bg-gradient-to-br ${m.color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
                >
                  <m.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="card-h3 text-slate-900 mb-3">{m.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-sans">
                  {m.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="rounded-2xl bg-gradient-to-br from-[#0a1628] to-[#0d2444] p-12 md:p-16 text-white text-center relative overflow-hidden shadow-2xl">
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "radial-gradient(circle,#fff 1px,transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="relative z-10">
              <Rocket className="w-14 h-14 mx-auto mb-6 text-cyan-400" />
              <h2 className="section-h2 text-white mb-5">Notre Impact</h2>
              <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed font-sans mb-8">
                À travers ces missions, nous visons à positionner l&apos;Afrique
                comme un acteur majeur dans le domaine des sciences spatiales et
                de la géomatique, en développant une expertise locale de classe
                mondiale.
              </p>
              <Link href="/register">
                <button className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-8 py-3.5 rounded-2xl transition-all duration-300 hover:scale-105 font-sans">
                  Rejoindre la mission <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {[
              ["500+", "Jeunes formés"],
              ["50+", "Projets soutenus"],
              ["15+", "Pays partenaires"],
              ["100+", "Collaborations"],
            ].map(([n, l], i) => (
              <div key={i} className="text-center group">
                <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-blue-600 to-cyan-500 mb-2 group-hover:scale-110 transition-transform duration-300 font-sans">
                  {n}
                </div>
                <div className="text-slate-500 font-medium font-sans text-sm">
                  {l}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
