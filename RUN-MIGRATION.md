# 🚀 Execute ContentMind Database Migration

## Your Supabase Project

**Project URL**: `https://uwayfmqixnrhrwknmfmy.supabase.co`  
**Project ID**: `uwayfmqixnrhrwknmfmy`

---

## Step 1: Open Supabase SQL Editor

Click this link to open your SQL Editor:

👉 **https://supabase.com/dashboard/project/uwayfmqixnrhrwknmfmy/sql**

---

## Step 2: Copy Migration SQL

The migration SQL is in:
```
supabase/migrations/20250127_contentmind_schema.sql
```

**Option A: Copy from your editor**
1. Open `supabase/migrations/20250127_contentmind_schema.sql` in VS Code
2. Select All (⌘+A or Ctrl+A)
3. Copy (⌘+C or Ctrl+C)

**Option B: Copy from terminal**
```bash
cat supabase/migrations/20250127_contentmind_schema.sql | pbcopy
```
(macOS - copies to clipboard)

---

## Step 3: Paste and Run in Supabase

1. In the SQL Editor, paste the migration SQL
2. Click the **"Run"** button (or press ⌘+Enter)
3. Wait for completion (2-5 seconds)

**Expected result:**
```
Success. No rows returned
```

If you see errors, STOP and report them.

---

## Step 4: Verify Success

Back in your terminal, run:

```bash
node scripts/check-database.mjs
```

**Expected output:**
```
📊 Table Status:
   ✅ Exists    profiles
   ✅ Exists    workspaces
   ✅ Exists    content
   ✅ Exists    strategies
   ✅ Exists    feedback
   ✅ Exists    content_performance

✅ All tables exist! Database schema is ready.
```

---

## What Gets Created

- ✅ 6 tables
- ✅ 7 foreign keys
- ✅ 9 indexes
- ✅ 23 RLS policies
- ✅ 2 triggers

---

## Need Help?

If you encounter any issues:
1. Copy the exact error message
2. Note which line failed
3. Report back for assistance

---

Ready? Open the SQL Editor link above and follow the steps! 🎯
