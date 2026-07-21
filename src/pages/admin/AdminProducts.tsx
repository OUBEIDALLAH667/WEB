import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Upload, Package, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Product, Category } from '../../types';
import { formatFCFA, getProductImage } from '../../lib/config';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ProductImage } from '../../components/ui/ProductImage';

export function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({
    name: '', brand: '', description: '', price: 0, stock: 0,
    category_id: '', image_url: '', is_active: true,
  });
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('products').select('*, category:categories(*)').order('created_at', { ascending: false }),
      supabase.from('categories').select('*').order('name'),
    ]);
    setProducts(prods as Product[] ?? []);
    setCategories(cats as Category[] ?? []);
    setLoading(false);
  }

  function openForm(product?: Product) {
    if (product) {
      setEditing(product);
      setForm({
        name: product.name, brand: product.brand, description: product.description,
        price: product.price, stock: product.stock, category_id: product.category_id ?? '',
        image_url: product.image_url, is_active: product.is_active,
      });
    } else {
      setEditing(null);
      setForm({ name: '', brand: '', description: '', price: 0, stock: 0, category_id: '', image_url: '', is_active: true });
    }
    setShowForm(true);
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);

    const ext = file.name.split('.').pop();
    const fileName = `${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('product-images').upload(fileName, file);

    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName);
      setForm(prev => ({ ...prev, image_url: publicUrl }));
    }
    setUploading(false);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      brand: form.brand,
      description: form.description,
      price: form.price,
      stock: form.stock,
      category_id: form.category_id || null,
      image_url: form.image_url,
      is_active: form.is_active,
    };

    if (editing) {
      await supabase.from('products').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('products').insert(payload);
    }

    setShowForm(false);
    setSaving(false);
    loadData();
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce produit?')) return;
    await supabase.from('products').delete().eq('id', id);
    loadData();
  }

  if (loading) return <LoadingSpinner />;

  const filtered = search
    ? products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()))
    : products;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display font-bold text-2xl text-white">Produits</h2>
          <p className="text-dark-200 text-sm mt-1">{products.length} produit{products.length > 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => openForm()}>
          <Plus size={18} /> Ajouter
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300" />
        <input
          type="text"
          placeholder="Rechercher..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-glass w-full pl-12 pr-4 py-3 rounded-xl text-sm text-white"
        />
      </div>

      {/* Products table */}
      <GlassCard className="overflow-hidden">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <Package size={40} className="text-dark-300 mx-auto mb-3" />
            <p className="text-dark-100">Aucun produit</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10 text-left">
                  <th className="px-4 py-3 font-medium text-dark-200">Produit</th>
                  <th className="px-4 py-3 font-medium text-dark-200 hidden sm:table-cell">Catégorie</th>
                  <th className="px-4 py-3 font-medium text-dark-200">Prix</th>
                  <th className="px-4 py-3 font-medium text-dark-200 hidden sm:table-cell">Stock</th>
                  <th className="px-4 py-3 font-medium text-dark-200 hidden sm:table-cell">Statut</th>
                  <th className="px-4 py-3 font-medium text-dark-200 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(product => (
                  <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {(() => { const img = getProductImage(product); return (
                          <ProductImage
                            src={img.src}
                            emoji={img.emoji}
                            alt={product.name}
                            className="w-10 h-10 object-cover"
                            emojiSize="text-base"
                          />
                        ); })()}
                        <div>
                          <p className="text-white font-medium">{product.name}</p>
                          <p className="text-xs text-dark-300">{product.brand}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-dark-200 hidden sm:table-cell">{product.category?.name ?? '—'}</td>
                    <td className="px-4 py-3 text-white">{formatFCFA(product.price)}</td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={product.stock > 0 ? 'text-green-300' : 'text-red-300'}>{product.stock}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${product.is_active ? 'bg-green-500/10 text-green-300' : 'bg-dark-500/20 text-dark-200'}`}>
                        {product.is_active ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openForm(product)} className="p-2 rounded-lg glass-light hover:bg-white/10 transition-colors">
                          <Pencil size={14} className="text-dark-100" />
                        </button>
                        <button onClick={() => handleDelete(product.id)} className="p-2 rounded-lg glass-light hover:bg-red-500/20 transition-colors">
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Form modal */}
      {showForm && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={() => setShowForm(false)} />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <GlassCard className="w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 pointer-events-auto animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display font-semibold text-lg text-white">
                  {editing ? 'Modifier le produit' : 'Nouveau produit'}
                </h3>
                <button onClick={() => setShowForm(false)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <X size={20} className="text-dark-100" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-4">
                {/* Image upload */}
                <div>
                  <label className="block text-sm font-medium text-dark-100 mb-2">Image</label>
                  <div className="flex items-center gap-4">
                    {form.image_url ? (
                      <img src={form.image_url} alt="Aperçu" className="w-24 h-24 rounded-xl object-cover" />
                    ) : (
                      <ProductImage
                        src={null}
                        emoji="📦"
                        alt="Aperçu"
                        className="w-24 h-24"
                        emojiSize="text-3xl"
                      />
                    )}
                    <label className="cursor-pointer">
                      <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg glass-light text-sm text-dark-100 hover:bg-white/10 transition-all">
                        <Upload size={16} /> {uploading ? 'Upload...' : 'Choisir une image'}
                      </span>
                      <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-100 mb-2">Nom *</label>
                    <input type="text" required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                      className="input-glass w-full px-4 py-2.5 rounded-xl text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-100 mb-2">Marque</label>
                    <input type="text" value={form.brand} onChange={e => setForm(p => ({ ...p, brand: e.target.value }))}
                      className="input-glass w-full px-4 py-2.5 rounded-xl text-sm text-white" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-dark-100 mb-2">Description</label>
                  <textarea rows={3} value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                    className="input-glass w-full px-4 py-2.5 rounded-xl text-sm text-white resize-none" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-dark-100 mb-2">Prix (FCFA) *</label>
                    <input type="number" required min={0} value={form.price} onChange={e => setForm(p => ({ ...p, price: parseInt(e.target.value) || 0 }))}
                      className="input-glass w-full px-4 py-2.5 rounded-xl text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-100 mb-2">Stock *</label>
                    <input type="number" required min={0} value={form.stock} onChange={e => setForm(p => ({ ...p, stock: parseInt(e.target.value) || 0 }))}
                      className="input-glass w-full px-4 py-2.5 rounded-xl text-sm text-white" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-dark-100 mb-2">Catégorie</label>
                    <select value={form.category_id} onChange={e => setForm(p => ({ ...p, category_id: e.target.value }))}
                      className="input-glass w-full px-4 py-2.5 rounded-xl text-sm text-white">
                      <option value="">Aucune</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm(p => ({ ...p, is_active: e.target.checked }))}
                    className="w-5 h-5 rounded accent-electric-500" />
                  <span className="text-sm text-dark-100">Produit actif (visible dans le catalogue)</span>
                </label>

                <div className="flex gap-3 pt-2">
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Enregistrement...' : 'Enregistrer'}
                  </Button>
                  <Button variant="secondary" onClick={() => setShowForm(false)}>Annuler</Button>
                </div>
              </form>
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
}
