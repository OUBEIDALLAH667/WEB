import { useEffect, useState } from 'react';
import { Package, ClipboardList, Wrench, Calendar, TrendingUp, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { GlassCard } from '../../components/ui/GlassCard';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { formatFCFA, formatDateTime } from '../../lib/config';

export function AdminDashboard() {
  const [stats, setStats] = useState({
    productCount: 0,
    orderCount: 0,
    pendingOrders: 0,
    newDiagnostics: 0,
    pendingAppointments: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [products, orders, diagnostics, appointments] = await Promise.all([
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*'),
        supabase.from('diagnostics').select('*').eq('status', 'new'),
        supabase.from('appointments').select('*').eq('status', 'pending'),
      ]);

      const allOrders = orders.data ?? [];
      const revenue = allOrders
        .filter((o: any) => o.status === 'paid' || o.status === 'completed')
        .reduce((sum: number, o: any) => sum + o.total, 0);

      setStats({
        productCount: products.count ?? 0,
        orderCount: allOrders.length,
        pendingOrders: allOrders.filter((o: any) => o.status === 'pending').length,
        newDiagnostics: diagnostics.data?.length ?? 0,
        pendingAppointments: appointments.data?.length ?? 0,
        totalRevenue: revenue,
      });

      setRecentOrders(allOrders.slice(0, 5));
      setLoading(false);
    })();
  }, []);

  if (loading) return <LoadingSpinner />;

  const statCards = [
    { label: 'Produits', value: stats.productCount, icon: Package, color: 'text-electric-300' },
    { label: 'Commandes', value: stats.orderCount, icon: ClipboardList, color: 'text-white' },
    { label: 'Revenus', value: formatFCFA(stats.totalRevenue), icon: TrendingUp, color: 'text-green-300' },
    { label: 'Diagnostics en attente', value: stats.newDiagnostics, icon: Wrench, color: 'text-yellow-300' },
    { label: 'RDV en attente', value: stats.pendingAppointments, icon: Calendar, color: 'text-electric-300' },
    { label: 'Commandes en attente', value: stats.pendingOrders, icon: Clock, color: 'text-yellow-300' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display font-bold text-2xl text-white">Tableau de bord</h2>
        <p className="text-dark-200 text-sm mt-1">Vue d'ensemble de l'activité</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, i) => (
          <GlassCard key={i} className="p-5">
            <div className="flex items-center justify-between mb-3">
              <stat.icon size={20} className={stat.color} />
            </div>
            <p className="font-display font-bold text-xl text-white">{stat.value}</p>
            <p className="text-xs text-dark-200 mt-1">{stat.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Recent orders */}
      <GlassCard className="p-6">
        <h3 className="font-display font-semibold text-lg text-white mb-4">Commandes récentes</h3>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-dark-200 py-4 text-center">Aucune commande pour le moment</p>
        ) : (
          <div className="space-y-3">
            {recentOrders.map((order: any) => (
              <div key={order.id} className="flex items-center justify-between p-3 rounded-lg glass-light">
                <div>
                  <p className="text-sm font-medium text-white">#{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-dark-300">{formatDateTime(order.created_at)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-white">{formatFCFA(order.total)}</span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    order.status === 'completed' ? 'bg-green-500/10 text-green-300' :
                    order.status === 'pending' ? 'bg-yellow-500/10 text-yellow-300' :
                    order.status === 'cancelled' ? 'bg-red-500/10 text-red-300' :
                    'bg-electric-500/10 text-electric-300'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  );
}
