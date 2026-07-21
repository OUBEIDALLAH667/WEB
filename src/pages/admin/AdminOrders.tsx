import { useEffect, useState } from 'react';
import { ClipboardList, X, Eye } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Order } from '../../types';
import { formatFCFA, formatDateTime } from '../../lib/config';
import { GlassCard } from '../../components/ui/GlassCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const statuses = ['pending', 'paid', 'processing', 'completed', 'cancelled'];
const statusLabels: Record<string, string> = {
  pending: 'En attente', paid: 'Payée', processing: 'En traitement',
  completed: 'Terminée', cancelled: 'Annulée',
};
const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20',
  paid: 'bg-green-500/10 text-green-300 border-green-500/20',
  processing: 'bg-electric-500/10 text-electric-300 border-electric-500/20',
  completed: 'bg-green-500/10 text-green-300 border-green-500/20',
  cancelled: 'bg-red-500/10 text-red-300 border-red-500/20',
};

export function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    loadOrders();
  }, []);

  async function loadOrders() {
    const { data } = await supabase
      .from('orders')
      .select('*, order_items(*)')
      .order('created_at', { ascending: false });
    setOrders(data as Order[] ?? []);
    setLoading(false);
  }

  async function updateStatus(orderId: string, status: string) {
    await supabase.from('orders').update({ status }).eq('id', orderId);
    loadOrders();
    if (selected?.id === orderId) {
      setSelected({ ...selected, status: status as Order['status'] });
    }
  }

  if (loading) return <LoadingSpinner />;

  const filtered = filterStatus === 'all' ? orders : orders.filter(o => o.status === filterStatus);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-white">Commandes</h2>
        <p className="text-dark-200 text-sm mt-1">{orders.length} commande{orders.length > 1 ? 's' : ''}</p>
      </div>

      {/* Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setFilterStatus('all')}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === 'all' ? 'btn-electric text-white' : 'glass-light text-dark-100 hover:bg-white/10'}`}
        >
          Toutes
        </button>
        {statuses.map(s => (
          <button
            key={s}
            onClick={() => setFilterStatus(s)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filterStatus === s ? 'btn-electric text-white' : 'glass-light text-dark-100 hover:bg-white/10'}`}
          >
            {statusLabels[s]}
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <ClipboardList size={40} className="text-dark-300 mx-auto mb-3" />
          <p className="text-dark-100">Aucune commande</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {filtered.map(order => (
            <GlassCard key={order.id} className="p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-3">
                    <p className="text-sm font-medium text-white">#{order.id.slice(0, 8)}</p>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                      {statusLabels[order.status]}
                    </span>
                  </div>
                  <p className="text-xs text-dark-300 mt-1">
                    {formatDateTime(order.created_at)} • {order.order_items?.length ?? 0} article(s)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-display font-bold text-white">{formatFCFA(order.total)}</span>
                  <button
                    onClick={() => setSelected(order)}
                    className="p-2 rounded-lg glass-light hover:bg-white/10 transition-colors"
                  >
                    <Eye size={16} className="text-dark-100" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]" onClick={() => setSelected(null)} />
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 pointer-events-none">
            <GlassCard className="w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 pointer-events-auto animate-scale-in">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-display font-semibold text-lg text-white">Commande #{selected.id.slice(0, 8)}</h3>
                  <p className="text-xs text-dark-300 mt-0.5">{formatDateTime(selected.created_at)}</p>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
                  <X size={20} className="text-dark-100" />
                </button>
              </div>

              {/* Status changer */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-dark-100 mb-2">Statut</label>
                <select
                  value={selected.status}
                  onChange={e => updateStatus(selected.id, e.target.value)}
                  className="input-glass w-full px-4 py-2.5 rounded-xl text-sm text-white"
                >
                  {statuses.map(s => <option key={s} value={s}>{statusLabels[s]}</option>)}
                </select>
              </div>

              {/* Items */}
              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-medium text-dark-100 mb-2">Articles</h4>
                {selected.order_items?.map(item => (
                  <div key={item.id} className="flex justify-between p-3 rounded-lg glass-light">
                    <div>
                      <p className="text-sm text-white">{item.name}</p>
                      <p className="text-xs text-dark-300">{item.quantity}x • {item.item_type === 'product' ? 'Produit' : 'Service'}</p>
                    </div>
                    <span className="text-sm font-medium text-white">{formatFCFA(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>

              {/* Address + notes */}
              {selected.shipping_address && (
                <div className="mb-3">
                  <p className="text-xs text-dark-300 mb-1">Adresse</p>
                  <p className="text-sm text-white">{selected.shipping_address}</p>
                </div>
              )}
              {selected.notes && (
                <div className="mb-4">
                  <p className="text-xs text-dark-300 mb-1">Notes</p>
                  <p className="text-sm text-white">{selected.notes}</p>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex justify-between items-center">
                <span className="text-sm text-dark-200">Total</span>
                <span className="font-display font-bold text-lg gradient-text">{formatFCFA(selected.total)}</span>
              </div>
            </GlassCard>
          </div>
        </>
      )}
    </div>
  );
}
