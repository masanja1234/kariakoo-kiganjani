# Backup and Recovery Plan — Kariakoo Kiganjani

**Owner:** Masanja Paul (Founder & CTO)  
**Last Updated:** 2026-05-18

---

## What Gets Backed Up

| Asset | Location | Backup Method |
|-------|----------|---------------|
| Database (PostgreSQL) | Supabase | Automatic (daily) + Manual before deployments |
| Product images | Supabase Storage | Supabase project backup |
| Source code | GitHub | Git history (all commits) |
| Environment variables | Vercel | Stored in Vercel dashboard |
| Documentation | GitHub (docs/) | Git history |

---

## Database Backups

### Automatic Backups (Supabase)
- Supabase Pro plan includes **daily automatic backups**
- Retained for **7 days** (Pro) or **30 days** (Pro+)
- Access: Supabase Dashboard → Project Settings → Backups

### Manual Backup Before Deployment
Run this before any major schema change or deployment:

```bash
# Export full database (run from your local machine with psql installed)
pg_dump "$DATABASE_URL" --format=custom --file="backup-$(date +%Y%m%d-%H%M%S).dump"
```

Or use the Supabase Dashboard:
1. Go to: Supabase Dashboard → Project Settings → Backups
2. Click "Create backup" → Download the backup file
3. Store the file securely (not in the git repository)

### Scheduled Manual Backups
**Every Monday:** Download a backup from Supabase Dashboard  
**Before every deployment:** Create a manual backup  
**Store in:** A secure cloud drive (not git, not email)

---

## Source Code Backups

### Primary: GitHub
All code is stored in the GitHub repository. The `main` branch is the production branch.

```bash
# Verify remote is set correctly
git remote -v

# Push latest changes
git push origin main
```

### Recovery from GitHub
```bash
# Clone fresh copy if local is lost
git clone https://github.com/[your-username]/kariakoo-kiganjani.git
cd kariakoo-kiganjani
npm install
```

---

## Recovery Procedures

### Scenario 1: Accidental Data Deletion

**Recover from Supabase Backup:**
1. Supabase Dashboard → Project Settings → Backups
2. Select a backup from before the deletion
3. Click "Restore" — this replaces the entire database
4. ⚠️ WARNING: This overwrites ALL current data. Only do this for catastrophic loss.

**Recover Specific Records (preferred):**
1. Download the backup file from Supabase
2. Use `pg_restore` to restore to a temporary local database
3. Extract only the missing records with SQL
4. Insert them back into production

### Scenario 2: Corrupted Product Images

Product images are stored in Supabase Storage. If images are deleted:
1. Re-upload images via the admin dashboard (Admin → Products → Edit Product → Upload Images)
2. Images are NOT backed up separately — keep original copies of product photos locally

**Best Practice:** Keep a folder on your computer with all original product photos.

### Scenario 3: Code Is Lost or Broken

```bash
# Revert to last known good commit
git log --oneline  # find the last good commit hash
git revert HEAD    # undo last commit (safe — creates new commit)

# Or reset to a specific commit (destructive — use with caution)
git reset --hard <commit-hash>
git push --force origin main  # only if sure
```

### Scenario 4: Vercel Deployment Is Broken

1. Vercel Dashboard → Deployments
2. Find the last successful deployment (green checkmark)
3. Click the three dots → "Promote to Production"
4. Previous version is live within 30 seconds

### Scenario 5: Clerk Configuration Lost

Clerk settings are stored in Clerk's cloud — they don't need to be backed up separately. However, document:
- Which users have ADMIN role
- Allowed redirect URLs configured

Keep this list in a secure note and update it when admin users change.

---

## Recovery Time Objectives

| Incident | Target Recovery Time |
|----------|---------------------|
| Vercel rollback | < 5 minutes |
| Database restore from backup | < 2 hours |
| Full site rebuild from scratch | < 4 hours |

---

## Backup Verification Schedule

| Task | Frequency |
|------|-----------|
| Verify Supabase backup exists | Weekly |
| Test restore to staging environment | Monthly |
| Download and store local backup copy | Monthly |
| Verify GitHub push is up to date | After every coding session |

---

## Important Notes

1. **Never put backup files in the git repository** — database dumps contain sensitive data
2. **Never share backup files over WhatsApp or email** — use encrypted cloud storage
3. **Test your backups** — a backup you've never restored is an assumption, not a guarantee
4. **The `.env` file is NOT in git** — always keep a secure copy of all environment variables

---

## Emergency Contacts for Recovery

| Service | Support Link |
|---------|-------------|
| Supabase | supabase.com/support |
| Vercel | vercel.com/support |
| Clerk | clerk.com/support |
