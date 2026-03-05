import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { Globe, ArrowRight, Users, Target, BookOpen, Rocket, Award, Heart } from "lucide-react";
import Link from "next/link";

const milestones = [
  { year: "2021", event: "Fondation de REAAGESS", desc: "Création du réseau par un groupe de passionnés de géomatique africaine." },
  { year: "2022", event: "Premiers membres fondateurs", desc: "Rejoindre par des professionnels de 5 pays africains pionniers." },
  { year: "2023", event: "Premières publications", desc: "Lancement de la revue scientifique géospatiale africaine." },
  { year: "2024", event: "Expansion continentale", desc: "Présence active dans 15 pays africains avec 200+ membres." },
];

export default function APropos() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        icon={<Globe className="w-10 h-10 text-white" />}
        label="REAAGESS"
        title="Qui sommes-nous ?"
        subtitle="Découvrez le réseau qui façonne l'avenir des sciences spatiales et de la géomatique en Afrique"
      />

      {/* Intro */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="section-label">Notre histoire</div>
              <h2 className="section-h2 text-slate-900 mb-6">Un réseau né d&apos;une passion commune</h2>
              <div className="space-y-4 text-slate-600 leading-relaxed font-sans">
                <p>REAAGESS (Réseau Africain des Acteurs de la Géomatique et des Sciences Spatiales) est une initiative panafricaine née de la volonté de fédérer les acteurs africains des sciences géospatiales autour d&apos;une vision commune.</p>
                <p>Nous rassemblons jeunes professionnels, chercheurs, universitaires et praticiens du domaine géospatial pour créer un écosystème d&apos;excellence au service du développement africain.</p>
                <p>Notre réseau est fondé sur la conviction que l&apos;Afrique possède les talents et les ressources pour devenir un acteur majeur de la révolution géospatiale mondiale.</p>
              </div>
              <div className="flex gap-4 mt-8">
                <Link href="/mission"><button className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-700 to-cyan-600 text-white font-bold px-6 py-3 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg font-sans text-sm">Notre Mission <ArrowRight className="h-4 w-4" /></button></Link>
                <Link href="/vision"><button className="inline-flex items-center gap-2 border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-bold px-6 py-3 rounded-2xl transition-all duration-300 font-sans text-sm">Notre Vision</button></Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[{Icon:Users,v:"200+",l:"Membres actifs",c:"from-blue-600 to-cyan-500"},
                {Icon:Globe,v:"15",l:"Pays couverts",c:"from-cyan-600 to-teal-500"},
                {Icon:BookOpen,v:"80+",l:"Publications",c:"from-teal-600 to-emerald-500"},
                {Icon:Rocket,v:"45+",l:"Projets réalisés",c:"from-purple-600 to-indigo-500"}
              ].map(({Icon,v,l,c},i)=>(
                <div key={i} className={`card-hover rounded-2xl p-6 bg-gradient-to-br ${c} text-white shadow-xl`}>
                  <Icon className="h-8 w-8 mb-3 text-white/80" />
                  <div className="text-3xl font-bold font-sans mb-1">{v}</div>
                  <div className="text-white/80 text-sm font-sans">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <div className="section-label mx-auto w-fit">Notre parcours</div>
            <h2 className="section-h2 text-slate-900">Les grandes étapes de REAAGESS</h2>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-600 to-emerald-500 -translate-x-1/2" />
            {milestones.map((m, i) => (
              <div key={i} className={`relative flex items-center gap-8 mb-10 ${i % 2 === 0 ? "flex-row" : "flex-row-reverse"}`}>
                <div className={`w-1/2 ${i % 2 === 0 ? "text-right pr-8" : "text-left pl-8"}`}>
                  <div className="card-hover inline-block bg-white rounded-2xl p-6 shadow-sm border border-slate-100 max-w-xs">
                    <div className="text-cyan-600 font-bold font-sans text-sm mb-1">{m.year}</div>
                    <h3 className="card-h3 text-slate-900 mb-2">{m.event}</h3>
                    <p className="text-slate-500 text-sm font-sans">{m.desc}</p>
                  </div>
                </div>
                <div className="absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-cyan-500 border-4 border-white shadow-md" />
                <div className="w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team/values */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="rounded-2xl bg-gradient-to-br from-[#0a1628] to-[#0d2444] p-12 text-white relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="absolute right-0 top-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <Award className="h-12 w-12 text-cyan-400 mb-4" />
                <h2 className="section-h2 text-white mb-5">Rejoignez une communauté d&apos;excellence</h2>
                <p className="text-slate-300 leading-relaxed font-sans">REAAGESS vous offre bien plus qu&apos;un simple réseau professionnel. C&apos;est une communauté d&apos;acteurs engagés dans la transformation géospatiale de l&apos;Afrique.</p>
              </div>
              <div className="space-y-4">
                {[{Icon:Heart,t:"Communauté bienveillante",d:"Un espace d'entraide et de partage"},
                  {Icon:Target,t:"Ambitions partagées",d:"Des objectifs communs à l'échelle continentale"},
                  {Icon:Globe,t:"Impact réel",d:"Des projets qui changent concrètement les territoires"}
                ].map(({Icon,t,d},i)=>(
                  <div key={i} className="flex items-start gap-4 bg-white/5 rounded-xl p-4">
                    <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm font-sans">{t}</div>
                      <div className="text-slate-400 text-xs font-sans mt-0.5">{d}</div>
                    </div>
                  </div>
                ))}
                <Link href="/register">
                  <button className="w-full mt-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold py-3.5 rounded-2xl hover:scale-105 transition-all duration-300 font-sans text-sm flex items-center justify-center gap-2">
                    Rejoindre REAAGESS <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
