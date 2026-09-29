# ContentMind Automated Test Guide

Quick reference for running the automated hackathon demo test.

## 🚀 Quick Start

### Step 1: Start Server
```bash
npm run dev
```

### Step 2: Open Test Page
Navigate to: **http://localhost:3000/demo-test**

### Step 3: Run Test
Click: **"Run Full Hackathon Test"** button

### Step 4: Watch Results
The test runs automatically and shows results in real-time (~11 seconds).

---

## 📋 What Gets Tested

✅ **Hindsight Connection** - API responding  
✅ **Demo Memory Seed** - Historical data loaded  
✅ **Memory Retrieval** - Memories stored successfully  
✅ **Initial Strategy** - First recommendation generated  
✅ **Feedback Retention** - User feedback stored in Hindsight  
✅ **Second Strategy** - Improved recommendation generated  
✅ **Learning Detected** - Recommendations compared and improved  
✅ **Content Gaps** - Analytics feature working  
✅ **Learning Timeline** - Timeline feature working  

---

## 🎯 Expected Results

### Success Output
```
✅ ALL TESTS PASSED - Ready for Hackathon Demo!
```

### Test shows:
- **BEFORE LEARNING**: Initial recommendation
- **AFTER FEEDBACK**: Improved recommendation
- **LEARNING EVIDENCE**: Hindsight memories that influenced the change

---

## 🐛 Troubleshooting

### All Tests Fail Immediately
**Cause**: API keys not configured  
**Fix**: Check `.env.local` has valid `HINDSIGHT_API_KEY` and `GROQ_API_KEY`

### Test 1 Fails (Hindsight Connection)
**Cause**: Hindsight API key invalid or API down  
**Fix**: Verify API key at https://hindsight.vectorize.io

### Test 4 or 6 Fails (Strategy Generation)
**Cause**: Groq API key invalid or model issue  
**Fix**: Verify API key at https://console.groq.com

### Learning Not Detected (Test 7)
**Cause**: Recommendations too similar  
**Fix**: This is rare - check if feedback was actually stored (Test 5 should pass)

---

## 📊 Test Timeline

| Step | Duration | Action |
|------|----------|--------|
| 1-3  | ~2s      | Connection & Memory |
| 4    | ~3s      | First AI Generation |
| 5    | ~1s      | Feedback Storage |
| 6    | ~3s      | Second AI Generation |
| 7-9  | ~2s      | Validation |
| **Total** | **~11s** | **Complete Test** |

---

## 🎬 For Hackathon Demos

### Quick Demo Script

1. Say: "Let me show you our automated test that proves ContentMind learns"
2. Navigate to `/demo-test`
3. Click "Run Full Hackathon Test"
4. While it runs, explain: "This tests the complete workflow - initial recommendation, feedback storage, and improved recommendation"
5. Point out the before/after comparison
6. Highlight the learning evidence section
7. Show the green "ALL TESTS PASSED" banner

**Time: 15 seconds total (including explanation)**

---

## 🔍 What to Show Judges

### Key Evidence Points

1. **Real Integration**
   - Point out "Real Hindsight Cloud + Groq API" in technical details
   - Emphasize "Persistent (not mocked)" memory

2. **Learning Detection**
   - Show before/after recommendations side-by-side
   - Point to the "LEARNING EVIDENCE" section
   - Explain how feedback influenced the change

3. **All Features Working**
   - 9/9 tests passing = complete system
   - Content Gaps and Timeline also validated

---

## 💡 Pro Tips

### Tip 1: Run Before Presenting
Run the test once before your presentation to ensure everything works.

### Tip 2: Fresh Start
If you want to re-demonstrate learning, you can:
- Clear the Hindsight bank (in Hindsight Cloud dashboard)
- Re-run the test (it will seed fresh data)

### Tip 3: Show Console (Optional)
Open browser DevTools → Network tab to show real API calls happening.

### Tip 4: Compare Text
Point out specific differences between before/after recommendations:
- More "practical" and "demonstration" keywords after learning
- Less generic "awareness" content after learning

---

## 📈 Success Metrics

A successful test run shows:

✅ **9/9 Tests Passing**  
✅ **Before ≠ After** (recommendations are different)  
✅ **Learning Evidence Found** (memories listed)  
✅ **All Features Validated** (gaps, timeline working)  

---

## 🎉 Ready!

Your automated test system is ready to prove ContentMind's learning capabilities to hackathon judges in under 15 seconds!
