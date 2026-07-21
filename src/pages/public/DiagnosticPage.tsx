import { useState } from 'react';
import { MessageCircle, Send, Check, Smartphone, Laptop, Router, HardDrive, Camera } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { buildWhatsAppUrl, COMPANY } from '../../lib/config';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';

const deviceTypes = [
  { value: 'Smartphone', icon: Smartphone },
  { value: 'Ordinateur portable', icon: Laptop },
  { value: 'Routeur / Modem', icon: Router },
  { value: 'Disque dur / Stockage', icon: HardDrive },
  { value: 'Caméra / Surveillance', icon: Camera },
];

export function DiagnosticPage() {
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    device_type: '',
    brand: '',
    problem_description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  function updateField(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!form.customer_name || !form.phone || !form.device_type || !form.problem_description) {
      setError('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    setSubmitting(true);

    // Save to database
    const { error: dbError } = await supabase.from('diagnostics').insert({
      customer_name: form.customer_name,
      phone: form.phone,
      device_type: form.device_type,
      brand: form.brand,
      problem_description: form.problem_description,
    });

    if (dbError) {
      setError('Erreur lors de l\'envoi. Veuillez réessayer ou nous contacter directement sur WhatsApp.');
      setSubmitting(false);
      return;
    }

    // Build WhatsApp message
    const message = `*Nouveau diagnostic - AB.TECHNILOGIE*\n\n` +
      `Nom: ${form.customer_name}\n` +
      `Téléphone: ${form.phone}\n` +
      `Type d'appareil: ${form.device_type}\n` +
      `Marque: ${form.brand || 'Non précisée'}\n` +
      `Problème: ${form.problem_description}`;

    setSuccess(true);
    setSubmitting(false);

    // Open WhatsApp after a short delay
    setTimeout(() => {
      window.open(buildWhatsAppUrl(message), '_blank');
    }, 800);
  }

  if (success) {
    return (
      <div className="min-h-screen bg-mesh pt-24 lg:pt-28 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard className="p-12 text-center animate-scale-in">
            <div className="w-20 h-20 mx-auto rounded-full bg-green-500/20 flex items-center justify-center mb-6">
              <Check size={40} className="text-green-400" />
            </div>
            <h2 className="font-display font-bold text-2xl text-white">Diagnostic envoyé!</h2>
            <p className="text-dark-200 mt-3">
              Votre demande a été enregistrée. Vous allez être redirigé vers WhatsApp
              pour finaliser l'envoi à notre équipe.
            </p>
            <p className="text-sm text-dark-300 mt-4">
              Nous vous répondrons dans les plus brefs délais au {form.phone}.
            </p>
            <Button
              variant="secondary"
              className="mt-6"
              onClick={() => {
                setSuccess(false);
                setForm({ customer_name: '', phone: '', device_type: '', brand: '', problem_description: '' });
              }}
            >
              Envoyer un autre diagnostic
            </Button>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh pt-24 lg:pt-28 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-light mb-4">
            <MessageCircle size={14} className="text-green-400" />
            <span className="text-xs font-medium text-dark-100">Diagnostic gratuit</span>
          </div>
          <h1 className="font-display font-bold text-3xl lg:text-4xl text-white">Décrivez votre problème</h1>
          <p className="text-dark-200 mt-3 max-w-xl mx-auto">
            Remplissez ce formulaire et nous vous répondrons sur WhatsApp avec un diagnostic
            et un devis. C'est gratuit et sans engagement.
          </p>
        </div>

        <GlassCard className="p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-dark-100 mb-2">
                  Nom complet *
                </label>
                <input
                  type="text"
                  required
                  value={form.customer_name}
                  onChange={e => updateField('customer_name', e.target.value)}
                  placeholder="Votre nom"
                  className="input-glass w-full px-4 py-3 rounded-xl text-sm text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-dark-100 mb-2">
                  Téléphone / WhatsApp *
                </label>
                <input
                  type="tel"
                  required
                  value={form.phone}
                  onChange={e => updateField('phone', e.target.value)}
                  placeholder="+227 ..."
                  className="input-glass w-full px-4 py-3 rounded-xl text-sm text-white"
                />
              </div>
            </div>

            {/* Device type */}
            <div>
              <label className="block text-sm font-medium text-dark-100 mb-3">
                Type d'appareil *
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {deviceTypes.map(d => {
                  const Icon = d.icon;
                  const selected = form.device_type === d.value;
                  return (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => updateField('device_type', d.value)}
                      className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${selected ? 'bg-electric-500/20 border-electric-500/50 text-white' : 'glass-light border-white/10 text-dark-100 hover:bg-white/10'}`}
                    >
                      <Icon size={24} className={selected ? 'text-electric-300' : 'text-dark-200'} />
                      <span className="text-xs font-medium">{d.value}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-sm font-medium text-dark-100 mb-2">
                Marque (optionnel)
              </label>
              <input
                type="text"
                value={form.brand}
                onChange={e => updateField('brand', e.target.value)}
                placeholder="Ex: Samsung, HP, Cisco..."
                className="input-glass w-full px-4 py-3 rounded-xl text-sm text-white"
              />
            </div>

            {/* Problem description */}
            <div>
              <label className="block text-sm font-medium text-dark-100 mb-2">
                Description du problème *
              </label>
              <textarea
                required
                rows={5}
                value={form.problem_description}
                onChange={e => updateField('problem_description', e.target.value)}
                placeholder="Décrivez le problème rencontré: symptômes, quand il est apparu, ce que vous avez déjà essayé..."
                className="input-glass w-full px-4 py-3 rounded-xl text-sm text-white resize-none"
              />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
                {error}
              </div>
            )}

            <Button type="submit" size="lg" variant="orange" disabled={submitting} className="w-full">
              {submitting ? 'Envoi en cours...' : (
                <>
                  <Send size={20} /> Envoyer le diagnostic sur WhatsApp
                </>
              )}
            </Button>

            <p className="text-xs text-dark-300 text-center">
              En envoyant ce formulaire, vous serez redirigé vers WhatsApp pour finaliser
              l'envoi à {COMPANY.name}.
            </p>
          </form>
        </GlassCard>
      </div>
    </div>
  );
}
