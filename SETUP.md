# ContentMind Setup Guide

Complete setup instructions for running ContentMind locally.

## ✅ Prerequisites Checklist

Before you begin, make sure you have:

- [ ] Node.js 18 or higher installed
- [ ] npm (comes with Node.js)
- [ ] A code editor (VS Code recommended)
- [ ] Terminal/command line access
- [ ] Internet connection

### Check Node.js Version

```bash
node --version
# Should show v18.x.x or higher

npm --version
# Should show 9.x.x or higher
```

If Node.js is not installed, download it from: https://nodejs.org/

---

## 🔑 API Keys Setup

You need two API keys to run ContentMind:

### 1. Hindsight Cloud API Key

**Why:** This is the memory system that makes ContentMind learn over time.

**How to get it:**

1. Go to https://hindsight.vectorize.io
2. Click "Sign Up" or "Log In"
3. After signing in, go to the "Connect" page
4. You'll see your API key - copy it
5. Keep it safe (never share publicly)

**Cost:** Free tier available for testing and demos

---

### 2. Groq API Key

**Why:** This provides fast AI language generation for recommendations.

**How to get it:**

1. Go to https://console.groq.com
2. Sign up for an account
3. Navigate to "API Keys" section
4. Click "Create API Key"
5. Copy the key that appears
6. Save it securely

**Cost:** Free tier with generous limits for development

---

## 📦 Installation Steps

### Step 1: Navigate to Project Directory

```bash
cd /Users/ksaivarshith/Downloads/PROJECTS\ WORLD/ContentMind
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (~417 packages). Takes about 1-2 minutes.

**Expected output:**
```
added 417 packages, and audited 418 packages in 38s
```

---

### Step 3: Create Environment File

```bash
cp .env.example .env
```

This creates a `.env` file where you'll add your API keys.

### Step 4: Add Your API Keys

Open the `.env` file in your code editor and replace the placeholder values:

```env
# Hindsight Cloud Configuration
HINDSIGHT_API_KEY=your_actual_hindsight_key_here
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_BANK_ID=contentmind

# Groq API Configuration
GROQ_API_KEY=your_actual_groq_key_here
```

**Important:**
- Replace `your_actual_hindsight_key_here` with your real Hindsight API key
- Replace `your_actual_groq_key_here` with your real Groq API key
- Don't use quotes around the keys
- Don't add spaces before or after the `=` sign

**Example (with fake keys):**
```env
HINDSIGHT_API_KEY=hsk_abc123xyz789
GROQ_API_KEY=gsk_def456uvw012
```

---

### Step 5: Build the Application (Optional but Recommended)

```bash
npm run build
```

This verifies everything compiles correctly. Takes about 30 seconds.

**Expected output:**
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages (9/9)
✓ Finalizing page optimization
```

---

### Step 6: Start Development Server

```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 15.5.26
- Local:        http://localhost:3000
✓ Ready in 1129ms
```

---

## 🌐 Access the Application

1. Open your web browser
2. Go to: **http://localhost:3000**
3. You should see the ContentMind dashboard

---

## 🎬 First Time Setup in the UI

### Load Demo Memory

1. You'll see a welcome screen
2. Click the **"Load Demo Memory"** button
3. Wait 5-10 seconds for the data to load
4. You'll see: "Hindsight Memory Active" ✅

**What this does:**
- Creates a memory bank in Hindsight Cloud
- Stores 45 historical social media posts
- Loads brand information for TechNova
- Sets up performance patterns
- Initializes content preferences

### Verify Setup

Go through each tab to make sure everything loaded:

1. **Overview Tab** - Should show statistics (45 posts, etc.)
2. **Strategy Agent Tab** - Try asking: "What should we post next week?"
3. **Memory Explorer Tab** - Should show stored memories
4. **Content Gaps Tab** - Should display topic charts
5. **Learning Timeline Tab** - Should show learning events

---

## 🐛 Troubleshooting

### Error: "Hindsight is not configured"

**Cause:** API key is missing or incorrect

**Fix:**
1. Check your `.env` file exists in the project root
2. Verify `HINDSIGHT_API_KEY` is set with your actual key
3. Restart the dev server: Stop (Ctrl+C) and run `npm run dev` again

---

### Error: "Groq is not configured"

**Cause:** Groq API key is missing or incorrect

