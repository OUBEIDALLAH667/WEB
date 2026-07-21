import { useEffect, useState } from 'react';
import { Calendar, Clock, Plus, CalendarPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Appointment, Service } from '../../types';
import { formatDate } from '../../lib/config';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const statusConfig = {
  pending: { label: 'En attente', color: 'text-yellow-300', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  confirmed: { label: 'Confirmé', color: 'text-electric-300', bg: 'bg-electric-500/10', border: 'border-electric-500/20' },
  completed: { label: 'Terminé', color: 'text-green-300', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  cancelled: { label: 'Annulé', color: 'text-red-300', bg: 'bg-red-500/10', border: 'border-red-500/20' },
};

const timeSlots = ['08:00', '09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00'];

export function AppointmentsPage() {
  const { profile } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    customer_name: '',
    phone: '',
    service_id: '',
    preferred_date: '',
    preferred_time: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: servs } = await supabase.from('services').select('*').eq('is_active', true);
      setServices(servs as Service[] ?? []);

      if (profile) {
        const { data: appts } = await supabase
          .from('appointments')
          .select('*, service:services(*)')
          .eq('user_id', profile.id)
          .order('preferred_date', { ascending: false });
        setAppointments(appts as Appointment[] ?? []);
      }
      setLoading(false);
    })();
  }, [profile]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;
    setSubmitting(true);

    await supabase.from('appointments').insert({
      user_id: profile.id,
      service_id: form.service_id || null,
      customer_name: form.customer_name || profile.full_name,
      phone: form.phone || profile.phone,
      preferred_date: form.preferred_date,
      preferred_time: form.preferred_time,
      notes: form.notes,
    });

    // Refresh
    const { data: appts } = await supabase
      .from('appointments')
      .select('*, service:services(*)')
      .eq('user_id', profile.id)
      .order('preferred_date', { ascending: false });
    setAppointments(appts as Appointment[] ?? []);

    setShowForm(false);
    setSubmitting(false);
    setForm({ customer_name: '', phone: '', service_id: '', preferred_date: '', preferred_time: '', notes: '' });
  }

  if (loading) return <div className="min-h-screen bg-mesh pt-24"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-mesh pt-24 lg:pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display font-bold text-3xl text-white">Mes rendez-vous</h1>
            <p className="text-dark-200 mt-2">{appointments.length} rendez-vous</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus size={18} /> Nouveau
          </Button>
        </div>

        {showForm && (
          <GlassCard className="p-6 mb-6 animate-slide-up">
            <h2 className="font-display font-semibold text-lg text-white mb-4">Prendre un rendez-vous</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-100 mb-2">Service</label>
                  <select
                    value={form.service_id}
                    onChange={e => setForm(p => ({ ...p, service_id: e.target.value }))}
                    className="input-glass w-full px-4 py-3 rounded-xl text-sm text-white"
                  >
                    <option value="">Sélectionner un service</option>
                    {services.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-100 mb-2">Date</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={form.preferred_date}
                    onChange={e => setForm(p => ({ ...p, preferred_date: e.target.value }))}
                    className="input-glass w-full px-4 py-3 rounded-xl text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-100 mb-2">Créneau horaire</label>
                <div className="flex flex-wrap gap-2">
                  {timeSlots.map(slot => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setForm(p => ({ ...p, preferred_time: slot }))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${form.preferred_time === slot ? 'btn-electric text-white' : 'glass-light text-dark-100 hover:bg-white/10'}`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-100 mb-2">Notes (optionnel)</label>
                <textarea
                  rows={2}
                  value={form.notes}
                  onChange={e => setForm(p => ({ ...p, notes: e.target.value }))}
                  placeholder="Décrivez le problème..."
                  className="input-glass w-full px-4 py-3 rounded-xl text-sm text-white resize-none"
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={submitting || !form.preferred_date || !form.preferred_time}>
                  <CalendarPlus size={18} /> {submitting ? 'Réservation...' : 'Réserver'}
                </Button>
                <Button variant="secondary" onClick={() => setShowForm(false)}>Annuler</Button>
              </div>
            </form>
          </GlassCard>
        )}

        {appointments.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Calendar size={48} className="text-dark-300 mx-auto mb-4" />
            <p className="text-dark-100 font-medium">Aucun rendez-vous</p>
            <p className="text-sm text-dark-300 mt-1">Réservez un créneau pour faire réparer votre appareil</p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {appointments.map(appt => {
              const status = statusConfig[appt.status];
              return (
                <GlassCard key={appt.id} className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-electric-500/10 flex items-center justify-center shrink-0">
                        <Calendar size={22} className="text-electric-400" />
                      </div>
                      <div>
                        <h3 className="font-medium text-white">
                          {appt.service?.name ?? 'Rendez-vous'}
                        </h3>
                        <div className="flex items-center gap-3 mt-1 text-sm text-dark-200">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} /> {formatDate(appt.preferred_date)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock size={14} /> {appt.preferred_time}
                          </span>
                        </div>
                        {appt.notes && (
                          <p className="text-xs text-dark-300 mt-2">{appt.notes}</p>
                        )}
                      </div>
                    </div>
                    <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium ${status.bg} ${status.color} border ${status.border}`}>
                      {status.label}
                    </span>
                  </div>
                </GlassCard>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
