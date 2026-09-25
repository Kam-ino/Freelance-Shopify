# Enzo — Shopify theme for Enzo Scents

Online Store 2.0 theme. Layout follows nishane.com; branding (black, gold, magnolia ivory, the bottle label's hairline frame) comes from Enzo's packaging.

## Install
Connect this branch via **Online Store → Themes → Add theme → Connect from GitHub**, or zip the repo root and upload it.

## Store setup
1. **Menus:** `main-menu` (header, dropdowns from nested links) and `footer`.
2. **Product metafields** (Settings → Custom data → Products, namespace `custom`):

   | Key | Type | Used for |
   |---|---|---|
   | `subtitle` | Single line text | Line under the title on cards and product pages, e.g. "Extrait de Parfum". Falls back to the product type |
   | `tagline` | Single line text | Line under the product title. Set the concentration here per product, e.g. "30% fragrance oil · natural spray" |
   | `top_notes`, `heart_notes`, `base_notes` | Single line text (or list) | Fragrance notes on the product page and in the Scent spotlight section |
3. **Homepage:** in the theme editor, pick a collection for *Best sellers*, a product for *Scent spotlight*, and collections for *Featured collections*. Upload a hero image of at least 2400px. The bundled sample photo is 900px and only a placeholder.
4. **Theme settings → Cart:** set the free-shipping threshold (default 150, in shop currency).

## Not included
Collection filters, predictive search, a language/currency selector and classic-account address management. New customer accounts (Shopify's default) don't need the address templates.
