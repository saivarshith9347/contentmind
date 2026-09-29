import { NextRequest, NextResponse } from 'next/server';
import { isHindsightConfigured, retainFeedback } from '@/lib/hindsight-service';

export async function POST(request: NextRequest) {
  try {
    if (!isHindsightConfigured()) {
      return NextResponse.json(
        { error: 'Hindsight is not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { feedback, helpful, query } = body;

    if (typeof helpful !== 'boolean') {
      return NextResponse.json(
        { error: 'helpful (boolean) is required' },
        { status: 400 }
      );
    }

    // Create feedback content
    let feedbackContent = '';
    
    if (helpful) {
      feedbackContent = `Positive Feedback: User found the recommendation helpful. ${feedback ? `User comment: "${feedback}"` : ''}`;
      if (query) {
        feedbackContent += ` Original query: "${query}"`;
      }
    } else {
      feedbackContent = `Negative Feedback: User found the recommendation not helpful. ${feedback ? `User comment: "${feedback}"` : 'No specific reason provided.'}`;
      if (query) {
        feedbackContent += ` Original query: "${query}"`;
      }
    }

    // Store feedback in Hindsight
    await retainFeedback(feedbackContent, 'user_feedback');

    return NextResponse.json({
      success: true,
      message: 'Feedback stored successfully',
      learned: true,
    });

  } catch (error: any) {
    console.error('Feedback storage error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to store feedback' },
      { status: 500 }
    );
  }
}
