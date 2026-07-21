import { Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, ClipboardList, Wrench, Calendar,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { Logo } from '../../components/ui/Logo';

const adminLinks = [
  { to: '/admin', label: 'Tableau de bord', icon: LayoutDashboard, exact: true },
  { to: '/admin/produits', label: 'Produits', icon: Package },
  { to: '/admin/commandes', label: 'Commandes', icon: ClipboardList },
  { to: '/admin/diagnostics', label: 'Diagnostics', icon: Wrench },
  { to: '/admin/rendez-vous', label: 'Rendez-vous', icon: Calendar },
];

export function AdminLayout() {
  const { profile, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="min-h-screen bg-mesh pt-24"><LoadingSpinner /></div>;
  if (!profile) return <Navigate to="/login" replace />;
  if (!profile.is_admin) return <Navigate to="/" replace />;

  const isActive = (link: typeof adminLinks[0]) =>
    link.exact ? location.pathname === link.to : location.pathname.startsWith(link.to);

  return (
    <div className="min-h-screen bg-mesh pt-20 lg:pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Logo size={36} />
          <div>
            <h1 className="font-display font-bold text-xl text-white">Espace administrateur</h1>
            <p className="text-xs text-dark-200">AB.TECHNILOGIE — Gestion</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6">
          {/* Sidebar */}
          <aside>
            <div className="glass rounded-2xl p-3 lg:sticky lg:top-24">
              <nav className="space-y-1">
                {adminLinks.map(link => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive(link) ? 'bg-electric-500/20 text-electric-300 border border-electric-500/20' : 'text-dark-100 hover:text-white hover:bg-white/5'}`}
                  >
                    <link.icon size={18} />
                    {link.label}
                  </Link>
                ))}
              </nav>
              <div className="mt-3 pt-3 border-t border-white/10">
                <Link
                  to="/"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-dark-200 hover:text-white hover:bg-white/5 transition-all"
                >
                  <ArrowLeft size={18} /> Retour au site
                </Link>
              </div>
            </div>
          </aside>

          {/* Content */}
          <main className="min-w-0">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
