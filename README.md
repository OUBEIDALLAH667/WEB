# AB.TECHNILOGIE — Site e-commerce

Boutique en ligne pour matériel télécom et services de diagnostic à Niamey, Niger.

## Stack technique

- **Vite** + **React 18** + **TypeScript**
- **Tailwind CSS** (thème personnalisé bleu électrique / orange)
- **Supabase** (base de données PostgreSQL, authentification, storage)
- **React Router** pour la navigation
- **Lucide React** pour les icônes

## Fonctionnalités

- Catalogue de produits (routeurs, smartphones, switchs, accessoires)
- Fiches produits détaillées
- Panier d'achat avec drawer
- Page de checkout avec confirmation via WhatsApp
- Diagnostic de panne en ligne
- Prise de rendez-vous
- Espace client (commandes, rendez-vous, compte)
- Espace administrateur (produits, commandes, rendez-vous, diagnostics)

## Démarrage

```bash
npm install
npm run dev
```

## Scripts

| Commande            | Description                          |
|---------------------|--------------------------------------|
| `npm run dev`       | Lance le serveur de développement    |
| `npm run build`     | Build de production                  |
| `npm run typecheck` | Vérification des types TypeScript    |
| `npm run lint`      | Lint avec ESLint                     |
| `npm run preview`   | Prévisualisation du build            |

## Structure du projet

```
src/
├── components/          # Composants réutilisables
│   ├── ui/              # Composants UI de base (Button, GlassCard, Logo, ProductImage)
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── ProductCard.tsx
│   └── CartDrawer.tsx
├── context/            # Contextes React (Auth, Cart)
├── lib/                # Utilitaires (config, supabase)
├── pages/
│   ├── public/         # Pages publiques (Home, Catalogue, Produit, Services, Diagnostic)
│   ├── client/         # Espace client
│   ├── admin/          # Espace administrateur
│   └── auth/           # Connexion / inscription
└── types/              # Types TypeScript

public/
└── images/products/    # Images produits (remplaçables, voir README du dossier)
```

## Images produits

Les images produits sont stockées dans `/public/images/products/`.
Voir le [README du dossier](public/images/products/README.md) pour la convention de nommage.

Si aucune image n'est trouvée, un emoji par défaut s'affiche dans un cadre dégradé bleu/orange.

## Variables d'environnement

Les variables Supabase sont pré-configurées dans `.env` (non commité).
Ne jamais commité de secrets dans le dépôt.

## Licence

Projet privé — AB.TECHNILOGIE
