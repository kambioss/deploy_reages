import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";
import { Globe } from "lucide-react";

const organisations = [
  { nom: "Direction Nationale des Eaux et Forêts (DNEF)", pays: "Mali", description: "Gestion des ressources forestières et hydrauliques" },
  { nom: "Institut Géographique National (IGN)", pays: "Burkina Faso", description: "Cartographie et référentiel géographique national" },
  { nom: "Agence Nationale de l'Aviation Civile (ANAC)", pays: "Côte d'Ivoire", description: "Navigation aérienne et télédétection" },
  { nom: "Centre National de Télédetection (CNT)", pays: "Sénégal", description: "Traitement d'images satellitaires et analyse spatiale" },
  { nom: "Institut de Géographie Tropicale (IGT)", pays: "Côte d'Ivoire", description: "Recherche et formation en géographie et géomatique" },
];

export default function OrganisationsPage() {
  return (
    <LayoutWrapper>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Organisations membres</h1>
            <p className="text-xl text-gray-500">Les institutions membres du réseau REAAGESS en Afrique</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {organisations.map((org, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Globe className="text-blue-600" size={24} />
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{org.nom}</h3>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">{org.pays}</span>
                <p className="text-sm text-gray-500 mt-3">{org.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </LayoutWrapper>
  );
}
