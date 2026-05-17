"use client";

import { useState, useEffect } from "react";
import { Loader2, Save } from "lucide-react";
import { adminGetSettings, adminUpdateSetting } from "@/actions/admin";

const SETTINGS_CONFIG = [
  { key: "businessName", label: "Jina la Biashara", type: "text" },
  { key: "slogan", label: "Kauli Mbiu", type: "text" },
  { key: "whatsappNumber", label: "Namba ya WhatsApp", type: "text" },
  { key: "businessEmail", label: "Barua Pepe ya Biashara", type: "email" },
  { key: "location", label: "Mahali pa Biashara", type: "text" },
  { key: "facebookUrl", label: "Facebook URL", type: "url" },
  { key: "instagramUrl", label: "Instagram URL", type: "url" },
  { key: "twitterUrl", label: "Twitter/X URL", type: "url" },
  { key: "deliveryNote", label: "Maelezo ya Uwasilishaji", type: "textarea" },
  { key: "paymentInstructions", label: "Maelekezo ya Malipo", type: "textarea" },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);

  useEffect(() => {
    adminGetSettings().then((s) => { setSettings(s); setLoading(false); });
  }, []);

  async function handleSave(key: string) {
    setSaving(key);
    try {
      await adminUpdateSetting(key, settings[key] ?? "");
      setSaved(key);
      setTimeout(() => setSaved(null), 2000);
    } catch { alert("Kuna tatizo."); } finally { setSaving(null); }
  }

  if (loading) return <div className="py-20 text-center"><Loader2 size={32} className="animate-spin mx-auto text-primary-600" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">Mipangilio</h1>
      <div className="max-w-2xl space-y-4">
        {SETTINGS_CONFIG.map((config) => (
          <div key={config.key} className="card p-5">
            <label className="label">{config.label}</label>
            <div className="flex gap-2 mt-1">
              {config.type === "textarea" ? (
                <textarea
                  value={settings[config.key] ?? ""}
                  onChange={(e) => setSettings((s) => ({ ...s, [config.key]: e.target.value }))}
                  className="input resize-none flex-1"
                  rows={3}
                />
              ) : (
                <input
                  type={config.type}
                  value={settings[config.key] ?? ""}
                  onChange={(e) => setSettings((s) => ({ ...s, [config.key]: e.target.value }))}
                  className="input flex-1"
                />
              )}
              <button
                onClick={() => handleSave(config.key)}
                disabled={saving === config.key}
                className={`px-3 rounded-lg text-sm font-medium transition-colors shrink-0 ${
                  saved === config.key ? "bg-green-500 text-white" : "bg-primary-600 hover:bg-primary-700 text-white"
                }`}
              >
                {saving === config.key ? <Loader2 size={14} className="animate-spin" /> : saved === config.key ? "✓" : <Save size={14} />}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
