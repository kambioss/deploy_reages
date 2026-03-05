"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, XCircle, Loader2, Database, Shield, ArrowRight } from "lucide-react";

interface StepResult {
  ok: boolean;
  message: string;
  detail?: string;
}

export default function SetupPage() {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [steps, setSteps] = useState<StepResult[]>([]);
  const [done, setDone] = useState(false);
  const [adminInfo, setAdminInfo] = useState<{ email: string; password: string } | null>(null);

  async function runSetup() {
    setRunning(true);
    setSteps([]);

    // Étape 1 : Tester la connexion DB
    setSteps([{ ok: true, message: "Connexion à la base de données..." }]);

    const seedRes = await fetch("/api/seed");
    const seedData = await seedRes.json();

    if (seedRes.ok) {
      if (seedData.users > 0) {
        setSteps([
          { ok: true, message: "✓ Base de données déjà initialisée" },
          { ok: true, message: `✓ ${seedData.users} utilisateur(s) existant(s)` },
        ]);
        setDone(true);
      } else {
        setSteps([
          { ok: true, message: "✓ Base de données connectée" },
          { ok: true, message: "✓ Administrateur créé avec succès" },
        ]);
        setAdminInfo({ email: "admin@reaages.org", password: "Admin@2024!" });
        setDone(true);
      }
    } else {
      setSteps([
        { ok: false, message: "✗ Erreur de base de données", detail: seedData.error },
        { ok: false, message: "→ Exécutez : npx prisma db push", detail: "Dans le dossier frontend/" },
      ]);
    }

    setRunning(false);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Database className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Configuration REAAGESS</h1>
          <p className="text-gray-500 mt-2 text-sm">
            Initialise la base de données et crée le compte administrateur
          </p>
        </div>

        {!done && steps.length === 0 && (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-800">
              <p className="font-semibold mb-1">Ce script va :</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Vérifier la connexion à la base de données SQLite</li>
                <li>• Créer les tables si elles n'existent pas</li>
                <li>• Créer le compte administrateur par défaut</li>
              </ul>
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
              <p className="font-semibold">⚠️ Prérequis</p>
              <p className="mt-1">Vous devez d'abord exécuter dans le terminal :</p>
              <code className="block bg-amber-100 rounded p-2 mt-2 font-mono text-xs">
                cd frontend<br />
                npx prisma generate<br />
                npx prisma db push
              </code>
            </div>
          </div>
        )}

        {/* Steps */}
        {steps.length > 0 && (
          <div className="space-y-3 mb-6">
            {steps.map((step, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${step.ok ? "bg-green-50" : "bg-red-50"}`}>
                {step.ok
                  ? <CheckCircle size={18} className="text-green-600 mt-0.5 flex-shrink-0" />
                  : <XCircle size={18} className="text-red-600 mt-0.5 flex-shrink-0" />
                }
                <div>
                  <p className={`text-sm font-medium ${step.ok ? "text-green-800" : "text-red-800"}`}>{step.message}</p>
                  {step.detail && <p className={`text-xs mt-0.5 ${step.ok ? "text-green-600" : "text-red-600"}`}>{step.detail}</p>}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Admin info */}
        {adminInfo && (
          <div className="bg-gray-900 rounded-xl p-5 mb-6">
            <div className="flex items-center gap-2 mb-3">
              <Shield size={16} className="text-yellow-400" />
              <span className="text-yellow-400 text-sm font-bold">Compte Administrateur créé</span>
            </div>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Email :</span>
                <span className="text-white">{adminInfo.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Mot de passe :</span>
                <span className="text-green-400 font-bold">{adminInfo.password}</span>
              </div>
            </div>
            <p className="text-yellow-500 text-xs mt-3">⚠️ Changez ce mot de passe après la première connexion</p>
          </div>
        )}

        {/* Buttons */}
        {!done ? (
          <button
            onClick={runSetup}
            disabled={running}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
          >
            {running ? (
              <><Loader2 size={18} className="animate-spin" />Initialisation en cours...</>
            ) : (
              <><Database size={18} />Lancer l'initialisation</>
            )}
          </button>
        ) : (
          <div className="space-y-3">
            <button
              onClick={() => router.push("/login")}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors"
            >
              Se connecter <ArrowRight size={18} />
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-medium transition-colors"
            >
              Retour à l'accueil
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
