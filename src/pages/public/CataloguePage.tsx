import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Package } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Product, Category } from '../../types';
import { ProductCard } from '../../components/ProductCard';
import { GlassCard } from '../../components/ui/GlassCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function CataloguePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<'recent' | 'price-asc' | 'price-desc' | 'name'>('recent');

  const selectedCat = searchParams.get('cat') ?? 'all';

  useEffect(() => {
    (async () => {
      const { data: cats } = await supabase.from('categories').select('*').order('name');
      setCategories(cats as Category[] ?? []);
      await loadProducts();
    })();
  }, []);

  async function loadProducts() {
    setLoading(true);
    let query = supabase.from('products').select('*, category:categories(*)').eq('is_active', true);

    if (selectedCat !== 'all') {
      const cat = categories.find(c => c.slug === selectedCat);
      if (cat) query = query.eq('category_id', cat.id);
    }

    if (sortBy === 'price-asc') query = query.order('price', { ascending: true });
    else if (sortBy === 'price-desc') query = query.order('price', { ascending: false });
    else if (sortBy === 'name') query = query.order('name', { ascending: true });
    else query = query.order('created_at', { ascending: false });

    const { data } = await query;
    setProducts(data as Product[] ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (categories.length > 0) loadProducts();
  }, [selectedCat, sortBy, categories]);

  const filtered = search
    ? products.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.brand.toLowerCase().includes(search.toLowerCase())
      )
    : products;

  return (
    <div className="min-h-screen bg-mesh pt-24 lg:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display font-bold text-3xl lg:text-4xl text-white">Catalogue</h1>
          <p className="text-dark-200 mt-2">
            {filtered.length} produit{filtered.length > 1 ? 's' : ''} disponible{filtered.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300" />
            <input
              type="text"
              placeholder="Rechercher un produit, une marque..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-glass w-full pl-12 pr-4 py-3 rounded-xl text-sm text-white"
            />
          </div>

          {/* Sort */}
          <div className="relative">
            <SlidersHorizontal size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300 pointer-events-none" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              className="input-glass pl-12 pr-8 py-3 rounded-xl text-sm text-white appearance-none cursor-pointer min-w-[200px]"
            >
              <option value="recent">Plus récents</option>
              <option value="price-asc">Prix croissant</option>
              <option value="price-desc">Prix décroissant</option>
              <option value="name">Nom (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSearchParams({})}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCat === 'all' ? 'btn-electric text-white' : 'glass-light text-dark-100 hover:text-white hover:bg-white/10'}`}
          >
            Tous
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSearchParams({ cat: cat.slug })}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${selectedCat === cat.slug ? 'btn-electric text-white' : 'glass-light text-dark-100 hover:text-white hover:bg-white/10'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Products grid */}
        {loading ? (
          <LoadingSpinner />
        ) : filtered.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Package size={48} className="text-dark-300 mx-auto mb-4" />
            <p className="text-dark-100 font-medium">Aucun produit trouvé</p>
            <p className="text-sm text-dark-300 mt-1">Essayez de modifier vos filtres</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {filtered.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
