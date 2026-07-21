import { useEffect, useState } from 'react';
import { Wrench, Phone, Clock, MessageCircle, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Diagnostic, DiagnosticStatus } from '../../types';
import { formatDateTime, buildWhatsAppUrl } from '../../lib/config';
import { GlassCard } from '../../components/ui/GlassCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const statuses: DiagnosticStatus[] = ['new', 'contacted', 'resolved'];
const statusLabels: Record<string, string> = { new: 'Nouveau', contacted: 'Contacté', resolved: 'Résolu' };
const statusColors: Record<string, string> = {
  new: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
  contacted: 'bg-electric-500/10 text-electric-300 border-electric-500/20',
  resolved: 'bg-green-500/10 text-green-300 border-green-500/20',
};

export function AdminDiagnostics() {
  const [diagnostics, setDiagnostics] = useState<Diagnostic[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => { loadDiagnostics(); }, []);

  async function loadDiagnostics() {
    const { data } = await supabase.from('diagnostics').select('*').order('created_at', { ascending: false });
    setDiagnostics(data as Diagnostic[] ?? []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: DiagnosticStatus) {
    await supabase.from('diagnostics').update({ status }).eq('id', id);
    loadDiagnostics();
  }

  async function handleDelete(id: string) {
    if (!confirm('Supprimer ce diagnostic?')) return;
    await supabase.from('diagnostics').delete().eq('id', id);
    loadDiagnostics();
  }

  if (loading) return <LoadingSpinner />;

  const filtered = filter === 'all' ? diagnostics : diagnostics.filter(d => d.status === filter);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-white">Diagnostics</h2>
        <p className="text-dark-200 text-sm mt-1">{diagnostics.length} demande{diagnostics.length > 1 ? 's' : ''}</p>
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
          <Wrench size={40} className="text-dark-300 mx-auto mb-3" />
          <p className="text-dark-100">Aucun diagnostic</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filtered.map(diag => (
            <GlassCard key={diag.id} className="p-5">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-medium text-white">{diag.customer_name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[diag.status]}`}>
                      {statusLabels[diag.status]}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-dark-300">
                    <span className="flex items-center gap-1.5">
                      <Phone size={12} /> {diag.phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Wrench size={12} /> {diag.device_type}
                    </span>
                    {diag.brand && <span>Marque: {diag.brand}</span>}
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} /> {formatDateTime(diag.created_at)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <a
                    href={buildWhatsAppUrl(`Bonjour ${diag.customer_name}, concernant votre diagnostic pour votre ${diag.device_type}...`)}
                    target="_blank"
                    className="p-2 rounded-lg bg-green-500/20 hover:bg-green-500/30 transition-colors"
                  >
                    <MessageCircle size={16} className="text-green-400" />
                  </a>
                  <button
                    onClick={() => handleDelete(diag.id)}
                    className="p-2 rounded-lg glass-light hover:bg-red-500/20 transition-colors"
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </button>
                </div>
              </div>

              <p className="text-sm text-dark-100 bg-dark-900/30 rounded-lg p-3 mt-2">
                {diag.problem_description}
              </p>

              {/* Status changer */}
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-dark-300">Changer le statut:</span>
                <select
                  value={diag.status}
                  onChange={e => updateStatus(diag.id, e.target.value as DiagnosticStatus)}
                  className="input-glass px-3 py-1.5 rounded-lg text-xs text-white"
                >
                  {statuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
                </select>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
