import { NextRequest, NextResponse } from 'next/server';
import { isHindsightConfigured, listMemories } from '@/lib/hindsight-service';

export async function GET(request: NextRequest) {
  try {
    if (!isHindsightConfigured()) {
      return NextResponse.json(
        { error: 'Hindsight is not configured' },
        { status: 500 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');
    const type = searchParams.get('type') || undefined;

    const result: any = await listMemories(limit, offset, type);

    // Format memories for display
    // Hindsight SDK may return: items, memories, or results
    const memoriesArray = result.items || result.memories || result.results || [];
    const formattedMemories = memoriesArray.map((memory: any, index: number) => ({
      id: memory.id || `memory_${offset + index + 1}`,
      text: memory.text || memory.content || 'No content',
      type: memory.type || 'unknown',
      timestamp: memory.timestamp || memory.created_at || new Date().toISOString(),
      context: memory.context || 'general',
    }));

    return NextResponse.json({
      success: true,
      memories: formattedMemories,
      total: result.total || formattedMemories.length,
      limit,
      offset,
    });

  } catch (error: any) {
    console.error('Memories retrieval error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to retrieve memories' },
      { status: 500 }
    );
  }
}
