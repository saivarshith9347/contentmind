# Memory Pulse Visual Guide

Quick visual reference for each memory state.

---

## 🔵 IDLE State

**Purpose**: Memory system ready, no active operations

```
        ┌─────────────┐
        │             │
        │      🧠     │    ← Brain icon
        │   (glow)    │    ← Subtle cyan glow
        │             │    ← Slow breathing pulse
        └─────────────┘

Animation: Gentle opacity fade (0.7 ↔ 0.9)
Duration: 3 seconds per cycle
Color: Cyan (rgb(79, 195, 247))
```

**Label**: "Ready"

---

## 🔵 RECALLING State

**Purpose**: Retrieving memories from Hindsight

```
           ⦿              ← Particle 1
       ⦿       ⦿          ← Particles 2 & 3
    ⦿    ┌─────┐    ⦿    ← Particles 4 & 5
         │ 🧠  │          ← Brain core
    ⦿    └─────┘    ⦿    ← Particles 6 & 7
       ⦿       ⦿          ← Particle 8
         
    ↓  All particles move inward  ↓
         
         ┌─────┐
         │ 🧠  │          ← All particles reach center
         └─────┘

Animation: 8 particles orbit → travel inward
Duration: 2 seconds per particle (staggered)
Color: Bright cyan (rgb(56, 189, 248))
```

**Label**: "Recalling memories..."

**Key Features**:
- Dashed orbital ring (60-80-100px radius based on size)
- Particles start at orbit edge
- Fade in → travel → fade out
- 0.15s stagger between particles
- Infinite loop

---

## 🟣 ANALYZING State

**Purpose**: Processing patterns and connections

```
              |
              |  ← Connection line
         ┌────┼────┐
      ─  │    ⚡   │  ─   ← 6 radiating lines
         │  (glow) │      ← Zap icon
      ─  └────┼────┘  ─
              |
              |

Animation: Lines pulse in sequence
Duration: 1.5 seconds per line
Color: Purple (rgb(139, 92, 246))
```

**Label**: "Analyzing patterns..."

**Key Features**:
- 6 connection lines (60° apart)
- Lines pulse: opacity 0 → 0.6 → 0
- 0.1s stagger between lines
- Gradient fade toward ends
- Infinite loop

---

## 🟢 LEARNING State

**Purpose**: New memory being formed

```
       ⦿ ← Single particle starts above
       |
       |  
       ↓  Travels downward
         
      ┌───┐
      │ ✨ │ ← Sparkles icon
      └───┘   ← Particle reaches core

Animation: Single particle journey into core
Duration: 1.5 seconds (one-shot)
Color: Teal (rgb(129, 230, 217))
```

**Label**: "Forming memory..."

**Key Features**:
- Starts 80-100px above core (based on size)
- Smooth inward motion
- Scale: 0 → 1.2 → 1 → 0
- Opacity: 0 → 1 → 0.8 → 0
- Icon changes to Sparkles
- Enhanced glow on particle

---

## 🟢 LEARNED State

**Purpose**: Memory successfully stored

```
         ┌───┐
         │ ✨ │ ← Core briefly expands
         └───┘
         
           ↓
         
       ○ ┌───┐ ○   ← First pulse ring
         │ ✨ │
       ○ └───┘ ○
         
           ↓
         
    ○    ┌───┐    ○   ← Second pulse ring
         │ ✨ │        ← (rings continue outward)
    ○    └───┘    ○

Animation: Core expands + dual pulse rings
Duration: 0.6s expand, 1-1.2s rings
Color: Green (rgb(20, 184, 166))
```

**Label**: "Memory stored!"

**Key Features**:
- Core scale: 1 → 1.3 → 1 (0.6s)
- First ring: scale 1 → 2.5, opacity 0.6 → 0 (1.0s)
- Second ring: scale 1 → 3, opacity 0.4 → 0 (1.2s, +0.1s delay)
- Enhanced glow effect
- Success checkmark appears after

---

## 📊 State Comparison

| State | Icon | Color | Particles | Duration | Loop |
|-------|------|-------|-----------|----------|------|
| IDLE | 🧠 Brain | Cyan | 0 | 3s | ✓ |
| RECALLING | 🧠 Brain | Bright Cyan | 8 inward | 2s each | ✓ |
| ANALYZING | ⚡ Zap | Purple | 0 (lines) | 1.5s | ✓ |
| LEARNING | ✨ Sparkles | Teal | 1 inward | 1.5s | ✗ |
| LEARNED | ✨ Sparkles | Green | 0 (rings) | 1.8s | ✗ |

---

## 🎨 Color Meanings

```
🔵 CYAN    = Memory Access    = "Looking at what I know"
🟣 PURPLE  = Intelligence      = "Thinking and connecting"
🟢 TEAL    = Learning          = "Adding new knowledge"
🟢 GREEN   = Growth            = "Successfully learned!"
```

---

## 📐 Size Variations

### Small (sm)
```
Core: 40px × 40px
Icon: 20px
Particles: 4px
Orbit: 60px
Total: 120px × 120px
```
**Use for**: Inline indicators, sidebar status

### Medium (md) - Default
```
Core: 56px × 56px
Icon: 28px
Particles: 6px
Orbit: 80px
Total: 160px × 160px
```
**Use for**: Modal dialogs, main content areas

