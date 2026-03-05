"use client";

import React, { useState } from "react";
import { Phone, Mail, MapPin, Send, MessageSquare } from "lucide-react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
    type: "general",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    setSubmitSuccess(true);

    setTimeout(() => {
      setSubmitSuccess(false);
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
        type: "general",
      });
    }, 3000);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: "Téléphone",
      content: "+221 33 123 45 67",
      description: "Du lundi au vendredi, 9h-18h",
      color: "from-blue-500 to-cyan-600",
    },
    {
      icon: Mail,
      title: "Email",
      content: "contact@reaagess.org",
      description: "Réponse sous 24h",
      color: "from-cyan-500 to-teal-600",
    },
    {
      icon: MapPin,
      title: "Siège Social",
      content: "Dakar, Sénégal",
      description: "Avenue Cheikh Anta Diop",
      color: "from-teal-500 to-emerald-600",
    },
  ];

  const offices = [
    {
      city: "Dakar",
      country: "Sénégal",
      address: "Avenue Cheikh Anta Diop, BP 1234",
      phone: "+221 33 123 45 67",
      email: "dakar@reaagess.org",
    },
    {
      city: "Bamako",
      country: "Mali",
      address: "Route de Koulouba, ACI 2000",
      phone: "+223 20 23 45 67",
      email: "bamako@reaagess.org",
    },
    {
      city: "Ouagadougou",
      country: "Burkina Faso",
      address: "Avenue Kwamé N'Krumah, 01 BP 5678",
      phone: "+226 25 34 56 78",
      email: "ouagadougou@reaagess.org",
    },
  ];

  const faqs = [
    {
      question: "Comment devenir membre du réseau REAAGESS ?",
      answer:
        "Vous pouvez nous rejoindre en remplissant le formulaire d'inscription sur notre site ou en contactant directement notre équipe de coordination.",
    },
    {
      question: "Quels types de services proposez-vous ?",
      answer:
        "Nous offrons des services de télédétection, SIG, formation, conseil technique et accompagnement de projets dans le domaine de la géomatique et des sciences spatiales.",
    },
    {
      question: "Dans quels pays intervenez-vous ?",
      answer:
        "Nous intervenons dans plus de 15 pays africains avec des bureaux permanents au Sénégal, Mali et Burkina Faso.",
    },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      {/* Hero Section with Background Image */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?q=80&w=2074"
            alt="Contact"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-indigo-900/90 to-purple-900/90"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="inline-block mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-2xl opacity-60 animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl">
                <MessageSquare className="w-12 h-12" />
              </div>
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            Contactez-nous
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-blue-100 leading-relaxed">
            Nous sommes à votre disposition pour répondre à toutes vos questions
            et discuter de vos projets en géomatique et sciences spatiales
          </p>
        </div>

        {/* Decorative Wave */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full h-auto"
          >
            <path
              fill="#f9fafb"
              fillOpacity="1"
              d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,64C960,75,1056,85,1152,80C1248,75,1344,53,1392,42.7L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            ></path>
          </svg>
        </div>
      </section>

      {/* Main Content */}
      <div className="bg-gray-50 py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          {/* Contact Info Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 p-8 text-center"
                >
                  <div
                    className={`bg-gradient-to-br ${info.color} rounded-2xl w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {info.title}
                  </h3>
                  <p className="text-lg font-semibold text-blue-600 mb-2">
                    {info.content}
                  </p>
                  <p className="text-gray-600 text-sm">{info.description}</p>
                </div>
              );
            })}
          </div>

          {/* Contact Form and Offices */}
          <div className="grid md:grid-cols-5 gap-8 mb-16">
            {/* Contact Form - 3 colonnes */}
            <div className="md:col-span-3 bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Envoyez-nous un message
              </h2>

              {submitSuccess ? (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8 text-center">
                  <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Send className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">
                    Message envoyé !
                  </h3>
                  <p className="text-green-700 text-lg">
                    Nous vous répondrons dans les plus brefs délais.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Type de demande
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    >
                      <option value="general">Information générale</option>
                      <option value="membership">Adhésion au réseau</option>
                      <option value="partnership">Partenariat</option>
                      <option value="technical">Support technique</option>
                      <option value="training">Formation</option>
                    </select>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Nom complet *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Votre nom et prénom"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                      >
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Sujet *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      placeholder="Sujet de votre message"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                      placeholder="Décrivez votre demande en détail..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-lg hover:shadow-xl text-lg"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>

            {/* Offices - 2 colonnes */}
            <div className="md:col-span-2">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Nos Bureaux
              </h2>
              <div className="space-y-4">
                {offices.map((office, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border-l-4 border-blue-600"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                      {office.city}, {office.country}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600 ml-7">
                      <p>{office.address}</p>
                      <p className="flex items-center">
                        <Phone className="w-4 h-4 mr-2 text-blue-600" />
                        {office.phone}
                      </p>
                      <p className="flex items-center">
                        <Mail className="w-4 h-4 mr-2 text-blue-600" />
                        {office.email}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Questions Fréquemment Posées
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border-t-4 border-blue-600"
                >
                  <h3 className="text-lg font-bold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
