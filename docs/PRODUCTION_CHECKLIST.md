# Production Checklist — Kariakoo Kiganjani

**Use this before every major deployment or launch.**

---

## Pre-Deployment Checklist

### Code & Build
- [ ] `npx tsc --noEmit` — zero TypeScript errors
- [ ] `npm run build` — production build succeeds
- [ ] No `console.log` statements with sensitive data
- [ ] No hardcoded secrets or phone numbers in source code
- [ ] All TODO/FIXME comments resolved or tracked in issues

### Environment Variables (Vercel)
- [ ] `DATABASE_URL` set (Supabase connection pooler)
- [ ] `DIRECT_URL` set (Supabase direct URL for migrations)
- [ ] `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` set
- [ ] `CLERK_SECRET_KEY` set
- [ ] `NEXT_PUBLIC_SUPABASE_URL` set
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set
- [ ] `NEXT_PUBLIC_APP_URL` set to `https://kariakookiganjani.co.tz`
- [ ] `NEXT_PUBLIC_MAINTENANCE_MODE` set to `"false"`

### Database
- [ ] `npx prisma db push` applied to production database
- [ ] All required database indexes are present
- [ ] Supabase RLS policies are configured correctly
- [ ] Storage buckets exist: `product-images`, `category-images`, `budget-request-images`, `logos`
- [ ] Database backup taken before deployment

### Authentication (Clerk)
- [ ] Clerk production instance is active (not development)
- [ ] Correct publishable key for production environment
- [ ] Admin users have `{ "role": "ADMIN" }` in public metadata
- [ ] Allowed redirect URLs include `https://kariakookiganjani.co.tz`

### Security
- [ ] Security headers verified via `https://securityheaders.com`
- [ ] No admin routes accessible without authentication (test manually)
- [ ] Health check endpoint returns 200: `https://kariakookiganjani.co.tz/api/health`
- [ ] Maintenance mode redirect works when `NEXT_PUBLIC_MAINTENANCE_MODE=true`

### Payment & Business
- [ ] Payment phone numbers are correct: `0762 474 101`
- [ ] WhatsApp link opens correct number: `+255762474101`
- [ ] Contact email is correct: `info@kariakookiganjani.co.tz`
- [ ] All product prices are correct
- [ ] Delivery fees are configured correctly in admin settings

### Performance
- [ ] Product images are optimized and served from Supabase Storage
- [ ] Next.js Image component used for all product/category images
- [ ] No N+1 query issues in product listing pages

---

## Post-Deployment Verification

### Functional Tests
- [ ] Homepage loads correctly with featured products
- [ ] Product detail page shows images and variants
- [ ] Add to cart works for guest and logged-in users
- [ ] Checkout flow completes (place order)
- [ ] Order confirmation page shows correct details
- [ ] Budget request form submits successfully
- [ ] User account page shows orders
- [ ] Admin dashboard loads without errors
- [ ] Admin can create/edit products
- [ ] Admin can update order status
- [ ] Admin can confirm payments

### Admin-Specific
- [ ] `/admin` route requires login + ADMIN role
- [ ] `/admin/products/new` can create a product with images
- [ ] `/admin/orders` shows all orders with correct data
- [ ] `/admin/notifications` shows notifications

### API Health
- [ ] `GET /api/health` returns `{ "status": "ok" }`
- [ ] All environment variable checks pass in health response

---

## Rollback Plan

If deployment fails:
1. In Vercel Dashboard → Deployments → Select previous deployment → "Promote to Production"
2. If database migration caused issues → restore from backup (see BACKUP_AND_RECOVERY_PLAN.md)
3. Notify team via WhatsApp group immediately

---

## Monitoring After Launch

- Check Vercel function logs for errors in first 24 hours
- Check Supabase Dashboard for unusual database activity
- Check Clerk Dashboard for authentication errors
- Monitor admin notifications for new orders/budget requests
