# 🚀 ContentMind Database Migration Instructions

## Current Status

✅ **Database schema files created**  
⚠️ **Migration not yet executed** - Tables don't exist yet

## What You Need to Do

Execute the database migration to create all tables, RLS policies, indexes, and triggers.

---

## 📋 Step-by-Step Instructions

### Step 1: Open Supabase Dashboard

Go to your Supabase project's SQL Editor:

```
https://supabase.com/dashboard/project/uwayfmqixnrhrwknmfmy/sql
```

*(Your project ID: `uwayfmqixnrhrwknmfmy` from NEXT_PUBLIC_SUPABASE_URL)*

### Step 2: Open Migration File

In your code editor, open:
```
supabase/migrations/20250127_contentmind_schema.sql
```

### Step 3: Copy All SQL

- Select all content (⌘+A / Ctrl+A)
- Copy (⌘+C / Ctrl+C)

### Step 4: Paste into SQL Editor

- In the Supabase Dashboard SQL Editor
- Paste the SQL (⌘+V / Ctrl+V)

### Step 5: Run Migration

- Click the **"Run"** button (or press ⌘+Enter / Ctrl+Enter)
- Wait for completion (should take 2-5 seconds)

### Step 6: Verify Success

You should see:
```
Success. No rows returned
```

If you see any errors, **STOP** and report them before proceeding.

---

## ✅ Verify Migration Success

After running the migration, verify it worked:

```bash
node scripts/check-database.mjs
```

**Expected output:**
```
📊 Table Status:
   ✅ Exists                                  profiles
   ✅ Exists                                  workspaces
   ✅ Exists                                  content
   ✅ Exists                                  strategies
   ✅ Exists                                  feedback
   ✅ Exists                                  content_performance

✅ All tables exist! Database schema is ready.
```

---

## 📊 What Gets Created

The migration creates:

### Tables (6):
1. **profiles** - User profiles linked to auth.users
2. **workspaces** - User workspaces/brands
3. **content** - Content items per workspace
4. **strategies** - AI-generated strategies per workspace
5. **feedback** - User feedback per workspace
6. **content_performance** - Time-series metrics per content

### Security (23 RLS Policies):
- Complete user data isolation
- Users can only access their own workspaces
- No cross-user data access
- Anonymous users get no access

### Performance (9 Indexes):
- Optimized queries for all foreign keys
- Date-based queries optimized
- Metric lookups optimized

### Automation (2 Triggers):
- Auto-update `updated_at` on workspace changes
- Auto-create profile when user signs up

---

## 🔒 Security Validation

After migration, the database will enforce:

✅ **User A** can access **User A's workspaces** only  
❌ **User A** cannot access **User B's workspaces**  
❌ **User A** cannot access **User B's content**  
❌ **Anonymous users** cannot access any application data  

---

## ⚠️ Important Notes

### DO NOT:
- ❌ Run this migration twice
- ❌ Modify the SQL before running (unless you know what you're doing)
- ❌ Run this on a production database without backup

### This Migration:
- ✅ Creates tables (doesn't drop existing data)
- ✅ Is idempotent (uses `IF NOT EXISTS`)
- ✅ Enables RLS on all tables
- ✅ Creates all necessary indexes
- ✅ Sets up automatic profile creation

---

## 🐛 Troubleshooting

### Error: "relation already exists"
**Cause**: Tables already created (migration already ran)  
**Solution**: This is OK - tables exist, continue to verification

### Error: "permission denied"
**Cause**: Using publishable key instead of accessing dashboard  
**Solution**: Must use Supabase Dashboard SQL Editor (has admin privileges)

### Error: "schema auth does not exist"
**Cause**: Running on wrong database  
**Solution**: Verify you're in correct Supabase project dashboard

### Tables don't show in verification
**Cause**: Schema cache not refreshed  
**Solution**: Wait 30 seconds and run `node scripts/check-database.mjs` again

---

## 📞 Need Help?

If you encounter errors:

1. **Copy the exact error message**
2. **Note which line number failed**
3. **DO NOT proceed** - stop and report the issue

---

## ✅ After Successful Migration

Once migration is complete and verified, the next steps are:

1. Test signup creates profile ✅
2. Test login still works ✅
3. Update API routes for workspace context 🔜
4. Update Hindsight service for workspace isolation 🔜
5. Add workspace selection UI 🔜
6. Test multi-user data isolation 🔜

---

## 🎯 Ready?

When you're ready, open the Supabase Dashboard and follow the steps above.

**Don't forget to verify afterwards with:**
```bash
node scripts/check-database.mjs
```

Good luck! 🚀
