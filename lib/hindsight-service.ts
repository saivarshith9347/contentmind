import { HindsightClient } from '@vectorize-io/hindsight-client';

// Initialize Hindsight client
function getHindsightClient() {
  const apiKey = process.env.HINDSIGHT_API_KEY;
  const baseUrl = process.env.HINDSIGHT_BASE_URL || 'https://api.hindsight.vectorize.io';
  
  if (!apiKey) {
    throw new Error('HINDSIGHT_API_KEY environment variable is not set');
  }
  
  return new HindsightClient({
    baseUrl,
    apiKey,
  });
}

function getBankId() {
  return process.env.HINDSIGHT_BANK_ID || 'contentmind';
}

// Check if Hindsight is configured
export function isHindsightConfigured() {
  return !!process.env.HINDSIGHT_API_KEY;
}

// Retain content in Hindsight memory
export async function retainContent(content: string, context?: string, metadata?: Record<string, any>) {
  try {
    const client = getHindsightClient();
    const bankId = getBankId();
    
    // Convert all metadata values to strings as required by Hindsight
    const stringMetadata = metadata
      ? Object.fromEntries(
          Object.entries(metadata).map(([key, value]) => [key, String(value)])
        )
      : {};
    
    await client.retain(bankId, content, {
      context: context || 'content_strategy',
      metadata: stringMetadata,
      async: false,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error retaining content:', error);
    throw error;
  }
}

// Retain multiple contents in batch
export async function retainBatch(contents: Array<{ content: string; context?: string; metadata?: Record<string, any> }>) {
  try {
    const client = getHindsightClient();
    const bankId = getBankId();
    
    const items = contents.map(item => ({
      content: item.content,
      context: item.context || 'content_strategy',
      // Convert all metadata values to strings as required by Hindsight
      metadata: item.metadata 
        ? Object.fromEntries(
            Object.entries(item.metadata).map(([key, value]) => [key, String(value)])
          )
        : {},
    }));
    
    await client.retainBatch(bankId, items, {
      async: false,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error retaining batch:', error);
    throw error;
  }
}

// Recall relevant memories from Hindsight
export async function recallRelevantContent(query: string, budget: 'low' | 'mid' | 'high' = 'mid') {
  try {
    const client = getHindsightClient();
    const bankId = getBankId();
    
    const response = await client.recall(bankId, query, {
      budget,
      maxTokens: 4096,
    });
    
    return response.results || [];
  } catch (error) {
    console.error('Error recalling content:', error);
    throw error;
  }
}

// Reflect - generate response with memory context
export async function reflectOnStrategy(query: string, context?: string, budget: 'low' | 'mid' | 'high' = 'mid') {
  try {
    const client = getHindsightClient();
    const bankId = getBankId();
    
    const response = await client.reflect(bankId, query, {
      budget,
      context: context || 'content_strategy',
    });
    
    return response;
  } catch (error) {
    console.error('Error reflecting on strategy:', error);
    throw error;
  }
}

// Retain user feedback
export async function retainFeedback(feedback: string, context: string = 'user_feedback') {
  try {
    const client = getHindsightClient();
    const bankId = getBankId();
    
    await client.retain(bankId, feedback, {
      context,
      metadata: {
        type: 'feedback',
        timestamp: new Date().toISOString(),
      },
      async: false,
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error retaining feedback:', error);
    throw error;
  }
}

// List memories from Hindsight
export async function listMemories(limit: number = 20, offset: number = 0, type?: string) {
  try {
    const client = getHindsightClient();
    const bankId = getBankId();
    
    const response = await client.listMemories(bankId, {
      limit,
      offset,
      type,
    });
    
    return response;
  } catch (error) {
    console.error('Error listing memories:', error);
    throw error;
  }
}

// Create or ensure bank exists
export async function ensureBank() {
  try {
    const client = getHindsightClient();
    const bankId = getBankId();
    
    // Try to create the bank (will fail silently if it already exists)
    try {
      await client.createBank(bankId, {
        name: 'ContentMind',
        mission: `You are ContentMind, an AI content strategy analyst for TechNova, a technology education brand.
        
Your role is to:
- Analyze historical content performance
- Identify content gaps and opportunities
- Generate data-driven content recommendations
- Learn from user feedback
- Maintain brand voice consistency

When making recommendations:
- Ground suggestions in historical data from memory
- Explicitly reference which memories influenced your recommendations
- Identify patterns in successful vs unsuccessful content
- Be honest when historical evidence is limited
- Prioritize practical, actionable content that resonates with developers
- Remember that practical tutorials and demonstrations outperform generic awareness posts

Target Audience: Students, developers, and young professionals
Brand Voice: Practical, simple, friendly, technically accurate, avoids unnecessary jargon`,
        disposition: {
          skepticism: 2,   // More trusting of data
          literalism: 3,   // Balanced
          empathy: 4,      // High empathy for content creators
        },
      });
    } catch (e: any) {
      // Bank might already exist, which is fine
      if (!e.message?.includes('already exists')) {
        console.error('Error creating bank:', e);
      }
    }
    
    return { success: true };
  } catch (error) {
    console.error('Error ensuring bank:', error);
    throw error;
  }
}

export default {
  isHindsightConfigured,
  retainContent,
  retainBatch,
  recallRelevantContent,
  reflectOnStrategy,
  retainFeedback,
  listMemories,
  ensureBank,
};
