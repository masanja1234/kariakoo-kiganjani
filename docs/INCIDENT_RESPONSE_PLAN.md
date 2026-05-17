# Incident Response Plan — Kariakoo Kiganjani

**Owner:** Masanja Paul (Founder & CTO)  
**Last Updated:** 2026-05-18

---

## Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| P1 — Critical | Site down, data breach, payment fraud | Immediate (within 15 min) |
| P2 — High | Admin inaccessible, orders not processing | Within 1 hour |
| P3 — Medium | Feature broken, performance degraded | Within 4 hours |
| P4 — Low | Minor UI bug, non-critical error | Within 24 hours |

---

## P1: Site Is Down

### Symptoms
- Homepage returns 500 or doesn't load
- All users getting errors
- Vercel deployment failed

### Steps
1. **Check Vercel Status** → vercel.com/status
2. **Check Supabase Status** → status.supabase.com
3. **Check Clerk Status** → clerk.statuspage.io
4. **Enable Maintenance Mode** (if partial failure):
   - Vercel Dashboard → Environment Variables → Set `NEXT_PUBLIC_MAINTENANCE_MODE=true` → Redeploy
5. **Check Vercel Logs** → Deployments → Functions → Runtime Logs
6. **Rollback if needed** → Vercel → Deployments → Previous stable deployment → "Promote to Production"
7. **Notify customers** via WhatsApp status if downtime > 30 minutes
8. **Disable Maintenance Mode** once fixed

---

## P1: Suspected Data Breach

### Immediate Actions (first 30 minutes)
1. **Revoke all admin sessions** in Clerk Dashboard → Users → each admin user → "Revoke all sessions"
2. **Rotate Supabase Service Role Key**:
   - Supabase Dashboard → Settings → API → Roll service_role key
   - Update `SUPABASE_SERVICE_ROLE_KEY` in Vercel Environment Variables
   - Redeploy immediately
3. **Rotate Clerk Secret Key**:
   - Clerk Dashboard → API Keys → Create new secret key
   - Update `CLERK_SECRET_KEY` in Vercel
   - Redeploy
4. **Enable Maintenance Mode** to prevent further access

### Investigation (first 2 hours)
5. Review Supabase Database Logs for unusual queries
6. Review Clerk Authentication logs for suspicious sign-ins
7. Review Vercel Function logs for unauthorized access patterns
8. Identify what data may have been accessed

### Recovery
9. Fix the vulnerability before bringing site back online
10. Restore from backup if data was modified (see BACKUP_AND_RECOVERY_PLAN.md)
11. Disable Maintenance Mode
12. Document what happened and how it was fixed

---

## P1: Payment Fraud Suspected

### Symptoms
- Orders placed with clearly wrong prices
- Multiple orders from same user in short time
- Unusual payment references

### Steps
1. **Immediately cancel suspect orders** in admin dashboard
2. Do NOT ship any items from suspect orders
3. Check order total against product prices in database
4. Review the customer's account in Clerk for suspicious activity
5. If a vulnerability is found (e.g., price manipulation): enable maintenance mode, fix the issue, redeploy
6. Document the incident

**Note:** The system calculates prices server-side — client-submitted prices are rejected. Price manipulation via the API is not possible. Fraud is most likely an attempt to use fake payment references.

---

## P2: Admin Dashboard Inaccessible

### Symptoms
- Admin user can't log in to `/admin`
- Admin sees "unauthorized" or redirect to home

### Debugging Steps
1. **Check Clerk metadata**: Clerk Dashboard → Users → Find admin → Check Public Metadata shows `{ "role": "ADMIN" }`
2. **Force re-login**: Admin user signs out completely and signs back in (session may have cached old role)
3. **Check Vercel env vars**: Confirm `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` are set
4. **Check health endpoint**: `GET /api/health` — verify environment check passes
5. **Check Vercel logs** for middleware errors

---

## P2: Orders Not Processing

### Symptoms
- Customers can't place orders
- Cart checkout fails
- Order creation throws errors

### Debugging Steps
1. Check `/api/health` for database status
2. Check Vercel Function logs for `createOrder` action errors
3. Check Supabase Database → Table Editor → `orders` table for recent inserts
4. Verify product stock quantities (out-of-stock products block orders)

---

## P3: Database Performance Issues

### Symptoms
- Pages loading slowly (> 3 seconds)
- Timeout errors in Vercel logs

### Steps
1. Check Supabase Dashboard → Database → Performance metrics
2. Look for slow queries in Supabase Dashboard → Database → Query Performance
3. Verify all indexes are present (check `prisma/schema.prisma`)
4. Check connection pool status (pooler URL vs direct URL)
5. Consider enabling caching for frequently-read data

---

## Communication Templates

### WhatsApp Status (Customer Notification — in Swahili)
```
🔧 Kariakoo Kiganjani iko chini kwa matengenezo ya muda mfupi.
Tutarudi haraka. Asante kwa uvumilivu wako.
— Timu ya Kariakoo Kiganjani
```

### When Back Online
```
✅ Kariakoo Kiganjani inarudi! Tunaomba msamaha kwa usumbufu.
Tembelea: kariakookiganjani.co.tz
```

---

## Post-Incident Review

After every P1/P2 incident, document:
1. **What happened** — timeline of events
2. **Root cause** — why did it happen?
3. **Impact** — how many users affected, for how long?
4. **Resolution** — what fixed it?
5. **Prevention** — what changes prevent recurrence?

Store this in `docs/incidents/YYYY-MM-DD-brief-description.md`
