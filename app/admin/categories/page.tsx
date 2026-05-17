"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Tag, Loader2 } from "lucide-react";
import { getCategories } from "@/actions/products";
import { adminCreateCategory, adminUpdateCategory, adminDeleteCategory } from "@/actions/admin";
import { generateSlug } from "@/lib/utils";
import type { Category } from "@/types";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ nameSw: "", nameEn: "", slug: "", descriptionSw: "", descriptionEn: "", isActive: true });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    const data = await getCategories();
    setCategories(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function resetForm() {
    setForm({ nameSw: "", nameEn: "", slug: "", descriptionSw: "", descriptionEn: "", isActive: true });
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(cat: Category) {
    setForm({
      nameSw: cat.nameSw,
      nameEn: cat.nameEn,
      slug: cat.slug,
      descriptionSw: cat.descriptionSw ?? "",
      descriptionEn: cat.descriptionEn ?? "",
      isActive: cat.isActive,
    });
    setEditingId(cat.id);
    setShowForm(true);
  }

  async function handleSave() {
    if (!form.nameSw || !form.nameEn) return;
    setSaving(true);
    try {
      if (editingId) {
        await adminUpdateCategory(editingId, { ...form });
      } else {
        await adminCreateCategory({ ...form });
      }
      resetForm();
      await load();
    } catch {
      alert("Kuna tatizo. Jaribu tena.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Una uhakika unataka kufuta kategoria hii?")) return;
    try {
      await adminDeleteCategory(id);
      await load();
    } catch {
      alert("Haiwezi kufuta kategoria yenye bidhaa.");
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Kategoria</h1>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary flex items-center gap-2 text-sm">
          <Plus size={16} />
          Ongeza Kategoria
        </button>
      </div>

      {showForm && (
        <div className="card p-6 mb-6">
          <h2 className="font-bold text-gray-900 dark:text-gray-100 mb-4">
            {editingId ? "Hariri Kategoria" : "Kategoria Mpya"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label">Jina (Kiswahili) *</label>
              <input
                value={form.nameSw}
                onChange={(e) => {
                  setForm((f) => ({ ...f, nameSw: e.target.value, slug: f.slug || generateSlug(e.target.value) }));
                }}
                className="input"
                placeholder="Fashion / Mitindo"
              />
            </div>
            <div>
              <label className="label">Name (English) *</label>
              <input value={form.nameEn} onChange={(e) => setForm((f) => ({ ...f, nameEn: e.target.value }))} className="input" placeholder="Fashion" />
            </div>
            <div>
              <label className="label">Slug *</label>
              <input value={form.slug} onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))} className="input font-mono text-sm" placeholder="fashion-mitindo" />
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))} className="rounded text-primary-600 w-4 h-4" />
              <label htmlFor="isActive" className="text-sm text-gray-700 dark:text-gray-300">Inafanya Kazi</label>
            </div>
            <div>
              <label className="label">Maelezo (Kiswahili)</label>
              <input value={form.descriptionSw} onChange={(e) => setForm((f) => ({ ...f, descriptionSw: e.target.value }))} className="input" placeholder="Maelezo..." />
            </div>
            <div>
              <label className="label">Description (English)</label>
              <input value={form.descriptionEn} onChange={(e) => setForm((f) => ({ ...f, descriptionEn: e.target.value }))} className="input" placeholder="Description..." />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button onClick={handleSave} disabled={saving} className="btn-primary flex items-center gap-2">
              {saving ? <Loader2 size={14} className="animate-spin" /> : null}
              {editingId ? "Hifadhi" : "Ongeza"}
            </button>
            <button onClick={resetForm} className="btn-outline">Ghairi</button>
          </div>
        </div>
      )}

      <div className="card overflow-hidden">
        {loading ? (
          <div className="text-center py-12"><Loader2 size={32} className="animate-spin mx-auto text-primary-600" /></div>
        ) : categories.length === 0 ? (
          <div className="text-center py-16">
            <Tag size={48} className="mx-auto text-gray-300 dark:text-gray-700 mb-3" />
            <p className="text-gray-500">Hakuna kategoria</p>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
              <tr>
                {["Jina (SW)", "Jina (EN)", "Slug", "Hali", "Vitendo"].map((h) => (
                  <th key={h} className="text-left py-3 px-4 font-medium text-gray-600 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id} className="border-b border-gray-100 dark:border-gray-800 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-gray-100">{cat.nameSw}</td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{cat.nameEn}</td>
                  <td className="py-3 px-4 font-mono text-xs text-gray-500">{cat.slug}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cat.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>
                      {cat.isActive ? "Inafanya Kazi" : "Haifanyi Kazi"}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => startEdit(cat)} title="Hariri" aria-label="Hariri" className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors">
                        <Edit size={15} />
                      </button>
                      <button onClick={() => handleDelete(cat.id)} title="Futa" aria-label="Futa" className="p-1.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
