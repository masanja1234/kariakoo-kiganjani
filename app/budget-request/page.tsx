"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle, Loader2, Upload, MessageCircle, X } from "lucide-react";
import Image from "next/image";
import { Header } from "@/components/store/Header";
import { Footer } from "@/components/store/Footer";
import { budgetRequestSchema, type BudgetRequestInput } from "@/lib/validations";
import { submitBudgetRequest } from "@/actions/budgetRequests";
import { uploadBudgetRequestImage } from "@/actions/uploads";
import { getBudgetRequestLink } from "@/lib/whatsapp";

export default function BudgetRequestPage() {
  const [submitted, setSubmitted] = useState(false);
  const [deliveryNeeded, setDeliveryNeeded] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<BudgetRequestInput>({
    resolver: zodResolver(budgetRequestSchema),
    defaultValues: { deliveryNeeded: false, quantity: 1 },
  });

  const productNeeded = watch("productNeeded") ?? "";
  const budget = watch("budget") ?? 0;
  const whatsappLink = getBudgetRequestLink(productNeeded || "Bidhaa mbalimbali", budget || 0);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Picha ni kubwa sana. Upeo ni 5MB.");
      return;
    }
    setUploadError(null);
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  async function onSubmit(data: BudgetRequestInput) {
    try {
      let referenceImage: string | undefined;
      let referenceImagePath: string | undefined;

      if (imageFile) {
        try {
          const formData = new FormData();
          formData.append("file", imageFile);
          const uploaded = await uploadBudgetRequestImage(formData);
          referenceImage = uploaded.url;
          referenceImagePath = uploaded.path;
        } catch {
          // Upload failed — submit without image (graceful fallback)
        }
      }

      await submitBudgetRequest({ ...data, deliveryNeeded, referenceImage, referenceImagePath });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Kuna tatizo. Jaribu tena.");
    }
  }

  if (submitted) {
    return (
      <>
        <Header />
        <main className="max-w-xl mx-auto px-4 py-20 text-center">
          <div className="card p-10">
            <CheckCircle size={64} className="text-green-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              Ombi Limetumwa!
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Asante! Tutakuwasiliana nawe hivi karibuni kupitia WhatsApp ili kukusaidia kupata bidhaa unayohitaji.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
            >
              <MessageCircle size={18} />
              Zungumza WhatsApp Sasa
            </a>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="text-5xl mb-3">💰</div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            Tafuta Bidhaa kwa Budget Yako
          </h1>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">
            Una budget lakini hujui bidhaa gani kununua? Tujulishe na tutakusaidia kupata bidhaa bora kwa bei za Kariakoo.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(onSubmit)} className="card p-6 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Jina Kamili *</label>
                  <input {...register("fullName")} className="input" placeholder="Jina lako kamili" />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="label">Namba ya WhatsApp *</label>
                  <input {...register("whatsappPhone")} className="input" placeholder="+255..." />
                  {errors.whatsappPhone && <p className="text-red-500 text-xs mt-1">{errors.whatsappPhone.message}</p>}
                </div>
              </div>

              <div>
                <label className="label">Bidhaa Unayohitaji *</label>
                <input {...register("productNeeded")} className="input" placeholder="Mfano: Viatu vya ngozi, Simu ya Samsung, n.k." />
                {errors.productNeeded && <p className="text-red-500 text-xs mt-1">{errors.productNeeded.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label">Budget Yako (TZS) *</label>
                  <input
                    {...register("budget", { valueAsNumber: true })}
                    type="number"
                    className="input"
                    placeholder="50000"
                    min={1000}
                  />
                  {errors.budget && <p className="text-red-500 text-xs mt-1">{errors.budget.message}</p>}
                </div>
                <div>
                  <label className="label">Idadi Unayohitaji *</label>
                  <input
                    {...register("quantity", { valueAsNumber: true })}
                    type="number"
                    className="input"
                    placeholder="1"
                    min={1}
                  />
                  {errors.quantity && <p className="text-red-500 text-xs mt-1">{errors.quantity.message}</p>}
                </div>
              </div>

              <div>
                <label className="label">Eneo Lako *</label>
                <input {...register("location")} className="input" placeholder="Mfano: Dar es Salaam, Kinondoni" />
                {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location.message}</p>}
              </div>

              <div>
                <label className="label">Unahitaji Uwasilishaji?</label>
                <div className="flex gap-4 mt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={deliveryNeeded}
                      onChange={() => setDeliveryNeeded(true)}
                      className="text-primary-600"
                    />
                    <span className="text-sm">Ndio</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!deliveryNeeded}
                      onChange={() => setDeliveryNeeded(false)}
                      className="text-primary-600"
                    />
                    <span className="text-sm">Hapana — Nitachukua mwenyewe</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="label">Maelezo ya Ziada (Hiari)</label>
                <textarea
                  {...register("extraDetails")}
                  className="input resize-none"
                  rows={3}
                  placeholder="Rangi unayopenda, saizi, brand, au maelezo mengine..."
                />
              </div>

              {/* Image Upload */}
              <div>
                <label className="label">
                  <Upload size={14} className="inline mr-1" />
                  Pakia Picha ya Rejea (Hiari)
                </label>

                {imagePreview ? (
                  <div className="relative inline-block mt-2">
                    <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                      <Image src={imagePreview} alt="Picha ya Rejea" fill className="object-cover" />
                    </div>
                    <button
                      type="button"
                      onClick={clearImage}
                      title="Ondoa picha"
                      aria-label="Ondoa picha"
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <label className="mt-2 flex items-center gap-3 cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-4 hover:border-primary-400 transition-colors">
                    <Upload size={20} className="text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Bonyeza kupakia picha</p>
                      <p className="text-xs text-gray-400">JPG, PNG — upeo 5MB</p>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
                {uploadError && <p className="text-red-500 text-xs mt-1">{uploadError}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-primary-600 hover:bg-primary-700 disabled:bg-primary-400 text-white font-bold py-3 px-6 rounded-xl transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Inatuma...
                  </>
                ) : (
                  "Tuma Ombi"
                )}
              </button>
            </form>
          </div>

          {/* Info Card */}
          <div className="space-y-4">
            <div className="card p-5 bg-primary-50 dark:bg-primary-950/20 border-primary-200 dark:border-primary-800">
              <h3 className="font-bold text-primary-700 dark:text-primary-400 mb-3">Jinsi Inavyofanya Kazi</h3>
              <ol className="space-y-2 text-sm text-primary-600 dark:text-primary-300">
                <li className="flex gap-2"><span className="font-bold shrink-0">1.</span> Tuma ombi lako na budget yako</li>
                <li className="flex gap-2"><span className="font-bold shrink-0">2.</span> Timu yetu itatafuta kwa wasambazaji wa Kariakoo</li>
                <li className="flex gap-2"><span className="font-bold shrink-0">3.</span> Tutakupigia WhatsApp na ofa bora</li>
                <li className="flex gap-2"><span className="font-bold shrink-0">4.</span> Ukikubali, tunaleta bidhaa kwako!</li>
              </ol>
            </div>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors"
            >
              <MessageCircle size={18} />
              Tuma WhatsApp Moja kwa Moja
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
