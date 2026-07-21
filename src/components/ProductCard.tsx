import { Link } from 'react-router-dom';
import { ShoppingCart, Eye } from 'lucide-react';
import type { Product } from '../types';
import { formatFCFA, getProductImage } from '../lib/config';
import { useCart } from '../context/CartContext';
import { GlassCard } from './ui/GlassCard';
import { ProductImage } from './ui/ProductImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const isNew = (Date.now() - new Date(product.created_at).getTime()) < 7 * 24 * 60 * 60 * 1000;

  return (
    <GlassCard hover className="overflow-hidden group flex flex-col">
      {/* Image */}
      <Link to={`/produit/${product.id}`} className="relative aspect-square overflow-hidden bg-dark-800 block">
        {(() => { const img = getProductImage(product); return (
          <ProductImage
            src={img.src}
            emoji={img.emoji}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            rounded="rounded-none"
          />
        ); })()}
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {isNew && (
            <span className="px-2.5 py-1 text-xs font-bold rounded-full bg-orange-500 text-white shadow-lg" style={{ boxShadow: '0 2px 12px rgba(255, 107, 0, 0.4)' }}>
              Nouveau
            </span>
          )}
          {product.stock > 0 ? (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full glass-strong text-green-300 border border-green-500/20">
              En stock
            </span>
          ) : (
            <span className="px-2.5 py-1 text-xs font-medium rounded-full glass-strong text-red-300 border border-red-500/20">
              Rupture
            </span>
          )}
        </div>
        {/* Quick view */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="glass-strong px-4 py-2 rounded-lg text-sm text-white flex items-center gap-2">
            <Eye size={16} /> Voir
          </span>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-electric-300 font-medium uppercase tracking-wider">{product.brand}</p>
        <Link to={`/produit/${product.id}`}>
          <h3 className="font-medium text-white mt-1 line-clamp-2 hover:text-electric-300 transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="mt-auto pt-3 flex items-center justify-between gap-2">
          <span className="font-display font-bold text-lg text-white">{formatFCFA(product.price)}</span>
          <button
            disabled={product.stock === 0}
            onClick={() => addToCart({
              id: product.id,
              type: 'product',
              name: product.name,
              price: product.price,
              image_url: getProductImage(product).src ?? undefined,
              reference_id: product.id,
            })}
            className="p-2.5 rounded-lg btn-orange text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            aria-label="Ajouter au panier"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </GlassCard>
  );
}
