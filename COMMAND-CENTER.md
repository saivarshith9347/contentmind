# ContentMind Command Center

The **ContentMind Command Center** is a global command palette that provides quick access to all features through keyboard shortcuts and natural language queries.

## Activation

Press **⌘K** (Mac) or **Ctrl+K** (Windows/Linux) from anywhere in the application to open the Command Center.

Press **Escape** or click outside to close it.

## Features

### 1. **Keyboard Navigation**
- Use **↑** and **↓** arrow keys to navigate through commands
- Press **Enter** to execute the selected command
- Press **Escape** to close without executing

### 2. **Natural Language Search**
Type natural queries to find commands:
- "ask" → Ask ContentMind
- "what to create" → Find Content Gaps
- "learning" → Show Recent Learning
- "best content" → Find High Performing Content
- "weekly plan" → Generate Weekly Plan

### 3. **Command Categories**

#### 🎯 Actions (Orange)
Commands that perform operations:
- **Ask ContentMind** - Get AI-powered strategy recommendations
- **Generate Strategy** - Create comprehensive content strategy
- **Teach ContentMind** - Provide feedback to improve recommendations
- **Generate Weekly Plan** - Create content calendar for next week

#### 🧭 Navigation (Blue)
Commands that switch between tabs:
- **Find Content Gaps** - Discover underrepresented topics
- **Explore Memory** - Browse ContentMind's knowledge
- **Show Recent Learning** - View learning journey and evolution

#### 💬 Queries (Purple)
Commands that help find information:
- **Analyze Topic** - Deep dive into topic performance
- **Find High Performing Content** - See what works best
- **Show Audience Preferences** - Understand engagement patterns
- **Search Memories** - Find specific knowledge

### 4. **Recent Activity**
The command center displays your recent interactions:
- 👁️ **Viewed** - Pages you recently visited
- ✨ **Generated** - Strategies recently created
- 🧠 **Learned** - Feedback you recently provided

## Command List

| Command | Description | Keywords | Category |
|---------|-------------|----------|----------|
| Ask ContentMind | Get AI-powered content strategy | ask, question, strategy, help | Action |
| Generate Strategy | Create comprehensive content strategy | generate, create, plan | Action |
| Find Content Gaps | Discover underrepresented topics | gaps, opportunities, missing | Navigate |
| Explore Memory | Browse ContentMind's knowledge | memory, brain, knowledge | Navigate |
| Show Recent Learning | View learning journey | learning, timeline, history | Navigate |
| Teach ContentMind | Provide feedback | teach, feedback, tell | Action |
| Generate Weekly Plan | Create content calendar | weekly, plan, calendar | Action |
| Analyze Topic | Deep dive into topic performance | analyze, performance, topic | Query |
| Find High Performing | See best performing content | best, top, successful | Query |
| Show Audience Preferences | Understand engagement patterns | audience, preferences, likes | Query |
| Search Memories | Find specific knowledge | search, find everything | Query |

## Technical Implementation

### Architecture
- **Component**: `components/CommandCenter.tsx`
- **Integration**: `app/page.tsx`
- **Styling**: CSS custom properties with framer-motion animations
- **Accessibility**: Full keyboard support, reduced motion support

### Key Technologies
- **Framer Motion** - Command entrance/exit animations
- **Fuzzy Search** - Natural language matching against command keywords
- **React Hooks** - State management and keyboard listeners
- **TypeScript** - Type-safe command definitions

### Command Structure
```typescript
interface CommandItem {
  id: string;              // Unique identifier
  title: string;           // Display name
  description: string;     // What it does
  icon: any;              // Lucide icon component
  category: 'action' | 'navigate' | 'query';
  keywords: string[];      // For natural language search
  action: () => void;     // What happens when executed
}
```

### Adding New Commands
To add a new command, edit `components/CommandCenter.tsx`:

```typescript
{
  id: 'your-command',
  title: 'Your Command Name',
  description: 'What your command does',
  icon: YourIcon,
  category: 'action', // or 'navigate' or 'query'
  keywords: ['keyword1', 'keyword2', 'natural phrase'],
  action: () => {
    // Your command logic
    onNavigate('target-tab'); // if navigation
    onClose(); // always close after
  },
}
```

## User Experience

### Visual Design
- **Dark theme** with subtle gradients
- **Category badges** (orange/blue/purple) for quick identification
- **Smooth animations** respecting `prefers-reduced-motion`
- **Glassmorphism backdrop** for depth
- **Hover states** with scaling and glow effects

### Performance
- **Instant search** - no debouncing, filters in real-time
- **Keyboard-first** - all interactions work without mouse
- **No layout shift** - modal overlay prevents content jump
- **Optimized rendering** - only visible commands re-render

## Accessibility

- ✅ Full keyboard navigation
- ✅ Screen reader friendly labels
- ✅ Focus management (returns focus on close)
- ✅ Reduced motion support
- ✅ High contrast colors
- ✅ Clear visual feedback

## Future Enhancements

Potential improvements:
- [ ] Command history persistence (localStorage)
- [ ] Custom keyboard shortcuts per command
- [ ] Command aliases and favorites
- [ ] Command usage analytics
- [ ] Voice command support
- [ ] Quick actions (no confirmation)
- [ ] Command chaining (multi-step workflows)
- [ ] Command suggestions based on context
