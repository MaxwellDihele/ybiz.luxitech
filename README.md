# LUXITECH — Next.js storefront starter

A responsive modern-premium storefront prototype for the LuxiTech South African technology retail brand.

## Included
- Responsive homepage and navigation
- Product category filtering and text search
- Product cards with demo content
- Client-side shopping bag with quantity controls
- Demo newsletter interaction
- Responsive mobile layout
- Brand styling: midnight, silver, pearl and electric blue

## Important prototype limitations
This is a **front-end starter**, not a production-ready store.
- Product catalogue and prices are sample data in `data/products.js`.
- Product images are remotely hosted Unsplash images.
- Cart state is held in browser memory and resets on refresh.
- Checkout is not connected.
- Yoco, Supabase, supplier feeds, order fulfilment, customer accounts, email and tracking are not implemented.
- Ratings and review counts are demonstration values and must be replaced with genuine data or removed before launch.
- Delivery, returns, warranty and product claims must be verified before publishing.

## Requirements
- Node.js 20.9 or later
- npm

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000.

## Build
```bash
npm run build
npm start
```

## Next implementation milestones
1. Replace sample products with verified supplier catalogue data.
2. Create Supabase schema, Row Level Security policies and admin roles.
3. Add persistent cart and customer accounts.
4. Implement server-side Yoco checkout session creation and verified webhooks.
5. Add order management, manual supplier fulfilment and shipment tracking.
6. Add transactional email, legal pages, SEO metadata and production monitoring.

## Brand direction
- Wordmark: LUXITECH.
- Positioning: affordable technology with a modern premium presentation.
- Slogan: Technology for Everyone.
- Palette: Midnight `#101114`, Charcoal `#25272C`, Silver `#C5C7CC`, Pearl `#F5F5F3`, Electric Blue `#2878E5`.
