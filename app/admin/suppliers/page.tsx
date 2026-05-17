"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, MessageCircle, Loader2, Store } from "lucide-react";
import { adminGetSuppliers, adminCreateSupplier, adminUpdateSupplier, adminDeleteSupplier } from "@/actions/admin";
import { StatusBadge } from "@/components/shared/StatusBadge";

interface Supplier {
  id: string;
  name: string;
  phone?: string | null;
  whatsapp?: string | null;
  shopLocation?: string | null;
  notes?: string | null;
  trustStatus: string;
  createdAt: Date;
}

export default function AdminSuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", whatsapp: "", shopLocation: "", notes: "", trustStatus: "PENDING_REVIEW" });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const data = await adminGetSuppliers();
    setSuppliers(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function resetForm() {
    setForm({ name: "", phone: "", whatsapp: "", shopLocation: "", notes: "", trustStatus: "PENDING_REVIEW" });
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(s: Supplier) {
    setForm({ name: s.name, phone: s.phone ?? "", whatsapp: s.whatsapp ?? "", shopLocation: s.shopLocation ?? "", notes: s.notes ?? "", trustStatus: s.trustStatus });
    setEditingId(s.id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.name) return;
    setSaving(true);
    try {
      if (editingId) {
        await adminUpdateSupplier(editingId, form);
      } else {
        await adminCreateSupplier(form);
      }
      resetForm();
      await load();
    } catch { alert("Kuna tatizo."); } finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Una uhakika?")) return;
    try { await adminDeleteSupplier(id); await load(); } catch { alert("Haiwezi kufuta."); }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Wasambazaji</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />Ongeza Msambazaji
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="font-bold mb-4">{editingId ? "Hariri" : "Msambazaji Mpya"}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><label className="label">Jina *</label><input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input" /></div>
            <div><label className="label">Simu</label><input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} className="input" /></div>
            <div><label className="label">WhatsApp</label><input value={form.whatsapp} onChange={(e) => setForm((f) => ({ ...f, whatsapp: e.target.value }))} className="input" /></div>
            <div><label className="label">Mahali pa Duka</label><input value={form.shopLocation} onChange={(e) => setForm((f) => ({ ...f, shopLocation: e.target.value }))} className="input" /></div>
            <div>
              <label className="label">Hali ya Uaminifu</label>
              <select value={form.trustStatus} onChange={(e) => setForm((f) => ({ ...f, trustStatus: e.target.value }))} className="input">
                <option value="TRUSTED">Anaaminiwa</option>
                <option value="PENDING_REVIEW">Inapitiwa</option>
                <option value="SUSPENDED">Imesimamishwa</option>
              </select>
            </div>
            <div><label className="label">Maelezo</label><input value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} className="input" /></div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
              {saving && <Loader2 size={14} className="animate-spin" />}{editingId ? "Hifadhi" : "Ongeza"}
            </button>
            <button onClick={resetForm} className="btn-outline">Ghairi</button>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="py-12 text-center"><Loader2 size={32} className="animate-spin mx-auto text-primary-600" /></div>
        ) : suppliers.length === 0 ? (
          <div className="text-center py-16"><Store size={48} className="mx-auto text-gray-300 mb-3" /><p className="text-gray-500">Hakuna wasambazaji</p></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <tr>{["Jina", "Simu", "Mahali", "Uaminifu", "Vitendo"].map((h) => <th key={h} className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">{h}</th>)}</tr>
              </thead>
              <tbody>
                {suppliers.map((s) => (
                  <tr key={s.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{s.name}</td>
                    <td className="py-3 px-4 text-gray-500">{s.phone}</td>
                    <td className="py-3 px-4 text-gray-500">{s.shopLocation}</td>
                    <td className="py-3 px-4"><StatusBadge status={s.trustStatus} /></td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {s.whatsapp && (
                          <a
                            href={`https://wa.me/${s.whatsapp.replace(/\D/g, "")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={`WhatsApp ${s.name}`}
                            aria-label={`WhatsApp ${s.name}`}
                            className="p-1.5 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/30 rounded-lg"
                          >
                            <MessageCircle size={14} />
                          </a>
                        )}
                        <button onClick={() => startEdit(s)} title="Hariri" aria-label="Hariri" className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg"><Edit size={14} /></button>
                        <button onClick={() => handleDelete(s.id)} title="Futa" aria-label="Futa" className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
