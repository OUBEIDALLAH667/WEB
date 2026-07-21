import { useState } from 'react';
import { User, Phone, Save, Check } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { formatDate } from '../../lib/config';

export function AccountPage() {
  const { profile, refreshProfile } = useAuth();
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [phone, setPhone] = useState(profile?.phone ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);

    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, phone })
      .eq('id', profile.id);

    if (!error) {
      await refreshProfile();
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
    setSaving(false);
  }

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-mesh pt-24 lg:pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-bold text-3xl text-white mb-2">Mon compte</h1>
        <p className="text-dark-200 mb-8">Gérez vos informations personnelles</p>

        <GlassCard className="p-6 lg:p-8">
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-electric-400 to-electric-600 flex items-center justify-center text-white font-display font-bold text-2xl glow-blue">
              {profile.full_name?.[0]?.toUpperCase() ?? 'U'}
            </div>
            <div>
              <h2 className="font-display font-semibold text-lg text-white">{profile.full_name}</h2>
              <p className="text-sm text-dark-200">
                Membre depuis {formatDate(profile.created_at)}
              </p>
              {profile.is_admin && (
                <span className="inline-flex items-center gap-1.5 mt-1 px-2 py-0.5 rounded-full bg-electric-500/20 text-electric-300 text-xs font-medium">
                  Administrateur
                </span>
              )}
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-100 mb-2">Nom complet</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-dark-300" />
                <input
                  type="text"
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
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
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+227 ..."
                  className="input-glass w-full pl-12 pr-4 py-3 rounded-xl text-sm text-white"
                />
              </div>
            </div>

            <Button type="submit" disabled={saving}>
              {saved ? <><Check size={18} /> Enregistré</> : <><Save size={18} /> {saving ? 'Enregistrement...' : 'Enregistrer'}</>}
            </Button>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
