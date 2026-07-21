import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Check, Lock, CreditCard, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';
import { formatFCFA, buildWhatsAppUrl, getProductImage } from '../lib/config';
import { GlassCard } from '../components/ui/GlassCard';
import { Button } from '../components/ui/Button';
import { ProductImage } from '../components/ui/ProductImage';

export function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { profile } = useAuth();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!profile) {
      navigate('/login?redirect=/checkout');
      return;
    }

    if (items.length === 0) {
      setError('Votre panier est vide.');
      return;
    }

    setLoading(true);

    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: profile.id,
        total,
        status: 'pending',
        shipping_address: shippingAddress,
        notes,
      })
      .select()
      .single();

    if (orderError) {
      setError('Erreur lors de la création de la commande: ' + orderError.message);
      setLoading(false);
      return;
    }

    // Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.type === 'product' ? item.reference_id : null,
      service_id: item.type === 'service' ? item.reference_id : null,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      item_type: item.type,
    }));

    const { error: itemsError } = await supabase.from('order_items').insert(orderItems);

    if (itemsError) {
      setError('Erreur lors de l\'ajout des articles: ' + itemsError.message);
      setLoading(false);
      return;
    }

    // Build WhatsApp confirmation message
    const message = `*Nouvelle commande - AB.TECHNILOGIE*\n\n` +
      `Client: ${profile.full_name}\n` +
      `Téléphone: ${profile.phone}\n` +
      `Commande #${order.id.slice(0, 8)}\n\n` +
      `*Articles:*\n` +
      items.map(i => `• ${i.quantity}x ${i.name} - ${formatFCFA(i.price * i.quantity)}`).join('\n') +
      `\n\n*Total: ${formatFCFA(total)}*\n` +
      (shippingAddress ? `Livraison: ${shippingAddress}\n` : '') +
      (notes ? `Notes: ${notes}\n` : '') +
      `\nPaiement: En attente (Stripe)`;

    clearCart();
    setSuccess(true);
    setLoading(false);

    // Open WhatsApp
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
            <h2 className="font-display font-bold text-2xl text-white">Commande enregistrée!</h2>
            <p className="text-dark-200 mt-3">
              Votre commande a été créée avec succès. Vous allez être redirigé vers WhatsApp
              pour confirmer avec notre équipe.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Link to="/compte/commandes">
                <Button variant="secondary">Voir mes commandes</Button>
              </Link>
              <Link to="/">
                <Button>Retour à l'accueil</Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-mesh pt-24 lg:pt-28 pb-16">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <GlassCard className="p-12 text-center">
            <ShoppingCart size={48} className="text-dark-300 mx-auto mb-4" />
            <h2 className="font-display font-semibold text-xl text-white">Votre panier est vide</h2>
            <p className="text-dark-200 mt-2">Ajoutez des produits ou services avant de commander.</p>
            <Link to="/catalogue" className="mt-6 inline-flex btn-electric text-white px-6 py-3 rounded-xl font-semibold">
              Voir le catalogue
            </Link>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-mesh pt-24 lg:pt-28 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-dark-200 hover:text-white transition-colors mb-6"
        >
          <ArrowLeft size={18} /> Retour
        </button>

        <h1 className="font-display font-bold text-3xl text-white mb-8">Finaliser la commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form */}
          <div className="lg:col-span-2 space-y-6">
            {!profile && (
              <GlassCard className="p-5 border border-electric-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Lock size={20} className="text-electric-400" />
                    <div>
                      <p className="text-sm font-medium text-white">Connexion requise</p>
                      <p className="text-xs text-dark-200">Connectez-vous pour commander</p>
                    </div>
                  </div>
                  <Link to="/login?redirect=/checkout">
                    <Button size="sm">Se connecter</Button>
                  </Link>
                </div>
              </GlassCard>
            )}

            <GlassCard className="p-6">
              <h2 className="font-display font-semibold text-lg text-white mb-4">Informations de livraison</h2>
              <div className="space-y-4">
                {profile && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-dark-200 mb-1">Nom</label>
                      <p className="text-sm text-white">{profile.full_name}</p>
                    </div>
                    <div>
                      <label className="block text-xs text-dark-200 mb-1">Téléphone</label>
                      <p className="text-sm text-white">{profile.phone || '—'}</p>
                    </div>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-dark-100 mb-2">Adresse de livraison (Niamey)</label>
                  <textarea
                    rows={3}
                    value={shippingAddress}
                    onChange={e => setShippingAddress(e.target.value)}
                    placeholder="Quartier, rue, point de repère..."
                    className="input-glass w-full px-4 py-3 rounded-xl text-sm text-white resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-100 mb-2">Notes (optionnel)</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Instructions particulières..."
                    className="input-glass w-full px-4 py-3 rounded-xl text-sm text-white resize-none"
                  />
                </div>
              </div>
            </GlassCard>

            {/* Payment notice */}
            <GlassCard className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-electric-500/10 flex items-center justify-center shrink-0">
                  <CreditCard size={24} className="text-electric-400" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-white">Paiement sécurisé</h3>
                  <p className="text-sm text-dark-200 mt-1">
                    Le paiement en ligne via Stripe sera disponible prochainement. En attendant,
                    votre commande sera confirmée via WhatsApp et le paiement se fera à la livraison
                    ou par transfert d'argent.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <GlassCard className="p-6 sticky top-24">
              <h2 className="font-display font-semibold text-lg text-white mb-4">Récapitulatif</h2>

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map(item => (
                  <div key={item.id} className="flex items-start gap-3">
                    {item.type === 'product' ? (
                      (() => { const img = getProductImage({ name: item.name, image_url: item.image_url }); return (
                        <ProductImage
                          src={img.src}
                          emoji={img.emoji}
                          alt={item.name}
                          className="w-12 h-12 object-cover shrink-0"
                          emojiSize="text-lg"
                        />
                      ); })()
                    ) : (
                      <div className="w-12 h-12 rounded-lg glass-light flex items-center justify-center shrink-0">
                        <span className="text-[10px] text-dark-300">S</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white truncate">{item.name}</p>
                      <p className="text-xs text-dark-300">{item.quantity}x {formatFCFA(item.price)}</p>
                    </div>
                    <span className="text-sm font-medium text-white shrink-0">
                      {formatFCFA(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-dark-200">Sous-total</span>
                  <span className="text-white">{formatFCFA(total)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-dark-200">Livraison</span>
                  <span className="text-green-300">À convenir</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-white/10">
                  <span className="font-display font-semibold text-white">Total</span>
                  <span className="font-display font-bold text-lg gradient-text">{formatFCFA(total)}</span>
                </div>
              </div>

              {error && (
                <div className="mt-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-300">
                  {error}
                </div>
              )}

              <Button
                size="lg"
                disabled={loading || !profile}
                onClick={handleCheckout}
                variant="orange"
                className="w-full mt-4"
              >
                {loading ? 'Traitement...' : (
                  <>
                    <MessageCircle size={18} /> Confirmer via WhatsApp
                  </>
                )}
              </Button>

              {!profile && (
                <p className="text-xs text-dark-300 text-center mt-3">
                  Connectez-vous pour finaliser
                </p>
              )}
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}
