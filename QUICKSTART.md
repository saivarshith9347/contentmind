# ContentMind - Quick Start Checklist

Get ContentMind running in under 5 minutes! ⚡

---

## ☑️ Pre-Flight Checklist

Before you start, make sure you have:

- [ ] Node.js 18+ installed (`node --version`)
- [ ] Hindsight Cloud account & API key
- [ ] Groq API account & API key
- [ ] Terminal open in project directory

---

## 🚀 5-Minute Setup

### 1️⃣ Create `.env` file (30 seconds)

```bash
cp .env.example .env
```

Then edit `.env` and add your keys:
```env
HINDSIGHT_API_KEY=your_hindsight_key_here
GROQ_API_KEY=your_groq_key_here
```

### 2️⃣ Start the server (30 seconds)

```bash
npm run dev
```

Wait for: `✓ Ready in 1129ms`

### 3️⃣ Open in browser (5 seconds)

Go to: **http://localhost:3000**

### 4️⃣ Load demo memory (10 seconds)

Click: **"Load Demo Memory"** button

Wait for: "Hindsight Memory Active" ✅

### 5️⃣ Try the agent! (3 minutes)

**Click "Strategy Agent" tab**

Ask: `What should we post next week?`

Click: **Generate**

🎉 You're now using AI with memory!

---

## 🎬 Quick Demo (60 seconds)

1. Ask: "What cybersecurity content should we create?"
2. Click "Not Helpful"
3. Type: "Practical demonstrations work better than awareness posts"
4. Ask the **same question** again
5. Watch it give a **better answer!**

That's learning in action! 🧠

---

## ❌ Troubleshooting

### "Hindsight is not configured"
→ Check `.env` file has `HINDSIGHT_API_KEY`
→ Restart server: `npm run dev`

### "Groq is not configured"  
→ Check `.env` file has `GROQ_API_KEY`
→ Restart server

### Port 3000 in use
→ Use: `PORT=3001 npm run dev`
→ Go to: http://localhost:3001

---

## 📚 Need More Help?

- **Full Setup Guide**: Read `SETUP.md`
- **Demo Script**: Read `DEMO.md`  
- **Complete Docs**: Read `README.md`

---

## ✅ Success Criteria

You're ready when you see:

✅ Server running at http://localhost:3000
✅ "Hindsight Memory Active" in header
✅ All 5 tabs load without errors
✅ Strategy Agent generates recommendations
✅ Memories show up in Memory Explorer

---

## 🎯 What to Show

**For Hackathon Judges:**

1. **Overview Tab** - See the metrics
2. **Strategy Agent** - Ask questions, get recommendations
3. **Show Memory** - Click "Memories Used" section
4. **Give Feedback** - Store feedback in Hindsight
5. **Ask Again** - Show it learned!

**Time to demo: 60 seconds total**

---

## 🔥 Pro Tips

- Use example questions (buttons below text box)
- Check "Memories Used" after each recommendation
- Try Content Gaps tab for visual charts
- Browse Memory Explorer to see all stored data
- Read Learning Timeline for the full story

---

## 🎉 You're Ready!

ContentMind is now running with:
- ✅ Persistent Hindsight memory
- ✅ Real AI recommendations
- ✅ Learning from feedback
- ✅ Professional UI

**Go impress those judges!** 🚀
