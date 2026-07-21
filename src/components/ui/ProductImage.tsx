import { useState } from 'react';

interface ProductImageProps {
  src: string | null;
  emoji: string;
  alt: string;
  className?: string;
  emojiSize?: string;
  rounded?: string;
}

/**
 * Affiche une image produit avec fallback automatique vers un emoji
 * dans un cadre avec fond dégradé bleu/orange si l'image n'est pas disponible.
 */
export function ProductImage({
  src,
  emoji,
  alt,
  className = '',
  emojiSize = 'text-5xl',
  rounded = 'rounded-xl',
}: ProductImageProps) {
  const [errored, setErrored] = useState(false);
  const showImage = src && !errored;

  if (showImage) {
    return (
      <img
        src={src}
        alt={alt}
        onError={() => setErrored(true)}
        className={className}
      />
    );
  }

  // Fallback: emoji dans un cadre avec fond dégradé bleu → orange
  return (
    <div
      className={`flex items-center justify-center bg-gradient-to-br from-electric-500/15 via-dark-700/40 to-orange-500/15 ${rounded} ${className}`}
      role="img"
      aria-label={alt}
    >
      <span className={`${emojiSize} select-none drop-shadow-lg`}>{emoji}</span>
    </div>
  );
}
