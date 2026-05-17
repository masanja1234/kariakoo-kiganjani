"use client";

import { useState } from "react";
import { Phone, Mail, MapPin, MessageCircle, Send, CheckCircle } from "lucide-react";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const whatsappLink = getWhatsAppLink("Habari! Nina swali kuhusu Kariakoo Kiganjani.");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // In production, this would send to a backend endpoint
    setSent(true);
  }

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-800 to-primary-600 text-white py-16">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Wasiliana Nasi</h1>
            <p className="text-primary-100 text-lg">
              Tuko hapa kukusaidia. Wasiliana nasi kwa njia yoyote.
            </p>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Info */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Taarifa za Mawasiliano
              </h2>

              <div className="space-y-4 mb-8">
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 card hover:shadow-md transition-shadow group"
                >
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 rounded-xl flex items-center justify-center shrink-0">
                    <MessageCircle size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      WhatsApp
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">+255 762 474 101</p>
                    <p className="text-xs text-green-600 dark:text-green-400 mt-0.5">Bonyeza kuzungumza sasa</p>
                  </div>
                </a>

                <a
                  href="tel:+255762474101"
                  className="flex items-center gap-4 p-4 card hover:shadow-md transition-shadow group"
                >
                  <div className="w-12 h-12 bg-primary-100 dark:bg-primary-950/30 text-primary-600 dark:text-primary-400 rounded-xl flex items-center justify-center shrink-0">
                    <Phone size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                      Simu
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">+255 762 474 101</p>
                  </div>
                </a>

                <a
                  href="mailto:info@kariakookiganjani.co.tz"
                  className="flex items-center gap-4 p-4 card hover:shadow-md transition-shadow group"
                >
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center shrink-0">
                    <Mail size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Barua Pepe
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">info@kariakookiganjani.co.tz</p>
                  </div>
                </a>

                <div className="flex items-center gap-4 p-4 card">
                  <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">Mahali</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Kariakoo, Dar es Salaam, Tanzania</p>
                  </div>
                </div>
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                <MessageCircle size={18} />
                Zungumza Nasi WhatsApp Sasa
              </a>
            </div>

            {/* Contact Form */}
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Tuma Ujumbe
              </h2>

              {sent ? (
                <div className="card p-8 text-center">
                  <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">Ujumbe Umetumwa!</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Asante kwa ujumbe wako. Tutajibu hivi karibuni.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="card p-6 space-y-4">
                  <div>
                    <label className="label">Jina Lako *</label>
                    <input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="input"
                      placeholder="Jina lako kamili"
                    />
                  </div>
                  <div>
                    <label className="label">Barua Pepe *</label>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      required
                      className="input"
                      placeholder="barua@pepe.com"
                    />
                  </div>
                  <div>
                    <label className="label">Ujumbe Wako *</label>
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                      className="input resize-none"
                      rows={5}
                      placeholder="Andika ujumbe wako hapa..."
                    />
                  </div>
                  <button type="submit" className="w-full flex items-center justify-center gap-2 btn-primary">
                    <Send size={16} />
                    Tuma Ujumbe
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
