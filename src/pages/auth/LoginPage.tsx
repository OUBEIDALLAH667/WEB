import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { Logo } from '../../components/ui/Logo';

export function LoginPage() {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { error } = await signIn(email, password);
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
          <h2 className="font-display font-semibold text-xl text-white mb-1">Connexion</h2>
          <p className="text-sm text-dark-200 mb-6">Accédez à votre compte</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-dark-100 mb-2">Email</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
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
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              {loading ? 'Connexion...' : <>Se connecter <ArrowRight size={18} /></>}
            </Button>
          </form>

          <p className="text-sm text-dark-200 text-center mt-6">
            Pas encore de compte?{' '}
            <Link to="/signup" className="text-electric-300 hover:text-electric-200 font-medium transition-colors">
              Créer un compte
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
