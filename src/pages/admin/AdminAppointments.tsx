import { useEffect, useState } from 'react';
import { Calendar, Phone, Clock, Trash2, CheckCircle, XCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Appointment, AppointmentStatus } from '../../types';
import { formatDate } from '../../lib/config';
import { GlassCard } from '../../components/ui/GlassCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const statuses: AppointmentStatus[] = ['pending', 'confirmed', 'completed', 'cancelled'];
const statusLabels: Record<string, string> = {
  pending: 'En attente', confirmed: 'Confirmé', completed: 'Terminé', cancelled: 'Annulé',
};
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
  confirmed: 'bg-electric-500/10 text-electric-300 border-electric-500/20',
  completed: 'bg-green-500/10 text-green-300 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-300 border-red-500/20',
};

export function AdminAppointments() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadAppointments(); }, []);

  async function loadAppointments() {
    const { data } = await supabase
      .from('appointments')
      .select('*, service:services(*)')
      .order('preferred_date', { ascending: false });
    setAppointments(data as Appointment[] ?? []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: AppointmentStatus) {
    await supabase.from('appointments').update({ status }).eq('id', id);
    loadAppointments();
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce rendez-vous?')) return;
    await supabase.from('appointments').delete().eq('id', id);
    loadAppointments();
  }

  if (loading) return <LoadingSpinner />;

  const filtered = filter === 'all' ? appointments : appointments.filter(a => a.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-white">Rendez-vous</h2>
        <p className="text-dark-200 text-sm mt-1">{appointments.length} rendez-vous</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === 'all' ? 'btn-electric text-white' : 'glass-light text-dark-100 hover:bg-white/10'}`}
        >
          Tous
        </button>
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === s ? 'btn-electric text-white' : 'glass-light text-dark-100 hover:bg-white/10'}`}
          >
            {statusLabels[s]}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Calendar size={40} className="text-dark-300 mx-auto mb-3" />
          <p className="text-dark-100">Aucun rendez-vous</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filtered.map(appt => (
            <GlassCard key={appt.id} className="p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="w-12 h-12 rounded-xl bg-electric-500/10 flex items-center justify-center shrink-0">
                    <Calendar size={22} className="text-electric-400" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium text-white">{appt.service?.name ?? 'Rendez-vous'}</h3>
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[appt.status]}`}>
                        {statusLabels[appt.status]}
                      </span>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-dark-300">
                      <span>{appt.customer_name}</span>
                      <span className="flex items-center gap-1"><Phone size={12} /> {appt.phone}</span>
                      <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(appt.preferred_date)}</span>
                      <span className="flex items-center gap-1"><Clock size={12} /> {appt.preferred_time}</span>
                    </div>
                    {appt.notes && (
                      <p className="text-xs text-dark-200 mt-2 bg-dark-900/30 rounded-lg p-2">{appt.notes}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {appt.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateStatus(appt.id, 'confirmed')}
                        className="p-2 rounded-lg bg-electric-500/20 hover:bg-electric-500/30 transition-colors"
                        title="Confirmer"
                      >
                        <CheckCircle size={16} className="text-electric-400" />
                      </button>
                      <button
                        onClick={() => updateStatus(appt.id, 'cancelled')}
                        className="p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                        title="Annuler"
                      >
                        <XCircle size={16} className="text-red-400" />
                      </button>
                    </>
                  )}
                  {appt.status === 'confirmed' && (
                    <button
                      onClick={() => updateStatus(appt.id, 'completed')}
                      className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors"
                      title="Marquer comme terminé"
                    >
                      <CheckCircle size={16} className="text-green-400" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(appt.id)}
                    className="p-2 rounded-lg glass-light hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
