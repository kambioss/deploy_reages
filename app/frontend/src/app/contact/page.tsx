"use client";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import PageHero from "@/components/PageHero";
import { Mail, Phone, MapPin, Send, Globe, MessageCircle } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ nom: "", email: "", sujet: "", message: "" });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); setSent(true); };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <PageHero
        icon={<Mail className="w-10 h-10 text-white" />}
        label="REAAGESS"
        title="Contactez-nous"
        subtitle="Notre équipe est disponible pour répondre à toutes vos questions"
        gradient="from-[#0a1628] via-[#0a2040] to-[#062020]"
      />

      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Infos */}
            <div>
              <div className="section-label">Nous contacter</div>
              <h2 className="section-h2 text-slate-900 mb-6">Parlons ensemble</h2>
              <p className="text-slate-500 leading-relaxed mb-10 font-sans">Que vous souhaitiez rejoindre le réseau, proposer un partenariat ou simplement en savoir plus sur nos activités, nous sommes à votre disposition.</p>
              
              <div className="space-y-6">
                {[
                  { Icon: Mail, label: "Email général", val: "contact@reaagess.org", sub: "Réponse sous 48h" },
                  { Icon: Phone, label: "Téléphone", val: "+228 33 123 45 67", sub: "Lun-Ven 8h-17h (GMT)" },
                  { Icon: MapPin, label: "Siège", val: "Lomé, Togo", sub: "Afrique de l'Ouest" },
                  { Icon: Globe, label: "Présence", val: "15 pays africains", sub: "Réseau panafricain" },
                ].map(({ Icon, label, val, sub }, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-11 h-11 bg-gradient-to-br from-blue-700 to-cyan-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 uppercase tracking-widest font-sans font-semibold mb-0.5">{label}</div>
                      <div className="text-slate-900 font-semibold font-sans">{val}</div>
                      <div className="text-slate-500 text-xs font-sans">{sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="bg-slate-50 rounded-2xl p-8 border border-slate-100">
              {sent ? (
                <div className="flex flex-col items-center justify-center h-full py-16 text-center">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <MessageCircle className="h-8 w-8 text-emerald-600" />
                  </div>
                  <h3 className="card-h3 text-slate-900 mb-2">Message envoyé !</h3>
                  <p className="text-slate-500 font-sans text-sm">Nous vous répondrons dans les meilleurs délais.</p>
                  <button onClick={() => setSent(false)} className="mt-6 text-cyan-600 font-semibold text-sm font-sans hover:underline">Envoyer un autre message</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <h3 className="card-h3 text-slate-900 mb-6">Envoyer un message</h3>
                  {[
                    { label: "Nom complet", name: "nom", type: "text", placeholder: "Votre nom et prénom", required: true },
                    { label: "Email", name: "email", type: "email", placeholder: "votre@email.com", required: true },
                    { label: "Sujet", name: "sujet", type: "text", placeholder: "Objet de votre message", required: true },
                  ].map(({ label, name, type, placeholder, required }) => (
                    <div key={name}>
                      <label className="block text-sm font-medium text-slate-700 mb-1.5 font-sans">{label}{required && <span className="text-red-500 ml-1">*</span>}</label>
                      <input type={type} value={(form as any)[name]} onChange={e => setForm(prev => ({ ...prev, [name]: e.target.value }))} placeholder={placeholder} required={required}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent font-sans bg-white" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 font-sans">Message <span className="text-red-500">*</span></label>
                    <textarea value={form.message} onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))} rows={5} placeholder="Décrivez votre demande..." required
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-y font-sans bg-white" />
                  </div>
                  <button type="submit" className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-700 to-cyan-600 text-white font-bold py-3.5 rounded-2xl hover:scale-105 transition-all duration-300 shadow-lg shadow-blue-500/25 font-sans">
                    <Send className="h-4 w-4" />Envoyer le message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
