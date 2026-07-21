// Configuration et constantes AB.TECHNILOGIE

// Numéro WhatsApp de l'entreprise (format international sans +)
export const WHATSAPP_NUMBER = '2279881819'; // À remplacer par le vrai numéro

export const COMPANY = {
  name: 'AB.TECHNILOGIE',
  city: 'Niamey',
  country: 'Niger',
  phone: '+227 98818219',
  email: 'contact@abtechnilogie.ne',
  address: 'Niamey, Niger',
}+{encoded}`;
}

// Emoji par défaut selon la catégorie de produit
const categoryEmojis: Record<string, string> = {
  'Routeurs': '📡',
  'Smartphones': '📱',
  'Switchs': '🔌',
  'Accessoires': '⚙️',
};

// Emoji par mot-clé dans le nom du produit (fallback plus précis)
const keywordEmojis: Record<string, string> = {
  'routeur': '📡',
  'modem': '📡',
  'smartphone': '📱',
  'iphone': '📱',
  'galaxy': '📱',
  'redmi': '📱',
  'spark': '📱',
  'switch': '🔌',
  'câble': '🔗',
  'cable': '🔗',
  'adaptateur': '🔁',
  'disque': '💾',
  'ssd': '💾',
  'hdd': '💾',
  'chargeur': '⚡',
  'batterie': '🔋',
  'caméra': '📷',
  'camera': '📷',
};

function slugify(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function getEmojiForProduct(product: { name: string; category?: { name?: string } | null }): string {
  // Try category first
  if (product.category?.name && categoryEmojis[product.category.name]) {
    return categoryEmojis[product.category.name];
  }
  // Try keyword matching
  const lowerName = product.name.toLowerCase();
  for (const [keyword, emoji] of Object.entries(keywordEmojis)) {
    if (lowerName.includes(keyword)) return emoji;
  }
  return '📦';
}

export interface ProductImageInfo {
  src: string | null;
  emoji: string;
}

export function getProductImage(product: {
  image_url?: string | null;
  name: string;
  category?: { name?: string } | null;
}): ProductImageInfo {
  // 1. Database image_url (Supabase Storage or external URL)
  if (product.image_url) {
    return { src: product.image_url, emoji: getEmojiForProduct(product) };
  }

  // 2. Local file in /public/images/products/{slug}.jpg
  //    We attempt to load it; the ProductImage component handles onError fallback
  const slug = slugify(product.name);
  return { src: `/images/products/${slug}.jpg`, emoji: getEmojiForProduct(product) };
}
