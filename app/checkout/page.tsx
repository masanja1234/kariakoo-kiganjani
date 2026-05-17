"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, MessageCircle, Loader2 } from "lucide-react";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { useCart } from "@/components/shared/CartContext";
import { formatPrice } from "@/lib/utils";
import { checkoutSchema, type CheckoutInput } from "@/lib/validations";
import { createOrder } from "@/actions/orders";
import { getCheckoutSupportLink } from "@/lib/whatsapp";

const PAYMENT_METHODS = [
  { value: "MPESA", label: "M-Pesa", instruction: "Tuma kwenye namba: 0762 474 101 (Kariakoo Kiganjani)" },
  { value: "TIGO_PESA", label: "Tigo Pesa", instruction: "Tuma kwenye namba: 0762 474 101 (Kariakoo Kiganjani)" },
  { value: "AIRTEL_MONEY", label: "Airtel Money", instruction: "Tuma kwenye namba: 0762 474 101 (Kariakoo Kiganjani)" },
  { value: "HALOPESA", label: "Halopesa", instruction: "Tuma kwenye namba: 0762 474 101 (Kariakoo Kiganjani)" },
  { value: "CASH_ON_DELIVERY", label: "Lipa Unapopokea (COD)", instruction: "Lipa kwa cash unapopokelewa bidhaa" },
  { value: "BANK_TRANSFER", label: "Bank Transfer", instruction: "Wasiliana nasi WhatsApp kupata taarifa za benki" },
];

const TANZANIAN_REGIONS = [
  "Dar es Salaam", "Arusha", "Mwanza", "Dodoma", "Mbeya", "Morogoro",
  "Tanga", "Kilimanjaro", "Kagera", "Mara", "Shinyanga", "Tabora",
  "Singida", "Iringa", "Ruvuma", "Lindi", "Mtwara", "Pwani",
  "Rukwa", "Katavi", "Geita", "Simiyu", "Njombe", "Songwe",
  "Zanzibar Mjini", "Zanzibar Kaskazini", "Zanzibar Kusini",
];

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const [submitted, setSubmitted] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("MPESA");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<CheckoutInput>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "MPESA" },
  });

  if (items.length === 0 && !submitted) {
    return (
      <>
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-20 text-center">
          <div className="text-5xl mb-4">🛒</div>
          <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Kikapu chako ni tupu
          </h1>
          <Link href="/products" className="btn-primary inline-block">
            Rudi Kununua
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  if (submitted) {
    return (
      <>
        <Header />
        <main className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="card p-10">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Agizo Limefanikiwa!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-2">
              Namba ya Agizo: <strong className="text-primary-600">{orderNumber}</strong>
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
              Asante kwa kununua! Tutakuwasiliana nawe hivi karibuni kuthibitisha malipo na kuanza uwasilishaji.
            </p>
            <div className="flex flex-col gap-3">
              <Link href={`/track-order?order=${orderNumber}`} className="btn-primary">
                Fuatilia Agizo
              </Link>
              <a
                href={getCheckoutSupportLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border-2 border-green-500 text-green-600 font-medium py-2 px-6 rounded-xl hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors"
              >
                <MessageCircle size={16} />
                Zungumza Nasi WhatsApp
              </a>
              <Link href="/" className="text-gray-500 hover:text-primary-600 text-sm transition-colors">
                Rudi Nyumbani
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const selectedInstruction = PAYMENT_METHODS.find((p) => p.value === selectedPayment)?.instruction ?? "";

  async function onSubmit(data: CheckoutInput) {
    try {
      const order = await createOrder({
        ...data,
        customerEmail: data.customerEmail || undefined,
        items,
      });
      clearCart();
      setOrderNumber(order.orderNumber);
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Kuna tatizo. Jaribu tena au wasiliana nasi WhatsApp.");
    }
  }

  return (
    <>
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Malipo</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contact */}
              <div className="card p-6">
                <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Taarifa za Mawasiliano</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Jina Kamili *</label>
                    <input {...register("customerName")} className="input" placeholder="Jina lako kamili" />
                    {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName.message}</p>}
                  </div>
                  <div>
                    <label className="label">Namba ya Simu *</label>
                    <input {...register("customerPhone")} className="input" placeholder="+255..." />
                    {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Barua Pepe (Hiari)</label>
                    <input {...register("customerEmail")} className="input" placeholder="barua@pepe.com" type="email" />
                  </div>
                </div>
              </div>

              {/* Delivery */}
              <div className="card p-6">
                <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Taarifa za Uwasilishaji</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Mkoa *</label>
                    <select {...register("region")} className="input">
                      <option value="">Chagua Mkoa</option>
                      {TANZANIAN_REGIONS.map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                    {errors.region && <p className="text-red-500 text-xs mt-1">{errors.region.message}</p>}
                  </div>
                  <div>
                    <label className="label">Wilaya/Eneo *</label>
                    <input {...register("district")} className="input" placeholder="Wilaya au eneo lako" />
                    {errors.district && <p className="text-red-500 text-xs mt-1">{errors.district.message}</p>}
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label">Anwani Kamili *</label>
                    <input {...register("address")} className="input" placeholder="Mitaa, karibu na nini, n.k." />
                    {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
                  </div>
                </div>
              </div>

              {/* Payment */}
              <div className="card p-6">
                <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Njia ya Malipo</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {PAYMENT_METHODS.map((method) => (
                    <label
                      key={method.value}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                        selectedPayment === method.value
                          ? "border-primary-500 bg-primary-50 dark:bg-primary-950/30"
                          : "border-gray-200 dark:border-gray-800 hover:border-primary-300"
                      }`}
                    >
                      <input
                        type="radio"
                        value={method.value}
                        {...register("paymentMethod")}
                        onChange={(e) => setSelectedPayment(e.target.value)}
                        className="text-primary-600"
                      />
                      <span className="text-sm font-medium">{method.label}</span>
                    </label>
                  ))}
                </div>

                {selectedInstruction && (
                  <div className="bg-primary-50 dark:bg-primary-950/20 border border-primary-200 dark:border-primary-800 rounded-xl p-4 mb-4">
                    <p className="text-sm font-semibold text-primary-700 dark:text-primary-400 mb-1">Maelekezo ya Malipo:</p>
                    <p className="text-sm text-primary-600 dark:text-primary-300">{selectedInstruction}</p>
                  </div>
                )}

                <div>
                  <label className="label">Namba ya Muamala (Baada ya kulipa)</label>
                  <input
                    {...register("transactionReference")}
                    className="input"
                    placeholder="Mfano: TZS123456789"
                  />
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div>
              <div className="card p-6 sticky top-20">
                <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">Muhtasari</h2>
                <div className="space-y-2 mb-4 max-h-48 overflow-y-auto">
                  {items.map((item) => (
                    <div key={item.productId} className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400 line-clamp-1 flex-1 mr-2">
                        {item.name} ×{item.quantity}
                      </span>
                      <span className="font-medium shrink-0">
                        {formatPrice((item.discountPrice ?? item.price) * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-200 dark:border-gray-800 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Jumla Ndogo</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Uwasilishaji</span>
                    <span className="text-green-600">TBA</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-2">
                    <span>Jumla</span>
                    <span className="text-primary-600 dark:text-primary-400">{formatPrice(subtotal)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 mt-6 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold py-3 px-6 rounded-xl transition-colors"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Inatuma...
                    </>
                  ) : (
                    "Weka Agizo"
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </main>
      <Footer />
    </>
  );
}
