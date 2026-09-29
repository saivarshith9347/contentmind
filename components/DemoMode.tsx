'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, ChevronRight, ChevronLeft, Check, X, 
  Sparkles, Brain, Target, MessageSquare, Clock
} from 'lucide-react';
import Button from './ui/Button';
import Card from './ui/Card';
import OverviewTab from './OverviewTab';
import StrategyAgentTab from './StrategyAgentTab';
import LearningTimelineTab from './LearningTimelineTab';
import MemoryFormationFlow from './ui/MemoryFormationFlow';

type DemoStep = 
  | 'welcome'
  | 'overview'
  | 'ask-question'
  | 'generation'
  | 'recommendation'
  | 'memories-shown'
  | 'teach-feedback'
  | 'memory-forming'
  | 'ask-again'
  | 'before-after'
  | 'timeline-finale'
  | 'complete';

interface DemoProgress {
  id: string;
  label: string;
  step: DemoStep[];
  completed: boolean;
}

interface DemoModeProps {
  onExit: () => void;
}

export default function DemoMode({ onExit }: DemoModeProps) {
  const [currentStep, setCurrentStep] = useState<DemoStep>('welcome');
  const [showMemoryFormation, setShowMemoryFormation] = useState(false);
  const [autoProgress, setAutoProgress] = useState(true);
  const [demoQuestion] = useState("What cybersecurity content should we create?");
  
  // Progress stages
  const progress: DemoProgress[] = [
    { 
      id: '01', 
      label: 'CONTEXT', 
      step: ['welcome', 'overview'], 
      completed: false 
    },
    { 
      id: '02', 
      label: 'RECALL', 
      step: ['ask-question', 'generation'], 
      completed: false 
    },
    { 
      id: '03', 
      label: 'STRATEGY', 
      step: ['recommendation', 'memories-shown'], 
      completed: false 
    },
    { 
      id: '04', 
      label: 'FEEDBACK', 
      step: ['teach-feedback'], 
      completed: false 
    },
    { 
      id: '05', 
      label: 'LEARNING', 
      step: ['memory-forming', 'ask-again', 'before-after', 'timeline-finale'], 
      completed: false 
    },
  ];

  const getCurrentProgressIndex = () => {
    return progress.findIndex(p => p.step.includes(currentStep));
  };

  const isStepCompleted = (progressIndex: number) => {
    const currentIndex = getCurrentProgressIndex();
    return progressIndex < currentIndex;
  };

  const nextStep = () => {
    const stepOrder: DemoStep[] = [
      'welcome',
      'overview',
      'ask-question',
      'generation',
      'recommendation',
      'memories-shown',
      'teach-feedback',
      'memory-forming',
      'ask-again',
      'before-after',
      'timeline-finale',
      'complete'
    ];
    
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const prevStep = () => {
    const stepOrder: DemoStep[] = [
      'welcome',
      'overview',
      'ask-question',
      'generation',
      'recommendation',
      'memories-shown',
      'teach-feedback',
      'memory-forming',
      'ask-again',
      'before-after',
      'timeline-finale',
      'complete'
    ];
    
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(stepOrder[currentIndex - 1]);
    }
  };

  // Auto-progress for certain steps
  useEffect(() => {
    if (!autoProgress) return;
    
    let timer: NodeJS.Timeout;
    
    switch (currentStep) {
      case 'generation':
        // Auto-progress after generation animation (~4s)
        timer = setTimeout(() => nextStep(), 4500);
        break;
      case 'memory-forming':
        // Handled by MemoryFormationFlow
        break;
    }
    
    return () => clearTimeout(timer);
  }, [currentStep, autoProgress]);

  const handleMemoryFormationComplete = () => {
    setShowMemoryFormation(false);
    nextStep();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[rgb(var(--bg-primary))]">
      {/* Demo Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-[rgb(var(--bg-secondary))]/95 backdrop-blur-sm border-b border-[rgb(var(--border-subtle))]">
        <div className="max-w-[1400px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-[rgb(var(--accent-intelligence))]/10 border border-[rgb(var(--accent-intelligence))]/30 rounded-full">
                <Play className="w-3 h-3 text-intelligence" />
                <span className="text-xs font-bold text-intelligence uppercase tracking-wider">
                  Demo Mode
                </span>
              </div>
              <span className="text-xs text-secondary">
                60-90 second product demonstration
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAutoProgress(!autoProgress)}
                className="text-xs"
              >
                Auto: {autoProgress ? 'ON' : 'OFF'}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onExit}
                icon={<X className="w-4 h-4" />}
              >
                Exit Demo
              </Button>
            </div>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center gap-3">
            {progress.map((prog, index) => {
              const isActive = prog.step.includes(currentStep);
              const isCompleted = isStepCompleted(index);
              
              return (
                <div key={prog.id} className="flex items-center gap-3">
                  <motion.div
                    animate={{
                      scale: isActive ? 1 : 0.95,
                      opacity: isCompleted || isActive ? 1 : 0.5
                    }}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg transition-all"
                    style={{
                      background: isActive 
                        ? 'rgba(var(--accent-intelligence), 0.15)'
                        : isCompleted
                        ? 'rgba(var(--accent-growth), 0.1)'
                        : 'rgba(var(--bg-elevated))',
                      border: `1px solid ${
                        isActive 
                          ? 'rgba(var(--accent-intelligence), 0.5)'
                          : isCompleted
                          ? 'rgba(var(--accent-growth), 0.3)'
                          : 'rgba(var(--border-subtle))'
                      }`
                    }}
                  >
                    <div 
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isCompleted 
                          ? 'bg-[rgb(var(--accent-growth))] text-white'
                          : isActive
                          ? 'bg-[rgb(var(--accent-intelligence))] text-white'
                          : 'bg-[rgb(var(--bg-tertiary))] text-secondary'
                      }`}
                    >
                      {isCompleted ? <Check className="w-4 h-4" /> : prog.id}
                    </div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      isActive ? 'text-intelligence' : isCompleted ? 'text-growth' : 'text-secondary'
                    }`}>
                      {prog.label}
                    </span>
                  </motion.div>
                  
                  {index < progress.length - 1 && (
                    <ChevronRight className="w-4 h-4 text-dim" />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Demo Content */}
      <div className="pt-32 px-6 pb-24 max-w-[1400px] mx-auto">
        <AnimatePresence mode="wait">
          {/* WELCOME */}
          {currentStep === 'welcome' && (
            <DemoSlide key="welcome">
              <div className="text-center max-w-3xl mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.8 }}
                  className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-[rgb(var(--accent-intelligence))] to-[rgb(var(--accent-ai))] flex items-center justify-center glow-intelligence"
                >
                  <Brain className="w-12 h-12 text-white" />
                </motion.div>
                
                <h1 className="text-5xl font-black text-primary mb-4">
                  ContentMind Demo
                </h1>
                <p className="text-2xl text-secondary mb-8">
                  AI content strategy powered by <span className="text-intelligence font-bold">persistent memory</span>
                </p>
                
                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <Card variant="elevated" className="p-6">
                    <div className="text-3xl font-black text-intelligence mb-2">335</div>
                    <div className="text-sm text-secondary">Memories Stored</div>
                  </Card>
                  <Card variant="elevated" className="p-6">
                    <div className="text-3xl font-black text-ai mb-2">45</div>
                    <div className="text-sm text-secondary">Historical Posts</div>
                  </Card>
                  <Card variant="elevated" className="p-6">
                    <div className="text-3xl font-black text-strategy mb-2">12</div>
                    <div className="text-sm text-secondary">Content Gaps</div>
                  </Card>
                </div>

                <p className="text-lg text-secondary mb-8">
                  Watch ContentMind <span className="text-learning font-semibold">learn from feedback</span> and{' '}
                  <span className="text-recall font-semibold">remember</span> what works.
                </p>

                <Button
                  variant="intelligence"
                  size="lg"
                  onClick={nextStep}
                  icon={<ChevronRight className="w-5 h-5" />}
                >
                  Start Demo
                </Button>
              </div>
            </DemoSlide>
          )}

          {/* OVERVIEW */}
          {currentStep === 'overview' && (
            <DemoSlide key="overview">
              <DemoInstruction
                title="Step 1: Overview"
                instruction="Show the intelligence snapshot and content opportunities"
                onNext={nextStep}
                onPrev={prevStep}
              />
              <div className="mt-6">
                <OverviewTab />
              </div>
            </DemoSlide>
          )}

          {/* ASK QUESTION */}
          {currentStep === 'ask-question' && (
            <DemoSlide key="ask-question">
              <DemoInstruction
                title="Step 2: Ask ContentMind"
                instruction={`Type: "${demoQuestion}"`}
                highlight="Notice the memory count: 335 memories ready"
                onNext={nextStep}
                onPrev={prevStep}
              />
              <div className="mt-6">
                <Card variant="elevated" className="p-8 text-center">
                  <h2 className="text-3xl font-bold text-primary mb-6">Ask ContentMind</h2>
                  <div className="max-w-2xl mx-auto">
                    <div className="text-left p-6 bg-[rgb(var(--bg-tertiary))] border border-[rgb(var(--border-subtle))] rounded-xl mb-6">
                      <p className="text-lg text-primary font-mono">{demoQuestion}</p>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-sm text-secondary mb-4">
                      <Brain className="w-4 h-4 text-intelligence" />
                      <span className="font-semibold text-intelligence">335 memories ready</span>
                      <span>•</span>
                      <span>45 historical posts</span>
                      <span>•</span>
                      <span>12 audience signals</span>
                    </div>
                  </div>
                </Card>
              </div>
            </DemoSlide>
          )}

          {/* GENERATION */}
          {currentStep === 'generation' && (
            <DemoSlide key="generation">
              <DemoInstruction
                title="Step 3: AI Thinking Process"
                instruction="Watch ContentMind consult its memory"
                highlight="This is what makes it different from ChatGPT"
                onPrev={prevStep}
              />
              <div className="mt-6">
                <Card variant="elevated" className="p-12 text-center">
                  <div className="space-y-8">
                    <DemoGenerationStage 
                      stage={1}
                      label="RECALLING MEMORY"
                      description="Searching 335 memories for relevant insights"
                      delay={0}
                    />
                    <DemoGenerationStage 
                      stage={2}
                      label="ANALYZING PERFORMANCE"
                      description="Checking which cybersecurity topics worked"
                      delay={1500}
                    />
                    <DemoGenerationStage 
                      stage={3}
                      label="CHECKING GAPS"
                      description="Finding underrepresented opportunities"
                      delay={3000}
                    />
                  </div>
                </Card>
              </div>
            </DemoSlide>
          )}

          {/* RECOMMENDATION */}
          {currentStep === 'recommendation' && (
            <DemoSlide key="recommendation">
              <DemoInstruction
                title="Step 4: AI Recommendation"
                instruction="ContentMind suggests a strategy based on memory"
                onNext={nextStep}
                onPrev={prevStep}
              />
              <div className="mt-6">
                <Card variant="elevated" className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[rgb(var(--accent-intelligence))] to-[rgb(var(--accent-ai))] flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-primary mb-4">
                        Recommended Strategy
                      </h3>
                      <p className="text-lg text-primary leading-relaxed mb-6">
                        Focus on <span className="text-intelligence font-semibold">practical cybersecurity demonstrations</span> and{' '}
                        <span className="text-intelligence font-semibold">attack/defense scenarios</span>. Your audience engages{' '}
                        more with hands-on tutorials than generic security awareness posts.
                      </p>
                      
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="p-4 bg-[rgb(var(--bg-tertiary))] rounded-lg">
                          <div className="text-xs text-label mb-2">SUGGESTED TOPICS</div>
                          <div className="text-sm text-primary">Penetration Testing, SIEM Implementation</div>
                        </div>
                        <div className="p-4 bg-[rgb(var(--bg-tertiary))] rounded-lg">
                          <div className="text-xs text-label mb-2">FORMAT</div>
                          <div className="text-sm text-primary">Tutorial, Hands-on Guide</div>
                        </div>
                        <div className="p-4 bg-[rgb(var(--bg-tertiary))] rounded-lg">
                          <div className="text-xs text-label mb-2">CONFIDENCE</div>
                          <div className="text-sm text-intelligence font-bold">HIGH (based on 8 memories)</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </DemoSlide>
          )}

          {/* MEMORIES SHOWN */}
          {currentStep === 'memories-shown' && (
            <DemoSlide key="memories-shown">
              <DemoInstruction
                title="Step 5: Memories That Influenced This"
                instruction="Show which memories shaped the recommendation"
                highlight="Transparency: see exactly what the AI remembered"
                onNext={nextStep}
                onPrev={prevStep}
              />
              <div className="mt-6 space-y-4">
                <MemoryCard
                  type="Audience Preference"
                  text="Audience prefers hands-on cybersecurity tutorials over generic awareness content"
                  relevance={95}
                  color="learning"
                />
                <MemoryCard
                  type="Performance Pattern"
                  text="Penetration testing tutorial achieved 89% engagement vs. 34% for generic security tips"
                  relevance={92}
                  color="intelligence"
                />
                <MemoryCard
                  type="Content Gap"
                  text="Generic security awareness posts underperforming - audience wants actionable content"
                  relevance={88}
                  color="strategy"
                />
              </div>
            </DemoSlide>
          )}

          {/* TEACH FEEDBACK */}
          {currentStep === 'teach-feedback' && (
            <DemoSlide key="teach-feedback">
              <DemoInstruction
                title="Step 6: Teach ContentMind"
                instruction='Provide feedback: "Our audience responds better to practical cybersecurity demonstrations..."'
                highlight="This is where the magic happens - teaching the AI"
                onNext={() => {
                  setShowMemoryFormation(true);
                  nextStep();
                }}
                onPrev={prevStep}
              />
              <div className="mt-6">
                <Card variant="elevated" className="p-8" glow="learning">
                  <h3 className="text-2xl font-bold text-primary mb-4 text-center">
                    Teach ContentMind
                  </h3>
                  <div className="max-w-2xl mx-auto">
                    <div className="p-6 bg-[rgb(var(--accent-learning))]/10 border-2 border-[rgb(var(--accent-learning))]/50 rounded-xl mb-6">
                      <div className="flex items-start gap-3">
                        <MessageSquare className="w-5 h-5 text-learning mt-1 flex-shrink-0" />
                        <p className="text-lg text-primary">
                          "Our audience responds better to <span className="font-bold text-learning">practical cybersecurity demonstrations</span> than generic awareness posts."
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-secondary text-center">
                      This feedback will be stored in Hindsight and influence future recommendations
                    </p>
                  </div>
                </Card>
              </div>
            </DemoSlide>
          )}

          {/* MEMORY FORMING */}
          {currentStep === 'memory-forming' && (
            <DemoSlide key="memory-forming">
              <Card variant="elevated" className="p-12 text-center">
                <div className="text-sm text-label mb-8">STEP 7: HINDSIGHT INTEGRATION</div>
                {showMemoryFormation && (
                  <MemoryFormationFlow
                    isActive={showMemoryFormation}
                    onComplete={handleMemoryFormationComplete}
                    trigger="feedback"
                    size="lg"
                  />
                )}
              </Card>
            </DemoSlide>
          )}

          {/* ASK AGAIN */}
          {currentStep === 'ask-again' && (
            <DemoSlide key="ask-again">
              <DemoInstruction
                title="Step 8: Ask The Same Question Again"
                instruction={`Ask: "${demoQuestion}"`}
                highlight="Watch how the answer changes based on what we taught it"
                onNext={nextStep}
                onPrev={prevStep}
              />
              <div className="mt-6">
                <Card variant="elevated" className="p-8 text-center">
                  <h2 className="text-3xl font-bold text-primary mb-6">Ask Again</h2>
                  <div className="max-w-2xl mx-auto">
                    <div className="text-left p-6 bg-[rgb(var(--bg-tertiary))] border border-[rgb(var(--border-subtle))] rounded-xl mb-4">
                      <p className="text-lg text-primary font-mono">{demoQuestion}</p>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-sm">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-[rgb(var(--accent-learning))]/10 border border-[rgb(var(--accent-learning))]/30 rounded-full">
                        <Check className="w-3 h-3 text-learning" />
                        <span className="font-semibold text-learning">336 memories</span>
                        <span className="text-secondary">(+1 new)</span>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </DemoSlide>
          )}

          {/* BEFORE/AFTER */}
          {currentStep === 'before-after' && (
            <DemoSlide key="before-after">
              <DemoInstruction
                title="Step 9: Before vs After Learning"
                instruction="Compare how ContentMind's recommendations evolved"
                highlight="This is persistent memory in action"
                onNext={nextStep}
                onPrev={prevStep}
              />
              <div className="mt-6 grid md:grid-cols-2 gap-6">
                <Card variant="elevated" className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-full">
                      <span className="text-xs font-bold text-red-400 uppercase">Before</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-primary mb-3">
                    Generic cybersecurity awareness posts
                  </h4>
                  <ul className="space-y-2 text-sm text-secondary">
                    <li>• "Top 10 cybersecurity tips"</li>
                    <li>• "Why cybersecurity matters"</li>
                    <li>• "General security best practices"</li>
                  </ul>
                </Card>

                <Card variant="elevated" className="p-6" glow="learning">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="px-3 py-1 bg-[rgb(var(--accent-learning))]/10 border border-[rgb(var(--accent-learning))]/30 rounded-full">
                      <span className="text-xs font-bold text-learning uppercase">After</span>
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-learning mb-3">
                    Practical attack/defense demonstrations
                  </h4>
                  <ul className="space-y-2 text-sm text-primary">
                    <li>• "How to detect SQL injection attacks"</li>
                    <li>• "Building a home security lab"</li>
                    <li>• "Penetration testing walkthrough"</li>
                  </ul>
                </Card>
              </div>
            </DemoSlide>
          )}

          {/* TIMELINE FINALE */}
          {currentStep === 'timeline-finale' && (
            <DemoSlide key="timeline-finale">
              <DemoInstruction
                title="Step 10: Learning Timeline"
                instruction="Show ContentMind's evolution over time"
                highlight="Every piece of feedback makes it smarter"
                onNext={nextStep}
                onPrev={prevStep}
              />
              <div className="mt-6">
                <LearningTimelineTab />
              </div>
            </DemoSlide>
          )}

          {/* COMPLETE */}
          {currentStep === 'complete' && (
            <DemoSlide key="complete">
              <div className="text-center max-w-3xl mx-auto">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.8 }}
                  className="w-24 h-24 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-[rgb(var(--accent-growth))] to-[rgb(var(--accent-learning))] flex items-center justify-center"
                >
                  <Check className="w-12 h-12 text-white" />
                </motion.div>
                
                <h1 className="text-5xl font-black text-primary mb-6">
                  Demo Complete!
                </h1>
                
                <Card variant="elevated" className="p-8 mb-8">
                  <h2 className="text-3xl font-bold text-learning mb-4">
                    ContentMind doesn't just generate.
                  </h2>
                  <p className="text-2xl text-primary">
                    It <span className="text-intelligence font-bold">remembers</span> what you teach it.
                  </p>
                </Card>

                <div className="grid md:grid-cols-3 gap-4 mb-8">
                  <div className="p-6 bg-[rgb(var(--accent-intelligence))]/10 border border-[rgb(var(--accent-intelligence))]/30 rounded-xl">
                    <Sparkles className="w-8 h-8 text-intelligence mx-auto mb-3" />
                    <div className="font-bold text-primary mb-1">Persistent Memory</div>
                    <div className="text-sm text-secondary">Powered by Hindsight</div>
                  </div>
                  <div className="p-6 bg-[rgb(var(--accent-learning))]/10 border border-[rgb(var(--accent-learning))]/30 rounded-xl">
                    <Brain className="w-8 h-8 text-learning mx-auto mb-3" />
                    <div className="font-bold text-primary mb-1">Continuous Learning</div>
                    <div className="text-sm text-secondary">Improves over time</div>
                  </div>
                  <div className="p-6 bg-[rgb(var(--accent-strategy))]/10 border border-[rgb(var(--accent-strategy))]/30 rounded-xl">
                    <Target className="w-8 h-8 text-strategy mx-auto mb-3" />
                    <div className="font-bold text-primary mb-1">Tailored Strategy</div>
                    <div className="text-sm text-secondary">Based on your feedback</div>
                  </div>
                </div>

                <div className="flex gap-4 justify-center">
                  <Button
                    variant="intelligence"
                    size="lg"
                    onClick={() => setCurrentStep('welcome')}
                    icon={<Play className="w-5 h-5" />}
                  >
                    Restart Demo
                  </Button>
                  <Button
                    variant="secondary"
                    size="lg"
                    onClick={onExit}
                  >
                    Exit Demo Mode
                  </Button>
                </div>
              </div>
            </DemoSlide>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-[rgb(var(--bg-secondary))]/95 backdrop-blur-sm border-t border-[rgb(var(--border-subtle))] py-4">
        <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={prevStep}
            disabled={currentStep === 'welcome'}
            icon={<ChevronLeft className="w-4 h-4" />}
          >
            Previous
          </Button>
          
          <div className="text-sm text-secondary">
            <span className="font-mono">
              {progress[getCurrentProgressIndex()]?.label}
            </span>
          </div>
          
          <Button
            variant="intelligence"
            onClick={nextStep}
            disabled={currentStep === 'complete'}
            icon={<ChevronRight className="w-4 h-4" />}
          >
            {currentStep === 'timeline-finale' ? 'Finish' : 'Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}

// Helper Components

function DemoSlide({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

interface DemoInstructionProps {
  title: string;
  instruction: string;
  highlight?: string;
  onNext?: () => void;
  onPrev?: () => void;
}

function DemoInstruction({ title, instruction, highlight, onNext, onPrev }: DemoInstructionProps) {
  return (
    <Card variant="elevated" className="p-6 mb-6 border-l-4 border-intelligence">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-intelligence mb-2">{title}</h3>
          <p className="text-primary mb-2">{instruction}</p>
          {highlight && (
            <p className="text-sm text-secondary italic">💡 {highlight}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

interface DemoGenerationStageProps {
  stage: number;
  label: string;
  description: string;
  delay: number;
}

function DemoGenerationStage({ stage, label, description, delay }: DemoGenerationStageProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          className="flex items-center gap-4 p-6 bg-[rgb(var(--bg-tertiary))] rounded-xl"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[rgb(var(--accent-intelligence))] to-[rgb(var(--accent-ai))] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold">{stage}</span>
          </div>
          <div className="flex-1 text-left">
            <div className="text-sm font-bold text-intelligence uppercase mb-1">{label}</div>
            <div className="text-sm text-secondary">{description}</div>
          </div>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          >
            <Brain className="w-6 h-6 text-intelligence" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface MemoryCardProps {
  type: string;
  text: string;
  relevance: number;
  color: 'learning' | 'intelligence' | 'strategy';
}

function MemoryCard({ type, text, relevance, color }: MemoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card variant="elevated" className="p-6">
        <div className="flex items-start gap-4">
          <div className={`w-12 h-12 rounded-xl bg-${color}/10 border border-${color}/30 flex items-center justify-center flex-shrink-0`}>
            <Brain className={`w-6 h-6 text-${color}`} />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-label uppercase">{type}</span>
              <span className={`text-xs font-bold text-${color}`}>{relevance}% relevance</span>
            </div>
            <p className="text-sm text-primary">{text}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
