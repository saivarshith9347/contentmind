# ContentMind - Vercel Deployment Guide

## ✅ Pre-Deployment Checklist

- [x] Build passes: `npm run build` ✅
- [x] Environment variables properly configured
- [x] .env.local ignored by Git
- [x] No secrets in client code
- [x] No hardcoded localhost in production code
- [x] Supabase configured for SSR
- [x] RLS policies active (23 policies)
- [x] Database schema deployed

---

## 📋 Required Environment Variables

### Public Variables (Browser-Safe)
These use `NEXT_PUBLIC_` prefix and are intentionally exposed to the browser:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here
```

### Server-Only Secrets (Never Exposed)
These must **NEVER** use `NEXT_PUBLIC_` prefix:

```
HINDSIGHT_API_KEY=your-hindsight-api-key-here
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_BANK_ID=contentmind
GROQ_API_KEY=your-groq-api-key-here
```

---

## 🚀 Deployment Steps

### 1. Prepare Repository

```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Production ready"

# Add remote (GitHub, GitLab, etc.)
git remote add origin your-repo-url

# Push
git push -u origin main
```

### 2. Connect to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Select the repository

### 3. Configure Project Settings

**Framework Preset**: Next.js (auto-detected)  
**Root Directory**: `./`  
**Build Command**: `npm run build` (auto-detected)  
**Output Directory**: `.next` (auto-detected)  
**Install Command**: `npm install` (auto-detected)  

### 4. Add Environment Variables

Go to: **Settings → Environment Variables**

Add each variable for **Production, Preview, and Development**:

#### Public Variables:
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://uwayfmqixnrhrwknmfmy.supabase.co
Type: Plain Text
Environments: ✓ Production ✓ Preview ✓ Development
```

```
Name: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
Value: [your publishable key]
Type: Plain Text
Environments: ✓ Production ✓ Preview ✓ Development
```

#### Server-Only Secrets (Mark as Encrypted):
```
Name: HINDSIGHT_API_KEY
Value: [your Hindsight API key]
Type: Encrypted ← Important!
Environments: ✓ Production ✓ Preview ✓ Development
```

```
Name: HINDSIGHT_BASE_URL
Value: https://api.hindsight.vectorize.io
Type: Plain Text
Environments: ✓ Production ✓ Preview ✓ Development
```

```
Name: HINDSIGHT_BANK_ID
Value: contentmind
Type: Plain Text
Environments: ✓ Production ✓ Preview ✓ Development
```

```
Name: GROQ_API_KEY
Value: [your Groq API key]
Type: Encrypted ← Important!
Environments: ✓ Production ✓ Preview ✓ Development
```

### 5. Deploy

Click **"Deploy"**

Vercel will:
1. Install dependencies
2. Run build
3. Deploy to edge network
4. Provide production URL

**Deployment time**: ~2-3 minutes

### 6. Configure Supabase Redirect URLs

After deployment, get your Vercel URL (e.g., `https://contentmind.vercel.app`)

Go to: **Supabase Dashboard → Authentication → URL Configuration**

Add your production domain to:
- **Site URL**: `https://contentmind.vercel.app`
- **Redirect URLs**: Add:
  - `https://contentmind.vercel.app/**`
  - `https://contentmind.vercel.app/auth/callback`

**Save changes**

### 7. Verify Deployment

Test your production site:

```bash
# Test home page
curl https://your-domain.vercel.app

# Test API endpoint
curl https://your-domain.vercel.app/api/memories

# Test auth pages
# Visit: https://your-domain.vercel.app/auth/sign-up
```

**Expected**:
- ✅ Home page loads
- ✅ Demo Mode works
- ✅ Auth pages load
- ✅ APIs return JSON

---

## 🔄 Continuous Deployment

After initial setup, Vercel automatically deploys on every push:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push

# Vercel automatically deploys
# View deployment at: vercel.com/your-project
```

**Branches**:
- `main` branch → Production deployment
- Other branches → Preview deployments

---

## 🔧 Troubleshooting

### Build Fails

**Check**:
1. Environment variables are set correctly
2. All 6 variables are present
3. No typos in variable names

**Debug**:
- View build logs in Vercel dashboard
- Check "Deployments" tab for error details

### Authentication Not Working

**Check**:
1. Supabase redirect URLs include your Vercel domain
2. Environment variables are set for correct environment
3. Cookies are enabled in browser

**Debug**:
- Check browser console for errors
- Verify `NEXT_PUBLIC_SUPABASE_URL` is correct
- Verify `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` is correct

### API Errors

**Check**:
1. `HINDSIGHT_API_KEY` is set and encrypted
2. `GROQ_API_KEY` is set and encrypted
3. API keys are valid and active

**Debug**:
- Check Vercel function logs
- Verify no `NEXT_PUBLIC_` prefix on secrets

### Demo Mode Not Working

**Check**:
1. Home page loads (`/`)
2. Hindsight API key is valid
3. Groq API key is valid

**Debug**:
- Test API endpoints: `/api/memories`, `/api/strategy`
- Check function logs for errors

---

## 📊 Performance

**Expected Metrics**:
- **Build time**: 3-5 minutes (first), <2 minutes (subsequent)
- **Cold start**: <1 second
- **Page load**: <2 seconds
- **API response**: <1 second

**Optimizations Included**:
- ✅ Static page pre-rendering
- ✅ Edge middleware (94.9 kB)
- ✅ Optimized bundle sizes (<250 kB per page)
- ✅ Image optimization (if added)
- ✅ Automatic CDN caching

---

## 🔒 Security

**Production Security**:
- ✅ RLS enabled on all tables (23 policies)
- ✅ Server-only secrets encrypted
- ✅ Cookie-based sessions (HTTP-only)
- ✅ No secrets in browser code
- ✅ No localStorage dependencies
- ✅ HTTPS enforced (automatic on Vercel)

**Access Control**:
- ✅ Anonymous users: Blocked from database
- ✅ Authenticated users: RLS filters by `auth.uid()`
- ✅ API keys: Server-side only
- ✅ Supabase publishable key: Protected by RLS

---

## 📞 Support

**Resources**:
- Vercel Docs: https://vercel.com/docs
- Next.js Docs: https://nextjs.org/docs
- Supabase Docs: https://supabase.com/docs

**Common Issues**:
- Build errors: Check environment variables
- Auth errors: Check Supabase redirect URLs
- API errors: Check API keys are encrypted

---

## ✅ Post-Deployment Checklist

After deployment, verify:

- [ ] Home page loads without errors
- [ ] Demo Mode works (no authentication required)
- [ ] Signup page loads
- [ ] Login page loads
- [ ] Can create test account
- [ ] API endpoints return JSON
- [ ] No console errors in browser
- [ ] Mobile responsive (check on phone)
- [ ] All tabs load (Overview, Strategy, Memory, etc.)

---

**Deployment Status**: ✅ Ready for production

**Estimated Setup Time**: 10-15 minutes
