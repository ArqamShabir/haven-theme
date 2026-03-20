

## Plan: Convert to Standalone Showcase Site with Admin Panel

### What Changes

The site will be disconnected from Shopify entirely. Products will be stored locally (localStorage via Zustand). An admin panel will let you manage products, site settings, and content. "Add to Cart" becomes "Contact to Buy" (links to contact page with product pre-filled). "Buy Now" is removed.

---

### 1. Local Product Store (`src/stores/productStore.ts`)
- Zustand store with `persist` (localStorage) holding all products
- Same data shape as current `ShopifyProduct` interface for compatibility
- CRUD operations: `addProduct`, `updateProduct`, `deleteProduct`
- Seed with the existing Artisan Ceramic Vase as default data
- Generate handles from titles automatically

### 2. Site Settings Store (`src/stores/settingsStore.ts`)
- Store name, announcement bar text, contact email, social links, hero content
- Color theme preferences (accent color)
- Persisted to localStorage

### 3. Rewrite Data Layer
- **Delete**: `src/lib/shopify.ts` (all Shopify API code)
- **Delete**: `src/stores/cartStore.ts`, `src/hooks/useCartSync.ts`
- **Rewrite**: `src/hooks/useProducts.ts` to read from `productStore` instead of Shopify API
- **Remove**: `CartDrawer.tsx` from Header, remove cart icon
- **Remove**: All cart-related imports across components

### 4. "Contact to Buy" Conversion
- **ProductInfo.tsx**: Replace "Add to cart" button with "Contact to Buy" linking to `/contact?product={handle}`; remove "Buy it now" button entirely
- **StickyATC.tsx**: Change button to "Enquire Now" linking to contact page
- **ProductCard.tsx**: Replace "Quick add" hover overlay with "View Details" or remove it
- **ContactPage.tsx**: Read `?product=` query param, pre-fill subject with product name

### 5. Admin Panel (`/admin`)
- **Admin Layout** (`src/pages/admin/AdminLayout.tsx`): Sidebar with nav (Dashboard, Products, Settings), simple password gate (stored in settings store)
- **Dashboard** (`src/pages/admin/AdminDashboard.tsx`): Overview — product count, quick links
- **Products** (`src/pages/admin/AdminProducts.tsx`): Table of all products with edit/delete; "Add Product" button
- **Product Form** (`src/pages/admin/AdminProductForm.tsx`): Title, description, handle, price, images (URL input), variants (name + values), options
- **Settings** (`src/pages/admin/AdminSettings.tsx`): Edit store name, announcement text, contact info, hero content
- Routes added to `App.tsx`

### 6. Cleanup
- Remove `@tanstack/react-query` dependency from product-related code (can keep for other uses or remove entirely)
- Remove Shopify-related search overlay functionality
- Update `SearchOverlay.tsx` to search local product store
- Clean up Header to remove cart, keep search

---

### Technical Details

- **No backend needed** — all data in localStorage via Zustand `persist`
- **Admin auth**: Simple password check (configurable in settings), stored in localStorage — suitable for a showcase/demo site
- **Image handling**: Admin enters image URLs (external hosting like Unsplash, Imgur, etc.)
- **~15 files modified, ~6 new files created**

