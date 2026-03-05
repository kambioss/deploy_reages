"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  UserPlus,
  Mail,
  Lock,
  User,
  Globe,
  Briefcase,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

const pays = [
  "Sénégal",
  "Mali",
  "Burkina Faso",
  "Niger",
  "Côte d'Ivoire",
  "Togo",
  "Bénin",
  "Guinée",
  "Guinée-Bissau",
  "Mauritanie",
  "Gambie",
  "France",
  "Belgique",
  "Canada",
  "Autre",
];

const secteursActivite = [
  "Agriculture",
  "Éducation",
  "Santé",
  "Environnement",
  "Énergie",
  "Eau et Assainissement",
  "Développement rural",
  "Technologie",
  "Finance",
  "Tourisme",
  "Artisanat",
  "Autre",
];

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    password: "",
    confirmPassword: "",
    pays: "",
    fonction: "",
    secteurActivite: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...submitData } = formData;

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push("/login?message=Inscription réussie");
      } else {
        setError(data.error || "Erreur lors de l'inscription");
      }
    } catch (error) {
      setError("Erreur de connexion au serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Registration Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white overflow-y-auto">
        <div className="w-full max-w-2xl">
          {/* Logo/Brand */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-2xl mb-4 shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Rejoignez REAAGESS
            </h1>
            <p className="text-gray-600">
              Créez votre compte et faites partie du réseau
            </p>
          </div>

          {/* Registration Form */}
          <Card className="border-0 shadow-xl">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-6 pt-6">
                {error && (
                  <Alert
                    variant="destructive"
                    className="border-red-200 bg-red-50"
                  >
                    <AlertDescription className="text-red-800">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Nom et Prénom */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="nom"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Nom *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="nom"
                        name="nom"
                        placeholder="Votre nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                        className="pl-10 h-12 border-2 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="prenom"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Prénom *
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="prenom"
                        name="prenom"
                        placeholder="Votre prénom"
                        value={formData.prenom}
                        onChange={handleChange}
                        required
                        className="pl-10 h-12 border-2 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Adresse email *
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="votre@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="pl-10 h-12 border-2 focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* Mots de passe */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Mot de passe *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className="pl-10 pr-10 h-12 border-2 focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="confirmPassword"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Confirmer *
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="pl-10 pr-10 h-12 border-2 focus:border-emerald-500"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="w-5 h-5" />
                        ) : (
                          <Eye className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Pays et Fonction */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="pays"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Pays *
                    </Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                      <Select
                        value={formData.pays}
                        onValueChange={(value) =>
                          handleSelectChange("pays", value)
                        }
                      >
                        <SelectTrigger className="pl-10 h-12 border-2 focus:ring-emerald-500">
                          <SelectValue placeholder="Sélectionnez votre pays" />
                        </SelectTrigger>
                        <SelectContent>
                          {pays.map((pays) => (
                            <SelectItem key={pays} value={pays}>
                              {pays}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="fonction"
                      className="text-sm font-semibold text-gray-700"
                    >
                      Fonction *
                    </Label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <Input
                        id="fonction"
                        name="fonction"
                        placeholder="Votre fonction"
                        value={formData.fonction}
                        onChange={handleChange}
                        required
                        className="pl-10 h-12 border-2 focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Secteur d'activité */}
                <div className="space-y-2">
                  <Label
                    htmlFor="secteurActivite"
                    className="text-sm font-semibold text-gray-700"
                  >
                    Secteur d'activité *
                  </Label>
                  <Select
                    value={formData.secteurActivite}
                    onValueChange={(value) =>
                      handleSelectChange("secteurActivite", value)
                    }
                  >
                    <SelectTrigger className="h-12 border-2 focus:ring-emerald-500">
                      <SelectValue placeholder="Sélectionnez votre secteur" />
                    </SelectTrigger>
                    <SelectContent>
                      {secteursActivite.map((secteur) => (
                        <SelectItem key={secteur} value={secteur}>
                          {secteur}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Inscription en cours...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-5 w-5" />
                      Créer mon compte
                    </>
                  )}
                </Button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Ou</span>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Vous avez déjà un compte ?{" "}
                    <Link
                      href="/login"
                      className="text-emerald-600 hover:text-emerald-700 font-semibold hover:underline"
                    >
                      Se connecter
                    </Link>
                  </p>
                </div>
              </CardContent>
            </form>
          </Card>

          {/* Terms */}
          <div className="mt-8 text-center text-sm text-gray-500">
            <p>
              En créant un compte, vous acceptez nos{" "}
              <Link href="/terms" className="text-emerald-600 hover:underline">
                Conditions d'utilisation
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Benefits */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2070"
            alt="Collaboration"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/95 via-teal-900/90 to-cyan-900/95"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Pourquoi rejoindre REAAGESS ?
            </h2>
            <p className="text-xl text-emerald-100 mb-12 leading-relaxed">
              Devenez membre du premier réseau africain dédié aux sciences
              spatiales et à la géomatique.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-emerald-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Accès exclusif aux ressources
                  </h3>
                  <p className="text-emerald-200 leading-relaxed">
                    Formations, webinaires, publications scientifiques et
                    données géospatiales
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-teal-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-teal-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">Réseau panafricain</h3>
                  <p className="text-emerald-200 leading-relaxed">
                    Connectez-vous avec plus de 500 experts en géomatique à
                    travers 15 pays
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-cyan-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-cyan-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Opportunités de collaboration
                  </h3>
                  <p className="text-emerald-200 leading-relaxed">
                    Participez à des projets innovants et développez votre
                    carrière
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 className="w-6 h-6 text-blue-300" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">
                    Visibilité professionnelle
                  </h3>
                  <p className="text-emerald-200 leading-relaxed">
                    Mettez en valeur votre expertise et vos réalisations auprès
                    de la communauté
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