### Large (lg)
```
Core: 72px × 72px
Icon: 36px
Particles: 8px
Orbit: 100px
Total: 200px × 200px
```
**Use for**: Full-screen overlays, hero sections, loading screens

---

## 🎬 Animation Flow Examples

### Feedback Submission Flow

```
User clicks "Teach ContentMind"
  ↓
┌─────────────────────────────────────┐
│  RECALLING (2.0s)                   │
│  "Retrieving related memories..."   │
│  [8 particles moving inward]        │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│  ANALYZING (1.8s)                   │
│  "Analyzing feedback context..."    │
│  [6 connection lines pulsing]       │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│  LEARNING (1.5s)                    │
│  "Forming new memory..."            │
│  [1 particle traveling to core]     │
└─────────────────────────────────────┘
  ↓
┌─────────────────────────────────────┐
│  LEARNED (1.0s)                     │
│  "Memory stored in Hindsight!"      │
│  [Core expands, rings pulse out]    │
└─────────────────────────────────────┘
  ↓
[✓ Success message appears]
```

**Total Flow Time**: ~6.3 seconds

---

### Strategy Generation (Recall Phase)

```
User enters question
  ↓
Stage 1: Question Analysis (existing)
  ↓
┌─────────────────────────────────────┐
│  RECALLING (2.2s)                   │
│  "Searching memory archive..."      │
│  [8 particles moving inward]        │
└─────────────────────────────────────┘
  ↓
Stage 3: Strategy Reasoning (existing)
```

---

### Memory Explorer - Initial Load

```
User navigates to Memory Explorer
  ↓
┌─────────────────────────────────────┐
│  RECALLING (until data loads)       │
│  "Accessing ContentMind's memory    │
│   archive..."                       │
│  [8 particles moving inward]        │
└─────────────────────────────────────┘
  ↓
[Memory Universe appears]
```

---

## 💡 Design Tips

### When to Use Each State

| Scenario | State | Rationale |
|----------|-------|-----------|
| Page loading memories | RECALLING | User expects data retrieval |
| Processing strategy | ANALYZING | Complex computation happening |
| Pre-Hindsight.retain() | LEARNING | Memory formation visible |
| Post-Hindsight.retain() | LEARNED | Success confirmation |
| Idle / ready | IDLE | Nothing happening, ready for input |

### Common Mistakes to Avoid

❌ **Don't**: Use IDLE during loading
✅ **Do**: Use RECALLING to show activity

❌ **Don't**: Skip LEARNING before LEARNED
✅ **Do**: Show formation process

❌ **Don't**: Use same state for different operations
✅ **Do**: Match state to semantic meaning

❌ **Don't**: Loop LEARNING or LEARNED
✅ **Do**: These are one-shot animations

---

## 🔧 Implementation Patterns

### Basic Usage
```tsx
import MemoryPulseIndicator from '@/components/ui/MemoryPulseIndicator';

// Show current state
<MemoryPulseIndicator 
  state={currentState}
  size="md"
  showLabel={true}
/>
```

### State Machine Pattern
```tsx
const [state, setState] = useState<MemoryPulseState>('idle');

// Loading data
useEffect(() => {
  setState('recalling');
  fetchMemories().then(() => {
    setState('idle');
  });
}, []);

// Submitting feedback
const handleFeedback = async () => {
  setState('learning');
  await submitToHindsight();
  setState('learned');
  setTimeout(() => setState('idle'), 1000);
};
```

### Full Flow Pattern
```tsx
import MemoryFormationFlow from '@/components/ui/MemoryFormationFlow';

// Automatic state progression
<MemoryFormationFlow
  isActive={isProcessing}
  onComplete={() => {
    setIsProcessing(false);
    showSuccess();
  }}
  trigger="feedback"
  size="lg"
/>
```

---

## 📱 Responsive Behavior

### Desktop (> 1024px)
- Use `lg` size for modals
- Use `md` size for inline
- Full animation complexity

### Tablet (768px - 1024px)
- Use `md` size for modals
- Use `sm` size for inline
- Full animation complexity

### Mobile (< 768px)
- Use `md` size for modals
- Use `sm` size for inline
- Consider reduced motion by default

---

## ♿ Accessibility

### Labels
Every state includes:
- Visual icon change
- Text label describing action
- Color change with semantic meaning

### Reduced Motion
When `prefers-reduced-motion: reduce`:
```
IDLE:      No pulse (static)
RECALLING: Particles fade (no movement)
ANALYZING: Lines fade (no pulse)
LEARNING:  Particle appears (no travel)
LEARNED:   Core glow only (no rings)
```

### Screen Readers
```html
<div role="status" aria-live="polite">
  {stateLabels[state]}
</div>
```

---

## 🎯 Success Criteria

### Visual Communication
- ✅ State immediately recognizable
- ✅ Different from generic loaders
- ✅ Matches ContentMind brand
- ✅ Communicates progress clearly

### User Understanding
- ✅ Users know what AI is doing
- ✅ Users trust memory is working
- ✅ Users feel AI is "thinking"
- ✅ Users get confirmation of success

### Technical Performance
- ✅ 60fps on modern devices
- ✅ Respects motion preferences
- ✅ Minimal bundle impact
- ✅ No layout shift

---

*Visual guide created: 2026-09-27*
*For full technical documentation, see: MEMORY-PULSE-SYSTEM.md*
