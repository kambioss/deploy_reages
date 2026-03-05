import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import {
  Rocket,
  MapPin,
  Satellite,
  TreePine,
  Wheat,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const projets = [];

/*const projets = [
  { icon: MapPin,    titre: "CartographieAI Afrique", statut: "en_cours",  pays: "Togo · Bénin · Ghana",   desc: "Développement d'une plateforme IA de cartographie automatique des terres agricoles en Afrique de l'Ouest à partir d'images satellite Sentinel-2.", tags: ["SIG","Machine Learning","Agriculture"], color: "from-blue-600 to-cyan-500" },
  { icon: Satellite, titre: "SatMonitor Sahel",       statut: "en_cours",  pays: "Mali · Niger · Burkina",  desc: "Système de surveillance par satellite du couvert végétal et des ressources en eau dans la région du Sahel pour anticiper les crises alimentaires.", tags: ["Télédétection","Sahel","Eau"], color: "from-purple-600 to-indigo-500" },
  { icon: TreePine,  titre: "ForestWatch Congo",       statut: "planifie",  pays: "RDC · Congo · Gabon",     desc: "Plateforme de suivi en temps réel de la déforestation dans le bassin du Congo, deuxième plus grande forêt tropicale mondiale.", tags: ["Forêt","Déforestation","Biodiversité"], color: "from-emerald-600 to-green-500" },
  { icon: Wheat,     titre: "AgroSmart East Africa",   statut: "termine",   pays: "Kenya · Tanzania · Rwanda",desc: "Déploiement de solutions géospatiales pour l'agriculture de précision en Afrique de l'Est, touchant 500 000 petits exploitants agricoles.", tags: ["Agriculture","IoT","Impact"], color: "from-orange-600 to-amber-500" },
];
*/
const statutColors: Record<string, string> = {
  en_cours: "bg-green-100 text-green-700",
  planifie: "bg-yellow-100 text-yellow-700",
  termine: "bg-blue-100 text-blue-700",
};
const statutLabels: Record<string, string> = {
  en_cours: "En cours",
  planifie: "Planifié",
  termine: "Terminé",
};

export default function Projets() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        icon={<Rocket className="w-10 h-10 text-white" />}
        label="Projets"
        title="Nos Projets"
        subtitle="Des initiatives géospatiales concrètes au service du développement africain"
        gradient="from-[#0a1628] via-[#1a0640] to-[#0c2340]"
      />

      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <div className="section-label mx-auto w-fit">Impact terrain</div>
            <h2 className="section-h2 text-slate-900 mb-4">
              Projets en cours &amp; terminés
            </h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto font-sans">
              Des projets de recherche et développement qui transforment
              concrètement les territoires africains grâce aux technologies
              géospatiales
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {projets.map((p, i) => (
              <div
                key={i}
                className="card-hover group bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className={`h-1.5 bg-gradient-to-r ${p.color}`} />
                <div className="p-8">
                  <div className="flex items-start gap-4 mb-5">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${p.color} flex items-center justify-center flex-shrink-0 shadow-md group-hover:scale-110 transition-transform duration-300`}
                    >
                      <p.icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <h3 className="card-h3 text-slate-900">{p.titre}</h3>
                        <span
                          className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 font-sans ${statutColors[p.statut]}`}
                        >
                          {statutLabels[p.statut]}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 font-sans">
                        {p.pays}
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed mb-4 font-sans">
                    {p.desc}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((t) => (
                      <span
                        key={t}
                        className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-sans font-medium"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 rounded-2xl bg-gradient-to-br from-[#0a1628] to-[#0d2444] p-10 text-white text-center relative overflow-hidden shadow-2xl">
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "radial-gradient(circle,#fff 1px,transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />
            <div className="relative z-10">
              <h2 className="section-h2 text-white mb-4">
                Vous avez un projet géospatial ?
              </h2>
              <p className="text-slate-300 font-sans mb-8 max-w-xl mx-auto">
                REAAGESS peut vous accompagner dans la conception, le
                financement et la mise en œuvre de votre projet géospatial en
                Afrique.
              </p>
              <Link href="/contact">
                <button className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-8 py-3.5 rounded-2xl hover:scale-105 transition-all duration-300 font-sans">
                  Proposer un projet <ArrowRight className="h-4 w-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