**Fix:**
1. Check your `.env` file
2. Verify `GROQ_API_KEY` is set
3. Make sure there are no extra spaces or quotes
4. Restart the dev server

---

### Error: Port 3000 already in use

**Cause:** Another application is using port 3000

**Fix Option 1 - Use different port:**
```bash
PORT=3001 npm run dev
```
Then access at http://localhost:3001

**Fix Option 2 - Stop other process:**
```bash
# Find what's using port 3000
lsof -i :3000

# Kill that process
kill -9 <PID>

# Then start again
npm run dev
```

---

### Build fails with TypeScript errors

**Cause:** TypeScript version or dependency mismatch

**Fix:**
```bash
# Clear everything and reinstall
rm -rf node_modules .next
npm install
npm run build
```

---

### "Cannot find module" errors

**Cause:** Missing dependencies

**Fix:**
```bash
npm install
```

---

### Page loads but shows "Failed to load"

**Cause:** API routes aren't working or API keys are invalid

**Fix:**
1. Check browser console (F12) for errors
2. Verify API keys are correct in `.env`
3. Test Hindsight API directly:
   ```bash
   curl -H "Authorization: Bearer YOUR_KEY" \
        https://api.hindsight.vectorize.io/v1/version
   ```
4. Restart dev server

---

## 📁 Project File Structure

```
ContentMind/
├── .env                  # YOUR API KEYS (never commit this!)
├── .env.example          # Template for environment variables
├── .gitignore            # Git ignore file (.env is ignored)
├── package.json          # Dependencies list
├── README.md            # Main documentation
├── DEMO.md              # Demo script
├── SETUP.md             # This file
├── app/
│   ├── api/             # Server-side API routes
│   ├── globals.css      # Styles
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Main dashboard
├── components/          # React components
├── lib/                 # Utility functions
└── node_modules/        # Installed packages (auto-generated)
```

---

## 🔒 Security Notes

### ⚠️ NEVER commit your `.env` file

The `.gitignore` file already includes `.env`, but double-check:

```bash
git status
# Should NOT show .env in the list
```

### ✅ Good Practices

- Keep API keys in `.env` only
- Never hardcode keys in source files
- Don't share keys in screenshots
- Don't paste keys in chat/email
- Rotate keys if accidentally exposed

---

## 🚀 Production Deployment (Optional)

If you want to deploy this to production:

### Vercel (Recommended for Next.js)

1. Sign up at https://vercel.com
2. Install Vercel CLI: `npm i -g vercel`
3. Run: `vercel`
4. Add environment variables in Vercel dashboard:
   - `HINDSIGHT_API_KEY`
   - `HINDSIGHT_BASE_URL`
   - `HINDSIGHT_BANK_ID`
   - `GROQ_API_KEY`

### Other Platforms

ContentMind can also deploy to:
- Netlify
- Railway
- Render
- AWS Amplify
- Your own server with Node.js

**Requirements:**
- Node.js 18+ runtime
- Support for Next.js 15
- Environment variables support

---

## 📊 Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server (after build)
npm start

# Run linting
npm run lint
```

---

## 💡 Tips for Development

### Hot Reload
Changes to files automatically refresh the browser. No need to restart.

### View API Responses
Open browser DevTools (F12) → Network tab → filter "Fetch/XHR" to see API calls.

### Check Logs
The terminal running `npm run dev` shows server-side console logs.

### Reset Memory
To start fresh, just delete the bank in Hindsight Cloud and reload demo memory.

---

## ✅ Setup Complete!

You should now have:

- ✅ ContentMind running at http://localhost:3000
- ✅ Hindsight memory configured and loaded
- ✅ Groq AI generating recommendations
- ✅ All features working

**Next Steps:**
1. Read DEMO.md for the 60-second demo script
2. Explore each tab in the UI
3. Try asking different strategy questions
4. Give feedback and watch ContentMind learn!

---

## 📞 Getting Help

If you're still stuck:

1. Check the main README.md
2. Review error messages carefully
3. Verify all API keys are correct
4. Try the troubleshooting steps above
5. Check Hindsight documentation: https://docs.hindsight.vectorize.io
6. Check Groq documentation: https://console.groq.com/docs

---

## 🎉 Ready to Demo!

Your ContentMind AI agent is ready to demonstrate persistent memory and continuous learning!
