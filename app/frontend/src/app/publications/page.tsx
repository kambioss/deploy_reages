import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { BookOpen, Download, ExternalLink, FileText } from "lucide-react";

const publications = [
  { titre: "Utilisation des drones pour la cartographie des zones inondables en Afrique subsaharienne", auteur: "Dr. Kofi Mensah, Aïssatou Ba", categorie: "Article scientifique", date: "2024", lien: "#" },
  { titre: "Analyse multi-temporelle de la déforestation dans le bassin du Congo par télédétection", auteur: "Pr. Jean-Marie Ndongmo", categorie: "Publication de recherche", date: "2024", lien: "#" },
  { titre: "SIG et gouvernance foncière en Afrique de l'Ouest : état des lieux et perspectives", auteur: "Fatima Zahra Alaoui, Ibrahim Diallo", categorie: "Rapport technique", date: "2023", lien: "#" },
  { titre: "Machine Learning appliqué à la classification des occupations du sol en Afrique", auteur: "Dr. Amara Kouyaté", categorie: "Article scientifique", date: "2023", lien: "#" },
  { titre: "Revue REAAGESS Vol. 1 — Géomatique et développement durable africain", auteur: "Collectif REAAGESS", categorie: "Revue scientifique", date: "2024", lien: "#" },
  { titre: "Atlas géospatial des ressources en eau en Afrique sahélienne", auteur: "Équipe SIG REAAGESS", categorie: "Atlas / Rapport", date: "2023", lien: "#" },
];

const catColors: Record<string, string> = {
  "Article scientifique": "bg-blue-100 text-blue-700",
  "Publication de recherche": "bg-purple-100 text-purple-700",
  "Rapport technique": "bg-orange-100 text-orange-700",
  "Revue scientifique": "bg-cyan-100 text-cyan-700",
  "Atlas / Rapport": "bg-teal-100 text-teal-700",
};

export default function Publications() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        icon={<BookOpen className="w-10 h-10 text-white" />}
        label="Ressources"
        title="Publications"
        subtitle="Recherches, articles et rapports scientifiques produits par les membres de REAAGESS"
        gradient="from-[#0a1628] via-[#0c1840] to-[#0c2340]"
      />

      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-14">
            <div className="section-label mx-auto w-fit">Bibliothèque scientifique</div>
            <h2 className="section-h2 text-slate-900 mb-4">Notre production scientifique</h2>
            <p className="text-slate-500 text-lg max-w-xl mx-auto font-sans">Accédez aux travaux de recherche et publications des membres du réseau REAAGESS</p>
          </div>

          <div className="space-y-4">
            {publications.map((p, i) => (
              <div key={i} className="card-hover group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm flex items-start gap-5">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-700 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <h3 className="card-h3 text-slate-900 mb-1">{p.titre}</h3>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full font-sans ${catColors[p.categorie] || "bg-gray-100 text-gray-600"}`}>{p.categorie}</span>
                      <span className="text-xs text-slate-400 font-sans">{p.date}</span>
                    </div>
                  </div>
                  <p className="text-slate-500 text-sm font-sans mb-3">{p.auteur}</p>
                  <div className="flex gap-3">
                    <a href={p.lien} className="inline-flex items-center gap-1.5 text-xs text-cyan-600 hover:text-cyan-700 font-semibold font-sans transition-colors">
                      <ExternalLink className="h-3.5 w-3.5" />Lire en ligne
                    </a>
                    <a href={p.lien} className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 font-semibold font-sans transition-colors">
                      <Download className="h-3.5 w-3.5" />Télécharger PDF
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-16">
            {[["80+","Publications totales"],["25","Auteurs actifs"],["4","Langues de publication"]].map(([n,l],i)=>(
              <div key={i} className={`text-center p-6 rounded-2xl ${i===1?"bg-gradient-to-br from-blue-700 to-cyan-600 text-white shadow-xl shadow-blue-500/25":"bg-slate-50 border border-slate-100"}`}>
                <div className={`text-3xl font-bold font-sans mb-1 ${i===1?"text-white":"text-slate-900"}`}>{n}</div>
                <div className={`text-sm font-sans ${i===1?"text-blue-100":"text-slate-500"}`}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
