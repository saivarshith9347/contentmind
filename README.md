# ContentMind

**AI Content Strategy That Remembers**

ContentMind is an AI-powered content strategy agent with persistent memory using [Hindsight Cloud](https://hindsight.vectorize.io). Built for the Hindsight Hackathon, it demonstrates how AI agents can learn from historical data and user feedback to provide increasingly accurate content recommendations over time.

## 🎯 Problem

Traditional AI content strategy tools provide generic recommendations without learning from your specific content history. They don't remember:
- What content performed well or poorly
- Which topics resonate with your audience
- Feedback you've given about previous recommendations
- Patterns in successful content

This means you get the same generic advice repeatedly, without personalization or improvement over time.

## 💡 Solution

ContentMind uses **Hindsight memory** to:

1. **Remember historical content** - Stores and analyzes your past posts and their performance
2. **Learn from patterns** - Identifies what works (practical tutorials) vs what doesn't (generic awareness posts)
3. **Incorporate feedback** - When you tell it what's useful, it stores that feedback and uses it in future recommendations
4. **Improve over time** - Each interaction makes recommendations more accurate and personalized

## 🧠 Why Hindsight is Necessary

Hindsight provides three critical operations that make ContentMind work:

### 1. **Retain** - Store Knowledge
```typescript
// Store historical content performance
await hindsight.retain(bankId, `
  Historical Post: "Build Your First RAG Application"
  Topic: AI - Practical Tutorial
  Performance: 8500 views, 8.5% engagement rate
  Outcome: high
`);

// Store user feedback
await hindsight.retain(bankId, `
  User Feedback: Practical cybersecurity demonstrations 
  perform better than generic awareness posts
`);
```

### 2. **Recall** - Retrieve Relevant Memories
```typescript
// When user asks: "What cybersecurity content should we create?"
const memories = await hindsight.recall(bankId, query);
// Returns: Historical performance data + user feedback
```

### 3. **Reflect** - Generate Contextual Responses
```typescript
// Generate strategy recommendations using memory context
const response = await hindsight.reflect(bankId, query);
// Returns: Data-driven recommendation influenced by memories
```

Without Hindsight's persistent memory:
- ❌ Recommendations would be generic and repetitive
- ❌ No learning from historical performance
- ❌ No incorporation of user preferences
- ❌ No improvement over time

With Hindsight:
- ✅ Recommendations grounded in actual data
- ✅ Learns which content types work
- ✅ Remembers and applies user feedback
- ✅ Gets smarter with each interaction

## 🏗️ Architecture

```
Browser (React/Next.js)
  ↓
Next.js Pages & Components (Client-Side)
  ↓
Next.js API Routes (Server-Side)
  ├→ Supabase Cloud (Authentication + PostgreSQL Database with RLS)
  ├→ Hindsight Cloud (AI Memory & Learning)
  └→ Groq Cloud (LLM Strategy Generation)
```

**Key Points:**
- **Frontend**: Next.js 15 App Router with React 19, TypeScript, and Tailwind CSS
- **Backend**: Next.js API routes (`/app/api/*`) - no separate server needed
- **Authentication**: Supabase Auth with cookie-based sessions via `@supabase/ssr`
- **Database**: Supabase PostgreSQL with 6 tables and 23 Row Level Security (RLS) policies
- **Memory**: Hindsight Cloud for persistent agent memory and learning
- **AI**: Groq API for fast LLM inference (llama-3.3-70b-versatile)
- **Deployment**: Vercel Edge Network (serverless functions)
- **Security**: Server-only API keys, client-side RLS protection, no exposed secrets

**Demo Mode:**
- Unauthenticated users can explore ContentMind with synthetic TechNova demo data
- No login required to see Strategy Agent, Memory Explorer, and analytics
- Full authentication available for production use

## 🧪 Automated Testing

ContentMind includes an automated test suite that verifies the complete learning workflow:

### Run Automated Tests

1. Start the dev server: `npm run dev`
2. Navigate to: **http://localhost:3000/demo-test**
3. Click **"Run Full Hackathon Test"**

The test automatically:
- ✅ Verifies Hindsight connection
- ✅ Seeds demo memory
- ✅ Generates initial strategy recommendation
- ✅ Stores user feedback in Hindsight
- ✅ Generates improved recommendation
- ✅ Detects learning improvements
- ✅ Validates all features

### Alternative: Quick Access

From the main dashboard, click the **"Run Test"** button in the header.

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Hindsight Cloud account ([sign up here](https://hindsight.vectorize.io))
- Groq API account ([sign up here](https://groq.com))

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys:

```env
# Supabase Configuration (Public - Browser-Safe)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key-here

# Hindsight Cloud Configuration (Server-Only Secret)
HINDSIGHT_API_KEY=your_hindsight_api_key_here
HINDSIGHT_BASE_URL=https://api.hindsight.vectorize.io
HINDSIGHT_BANK_ID=contentmind

# Groq API Configuration (Server-Only Secret)
GROQ_API_KEY=your_groq_api_key_here
```

**Variable Security:**
- `NEXT_PUBLIC_*` variables are browser-safe (protected by Supabase RLS)
- `HINDSIGHT_API_KEY` and `GROQ_API_KEY` are server-only secrets (never exposed to browser)

**Where to get API keys:**

- **Supabase URL & Key**: Go to [Supabase Dashboard](https://supabase.com/dashboard) → Your Project → Settings → API → Copy URL and publishable anon key
- **Hindsight API Key**: Go to [Hindsight Cloud](https://hindsight.vectorize.io) → Sign up → Connect page → Copy API key
- **Groq API Key**: Go to [GroqCloud](https://console.groq.com) → Sign up → API Keys → Create new key

### 3. Build the Application

```bash
npm run build
```

### 4. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 How to Use

### Initial Setup (First Time)

1. Click **"Load Demo Memory"** button in the header
2. This seeds Hindsight with:
   - TechNova brand profile
   - 45 historical posts with performance data
   - Content performance patterns
   - Initial audience preferences
   - Content gap analysis

### Exploring ContentMind

The dashboard has 5 tabs:

1. **Overview** - Key metrics and recent learning
2. **Strategy Agent** - Ask for content recommendations
3. **Memory Explorer** - Browse stored memories
4. **Content Gaps** - See underrepresented topics
5. **Learning Timeline** - Track how ContentMind evolves

## 🎪 60-Second Demo Sequence

This demo shows how ContentMind learns from feedback:

### BEFORE Learning (Generic Response)

1. Go to **"Strategy Agent"** tab
2. Ask: **"What cybersecurity content should we create?"**
3. Observe the recommendation (will reference historical data but may be general)

### Learning Event (Store Feedback)

4. Click **"Not Helpful"**
5. Add feedback: **"Our audience responds better to practical cybersecurity demonstrations than generic awareness posts"**
6. Click Submit
7. You'll see: **"Feedback Stored in Hindsight"**

### AFTER Learning (Improved Response)

8. Ask the **same question** again: **"What cybersecurity content should we create?"**
9. Notice the new recommendation is:
   - ✅ More specific and practical
   - ✅ Recommends demonstrations over awareness
   - ✅ References your feedback in "Memories Used"

**The difference is real** - not hardcoded! The improvement comes from Hindsight retrieving and using your feedback.

## 🎯 Hackathon Judging Alignment

### Memory Demonstration
- ✅ **Retain**: Historical posts, brand info, and user feedback stored in Hindsight
- ✅ **Recall**: Relevant memories retrieved before each recommendation
- ✅ **Reflect**: Used for generating contextual responses (optional in current version, can be enhanced)

### Learning Over Time
- ✅ Before/after demo shows clear improvement
- ✅ UI explicitly shows "Hindsight Memory Used"
- ✅ Lists which memories influenced each recommendation
- ✅ Feedback visibly stored and applied

### Real Integration
- ✅ Uses official `@vectorize-io/hindsight-client` npm package
- ✅ Makes actual API calls to Hindsight Cloud
- ✅ Not mocked or simulated
- ✅ Memory persists across sessions

### Demo Quality
- ✅ Realistic 45-post demo dataset
- ✅ Professional UI with glass-morphism design
- ✅ Clear memory indicators throughout
- ✅ Guided demo flow in Learning Timeline tab

## 📁 Project Structure

```
ContentMind/
├── app/
│   ├── api/              # Server-side API routes
│   │   ├── seed/         # Seed demo data
│   │   ├── strategy/     # Generate recommendations
│   │   ├── feedback/     # Store user feedback
│   │   ├── memories/     # List memories
│   │   └── analytics/    # Get analytics
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Main dashboard
├── components/           # React components
│   ├── OverviewTab.tsx
│   ├── StrategyAgentTab.tsx
│   ├── MemoryExplorerTab.tsx
│   ├── ContentGapsTab.tsx
│   └── LearningTimelineTab.tsx
├── lib/
│   ├── hindsight-service.ts  # Hindsight integration
│   ├── groq-service.ts       # Groq integration
│   └── seed-data.ts          # Demo dataset
├── .env.example          # Environment template
├── package.json          # Dependencies
└── README.md            # This file
```

## 🔒 Security Notes

- ✅ API keys stored in `.env.local` (never committed to git)
- ✅ All Hindsight/Groq calls happen server-side via Next.js API routes
- ✅ Server-only secrets (`HINDSIGHT_API_KEY`, `GROQ_API_KEY`) never exposed to browser
- ✅ Public Supabase keys protected by Row Level Security (RLS) policies
- ✅ `.gitignore` includes `.env*.local` files
- ✅ No separate backend server required - Next.js API routes handle all server-side logic

## 🧪 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Memory**: Hindsight Cloud TypeScript SDK
- **AI**: Groq SDK (openai/gpt-oss-120b)
- **Icons**: Lucide React
- **Charts**: Recharts

## 📊 Demo Dataset

The demo includes 45 synthetic historical posts for **TechNova**, a fictional tech education brand:

- **Topics**: AI, Python, Cybersecurity, Cloud, DevOps
- **Performance patterns**:
  - ✅ Practical AI tutorials → High engagement (9-14%)
  - ✅ Python automation scripts → High engagement (10-16%)
  - ✅ Practical cybersecurity demos → High engagement (11-16%)
  - ❌ Generic awareness posts → Low engagement (3-5%)
  - ❌ News summaries → Medium engagement (5-7%)

## 🎨 Design

- Dark professional theme
- Glass-morphism cards
- Gradient accents
- Responsive layout
- Clear memory indicators
- Loading states
- Error handling

## 🐛 Troubleshooting

### "Hindsight is not configured" error
- Check that `HINDSIGHT_API_KEY` is set in `.env.local`
- Verify the key is valid
- Restart the dev server after adding `.env.local`

### "Groq is not configured" error
- Check that `GROQ_API_KEY` is set in `.env.local`
- Verify the key is valid
- Restart the dev server

### "Supabase is not configured" error
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` are set in `.env.local`
- Verify the values are correct from your Supabase project
- Restart the dev server

### Build errors
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run build
```

### No memories showing
- Click "Load Demo Memory" button
- Check browser console for errors
- Verify Hindsight API is responding

## 📝 License

This is a hackathon project. Use freely!

## 🙏 Credits

- Built for the [Hindsight Hackathon](https://hindsight.vectorize.io)
- Uses [Hindsight Cloud](https://hindsight.vectorize.io) for agent memory
- Uses [Groq](https://groq.com) for fast LLM inference
- Demo content inspired by real tech content patterns

---

**ContentMind** - Because AI should remember what works 🧠✨
