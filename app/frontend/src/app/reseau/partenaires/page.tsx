import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Handshake } from "lucide-react";

const partenaires = [
  { nom: "Union Africaine (UA)", type: "Institutionnel", description: "Soutien institutionnel au développement des sciences spatiales africaines" },
  { nom: "Agence Spatiale Africaine (AfSA)", type: "Scientifique", description: "Coordination des programmes spatiaux africains" },
  { nom: "ESA - European Space Agency", type: "International", description: "Partenariat pour la formation et l'accès aux données satellites" },
  { nom: "UNOOSA", type: "International", description: "Programme des Nations Unies pour les affaires spatiales" },
  { nom: "FAO", type: "International", description: "Utilisation de la géomatique pour la sécurité alimentaire" },
];

export default function PartenairesPage() {
  const typeColors: any = {
    "Institutionnel": "bg-blue-100 text-blue-700",
    "Scientifique": "bg-green-100 text-green-700",
    "International": "bg-purple-100 text-purple-700",
  };

  return (
    <LayoutWrapper>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Nos Partenaires</h1>
            <p className="text-xl text-gray-500">Les organisations qui soutiennent la mission de REAAGESS</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {partenaires.map((p, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-6 flex gap-4 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Handshake className="text-indigo-600" size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900">{p.nom}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${typeColors[p.type] || "bg-gray-100 text-gray-600"}`}>{p.type}</span>
                  </div>
                  <p className="text-sm text-gray-500">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </LayoutWrapper>
  );
}
