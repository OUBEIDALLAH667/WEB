import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Clock, ArrowRight, Check, Calendar } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Service } from '../../types';
import { formatFCFA } from '../../lib/config';
import { useCart } from '../../context/CartContext';
import { GlassCard } from '../../components/ui/GlassCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('services').select('*').eq('is_active', true).order('price');
      setServices(data as Service[] ?? []);
      setLoading(false);
    })();
  }, []);

  return (
    <div className="min-h-screen bg-mesh pt-24 lg:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-4">
            <Wrench size={14} className="text-electric-400" />
            <span className="text-xs font-medium text-dark-100">Prestations de service</span>
          </div>
          <h1 className="font-display font-bold text-3xl lg:text-4xl text-white">Réparation & dépannage</h1>
          <p className="text-dark-200 mt-3 max-w-2xl mx-auto">
            Nos techniciens certifiés réparent tous vos appareils avec un diagnostic gratuit
            et un devis transparent.
          </p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : services.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <p className="text-dark-200">Les services seront bientôt disponibles.</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}

        {/* CTA */}
        <GlassCard className="mt-12 p-8 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-electric-500/10 rounded-full blur-3xl" />
          <div className="relative">
            <Calendar size={32} className="text-electric-400 mx-auto mb-4" />
            <h2 className="font-display font-bold text-2xl text-white">Besoin d'un rendez-vous?</h2>
            <p className="text-dark-200 mt-2">Réservez un créneau pour faire réparer votre appareil.</p>
            <Link to="/diagnostic" className="mt-6 inline-flex btn-electric text-white font-semibold px-6 py-3 rounded-xl items-center gap-2">
              Démarrer un diagnostic <ArrowRight size={18} />
            </Link>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

function ServiceCard({ service }: { service: Service }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart({
      id: service.id,
      type: 'service',
      name: service.name,
      price: service.price,
      reference_id: service.id,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  return (
    <GlassCard hover className="p-6 flex flex-col">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-electric-500/20 to-electric-600/10 flex items-center justify-center mb-4">
        <Wrench size={24} className="text-electric-400" />
      </div>

      <h3 className="font-display font-semibold text-lg text-white">{service.name}</h3>
      <p className="text-sm text-dark-200 mt-2 leading-relaxed flex-1">{service.description}</p>

      <div className="flex items-center gap-2 mt-4 text-xs text-dark-300">
        <Clock size={14} className="text-electric-400" />
        Durée estimée: {service.duration_hours}h
      </div>

      <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between">
        <span className="font-display font-bold text-xl text-white">{formatFCFA(service.price)}</span>
        <button
          onClick={handleAdd}
          className="btn-orange text-white font-semibold px-4 py-2.5 rounded-lg text-sm flex items-center gap-2"
        >
          {added ? <><Check size={16} /> Ajouté</> : 'Ajouter'}
        </button>
      </div>
    </GlassCard>
  );
}
