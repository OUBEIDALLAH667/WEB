import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, User, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';

export function SignupPage() {
  const { signUp } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', phone: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function update(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (form.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères.');
      return;
    }

    setLoading(true);
    const { error } = await signUp(form.email, form.password, form.full_name, form.phone);
    if (error) {
      setError(error);
      setLoading(false);
    } else {
      navigate('/');
    }
  }

  return (
    <div className="min-h-screen bg-mesh flex items-center justify-center pt-20 pb-12 px-4 relative overflow-hidden">
      <div className="halo-blue top-1/4 left-1/4 w-72 h-72" />
      <div className="halo-orange bottom-1/4 right-1/4 w-72 h-72" />
      <div className="w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <Logo size={48} />
          </div>
          <h1 className="font-display font-bold text-2xl text-white">AB.TECHNILOGIE</h1>
          <p className="text-xs text-dark-200 tracking-widest uppercase mt-1">Niamey, Niger</p>
        </div>

        <GlassCard className="p-8">
          <h2 className="font-display font-semibold text-xl text-white mb-1">Créer un compte</h2>
          <p className="text-sm text-dark-200 mb-6">Rejoignez la communauté AB.TECHNILOGIE</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-100 mb-2">Nom complet</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300" />
                <input
                  type="text"
                  required
                  value={form.full_name}
                  onChange={e => update('full_name', e.target.value)}
                  placeholder="Votre nom"
                  className="input-glass w-full pl-12 pr-4 py-3 rounded-xl text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-100 mb-2">Téléphone</label>
              <div className="relative">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300" />
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={e => update('phone', e.target.value)}
                  placeholder="+227 ..."
                  className="input-glass w-full pl-12 pr-4 py-3 rounded-xl text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-100 mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300" />
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  placeholder="vous@exemple.com"
                  className="input-glass w-full pl-12 pr-4 py-3 rounded-xl text-sm text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-100 mb-2">Mot de passe</label>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300" />
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={e => update('password', e.target.value)}
                  placeholder="Min. 6 caractères"
                  className="input-glass w-full pl-12 pr-4 py-3 rounded-xl text-sm text-white"
                />
              </div>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" disabled={loading} className="w-full">
              {loading ? 'Création...' : <>Créer mon compte <ArrowRight size={18} /></>}
            </Button>
          </form>

          <p className="text-sm text-dark-200 text-center mt-6">
            Déjà un compte?{' '}
            <Link to="/login" className="text-electric-300 hover:text-electric-200 font-medium transition-colors">
              Se connecter
            </Link>
          </p>
        </GlassCard>

        <p className="text-xs text-dark-300 text-center mt-6">
          <Link to="/" className="hover:text-dark-100 transition-colors">← Retour à l'accueil</Link>
        </p>
      </div>
    </div>
  );
}
