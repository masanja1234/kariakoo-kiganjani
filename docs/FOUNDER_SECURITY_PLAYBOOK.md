# Founder Security Playbook — Kariakoo Kiganjani

**Owner:** Masanja Paul (Founder & CTO)  
**Last Updated:** 2026-05-18  
**Classification:** Internal — Do not share publicly

---

## 1. Access Control Architecture

### Authentication Provider: Clerk
- All user authentication is handled exclusively by Clerk
- **Never** store passwords in the database
- **Never** use NextAuth, bcrypt, or custom JWT tokens
- Admin role is stored in Clerk public metadata: `{ "role": "ADMIN" }`

### How to Grant Admin Access
1. Log in to Clerk Dashboard → Users
2. Find the user by email
3. Click "Edit public metadata"
4. Set: `{ "role": "ADMIN" }`
5. The user must sign out and sign back in for the role to take effect

### How to Revoke Admin Access
1. In Clerk Dashboard → find the user
2. Edit public metadata → remove `"role": "ADMIN"` or set it to `"CUSTOMER"`
3. Click "Revoke all sessions" to immediately terminate active sessions

---

## 2. Data Protection Rules

### What Must NEVER Be Exposed to Customers
| Field | Model | Risk |
|-------|-------|------|
| `supplierCostPrice` | Product | Exposes profit margins |
| `profitSnapshot` | OrderItem | Business intelligence leak |
| `supplierCostPriceSnapshot` | OrderItem | Business intelligence leak |
| `adminNotes` | Order, Product, BudgetRequest | Internal business info |
| Supplier contact details | Supplier | Customer bypass risk |

All public API responses use safe Prisma select objects defined in `lib/selectors.ts`.

### What Customers CAN See
- Product selling price, discount price, stock quantity
- Their own order status and items (no cost/profit data)
- Their own budget request status
- Public reviews (approved only)

---

## 3. Environment Variables Security

### Required Variables (Never Commit to Git)
```
DATABASE_URL          — Supabase connection pooler URL
DIRECT_URL            — Supabase direct connection URL
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
CLERK_SECRET_KEY
NEXT_PUBLIC_SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY   ← Treat like a password; never expose client-side
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_MAINTENANCE_MODE  (set to "true" during maintenance)
```

### Security Rules for Env Vars
- `NEXT_PUBLIC_*` variables are visible in browser JavaScript — never put secrets there
- `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security — use only in server actions
- Rotate `CLERK_SECRET_KEY` and `SUPABASE_SERVICE_ROLE_KEY` every 6 months
- Store production secrets in Vercel Environment Variables (not in `.env` files)

---

## 4. Supabase Storage Security

### Allowed File Types (enforced in `actions/uploads.ts`)
- `image/jpeg`, `image/png`, `image/webp` only
- Maximum file size: **5 MB**

### Storage Buckets
| Bucket | Who Can Upload | Public? |
|--------|---------------|---------|
| `product-images` | Admins only | Yes (read) |
| `category-images` | Admins only | Yes (read) |
| `budget-request-images` | Authenticated users | No |
| `logos` | Admins only | Yes (read) |

### Supabase RLS Policy Reminder
Review Row Level Security policies in Supabase Dashboard → Storage → Policies quarterly.

---

## 5. Payment Security

### Accepted Payment Methods
- M-Pesa: `0762 474 101`
- Tigo Pesa: `0762 474 101`
- Airtel Money: `0762 474 101`
- HaloPesa: `0762 474 101`
- Cash on Delivery
- Bank Transfer

### Payment Verification Process
1. Customer places order → status: `PENDING`
2. Customer sends payment and shares transaction reference
3. Admin verifies payment in the mobile money app
4. Admin confirms payment in the dashboard → status changes to `CONFIRMED`
5. **Never confirm payment without manual verification in the bank/mobile money app**

### Anti-Fraud Rules
- Server-side price calculation — prices from client are NEVER trusted
- Order total is always recalculated from database prices at order creation
- Payment amounts are verified against the stored order total

---

## 6. Monitoring and Alerts

### Check Weekly
- [ ] Clerk Dashboard → Recent sign-ins (look for unusual locations or times)
- [ ] Supabase Dashboard → Database → Storage usage
- [ ] Vercel Dashboard → Function logs (look for repeated 401/403 errors)
- [ ] Admin Dashboard → Notifications (new orders, budget requests)

### Signs of a Security Incident
- Multiple failed login attempts from same IP
- Admin actions from unexpected times/locations
- Unusual database query volumes in Supabase
- Orders with very unusual quantities or prices

---

## 7. Regular Security Tasks

| Task | Frequency |
|------|-----------|
| Review active Clerk sessions | Monthly |
| Rotate Supabase service role key | Every 6 months |
| Review Clerk webhook signatures | Every 6 months |
| Audit admin user list in Clerk | Quarterly |
| Review Supabase RLS policies | Quarterly |
| Check for Next.js security updates | Monthly |
| Update npm dependencies | Monthly |

---

## 8. Contact for Security Issues

- **Internal:** Masanja Paul — WhatsApp +255 762 474 101
- **Clerk Support:** clerk.com/support
- **Supabase Support:** supabase.com/support
- **Vercel Support:** vercel.com/support
