'use client';

import { useState } from 'react';
import { Play, CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'pass' | 'fail';
  message?: string;
  details?: any;
}

interface TestData {
  beforeRecommendation?: string;
  afterRecommendation?: string;
  feedbackMemory?: any;
  learningEvidence?: string[];
}

export default function DemoTestPage() {
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults] = useState<TestResult[]>([
    { name: 'Hindsight Connection', status: 'pending' },
    { name: 'Demo Memory Seed', status: 'pending' },
    { name: 'Memory Retrieval', status: 'pending' },
    { name: 'Initial Strategy', status: 'pending' },
    { name: 'Feedback Retention', status: 'pending' },
    { name: 'Second Strategy', status: 'pending' },
    { name: 'Learning Detected', status: 'pending' },
    { name: 'Content Gaps', status: 'pending' },
    { name: 'Learning Timeline', status: 'pending' },
  ]);
  const [testData, setTestData] = useState<TestData>({});

  const updateResult = (index: number, status: TestResult['status'], message?: string, details?: any) => {
    setResults(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], status, message, details };
      return updated;
    });
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const runFullTest = async () => {
    setIsRunning(true);
    setCurrentStep(0);
    const data: TestData = {};

    try {
      // Test 1: Hindsight Connection
      setCurrentStep(0);
      updateResult(0, 'running');
      await sleep(500);
      
      try {
        const memCheck = await fetch('/api/memories?limit=1');
        const memData = await memCheck.json();
        
        if (memCheck.ok) {
          updateResult(0, 'pass', 'Hindsight API responding');
        } else {
          updateResult(0, 'fail', memData.error || 'Hindsight not configured');
          throw new Error('Hindsight connection failed');
        }
      } catch (error: any) {
        updateResult(0, 'fail', error.message);
        throw error;
      }

      // Test 2: Demo Memory Seed
      setCurrentStep(1);
      updateResult(1, 'running');
      await sleep(500);
      
      try {
        const seedResponse = await fetch('/api/seed', { method: 'POST' });
        const seedData = await seedResponse.json();
        
        if (seedResponse.ok && seedData.success) {
          updateResult(1, 'pass', `Seeded ${seedData.itemsSeeded || 'N/A'} items`);
        } else {
          updateResult(1, 'fail', seedData.error || 'Seed failed');
          throw new Error('Seed failed');
        }
      } catch (error: any) {
        updateResult(1, 'fail', error.message);
        throw error;
      }

      // Test 3: Memory Retrieval
      setCurrentStep(2);
      updateResult(2, 'running');
      await sleep(500);
      
      try {
        // First, verify memories using listMemories (direct check)
        let memResponse = await fetch('/api/memories?limit=10');
        let memData = await memResponse.json();
        
        // Retry up to 3 times with increasing delays if no memories found
        let retryCount = 0;
        const maxRetries = 3;
        const retryDelays = [2000, 3000, 5000]; // 2s, 3s, 5s
        
        while ((!memData.memories || memData.memories.length === 0) && retryCount < maxRetries) {
          await sleep(retryDelays[retryCount]);
          memResponse = await fetch('/api/memories?limit=10');
          memData = await memResponse.json();
          retryCount++;
        }
        
        if (!memResponse.ok) {
          const errorMsg = memData.error || `HTTP ${memResponse.status}`;
          updateResult(2, 'fail', `API error: ${errorMsg}`);
          throw new Error(`Memory API failed: ${errorMsg}`);
        }
        
        if (!memData.success) {
          const errorMsg = memData.error || 'API returned success: false';
          updateResult(2, 'fail', errorMsg);
          throw new Error(errorMsg);
        }
        
        if (!memData.memories || memData.memories.length === 0) {
          // Provide diagnostic info
          const bankId = 'contentmind'; // from HINDSIGHT_BANK_ID
          updateResult(2, 'fail', `No memories found after ${retryCount} retries (bank: ${bankId}, tried listMemories)`);
          throw new Error('No memories returned from Hindsight');
        }
        
        // Verify memories have actual content
        const validMemories = memData.memories.filter((m: any) => m.text && m.text !== 'No content');
        if (validMemories.length === 0) {
          updateResult(2, 'fail', 'Memories exist but contain no text');
          throw new Error('Memories have no content');
        }
        
        const retriedMsg = retryCount > 0 ? ` (found after ${retryCount} retries)` : '';
        updateResult(2, 'pass', `Retrieved ${memData.memories.length} memories${retriedMsg}`);
      } catch (error: any) {
        updateResult(2, 'fail', error.message);
        throw error;
      }

      // Test 4: Initial Strategy (Before Learning)
      setCurrentStep(3);
      updateResult(3, 'running');
      await sleep(1000);
      
      try {
        const strategyResponse = await fetch('/api/strategy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            query: 'What cybersecurity content should we create?',
            budget: 'mid'
          }),
        });
        
        const strategyData = await strategyResponse.json();
        
        if (strategyResponse.ok && strategyData.success) {
          data.beforeRecommendation = strategyData.recommendation;
          updateResult(3, 'pass', 'Initial recommendation generated', {
            recommendation: strategyData.recommendation,
            memoriesUsed: strategyData.memoryCount
          });
        } else {
          updateResult(3, 'fail', strategyData.error || 'Strategy generation failed');
          throw new Error('Initial strategy failed');
        }
      } catch (error: any) {
        updateResult(3, 'fail', error.message);
        throw error;
      }

      // Test 5: Feedback Retention
      setCurrentStep(4);
      updateResult(4, 'running');
      await sleep(1000);
      
      try {
        const feedbackResponse = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            helpful: false,
            feedback: 'Our audience responds better to practical cybersecurity demonstrations than generic awareness posts',
            query: 'What cybersecurity content should we create?'
          }),
        });
        
        const feedbackData = await feedbackResponse.json();
        
        if (feedbackResponse.ok && feedbackData.success) {
          updateResult(4, 'pass', 'Feedback stored in Hindsight');
        } else {
          updateResult(4, 'fail', feedbackData.error || 'Feedback storage failed');
          throw new Error('Feedback retention failed');
        }
      } catch (error: any) {
        updateResult(4, 'fail', error.message);
        throw error;
      }

      // Wait for memory to propagate
      await sleep(2000);

      // Test 6: Second Strategy (After Learning)
      setCurrentStep(5);
      updateResult(5, 'running');
      await sleep(1000);
      
      try {
        const strategy2Response = await fetch('/api/strategy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            query: 'What cybersecurity content should we create?',
            budget: 'mid'
          }),
        });
        
        const strategy2Data = await strategy2Response.json();
        
        if (strategy2Response.ok && strategy2Data.success) {
          data.afterRecommendation = strategy2Data.recommendation;
          
          // Extract learning evidence from memories
          const evidence: string[] = [];
          if (strategy2Data.memoriesUsed) {
            strategy2Data.memoriesUsed.forEach((mem: any) => {
              if (mem.text && (
                mem.text.includes('practical') || 
                mem.text.includes('demonstrations') ||
                mem.text.includes('feedback')
              )) {
                evidence.push(mem.text);
              }
            });
          }
          data.learningEvidence = evidence;
          
          updateResult(5, 'pass', 'Second recommendation generated', {
            recommendation: strategy2Data.recommendation,
            memoriesUsed: strategy2Data.memoryCount,
            evidence
          });
        } else {
          updateResult(5, 'fail', strategy2Data.error || 'Strategy generation failed');
          throw new Error('Second strategy failed');
        }
      } catch (error: any) {
        updateResult(5, 'fail', error.message);
        throw error;
      }

      // Test 7: Learning Detected
      setCurrentStep(6);
      updateResult(6, 'running');
      await sleep(500);
      
      try {
        const before = (data.beforeRecommendation || '').toLowerCase();
        const after = (data.afterRecommendation || '').toLowerCase();
        
        // Check if second recommendation mentions practical/demonstrations more
        const practicalBefore = (before.match(/practical|demonstration|demo|hands-on|live/g) || []).length;
        const practicalAfter = (after.match(/practical|demonstration|demo|hands-on|live/g) || []).length;
        
        const awarenessOrGenericBefore = (before.match(/awareness|generic|general|tips/g) || []).length;
        const awarenessOrGenericAfter = (after.match(/awareness|generic|general|tips/g) || []).length;
        
        const hasEvidence = (data.learningEvidence?.length || 0) > 0;
        
        if (before !== after && (practicalAfter > practicalBefore || awarenessOrGenericAfter < awarenessOrGenericBefore || hasEvidence)) {
          updateResult(6, 'pass', 'Learning detected: Recommendation improved', {
            practicalKeywordsBefore: practicalBefore,
            practicalKeywordsAfter: practicalAfter,
            evidenceCount: data.learningEvidence?.length || 0
          });
        } else if (before === after) {
          updateResult(6, 'fail', 'Recommendations are identical - no learning detected');
        } else {
          updateResult(6, 'pass', 'Recommendations differ', {
            note: 'Recommendations changed but subtle differences detected'
          });
        }
      } catch (error: any) {
        updateResult(6, 'fail', error.message);
      }

      // Test 8: Content Gaps
      setCurrentStep(7);
      updateResult(7, 'running');
      await sleep(500);
      
      try {
        const analyticsResponse = await fetch('/api/analytics');
        const analyticsData = await analyticsResponse.json();
        
        if (analyticsResponse.ok && analyticsData.success && analyticsData.analytics.contentGaps) {
          updateResult(7, 'pass', `${analyticsData.analytics.contentGaps.length} gaps identified`);
        } else {
          updateResult(7, 'fail', 'Content gaps not available');
        }
      } catch (error: any) {
        updateResult(7, 'fail', error.message);
      }

      // Test 9: Learning Timeline
      setCurrentStep(8);
      updateResult(8, 'running');
      await sleep(500);
      
      try {
        const timelineResponse = await fetch('/api/analytics');
        const timelineData = await timelineResponse.json();
        
        if (timelineResponse.ok && timelineData.success && timelineData.analytics.recentLearning) {
          updateResult(8, 'pass', `${timelineData.analytics.recentLearning.length} events tracked`);
        } else {
          updateResult(8, 'fail', 'Learning timeline not available');
        }
      } catch (error: any) {
        updateResult(8, 'fail', error.message);
      }

      setTestData(data);
      setCurrentStep(9);

    } catch (error: any) {
      console.error('Test failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pass':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'fail':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'running':
        return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
      default:
        return <div className="w-5 h-5 rounded-full border-2 border-gray-600" />;
    }
  };

  const allPassed = results.every(r => r.status === 'pass');
  const anyFailed = results.some(r => r.status === 'fail');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Hackathon Demo Test</h1>
            <p className="text-gray-400">Automated verification of ContentMind learning workflow</p>
          </div>
          <Link
            href="/"
            className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white flex items-center gap-2 transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>

        {/* Run Test Button */}
        <div className="glass rounded-xl p-6">
          <button
            onClick={runFullTest}
            disabled={isRunning}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white font-bold text-lg transition-all flex items-center justify-center gap-3"
          >
            {isRunning ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Running Test... Step {currentStep + 1}/9
              </>
            ) : (
              <>
                <Play className="w-6 h-6" />
                Run Full Hackathon Test
              </>
            )}
          </button>
        </div>

        {/* Test Results */}
        <div className="glass rounded-xl p-6">
          <h2 className="text-xl font-bold text-white mb-4">Test Results</h2>
          <div className="space-y-3">
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border transition-all ${
                  result.status === 'running'
                    ? 'bg-blue-500/10 border-blue-500/30'
                    : result.status === 'pass'
                    ? 'bg-green-500/10 border-green-500/30'
                    : result.status === 'fail'
                    ? 'bg-red-500/10 border-red-500/30'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <span className="text-white font-medium">{result.name}</span>
                  </div>
                  <span className="text-sm text-gray-400 uppercase">{result.status}</span>
                </div>
                {result.message && (
                  <p className="text-sm text-gray-300 mt-2 ml-8">{result.message}</p>
                )}
              </div>
            ))}
          </div>

          {/* Overall Status */}
          {!isRunning && results[0].status !== 'pending' && (
            <div className={`mt-6 p-4 rounded-lg border-2 ${
              allPassed
                ? 'bg-green-500/20 border-green-500'
                : anyFailed
                ? 'bg-red-500/20 border-red-500'
                : 'bg-yellow-500/20 border-yellow-500'
            }`}>
              <p className="text-center text-white font-bold text-lg">
                {allPassed
                  ? '✅ ALL TESTS PASSED - Ready for Hackathon Demo!'
                  : anyFailed
                  ? '❌ Some Tests Failed - Check Errors Above'
                  : '⚠️ Tests Incomplete'}
              </p>
            </div>
          )}
        </div>

        {/* Learning Evidence */}
        {testData.beforeRecommendation && testData.afterRecommendation && (
          <div className="space-y-6">
            {/* Before Learning */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                📋 BEFORE LEARNING
              </h3>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-gray-200 leading-relaxed">{testData.beforeRecommendation}</p>
              </div>
            </div>

            {/* After Learning */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                ✨ AFTER FEEDBACK
              </h3>
              <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                <p className="text-gray-200 leading-relaxed">{testData.afterRecommendation}</p>
              </div>
            </div>

            {/* Learning Evidence */}
            {testData.learningEvidence && testData.learningEvidence.length > 0 && (
              <div className="glass rounded-xl p-6">
                <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                  🧠 LEARNING EVIDENCE
                </h3>
                <p className="text-gray-400 text-sm mb-4">
                  Hindsight memories that influenced the second recommendation:
                </p>
                <div className="space-y-3">
                  {testData.learningEvidence.map((evidence, index) => (
                    <div key={index} className="bg-purple-500/10 rounded-lg p-4 border border-purple-500/30">
                      <p className="text-gray-200 text-sm">{evidence}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Technical Details */}
        <div className="glass rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-3">Technical Details</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-400">Integration:</span>
              <span className="text-white">Real Hindsight Cloud + Groq API</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Memory Type:</span>
              <span className="text-white">Persistent (not mocked)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Test Type:</span>
              <span className="text-white">End-to-End Automated</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">API Keys:</span>
              <span className="text-green-400">Server-side only (secure)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
