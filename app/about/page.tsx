import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Target, Eye, CheckCircle } from "lucide-react";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { getWhatsAppLink } from "@/lib/whatsapp";

const TEAM = [
  {
    name: "Masanja Paul",
    role: "Founder & CTO",
    initials: "MP",
    avatarClass: "bg-primary-600",
    photo: "/team/masanja-paul.jpg",
    bio: "Mwanzilishi wa Kariakoo Kiganjani. Mtaalamu wa teknolojia anayeendesha mfumo wa biashara.",
  },
  {
    name: "Salome William",
    role: "Managing Director",
    initials: "SW",
    avatarClass: "bg-purple-600",
    photo: "/team/salome-william.jpg",
    bio: "Mkurugenzi Mtendaji anayesimamia shughuli za kila siku za Kariakoo Kiganjani.",
  },
  {
    name: "Vienna Paul",
    role: "Chief Product Lead",
    initials: "VP",
    avatarClass: "bg-blue-600",
    photo: "/team/vienna-paul.jpg",
    bio: "Kiongozi wa bidhaa anayehakikisha ubora wa bidhaa na mahusiano na wasambazaji.",
  },
];

const HOW_IT_WORKS = [
  { step: "1", title: "Tafuta Bidhaa", desc: "Tazama bidhaa zetu au tuta bidhaa unayohitaji kupitia search." },
  { step: "2", title: "Chagua na Ongeza", desc: "Ongeza bidhaa kwenye kikapu na uendelee na malipo." },
  { step: "3", title: "Lipa kwa Simu", desc: "Lipa kwa M-Pesa, Tigo Pesa, Airtel Money, au Halopesa." },
  { step: "4", title: "Pokea Nyumbani", desc: "Tunawasilisha bidhaa hadi mlangoni mwako Tanzania nzima." },
];

export default function AboutPage() {
  const whatsappLink = getWhatsAppLink("Habari! Ningetaka kujua zaidi kuhusu Kariakoo Kiganjani.");

  return (
    <>
      <Header />
      <main>
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary-800 to-primary-600 text-white py-20">
          <div className="max-w-4xl mx-auto text-center px-4">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Kuhusu Kariakoo Kiganjani</h1>
            <p className="text-xl text-primary-100">
              Tunakufikishia Kariakoo kwenye simu yako
            </p>
          </div>
        </section>

        {/* About */}
        <section className="max-w-4xl mx-auto px-4 py-14">
          <div className="prose max-w-none text-gray-700 dark:text-gray-300">
            <p className="text-lg leading-relaxed mb-4">
              <strong>Kariakoo Kiganjani</strong> ni jukwaa la biashara ya mtandaoni kutoka Tanzania lenye lengo la kuleta bidhaa za Kariakoo kwenye simu yako. Tunatoa huduma ya kununua bidhaa mbalimbali kwa bei za Kariakoo bila kulazimika kuzunguka Kariakoo, Dar es Salaam.
            </p>
            <p className="leading-relaxed mb-4">
              Tunafanya kazi na wasambazaji wa kuaminika kutoka Kariakoo — moja ya masoko makubwa ya biashara Afrika Mashariki — kuhakikisha unapata bidhaa bora kwa bei inayofaa.
            </p>
            <p className="leading-relaxed">
              Iwe unatafuta nguo, viatu, vifaa vya nyumbani, simu, electronics, vipodozi, au bidhaa za watoto — Kariakoo Kiganjani inakupa chaguo pana kwa bei za soko halisi.
            </p>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="bg-gray-50 dark:bg-gray-900/50 py-14">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="card p-8">
              <div className="w-14 h-14 bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 rounded-2xl flex items-center justify-center mb-4">
                <Target size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Dhamira Yetu</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Kurahisisha upatikanaji wa bidhaa za Kariakoo kwa watu wote Tanzania kupitia teknolojia, tukihakikisha bei nafuu, ubora wa bidhaa, na uwasilishaji wa haraka.
              </p>
            </div>
            <div className="card p-8">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 rounded-2xl flex items-center justify-center mb-4">
                <Eye size={28} />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-3">Maono Yetu</h2>
              <p className="text-gray-600 dark:text-gray-400">
                Kuwa jukwaa kubwa zaidi la biashara ya mtandaoni Tanzania linalowafikia watu wa vijijini na mijini kwa usawa, nikijengwa juu ya uaminifu, ubora, na huduma bora.
              </p>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="max-w-5xl mx-auto px-4 py-14">
          <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-10">
            Jinsi Inavyofanya Kazi
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS.map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-14 h-14 bg-primary-600 text-white text-xl font-bold rounded-full flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-gray-100 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Team */}
        <section className="bg-gray-50 dark:bg-gray-900/50 py-14">
          <div className="max-w-5xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-center text-gray-900 dark:text-gray-100 mb-10">
              Timu Yetu
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {TEAM.map((member) => (
                <div key={member.name} className="card p-6 text-center">
                  {member.photo ? (
                    <div className="w-20 h-20 rounded-full mx-auto mb-4 overflow-hidden relative">
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                  ) : (
                    <div className={`w-20 h-20 ${member.avatarClass} text-white text-2xl font-bold rounded-full flex items-center justify-center mx-auto mb-4`}>
                      {member.initials}
                    </div>
                  )}
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-lg">{member.name}</h3>
                  <p className="text-primary-600 dark:text-primary-400 font-medium text-sm mb-2">{member.role}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-2xl mx-auto px-4 py-14 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Una Maswali?
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Wasiliana nasi — tuko hapa kukusaidia.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
              <CheckCircle size={16} />
              Wasiliana Nasi
            </Link>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition-colors"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
