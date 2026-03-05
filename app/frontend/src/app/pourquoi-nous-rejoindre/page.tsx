import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { Users, Globe, BookOpen, Calendar, Lightbulb, TrendingUp, ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";

const avantages = [
  { icon: Globe,      title: "Accès aux données géospatiales", description: "Bénéficiez d'un accès privilégié aux données et outils géospatiaux mobilisés par le réseau pour vos projets de recherche et développement.", color: "from-blue-600 to-cyan-500",    bullets: ["Bases de données SIG partagées","Imagerie satellitaire","Outils open-source géospatiaux"] },
  { icon: Users,      title: "Intégration aux pôles thématiques", description: "Rejoignez un pôle dédié à votre spécialité (cartographie, télédétection, agriculture de précision...) et collaborez avec des experts du domaine.", color: "from-purple-600 to-indigo-500", bullets: ["Pôle Cartographie & SIG","Pôle Télédétection","Pôle Agriculture & Environnement"] },
  { icon: BookOpen,   title: "Formation continue",              description: "Accédez à des formations de pointe, webinaires et ateliers pratiques animés par des experts africains et internationaux.", color: "from-teal-600 to-emerald-500",  bullets: ["Webinaires mensuels","Formations certifiantes","Accès aux supports de cours"] },
  { icon: Calendar,   title: "Rencontres et événements",        description: "Participez aux activités annuelles présentielles organisées à tour de rôle dans chaque pays membre africain.", color: "from-orange-600 to-amber-500",  bullets: ["Conférences africaines","Ateliers techniques","Networking professionnel"] },
  { icon: Lightbulb,  title: "Échanges scientifiques de haut niveau", description: "Contribuez à des discussions rigoureuses sur l'intelligence géospatiale et les technologies innovantes appliquées aux défis africains.", color: "from-cyan-600 to-blue-500",    bullets: ["Revue scientifique REAAGESS","Calls for papers","Co-publication d'articles"] },
  { icon: TrendingUp, title: "Collaboration continentale",      description: "Travaillez avec des professionnels et experts à l'échelle continentale pour stimuler l'innovation et créer un impact territorial réel.", color: "from-emerald-600 to-green-500", bullets: ["Projets transfrontaliers","Partenariats institutionnels","Mobilité africaine"] },
];

export default function PourquoiNousRejoindre() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        icon={<Users className="w-10 h-10 text-white" />}
        label="Adhésion"
        title="Pourquoi nous rejoindre ?"
        subtitle="Découvrez les opportunités exclusives réservées aux membres du réseau REAAGESS"
        gradient="from-[#0a1628] via-[#0c2040] to-[#062020]"
      />

      {/* Avantages grid */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-14">
            <div className="section-label mx-auto w-fit">Membres REAAGESS</div>
            <h2 className="section-h2 text-slate-900 mb-4">Des avantages concrets</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto font-sans">Bien plus qu&apos;un simple réseau, REAAGESS offre des opportunités uniques pour votre carrière et vos projets</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {avantages.map((a, i) => (
              <div key={i} className="card-hover group bg-white rounded-2xl p-8 border border-slate-100 shadow-sm">
                <div className={`w-14 h-14 bg-gradient-to-br ${a.color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <a.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="card-h3 text-slate-900 mb-3">{a.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed mb-4 font-sans">{a.description}</p>
                <ul className="space-y-1.5">
                  {a.bullets.map((b, j) => (
                    <li key={j} className="flex items-center gap-2 text-xs text-slate-600 font-sans">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" />{b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gradient-to-br from-[#0a1628] to-[#0d2444] relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
        <div className="absolute top-0 left-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 container mx-auto max-w-3xl text-center">
          <h2 className="section-h2 text-white mb-5">Prêt à rejoindre la communauté ?</h2>
          <p className="text-slate-300 text-lg mb-10 font-sans">L&apos;inscription est gratuite et ouverte à tous les professionnels africains du domaine géospatial</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <button className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-bold px-10 py-4 rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl shadow-cyan-500/30 font-sans">
                Rejoindre gratuitement <ArrowRight className="h-5 w-5" />
              </button>
            </Link>
            <Link href="/contact">
              <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white font-semibold px-10 py-4 rounded-2xl transition-all duration-300 font-sans">
                Nous contacter
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
