import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  ShoppingCart, User, Menu, X, LogOut, LayoutDashboard,
  Package, Calendar,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Logo } from './ui/Logo';


export function Navbar() {
  const { profile, signOut } = useAuth();
  const { itemCount, setIsCartOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: '/', label: 'Accueil' },
    { to: '/catalogue', label: 'Catalogue' },
    { to: '/services', label: 'Services' },
    { to: '/diagnostic', label: 'Diagnostic' },
  ];

  const isActive = (path: string) => path === '/' ? location.pathname === '/' : location.pathname.startsWith(path);

  function handleSignOut() {
    signOut();
    navigate('/');
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'glass-strong shadow-lg' : 'bg-transparent'}`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <Logo size={40} className="group-hover:scale-105 transition-transform" />
            <div className="hidden sm:block">
              <span className="font-display font-bold text-lg text-white tracking-tight">AB.TECHNILOGIE</span>
              <p className="text-[10px] text-dark-200 -mt-1 tracking-widest uppercase">Niamey, Niger</p>
            </div>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive(link.to) ? 'text-electric-300 bg-electric-500/10' : 'text-dark-100 hover:text-white hover:bg-white/5'}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-lg glass-light hover:bg-white/10 transition-all"
              aria-label="Panier"
            >
              <ShoppingCart size={20} className="text-white" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-electric-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center glow-blue">
                  {itemCount}
                </span>
              )}
            </button>

            {/* User */}
            {profile ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-lg glass-light hover:bg-white/10 transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-electric-400 to-electric-600 flex items-center justify-center text-white font-semibold text-sm">
                    {profile.full_name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <span className="hidden sm:block text-sm text-white font-medium max-w-[100px] truncate">
                    {profile.full_name?.split(' ')[0] ?? 'Compte'}
                  </span>
                </button>

                {userMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                    <div className="absolute right-0 mt-2 w-64 glass-strong rounded-xl shadow-2xl py-2 z-50 animate-scale-in origin-top-right">
                      <div className="px-4 py-3 border-b border-white/10">
                        <p className="text-sm font-semibold text-white truncate">{profile.full_name}</p>
                        <p className="text-xs text-dark-200">{profile.phone || 'Pas de téléphone'}</p>
                      </div>

                      {profile.is_admin ? (
                        <Link to="/admin" className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-100 hover:text-white hover:bg-white/5 transition-colors">
                          <LayoutDashboard size={18} /> Tableau de bord admin
                        </Link>
                      ) : (
                        <Link to="/compte" className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-100 hover:text-white hover:bg-white/5 transition-colors">
                          <User size={18} /> Mon compte
                        </Link>
                      )}

                      <Link to="/compte/commandes" className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-100 hover:text-white hover:bg-white/5 transition-colors">
                        <Package size={18} /> Mes commandes
                      </Link>
                      <Link to="/compte/rendez-vous" className="flex items-center gap-3 px-4 py-2.5 text-sm text-dark-100 hover:text-white hover:bg-white/5 transition-colors">
                        <Calendar size={18} /> Mes rendez-vous
                      </Link>

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-300 hover:bg-red-500/10 transition-colors border-t border-white/10 mt-1"
                      >
                        <LogOut size={18} /> Déconnexion
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                className="hidden sm:flex btn-electric text-white font-semibold px-5 py-2.5 rounded-lg text-sm"
              >
                Connexion
              </Link>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2.5 rounded-lg glass-light hover:bg-white/10 transition-all"
            >
              {mobileOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="lg:hidden glass-strong rounded-xl mt-2 mb-4 p-3 animate-slide-up">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive(link.to) ? 'text-electric-300 bg-electric-500/10' : 'text-dark-100 hover:text-white hover:bg-white/5'}`}
              >
                {link.label}
              </Link>
            ))}
            {!profile && (
              <Link to="/login" className="block px-4 py-3 rounded-lg text-sm font-semibold text-electric-300 hover:bg-white/5 transition-all mt-2 border-t border-white/10 pt-3">
                Connexion / Inscription
              </Link>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
