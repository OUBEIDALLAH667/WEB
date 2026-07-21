# Images produits — AB.TECHNILOGIE

## Structure

Placez vos images de produits dans ce dossier. Chaque image doit:

- Être au format **300x300px** (carré)
- Être au format **.jpg** ou **.webp** (préférez webp pour un meilleur ratio qualité/taille)
- Être nommée selon le **slug du produit** (voir la table `products` en base de données)

## Convention de nommage

Le système recherche automatiquement les images dans cet ordre:

1. `image_url` en base de données (Supabase Storage ou URL externe)
2. `/images/products/{product-slug}.jpg` (fichier local dans ce dossier)
3. Fallback: emoji par catégorie (📡 routeur, 📱 smartphone, etc.)

## Où trouver le slug?

Le slug est généré automatiquement à partir du nom du produit. Exemples:

| Produit                              | Slug attendu                    |
|--------------------------------------|---------------------------------|
| Routeur WiFi 6 TP-Link Archer AX55   | routeur-wifi-6-tp-link-archer-ax55   |
| Samsung Galaxy A35 5G 128GB          | samsung-galaxy-a35-5g-128gb     |
| Switch Cisco SG250-24 24-Port Gigabit| switch-cisco-sg250-24-24-port-gigabit |

## Comment remplacer une image

1. Renommez votre image selon le slug du produit (ex: `routeur-wifi-6-tp-link-archer-ax55.jpg`)
2. Placez-la dans ce dossier `/public/images/products/`
3. L'image apparaîtra automatiquement, aucune modification de code nécessaire

## Liste actuelle des produits

### Routeurs
- routeur-wifi-6-tp-link-archer-ax55.jpg
- routeur-4g-lte-mikrotik-hap-ac2.jpg
- routeur-cisco-rv340-dual-wan.jpg

### Smartphones
- samsung-galaxy-a35-5g-128gb.jpg
- xiaomi-redmi-note-13-pro-256gb.jpg
- tecno-spark-20-pro-128gb.jpg
- iphone-13-128gb.jpg

### Switchs
- switch-cisco-sg250-24-24-port-gigabit.jpg
- switch-tp-link-tl-sg1024-24-port.jpg
- switch-netgear-gs108-8-port-gigabit.jpg

### Accessoires
- cable-rj45-cat6-5m.jpg
- adaptateur-usb-c-vers-hdmi.jpg
- disque-ssd-480gb-sata.jpg
- chargeur-usb-c-65w.jpg
- batterie-externe-20000mah.jpg
