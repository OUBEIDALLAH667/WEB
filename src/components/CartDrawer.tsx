import { useNavigate } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { formatFCFA, getProductImage } from '../lib/config';
import { GlassCard } from './ui/GlassCard';
import { ProductImage } from './ui/ProductImage';

export function CartDrawer() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, total, itemCount } = useCart();
  const navigate = useNavigate();

  if (!isCartOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-md z-[70] glass-strong shadow-2xl flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10">
          <div className="flex items-center gap-3">
            <ShoppingCart size={22} className="text-electric-400" />
            <div>
              <h3 className="font-display font-semibold text-white">Panier</h3>
              <p className="text-xs text-dark-200">{itemCount} article{itemCount > 1 ? 's' : ''}</p>
            </div>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={20} className="text-dark-100" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-20 h-20 rounded-full glass flex items-center justify-center mb-4">
                <ShoppingCart size={32} className="text-dark-300" />
              </div>
              <p className="text-dark-100 font-medium">Votre panier est vide</p>
              <p className="text-sm text-dark-300 mt-1">Ajoutez des produits ou services</p>
            </div>
          ) : (
            items.map(item => (
              <GlassCard key={item.id} className="p-4">
                <div className="flex gap-3">
                  {item.type === 'product' ? (
                    (() => { const img = getProductImage({ name: item.name, image_url: item.image_url }); return (
                      <ProductImage
                        src={img.src}
                        emoji={img.emoji}
                        alt={item.name}
                        className="w-16 h-16 object-cover"
                        emojiSize="text-2xl"
                      />
                    ); })()
                  ) : (
                    <div className="w-16 h-16 rounded-lg glass-light flex items-center justify-center shrink-0">
                      <span className="text-xs text-dark-300 font-medium">
                        Service
                      </span>
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-sm font-medium text-white truncate">{item.name}</h4>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 rounded hover:bg-red-500/20 transition-colors shrink-0"
                      >
                        <Trash2 size={14} className="text-red-400" />
                      </button>
                    </div>
                    <p className="text-xs text-dark-300 mt-0.5">
                      {item.type === 'product' ? 'Produit' : 'Service'}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg glass-light flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                          <Minus size={12} className="text-dark-100" />
                        </button>
                        <span className="text-sm text-white font-medium w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg glass-light flex items-center justify-center hover:bg-white/10 transition-colors"
                        >
                          <Plus size={12} className="text-dark-100" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold text-electric-300">
                        {formatFCFA(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-5 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-dark-200">Total</span>
              <span className="text-xl font-display font-bold gradient-text">{formatFCFA(total)}</span>
            </div>
            <button
              onClick={() => {
                setIsCartOpen(false);
                navigate('/checkout');
              }}
              className="w-full btn-electric text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2"
            >
              Passer commande <ArrowRight size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
