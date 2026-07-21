import { useEffect, useState } from 'react';
import { Package, Clock, CheckCircle, XCircle, Truck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';
import type { Order } from '../../types';
import { formatFCFA, formatDateTime } from '../../lib/config';
import { GlassCard } from '../../components/ui/GlassCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';

const statusConfig = {
  pending: { label: 'En attente', icon: Clock, color: 'text-yellow-300', bg: 'bg-yellow-500/10', border: 'border-yellow-500/20' },
  paid: { label: 'Payée', icon: CheckCircle, color: 'text-green-300', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  processing: { label: 'En traitement', icon: Truck, color: 'text-electric-300', bg: 'bg-electric-500/10', border: 'border-electric-500/20' },
  completed: { label: 'Terminée', icon: CheckCircle, color: 'text-green-300', bg: 'bg-green-500/10', border: 'border-green-500/20' },
  cancelled: { label: 'Annulée', icon: XCircle, color: 'text-red-300', bg: 'bg-red-500/10', border: 'border-red-500/20' },
};

export function OrdersPage() {
  const { profile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!profile) return;
    (async () => {
      const { data } = await supabase
        .from('orders')
        .select('*, order_items(*)')
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });
      setOrders(data as Order[] ?? []);
      setLoading(false);
    })();
  }, [profile]);

  if (loading) return <div className="min-h-screen bg-mesh pt-24"><LoadingSpinner /></div>;

  return (
    <div className="min-h-screen bg-mesh pt-24 lg:pt-28 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display font-bold text-3xl text-white mb-2">Mes commandes</h1>
        <p className="text-dark-200 mb-8">{orders.length} commande{orders.length > 1 ? 's' : ''}</p>

        {orders.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <Package size={48} className="text-dark-300 mx-auto mb-4" />
            <p className="text-dark-100 font-medium">Aucune commande pour le moment</p>
            <p className="text-sm text-dark-300 mt-1">Vos commandes apparaîtront ici</p>
          </GlassCard>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const status = statusConfig[order.status];
              const StatusIcon = status.icon;
              return (
                <GlassCard key={order.id} className="p-5">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-white">Commande #{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-dark-300 mt-0.5">{formatDateTime(order.created_at)}</p>
                    </div>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${status.bg} ${status.color} border ${status.border}`}>
                      <StatusIcon size={14} /> {status.label}
                    </span>
                  </div>

                  <div className="space-y-2">
                    {order.order_items?.map(item => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-dark-100">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-white">{formatFCFA(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-sm text-dark-200">Total</span>
                    <span className="font-display font-bold text-lg gradient-text">{formatFCFA(order.total)}</span>
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
