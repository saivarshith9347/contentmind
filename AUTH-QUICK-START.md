# ContentMind Authentication - Quick Start Guide

## 🚀 Getting Started (5 minutes)

### 1. Install Dependencies
Already done! Packages installed:
```bash
@supabase/supabase-js
@supabase/ssr
```

### 2. Set Up Supabase Project

1. **Create Project**
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Choose organization, name, database password, region
   - Wait for project to spin up (~2 minutes)

2. **Get Credentials**
   - Go to Project Settings → API
   - Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - Copy **anon/public key** → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

3. **Add to `.env.local`**
   ```bash
   # Add these lines to your .env.local file
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
   ```

### 3. Configure Supabase

**Email Templates** (Settings → Auth → Email Templates)
- ✅ Confirm signup: Enabled
- ✅ Reset password: Enabled
- Optional: Customize with ContentMind branding

**Site URL** (Settings → Auth → URL Configuration)
- **Development**: `http://localhost:3000`
- **Production**: Your production domain

**Email Provider** (Settings → Auth → Providers)
- ✅ Email: Enabled
- ✅ Confirm email: Enabled (recommended)

### 4. Start Development Server
```bash
npm run dev
```

### 5. Test Authentication

1. Navigate to `http://localhost:3000/auth/sign-up`
2. Create account with test email
3. Check email for confirmation link
4. Click confirmation link
5. Should redirect to dashboard

✅ **Done!** Authentication is working.

---

## 🎯 Common Tasks

### Get Current User (Client Component)
```typescript
'use client';
import { createClient } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function MyComponent() {
  const [user, setUser] = useState(null);
  
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  return <div>{user?.email}</div>;
}
```

### Get Current User (Server Component)
```typescript
import { createClient } from '@/lib/supabase/server';

export default async function MyServerComponent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  return <div>{user?.email}</div>;
}
```

### Protect an API Route
```typescript
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Your protected logic here
  return NextResponse.json({ data: 'success' });
}
```

### Sign Out
```typescript
'use client';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export default function SignOutButton() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
    router.refresh();
  };

  return <button onClick={handleSignOut}>Sign Out</button>;
}
```

### Add Protected Route
Edit `middleware.ts`:
```typescript
const protectedRoutes = [
  '/dashboard',
  '/strategy',
  '/memory',
  '/gaps',
  '/learning',
  '/your-new-route',  // ← Add your route here
];
```

---

## 📁 File Structure Reference

```
ContentMind/
├── lib/supabase/
│   ├── client.ts          # Use in client components
│   └── server.ts          # Use in server components/API routes
├── middleware.ts          # Route protection + session refresh
├── app/auth/
│   ├── login/            # /auth/login
│   ├── sign-up/          # /auth/sign-up
│   ├── forgot-password/  # /auth/forgot-password
│   ├── update-password/  # /auth/update-password
│   └── confirm/          # /auth/confirm (email links)
└── .env.local            # Add Supabase credentials here
```

---

## 🔑 Environment Variables

```bash
# Copy this to .env.local
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key

# Existing (keep these)
HINDSIGHT_API_KEY=your-key
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_BANK_ID=contentmind
GROQ_API_KEY=your-key
```

---

## 🛡️ Routes

### Public Routes (No Auth Required)
- `/` - Home page
- `/auth/login` - Login
- `/auth/sign-up` - Registration
- `/auth/forgot-password` - Password reset
- `/auth/update-password` - Update password
- `/auth/confirm` - Email confirmation

### Protected Routes (Auth Required)
- `/dashboard`
- `/strategy`
- `/memory`
- `/gaps`
- `/learning`

Middleware automatically redirects:
- Unauthenticated users → `/auth/login`
- Authenticated users on auth pages → `/`

---

## 🐛 Troubleshooting

### "Invalid environment variables"
- Check `.env.local` has both Supabase variables
- Restart dev server: `npm run dev`

### Email not received
- Check spam folder
- Verify Supabase email settings enabled
- Check Supabase logs: Dashboard → Logs → Auth

### "Invalid token" on confirmation
- Token expired (valid 24 hours)
- Request new confirmation email
- Check URL has both `token` and `type` parameters

### User not redirected after login
- Check browser console for errors
- Verify middleware is running
- Check cookies in DevTools → Application → Cookies

### Build fails
- Ensure auth pages use `createClient()` wrapper
- Don't create Supabase client at module level
- Use Suspense for `useSearchParams()`

---

## 📚 Additional Resources

- **Detailed Docs**: See `AUTH-IMPLEMENTATION.md`
- **Changes Log**: See `CHANGES.md`
- **Supabase Docs**: https://supabase.com/docs/guides/auth
- **Next.js + Supabase**: https://supabase.com/docs/guides/auth/server-side/nextjs

---

## ✅ Quick Checklist

Setup:
- [ ] Supabase project created
- [ ] Credentials added to `.env.local`
- [ ] Email confirmation enabled
- [ ] Site URL configured

Testing:
- [ ] Sign up works
- [ ] Email confirmation received
- [ ] Login works
- [ ] Protected routes require auth
- [ ] Sign out works
- [ ] Password reset works

---

## 💡 Tips

1. **Development**: Use a real email for testing (confirmation emails required)
2. **Testing**: Use temporary email services for quick tests
3. **Security**: Never commit `.env.local` to git (already in `.gitignore`)
4. **Production**: Set proper site URL before deploying
5. **Debugging**: Check Supabase dashboard → Logs for auth errors

---

## 🎉 You're Ready!

Authentication is fully set up. All existing ContentMind features (Hindsight, Groq, Strategy Agent, etc.) remain unchanged. Supabase handles authentication only.

**Need help?** Check `AUTH-IMPLEMENTATION.md` for detailed guide.
