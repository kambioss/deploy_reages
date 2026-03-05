import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";
import Link from "next/link";
import { Briefcase, GraduationCap, Users, ArrowRight } from "lucide-react";

export default function CarrierePage() {
  const opportunities = [
    { title: "Appels d'offres", desc: "Découvrez les marchés et appels à projets en géomatique", href: "/carriere/appels-offres", icon: Briefcase, color: "bg-blue-500" },
    { title: "Formations", desc: "Développez vos compétences avec nos programmes de formation", href: "/formations", icon: GraduationCap, color: "bg-green-500" },
    { title: "Rejoindre le réseau", desc: "Intégrez une communauté de professionnels africains", href: "/register", icon: Users, color: "bg-purple-500" },
  ];

  return (
    <LayoutWrapper>
      <Navbar />
      <div className="min-h-screen bg-gray-50 pt-32 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Carrière & Opportunités</h1>
            <p className="text-xl text-gray-500">Développez votre carrière dans le domaine de la géomatique africaine</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {opportunities.map((o, i) => {
              const Icon = o.icon;
              return (
                <Link key={i} href={o.href} className="bg-white rounded-2xl shadow-sm p-8 hover:shadow-md transition-all hover:-translate-y-1 group">
                  <div className={`${o.color} w-14 h-14 rounded-2xl flex items-center justify-center mb-6`}>
                    <Icon className="text-white" size={28} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{o.title}</h3>
                  <p className="text-gray-500 mb-4">{o.desc}</p>
                  <span className="flex items-center gap-1 text-blue-600 font-medium group-hover:gap-2 transition-all">
                    En savoir plus <ArrowRight size={16} />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
      <Footer />
    </LayoutWrapper>
  );
}
