import { Link } from 'react-router-dom';
import {
  Cpu, Router, Smartphone, Network, Wrench, Truck, Shield,
  ArrowRight, MessageCircle, Zap, Clock, MapPin,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import type { Product, Category } from '../../types';
import { ProductCard } from '../../components/ProductCard';
import { GlassCard } from '../../components/ui/GlassCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: cats }, { data: prods }] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('*, category:categories(*)').eq('is_active', true).order('created_at', { ascending: false }).limit(8),
      ]);
      setCategories(cats as Category[] ?? []);
      setProducts(prods as Product[] ?? []);
      setLoading(false);
    })();
  }, []);

  const features = [
    { icon: Truck, title: 'Livraison à Niamey', desc: 'Livraison rapide dans toute la ville' },
    { icon: Shield, title: 'Garantie qualité', desc: 'Produits authentiques et garantis' },
    { icon: Wrench, title: 'Réparation pro', desc: 'Techniciens certifiés et expérimentés' },
    { icon: MessageCircle, title: 'Support WhatsApp', desc: 'Diagnostic gratuit en ligne' },
  ];

  const categoryIcons: Record<string, typeof Router> = {
    'Router': Router,
    'Smartphone': Smartphone,
    'Switch': Network,
    'Accessoire': Cpu,
  };

  return (
    <div className="min-h-screen bg-mesh">
      {/* Hero */}
      <section className="relative pt-32 lg:pt-40 pb-20 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="halo-blue top-20 left-1/4 w-72 h-72 animate-float" />
          <div className="halo-orange top-40 right-1/4 w-96 h-96 animate-float" style={{ animationDelay: '2s' }} />
          <div className="halo-blue bottom-0 left-1/2 w-80 h-80 animate-float" style={{ animationDelay: '4s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto animate-slide-up">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-6">
              <MapPin size={14} className="text-electric-400" />
              <span className="text-xs font-medium text-dark-100 tracking-wide">Niamey, Niger</span>
            </div>

            <h1 className="font-display font-bold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
              Votre partenaire <span className="gradient-text">technologique</span>
              <br />
              au cœur de Niamey
            </h1>

            <p className="mt-6 text-lg text-dark-200 max-w-2xl mx-auto leading-relaxed">
              Vente de matériel informatique — routeurs, smartphones, switchs — et prestations
              de réparation par des techniciens certifiés. Quality, rapidité, confiance.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/catalogue" className="btn-electric text-white font-semibold px-8 py-4 rounded-xl flex items-center gap-2 text-base">
                Découvrir le catalogue <ArrowRight size={20} />
              </Link>
              <Link to="/diagnostic" className="btn-orange text-white font-semibold px-8 py-4 rounded-xl flex items-center gap-2 text-base">
                <MessageCircle size={20} /> Diagnostic gratuit
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { value: '500+', label: 'Clients satisfaits' },
              { value: '200+', label: 'Produits en stock' },
              { value: '1000+', label: 'Réparations effectuées' },
              { value: '24h', label: 'Délai moyen réparation' },
            ].map((stat, i) => (
              <GlassCard key={i} className="p-6 text-center">
                <p className="font-display font-bold text-2xl lg:text-3xl gradient-text">{stat.value}</p>
                <p className="text-sm text-dark-200 mt-1">{stat.label}</p>
              </GlassCard>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {features.map((f, i) => (
            <GlassCard key={i} hover className="p-6">
              <div className="w-12 h-12 rounded-xl bg-electric-500/10 flex items-center justify-center mb-4">
                <f.icon size={24} className="text-electric-400" />
              </div>
              <h3 className="font-display font-semibold text-white">{f.title}</h3>
              <p className="text-sm text-dark-200 mt-1">{f.desc}</p>
            </GlassCard>
          ))}
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="font-display font-bold text-3xl text-white">Nos catégories</h2>
            <p className="text-dark-200 mt-2">Trouvez exactement ce qu'il vous faut</p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {categories.map(cat => {
              const Icon = categoryIcons[cat.name] ?? Cpu;
              return (
                <Link key={cat.id} to={`/catalogue?cat=${cat.slug}`}>
                  <GlassCard hover className="p-6 text-center group cursor-pointer">
                    <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-electric-500/20 to-electric-600/10 flex items-center justify-center mb-3 group-hover:from-electric-500/30 group-hover:to-electric-600/20 transition-all">
                      <Icon size={28} className="text-electric-400" />
                    </div>
                    <h3 className="font-medium text-white">{cat.name}</h3>
                  </GlassCard>
                </Link>
              );
            })}
          </div>
        </section>
      )}

      {/* Products */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-display font-bold text-3xl text-white">Produits récents</h2>
            <p className="text-dark-200 mt-2">Les dernières arrivées chez AB.TECHNILOGIE</p>
          </div>
          <Link to="/catalogue" className="text-electric-300 hover:text-electric-200 text-sm font-medium flex items-center gap-1 transition-colors">
            Tout voir <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : products.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <p className="text-dark-200">Les produits arrivent bientôt. Revenez visiter!</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Services preview */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlassCard className="p-8 lg:p-12 relative overflow-hidden">
          <div className="halo-orange top-0 right-0 w-64 h-64" />
          <div className="halo-blue bottom-0 left-0 w-64 h-64" />
          <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-electric-500/10 mb-4">
                <Wrench size={14} className="text-electric-400" />
                <span className="text-xs font-medium text-electric-300">Prestations de service</span>
              </div>
              <h2 className="font-display font-bold text-3xl text-white">Réparation & dépannage</h2>
              <p className="text-dark-200 mt-3 leading-relaxed">
                Nos techniciens certifiés réparent tous types d'appareils: smartphones, ordinateurs,
                routeurs, switchs. Diagnostic gratuit, devis transparent, réparation rapide.
              </p>
              <div className="mt-6 space-y-3">
                {[
                  { icon: Zap, text: 'Diagnostic express sous 24h' },
                  { icon: Shield, text: 'Garantie sur toutes les réparations' },
                  { icon: Clock, text: 'Rendez-vous à votre convenance' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-electric-500/10 flex items-center justify-center">
                      <item.icon size={16} className="text-electric-400" />
                    </div>
                    <span className="text-sm text-dark-100">{item.text}</span>
                  </div>
                ))}
              </div>
              <Link to="/services" className="mt-8 inline-flex btn-electric text-white font-semibold px-6 py-3 rounded-xl items-center gap-2">
                Voir les services <ArrowRight size={18} />
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { title: 'Réparation smartphone', price: 'À partir de 5000 FCFA', icon: Smartphone },
                { title: 'Configuration réseau', price: 'À partir de 10000 FCFA', icon: Router },
                { title: 'Dépannage ordinateur', price: 'À partir de 7500 FCFA', icon: Cpu },
                { title: 'Maintenance switch', price: 'À partir de 8000 FCFA', icon: Network },
              ].map((s, i) => (
                <div key={i} className="glass-light rounded-xl p-4">
                  <s.icon size={24} className="text-electric-400 mb-3" />
                  <h4 className="text-sm font-medium text-white">{s.title}</h4>
                  <p className="text-xs text-electric-300 mt-1">{s.price}</p>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>
      </section>

      {/* CTA WhatsApp */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <GlassCard className="p-8 lg:p-12 text-center relative overflow-hidden">
          <div className="halo-blue top-0 left-0 w-72 h-72" />
          <div className="halo-orange bottom-0 right-0 w-72 h-72" />
          <div className="relative">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-green-500/20 flex items-center justify-center mb-6">
              <MessageCircle size={32} className="text-green-400" />
            </div>
            <h2 className="font-display font-bold text-2xl lg:text-3xl text-white">
              Un problème avec votre appareil?
            </h2>
            <p className="text-dark-200 mt-3 max-w-xl mx-auto">
              Envoyez-nous un diagnostic gratuit via WhatsApp. Notre équipe vous répond rapidement
              avec une solution et un devis.
            </p>
            <Link to="/diagnostic" className="mt-6 inline-flex btn-orange text-white font-semibold px-8 py-4 rounded-xl items-center gap-2 text-base">
              Démarrer un diagnostic <ArrowRight size={20} />
            </Link>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
