import { NextRequest, NextResponse } from 'next/server';
import { isHindsightConfigured, recallRelevantContent } from '@/lib/hindsight-service';
import { isGroqConfigured, generateStrategyRecommendation } from '@/lib/groq-service';

export async function POST(request: NextRequest) {
  try {
    // Check configuration
    if (!isHindsightConfigured()) {
      return NextResponse.json(
        { error: 'Hindsight is not configured. Please set HINDSIGHT_API_KEY in your environment.' },
        { status: 500 }
      );
    }

    if (!isGroqConfigured()) {
      return NextResponse.json(
        { error: 'Groq is not configured. Please set GROQ_API_KEY in your environment.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { query, budget = 'mid' } = body;

    if (!query) {
      return NextResponse.json(
        { error: 'Query is required' },
        { status: 400 }
      );
    }

    // Recall relevant memories from Hindsight
    const memories = await recallRelevantContent(query, budget as 'low' | 'mid' | 'high');

    // Generate strategy recommendation using Groq with memory context
    const recommendation = await generateStrategyRecommendation(
      query,
      memories,
      true
    );

    // Format memories for response
    const formattedMemories = memories.map((memory: any, index: number) => ({
      id: index + 1,
      text: memory.text,
      type: memory.type || 'unknown',
      relevance: memory.score || 0,
    }));

    return NextResponse.json({
      success: true,
      query,
      recommendation: recommendation.recommendation,
      reasoning: recommendation.reasoning,
      suggestedTopics: recommendation.suggestedTopics,
      suggestedFormats: recommendation.suggestedFormats,
      targetAudience: recommendation.targetAudience,
      confidence: recommendation.confidence,
      memoriesUsed: formattedMemories,
      memoryCount: memories.length,
    });

  } catch (error: any) {
    console.error('Strategy generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate strategy' },
      { status: 500 }
    );
  }
}
