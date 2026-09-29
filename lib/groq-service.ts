import Groq from 'groq-sdk';

function getGroqClient() {
  const apiKey = process.env.GROQ_API_KEY;
  
  if (!apiKey) {
    throw new Error('GROQ_API_KEY environment variable is not set');
  }
  
  return new Groq({ apiKey });
}

export function isGroqConfigured() {
  return !!process.env.GROQ_API_KEY;
}

interface StrategyRecommendation {
  recommendation: string;
  reasoning: string;
  suggestedTopics: string[];
  suggestedFormats: string[];
  targetAudience: string[];
  confidence: string;
  memoriesUsed: number;
}

export async function generateStrategyRecommendation(
  query: string,
  memories: any[],
  includeMemoryContext: boolean = true
): Promise<StrategyRecommendation> {
  try {
    const groq = getGroqClient();
    
    // Build context from memories
    const memoryContext = memories.length > 0
      ? memories.map((m, i) => `Memory ${i + 1}: ${m.text}`).join('\n\n')
      : 'No specific historical memories retrieved.';
    
    const systemPrompt = `You are ContentMind, an AI content strategy analyst for TechNova, a technology education brand targeting students, developers, and young professionals.

Brand Voice: Practical, simple, friendly, technically accurate, avoids unnecessary jargon, focuses on hands-on learning.

Your task is to provide content strategy recommendations based on historical data and patterns.

CRITICAL RULES:
1. Ground ALL recommendations in the historical memories provided
2. Explicitly reference specific patterns you observe in the data
3. If memories show a pattern (e.g., "practical tutorials perform well"), use that pattern
4. Do NOT invent performance data or make generic suggestions without evidence
5. If evidence is limited, clearly state that
6. Prioritize content types that have historically performed well
7. Learn from both successes AND failures in the historical data

When analyzing memories, look for:
- Which topics and formats have high engagement
- Which content types underperformed
- Content gaps (topics mentioned but not well covered)
- Audience preferences based on performance data
- Patterns in successful vs unsuccessful posts

Respond with a JSON object containing:
{
  "recommendation": "string - main recommendation (2-3 sentences)",
  "reasoning": "string - detailed explanation of why, referencing specific memory patterns",
  "suggestedTopics": ["array of 3-5 specific topic suggestions"],
  "suggestedFormats": ["array of 2-4 format suggestions"],
  "targetAudience": ["array of 1-3 audience segments"],
  "confidence": "string - one of: 'Strong historical support', 'Some historical support', 'Limited historical evidence'",
  "memoriesUsed": number
}`;

    const userPrompt = includeMemoryContext
      ? `User Question: ${query}

Historical Content Memories:
${memoryContext}

Based on the historical memories above, provide a data-driven content strategy recommendation.`
      : `User Question: ${query}

Provide a content strategy recommendation. Note: Limited historical data available.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 0.7,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    });

    const response = completion.choices[0]?.message?.content;
    
    if (!response) {
      throw new Error('No response from Groq');
    }

    const parsed = JSON.parse(response);
    
    return {
      recommendation: parsed.recommendation || '',
      reasoning: parsed.reasoning || '',
      suggestedTopics: parsed.suggestedTopics || [],
      suggestedFormats: parsed.suggestedFormats || [],
      targetAudience: parsed.targetAudience || [],
      confidence: parsed.confidence || 'Limited historical evidence',
      memoriesUsed: memories.length,
    };
  } catch (error) {
    console.error('Error generating strategy recommendation:', error);
    throw error;
  }
}

export async function generateSimpleResponse(prompt: string): Promise<string> {
  try {
    const groq = getGroqClient();
    
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'user', content: prompt },
      ],
      model: 'openai/gpt-oss-120b',
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error generating response:', error);
    throw error;
  }
}

export default {
  isGroqConfigured,
  generateStrategyRecommendation,
  generateSimpleResponse,
};
