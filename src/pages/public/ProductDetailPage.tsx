import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Check, Truck, Shield } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatFCFA, getProductImage } from '../../lib/config';
import { GlassCard } from '../../components/ui/GlassCard';
import { Button } from '../../components/ui/Button';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { ProductImage } from '../../components/ui/ProductImage';
import { useCart } from '../../context/CartContext';
import type { Product } from '../../types';

export function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadProduct() {
      if (!id) return;
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*, category(*)')
        .eq('id', id)
        .single();
      setProduct(data as Product | null);
      setLoading(false);
    }
    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-20">
        <LoadingSpinner size={40} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 px-4 max-w-4xl mx-auto text-center">
        <h1 className="font-display text-3xl font-bold text-white mb-4">Produit introuvable</h1>
        <Link to="/catalogue" className="btn-electric text-white font-semibold px-6 py-3 rounded-xl inline-flex items-center gap-2">
          <ArrowLeft size={18} /> Retour au catalogue
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart({
      id: product.id,
      type: 'product',
      name: product.name,
      price: product.price,
      image_url: getProductImage(product).src ?? undefined,
      reference_id: product.id,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="pt-24 pb-20 px-4 max-w-6xl mx-auto relative">
      <div className="halo-blue top-20 left-10 w-72 h-72" />
      <div className="halo-orange bottom-20 right-10 w-72 h-72" />

      <Link to="/catalogue" className="inline-flex items-center gap-2 text-dark-100 hover:text-white transition-colors mb-8 relative">
        <ArrowLeft size={18} /> Retour au catalogue
      </Link>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 relative">
        {/* Image */}
        <GlassCard className="aspect-square overflow-hidden flex items-center justify-center">
          {(() => { const img = getProductImage(product); return (
            <ProductImage
              src={img.src}
              emoji={img.emoji}
              alt={product.name}
              className="w-full h-full object-cover"
              rounded="rounded-none"
            />
          ); })()}
        </GlassCard>

        {/* Details */}
        <div className="flex flex-col">
          {product.category && (
            <span className="text-sm text-electric-400 font-medium mb-2 uppercase tracking-wider">
              {product.category.name}
            </span>
          )}
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mb-3">
            {product.name}
          </h1>
          <p className="text-lg text-dark-100 mb-1">Marque: <span className="text-white">{product.brand}</span></p>

          <div className="my-6">
            <span className="font-display text-4xl font-bold gradient-text-bo">
              {formatFCFA(product.price)}
            </span>
          </div>

          <p className="text-dark-100 leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="flex items-center gap-3 mb-6">
            {product.stock > 0 ? (
              <span className="px-3 py-1 text-sm font-medium rounded-full glass-strong text-green-300 border border-green-500/20">
                En stock ({product.stock})
              </span>
            ) : (
              <span className="px-3 py-1 text-sm font-medium rounded-full glass-strong text-red-300 border border-red-500/20">
                Rupture de stock
              </span>
            )}
          </div>

          <Button
            variant="orange"
            size="lg"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="w-full md:w-auto"
          >
            {added ? (
              <><Check size={20} /> Ajouté au panier</>
            ) : (
              <><ShoppingCart size={20} /> Ajouter au panier</>
            )}
          </Button>

          {/* Reassurance */}
          <div className="grid grid-cols-2 gap-4 mt-8">
            <div className="flex items-center gap-2 text-sm text-dark-100">
              <Truck size={18} className="text-electric-400" />
              Livraison à Niamey
            </div>
            <div className="flex items-center gap-2 text-sm text-dark-100">
              <Shield size={18} className="text-orange-400" />
              Garantie 6 mois
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
