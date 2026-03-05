import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { Heart, Users, BookOpen, Lightbulb, Shield, Globe, Leaf, CheckCircle2 } from "lucide-react";

const valeurs = [
  { icon: Users,     title: "Collaboration & Solidarité", description: "Nous croyons en la force du collectif. Ensemble, nous construisons un réseau solide où chaque membre contribue au succès commun.", color: "from-blue-600 to-cyan-500",    items: ["Travail en équipe transnationale","Partage des ressources et compétences","Entraide entre membres du réseau"] },
  { icon: BookOpen,  title: "Partage des connaissances",  description: "La connaissance s'enrichit en se partageant. Nous favorisons la diffusion libre du savoir géospatial à travers tout le continent.", color: "from-cyan-600 to-teal-500",    items: ["Publications en accès libre","Formations et webinaires réguliers","Bibliothèque géospatiale partagée"] },
  { icon: Globe,     title: "Excellence scientifique",    description: "Nous nous engageons à maintenir les plus hauts standards dans nos travaux de recherche, nos formations et nos publications.", color: "from-teal-600 to-emerald-500", items: ["Rigueur méthodologique","Peer-review des publications","Certifications reconnues"] },
  { icon: Lightbulb, title: "Innovation & Créativité",    description: "L'innovation est au cœur de notre démarche. Nous encourageons les approches novatrices pour résoudre les défis africains.", color: "from-orange-600 to-amber-500",  items: ["Hackathons géospatiaux","Labs d'innovation ouverts","Incubation de projets"] },
  { icon: Shield,    title: "Responsabilité & Intégrité", description: "Nous agissons avec éthique, transparence et responsabilité dans toutes nos actions, envers nos membres et partenaires.", color: "from-purple-600 to-indigo-500", items: ["Gouvernance transparente","Éthique des données","Redevabilité envers les membres"] },
  { icon: Leaf,      title: "Développement durable",      description: "Nos actions sont guidées par la vision d'un développement africain souverain, durable et respectueux de l'environnement.", color: "from-emerald-600 to-green-500", items: ["Impact environnemental mesuré","Projets à vocation sociale","Souveraineté technologique africaine"] },
];

export default function Valeurs() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        icon={<Heart className="w-10 h-10 text-white" />}
        label="REAAGESS"
        title="Nos Valeurs"
        subtitle="Les principes fondamentaux qui guident chacune de nos actions et décisions"
        gradient="from-[#0a1628] via-[#1a0640] to-[#0c2340]"
      />

      {/* Intro */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="section-label mx-auto w-fit">Notre boussole</div>
          <h2 className="section-h2 text-slate-900 mb-6">Ce qui nous définit</h2>
          <p className="text-slate-500 text-lg max-w-3xl mx-auto leading-relaxed font-sans">
            Nos valeurs ne sont pas de simples mots. Elles sont les fondements sur lesquels REAAGESS construit chaque initiative, chaque partenariat et chaque formation. Elles unissent nos membres à travers le continent africain.
          </p>
        </div>
      </section>

      {/* Values cards */}
      <section className="py-10 px-6 pb-24 bg-slate-50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {valeurs.map((v, i) => (
              <div key={i} className="card-hover group bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm">
                <div className={`h-1.5 bg-gradient-to-r ${v.color}`} />
                <div className="p-8">
                  <div className={`w-14 h-14 bg-gradient-to-br ${v.color} rounded-xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <v.icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="card-h3 text-slate-900 mb-3">{v.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm font-sans mb-5">{v.description}</p>
                  <ul className="space-y-2">
                    {v.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-xs text-slate-600 font-sans">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0 mt-0.5" />{item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl bg-gradient-to-br from-[#0a1628] to-[#0d2444] p-12 text-white text-center relative overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)", backgroundSize: "24px 24px" }} />
            <div className="relative z-10">
              <div className="text-6xl text-cyan-400/40 font-display mb-4">"</div>
              <p className="text-xl md:text-2xl text-slate-200 leading-relaxed font-display italic max-w-2xl mx-auto">
                Seuls nous allons plus vite, ensemble nous allons plus loin.
              </p>
              <p className="text-cyan-400 font-sans text-sm mt-4 tracking-wider uppercase font-semibold">Proverbe africain — philosophie REAAGESS</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
