import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { GlassCard } from '../../components/ui/GlassCard';

export function NotFoundPage() {
  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center px-4 pt-20 pb-12 relative overflow-hidden">
      <div className="halo-blue top-1/4 left-1/4 w-72 h-72" />
      <div className="halo-orange bottom-1/4 right-1/4 w-72 h-72" />

      <GlassCard className="p-12 text-center max-w-md relative">
        <p className="font-display font-bold text-7xl lg:text-8xl gradient-text">404</p>
        <h1 className="font-display font-semibold text-2xl text-white mt-4">Page introuvable</h1>
        <p className="text-dark-200 mt-3">
          La page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-electric text-white font-semibold px-6 py-3 rounded-xl inline-flex items-center justify-center gap-2">
            <Home size={18} /> Accueil
          </Link>
          <Link to="/catalogue" className="glass-light text-dark-100 hover:text-white font-semibold px-6 py-3 rounded-xl inline-flex items-center justify-center gap-2 transition-all">
            <ArrowLeft size={18} /> Catalogue
          </Link>
        </div>
      </GlassCard>
    </div>
  );
}
