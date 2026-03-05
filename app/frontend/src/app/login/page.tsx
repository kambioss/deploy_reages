"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Lock, Mail, ArrowRight, Eye, EyeOff, AlertTriangle } from "lucide-react";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setNeedsSetup(false);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirect based on role
        if (data.user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/mon-espace");
        }
      } else if (response.status === 503) {
        setNeedsSetup(true);
      } else {
        setError(data.error || "Erreur lors de la connexion");
      }
    } catch {
      setError("Impossible de contacter le serveur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-4 shadow-lg">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bon retour !</h1>
            <p className="text-gray-600">Connectez-vous à votre compte REAAGESS</p>
          </div>

          {/* Avertissement si DB pas initialisée */}
          {needsSetup && (
            <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
              <div className="flex items-start gap-3">
                <AlertTriangle className="text-amber-600 flex-shrink-0 mt-0.5" size={20} />
                <div>
                  <p className="font-semibold text-amber-800">Base de données non initialisée</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Exécutez ces commandes dans votre terminal, puis{" "}
                    <Link href="/setup" className="underline font-medium">cliquez ici pour initialiser</Link>.
                  </p>
                  <code className="block mt-2 bg-amber-100 rounded p-2 text-xs font-mono text-amber-900">
                    cd frontend<br />
                    npx prisma generate<br />
                    npx prisma db push
                  </code>
                  <Link href="/setup"
                    className="mt-3 inline-block bg-amber-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-700 transition-colors">
                    → Aller à la page d'initialisation
                  </Link>
                </div>
              </div>
            </div>
          )}

          <Card className="border-0 shadow-xl">
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-5 pt-6">
                {error && (
                  <Alert variant="destructive" className="border-red-200 bg-red-50">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Adresse email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input id="email" name="email" type="email" placeholder="votre@email.com"
                      value={formData.email} onChange={handleChange} required
                      className="pl-10 h-12 border-2 focus:border-blue-500" />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                      Mot de passe
                    </Label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <Input id="password" name="password" type={showPassword ? "text" : "password"}
                      placeholder="••••••••" value={formData.password} onChange={handleChange} required
                      className="pl-10 pr-10 h-12 border-2 focus:border-blue-500" />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <Button type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold shadow-lg"
                  disabled={loading}>
                  {loading ? (
                    <><Loader2 className="mr-2 h-5 w-5 animate-spin" />Connexion...</>
                  ) : (
                    <>Se connecter <ArrowRight className="ml-2 h-5 w-5" /></>
                  )}
                </Button>

                <div className="text-center pt-2">
                  <p className="text-sm text-gray-600">
                    Pas encore de compte ?{" "}
                    <Link href="/register" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">
                      Créer un compte
                    </Link>
                  </p>
                </div>

                {/* Lien setup discret */}
                <div className="text-center">
                  <Link href="/setup" className="text-xs text-gray-400 hover:text-gray-600">
                    Première utilisation ? Initialiser la base de données →
                  </Link>
                </div>
              </CardContent>
            </form>
          </Card>
        </div>
      </div>

      {/* Right Side */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900" />
        </div>
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <div className="max-w-lg">
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Rejoignez le réseau africain des sciences spatiales
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Connectez-vous pour accéder à votre espace membre, participer aux projets
              et collaborer avec des experts en géomatique à travers toute l'Afrique.
            </p>
            <div className="space-y-4">
              {[
                { title: "Accès aux formations", desc: "Formations exclusives en géomatique et sciences spatiales" },
                { title: "Projets collaboratifs", desc: "Participez à des projets innovants avec d'autres membres" },
                { title: "Réseau panafricain", desc: "Connectez-vous avec des experts à travers tout le continent" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-blue-200 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
