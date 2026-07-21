import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Facebook, MessageCircle } from 'lucide-react';
import { COMPANY } from '../lib/config';
import { Logo } from './ui/Logo';

export function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <Logo size={40} />
              <div>
                <span className="font-display font-bold text-lg text-white">{COMPANY.name}</span>
                <p className="text-[10px] text-dark-200 -mt-1 tracking-widest uppercase">{COMPANY.city}, {COMPANY.country}</p>
              </div>
            </div>
            <p className="text-sm text-dark-200 max-w-md leading-relaxed">
              Votre partenaire technologique de confiance à Niamey. Vente de matériel informatique
              et prestations de réparation pour particuliers et professionnels.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <a href="#" className="w-10 h-10 rounded-lg glass-light flex items-center justify-center hover:bg-electric-500/20 transition-all">
                <Facebook size={18} className="text-dark-100" />
              </a>
              <a href={`https://wa.me/${COMPANY.phone.replace(/\s/g, '')}`} className="w-10 h-10 rounded-lg glass-light flex items-center justify-center hover:bg-electric-500/20 transition-all">
                <MessageCircle size={18} className="text-dark-100" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Navigation</h4>
            <ul className="space-y-3">
              <li><Link to="/" className="text-sm text-dark-200 hover:text-electric-300 transition-colors">Accueil</Link></li>
              <li><Link to="/catalogue" className="text-sm text-dark-200 hover:text-electric-300 transition-colors">Catalogue</Link></li>
              <li><Link to="/services" className="text-sm text-dark-200 hover:text-electric-300 transition-colors">Services</Link></li>
              <li><Link to="/diagnostic" className="text-sm text-dark-200 hover:text-electric-300 transition-colors">Diagnostic</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-dark-200">
                <MapPin size={16} className="text-electric-400 mt-0.5 shrink-0" />
                {COMPANY.address}
              </li>
              <li className="flex items-center gap-3 text-sm text-dark-200">
                <Phone size={16} className="text-electric-400 shrink-0" />
                {COMPANY.phone}
              </li>
              <li className="flex items-center gap-3 text-sm text-dark-200">
                <Mail size={16} className="text-electric-400 shrink-0" />
                {COMPANY.email}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-dark-300">
            © {new Date().getFullYear()} {COMPANY.name}. Tous droits réservés.
          </p>
          <p className="text-xs text-dark-300">
            Conçu avec précision à Niamey, Niger.
          </p>
        </div>
      </div>
    </footer>
  );
}
