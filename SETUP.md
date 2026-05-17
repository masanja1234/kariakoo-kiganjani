# Kariakoo Kiganjani — Setup & Testing Guide

## Quick Start

```bash
npm install
cp .env.example .env
# Fill in your real values in .env
npx prisma generate
npx prisma db push
npm run db:seed
npm run dev
```

Open http://localhost:3000

---

## 1. Environment Setup

Copy `.env.example` to `.env` and fill in each value:

### Clerk
1. Create a project at [clerk.com](https://clerk.com)
2. Copy **Publishable Key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
3. Copy **Secret Key** → `CLERK_SECRET_KEY`

### Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. **Project Settings → API**:
   - Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon / public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Copy **service_role** key → `SUPABASE_SERVICE_ROLE_KEY`
3. **Project Settings → Database → Connection string**:
   - **Transaction mode** (port 6543) → `DATABASE_URL` (append `?pgbouncer=true`)
   - **Session mode** (port 5432) → `DIRECT_URL`

### App URL
- Local: `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- Production: `NEXT_PUBLIC_APP_URL=https://yourdomain.com`

---

## 2. Supabase Storage Buckets

In Supabase Dashboard → **Storage**, create these **public** buckets:

| Bucket name | Use |
|---|---|
| `product-images` | Product photos |
| `category-images` | Category thumbnails |
| `budget-request-images` | Customer reference images |
| `logos` | Store logo variants |

For each: **New bucket → enable Public → Create**.

---

## 3. Database Setup

```bash
npx prisma generate     # Generate Prisma client
npx prisma db push      # Create all tables in Supabase
npm run db:seed         # Seed sample data
```

Seed creates: 12 categories, 24 products, 5 suppliers, store settings, sample notifications.

---

## 4. Create an Admin User

1. Start the app: `npm run dev`
2. Sign up at http://localhost:3000/sign-up
3. Go to **Clerk Dashboard → Users → your user → Metadata → Public metadata**
4. Set:
   ```json
   { "role": "ADMIN" }
   ```
5. Save. Visit http://localhost:3000/admin

---

## 5. Logo

Place your store logo at:

```
public/logo.png
```

Recommended: 200×60 px, transparent background PNG.

---

## 6. Testing Checklist

### Customer Flow
- [ ] Home page loads — hero, featured products, categories
- [ ] Click a category → filtered product listing
- [ ] Click a product → detail page (no supplier data visible in page source)
- [ ] Add to cart → cart icon count updates
- [ ] Open cart → items listed, change quantity, remove item
- [ ] Checkout → redirects to sign in if not logged in
- [ ] After sign in → checkout page shows order summary
- [ ] Place order → confirmation page, WhatsApp option appears
- [ ] Track order → enter order number, status visible
- [ ] Budget request → fill form, attach image (max 5 MB), submit
- [ ] About page loads
- [ ] Contact page loads

### Auth Flow
- [ ] Sign up with email
- [ ] Sign in
- [ ] Account page loads after sign in
- [ ] Sign out works
- [ ] `/admin` redirects to sign in if unauthenticated
- [ ] `/admin` shows 403 if logged in without ADMIN metadata
- [ ] `/admin` accessible after setting `{ "role": "ADMIN" }` in Clerk

### Admin Flow
- [ ] Dashboard shows order count, revenue, customer count, low-stock alert
- [ ] Products: add, edit (profit auto-calculated), delete
- [ ] Categories: add with image, edit, delete
- [ ] Suppliers: add, edit, delete; WhatsApp button opens supplier's own number
- [ ] Orders: list, click to view details, update status
- [ ] Payments: list visible
- [ ] Inventory: view stock levels, update quantity
- [ ] Customers: list visible
- [ ] Budget Requests: view submissions with reference images
- [ ] Notifications: list visible
- [ ] Delivery: management page loads
- [ ] Settings: update store name, WhatsApp number, currency

### Dark Mode
- [ ] Toggle dark mode from header
- [ ] All pages render correctly in dark mode
- [ ] Mode persists on page refresh

### Mobile
- [ ] Home page responsive
- [ ] Product grid responsive
- [ ] Cart drawer works on mobile
- [ ] Admin sidebar collapses on small screen

---

## 7. All Pages

### Public (no login required)
| URL | Description |
|---|---|
| `/` | Home — hero, featured products, categories |
| `/products` | All products with search and filter |
| `/products/[slug]` | Product detail |
| `/categories` | All categories |
| `/categories/[slug]` | Category product listing |
| `/cart` | Shopping cart |
| `/track-order` | Order tracking by order number |
| `/budget-request` | Custom order / budget request form |
| `/about` | About the store |
| `/contact` | Contact page |
| `/sign-in` | Clerk sign in |
| `/sign-up` | Clerk sign up |

### Authenticated (any logged-in user)
| URL | Description |
|---|---|
| `/account` | Customer account and order history |
| `/checkout` | Checkout flow |

### Admin only (`{ "role": "ADMIN" }` in Clerk metadata required)
| URL | Description |
|---|---|
| `/admin` | Dashboard overview |
| `/admin/products` | Product management |
| `/admin/categories` | Category management |
| `/admin/suppliers` | Supplier management |
| `/admin/orders` | Order management |
| `/admin/payments` | Payment records |
| `/admin/inventory` | Stock management |
| `/admin/customers` | Customer list |
| `/admin/budget-requests` | Budget request inbox |
| `/admin/delivery` | Delivery management |
| `/admin/notifications` | Notifications |
| `/admin/settings` | Store settings |

---

## 8. Security Notes

- Supplier data (phone, WhatsApp, cost price, profit margin, internal notes) is **never exposed** to customers — excluded from all public Prisma queries and server actions
- `SUPABASE_SERVICE_ROLE_KEY` is used only in server actions and API routes; never imported in client components
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` is safe for client-side use
- All `/admin/*` routes are protected by Clerk middleware — requires `{ "role": "ADMIN" }` public metadata
- `/account/*` and `/checkout/*` require any authenticated session
- No passwords stored — Clerk handles all authentication

---

## 9. Known Limitations

| Feature | Status |
|---|---|
| Contact form | UI only — no email sending wired up |
| Delivery fee | Configured in Settings but not calculated by customer location |
| Payment gateway | Manual M-Pesa confirmation by admin — no automatic payment API |
| Product reviews | Data model + admin approval exists; customer review submission UI not built |
| ESLint build warning | `Unknown options: useEslintrc, extensions` — Next.js 15 + ESLint 8 compatibility issue, does not affect runtime |

---

## 10. Useful Commands

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:seed      # Seed database with sample data
npx prisma studio    # Open Prisma database browser (GUI)
npx prisma db push   # Push schema changes to database
npx prisma generate  # Regenerate Prisma client after schema changes
npx tsc --noEmit     # TypeScript type check only
```

---

## 11. Recommended Next Steps

1. **M-Pesa Integration** — Vodacom/Airtel Tanzania M-Pesa API for automatic payment confirmation
2. **Email Notifications** — Resend or SendGrid for order confirmation emails to customers
3. **Product Reviews UI** — Customer-facing review submission (DB model already exists)
4. **Delivery Fee Calculator** — Location-based fee by district in Dar es Salaam
5. **WhatsApp Business API** — Automate order notifications via official WhatsApp Business API
6. **Supabase Row Level Security (RLS)** — Add RLS policies as defense-in-depth security layer
7. **Analytics** — Vercel Analytics or Plausible for visitor tracking
8. **Production Deployment** — Deploy to Vercel; set all env vars in Vercel dashboard; update `NEXT_PUBLIC_APP_URL`
9. **Custom Domain** — Point domain to Vercel; update Clerk allowed origins
10. **Image Optimization** — Supabase image transformation or CDN for auto-generated thumbnails
