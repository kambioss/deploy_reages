import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { Eye, Globe2, Sparkles, TrendingUp, Shield, Star, ArrowRight } from "lucide-react";
import Link from "next/link";

const pillars = [
  { icon: Globe2,    title: "Réseau Panafricain",       description: "Devenir la référence continentale en matière de sciences spatiales et géomatique, reconnue par les institutions mondiales.", color: "from-purple-600 to-indigo-500" },
  { icon: Sparkles,  title: "Excellence & Innovation",   description: "Fédérer les meilleurs talents africains pour innover, exceller et créer des solutions à la hauteur des enjeux continentaux.", color: "from-indigo-600 to-blue-500" },
  { icon: TrendingUp,title: "Développement Durable",     description: "Contribuer au développement durable de l'Afrique par les technologies géospatiales appliquées aux défis réels du terrain.", color: "from-blue-600 to-cyan-500" },
  { icon: Shield,    title: "Souveraineté Africaine",    description: "Renforcer l'autonomie technologique et la souveraineté spatiale du continent par la maîtrise locale des données géospatiales.", color: "from-cyan-600 to-teal-500" },
  { icon: Star,      title: "Rayonnement International", description: "Projeter l'excellence géospatiale africaine sur la scène internationale et créer des ponts avec les grandes agences spatiales mondiales.", color: "from-teal-600 to-emerald-500" },
];

export default function Vision() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        icon={<Eye className="w-10 h-10 text-white" />}
        label="REAAGESS"
        title="Notre Vision"
        subtitle="L'horizon que nous nous fixons pour l'avenir géospatial du continent africain"
        gradient="from-[#0a1628] via-[#1a1060] to-[#0c2340]"
      />

      {/* Vision statement */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="rounded-2xl border border-slate-100 shadow-xl overflow-hidden">
            <div className="h-1.5 bg-gradient-to-r from-purple-600 via-indigo-500 to-cyan-500" />
            <div className="p-10 md:p-16 text-center bg-white">
              <p className="text-xl md:text-2xl text-slate-700 leading-relaxed font-display font-medium max-w-4xl mx-auto">
                Être un <span className="text-purple-600">réseau panafricain de référence</span> en sciences spatiales et géomatique, capable de{" "}
                <span className="text-indigo-600">fédérer les talents</span> et de contribuer à un{" "}
                <span className="text-cyan-600">développement durable et souverain</span> de l&apos;Afrique grâce aux technologies géospatiales.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision pillars */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <div className="section-label mx-auto w-fit">Les piliers de notre vision</div>
            <h2 className="section-h2 text-slate-900">Ce vers quoi nous tendons</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pillars.map((p, i) => (
              <div key={i} className="card-hover group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <div className={`w-14 h-14 bg-gradient-to-br ${p.color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <p.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="card-h3 text-slate-900 mb-3">{p.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm font-sans">{p.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Horizon 2030 */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="section-label">Objectif stratégique</div>
              <h2 className="section-h2 text-slate-900 mb-6">Horizon 2030</h2>
              <p className="text-slate-600 leading-relaxed mb-6 font-sans">D'ici 2030, REAAGESS aspire à devenir l'institution de référence en géomatique et sciences spatiales en Afrique, avec une présence active dans plus de 30 pays, des laboratoires de recherche affiliés dans 10 universités africaines, et des partenariats stratégiques avec les agences spatiales mondiales.</p>
              <ul className="space-y-3">
                {["30+ pays membres actifs","10 laboratoires universitaires affiliés","5 agences spatiales partenaires","1 000+ membres certifiés"].map((item,i)=>(
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-sans text-sm">
                    <div className="w-2 h-2 rounded-full bg-cyan-500 flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <Link href="/a-propos">
                  <button className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold px-8 py-3.5 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg shadow-purple-500/25 font-sans">
                    En savoir plus <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{n:"2024",t:"Fondation REAAGESS",c:"from-blue-600 to-cyan-500"},
                {n:"2026",t:"10 pays membres",c:"from-cyan-600 to-teal-500"},
                {n:"2028",t:"50 projets réalisés",c:"from-teal-600 to-emerald-500"},
                {n:"2030",t:"Référence continentale",c:"from-purple-600 to-indigo-500"}
              ].map((s,i)=>(
                <div key={i} className={`card-hover rounded-2xl p-6 bg-gradient-to-br ${s.c} text-white shadow-xl`}>
                  <div className="text-3xl font-bold font-sans mb-2">{s.n}</div>
                  <div className="text-white/90 text-sm font-sans">{s.t}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
