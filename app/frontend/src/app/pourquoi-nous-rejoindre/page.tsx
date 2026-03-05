import Footer from "@/components/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Globe,
  Users,
  BookOpen,
  Calendar,
  Lightbulb,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function PourquoiNousRejoindre() {
  return (
    <LayoutWrapper>
      <Navbar />

      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pourquoi nous rejoindre ?
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Découvrez les avantages de faire partie du réseau REAAGESS
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">
                  Accès aux données
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Chaque membre bénéficie d'accès aux données géospatiales
                  mobilisées par le réseau pour ses projets et recherches.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">
                  Pôles thématiques
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Faites partie d'un pôle dédié à votre spécialité et collaborez
                  avec des experts du domaine.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">
                  Échange de compétences
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Participez à des formations, webinaires et ateliers pour
                  enrichir vos connaissances.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">
                  Rencontres annuelles
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Participez à des activités présentielle dans chaque pays
                  membre, à tour de rôle.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Lightbulb className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">
                  Discussions approfondies
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Contribuez à des échanges rigoureux sur l'intelligence
                  géospatiale et les technologies innovantes.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-900">
                  Collaboration africaine
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Travaillez avec des passionnés et experts à l'échelle
                  continentale pour stimuler l'innovation.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-12">
            <Button
              asChild
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Link href="/register">
                En savoir plus
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <Footer />
    </LayoutWrapper>
  );
}
