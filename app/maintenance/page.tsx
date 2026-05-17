import { MessageCircle } from "lucide-react";
import { getWhatsAppLink } from "@/lib/whatsapp";

export default function MaintenancePage() {
  const whatsappLink = getWhatsAppLink("Habari! Ninajaribu kufikia Kariakoo Kiganjani lakini inaonekana iko chini kwa matengenezo.");

  return (
    <div className="min-h-screen bg-primary-800 text-white flex flex-col items-center justify-center px-4 text-center">
      <div className="text-6xl mb-6">🔧</div>
      <h1 className="text-3xl font-bold mb-3">Tunarudi Hivi Karibuni</h1>
      <p className="text-primary-200 text-lg mb-2">
        Kariakoo Kiganjani iko chini kwa matengenezo ya muda mfupi.
      </p>
      <p className="text-primary-300 text-base mb-8">
        Tutarudi haraka. Asante kwa uvumilivu wako.
      </p>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
      >
        <MessageCircle size={20} />
        Wasiliana Nasi WhatsApp
      </a>
      <p className="mt-8 text-primary-400 text-sm">kariakookiganjani.co.tz</p>
    </div>
  );
}
