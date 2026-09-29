import { NextResponse } from 'next/server';
import { 
  isHindsightConfigured, 
  ensureBank, 
  retainBatch,
  listMemories 
} from '@/lib/hindsight-service';
import { 
  historicalPosts, 
  brandProfile, 
  initialAudiencePreferences 
} from '@/lib/seed-data';

export async function POST() {
  try {
    // Check if Hindsight is configured
    if (!isHindsightConfigured()) {
      return NextResponse.json(
        { error: 'Hindsight is not configured. Please set HINDSIGHT_API_KEY.' },
        { status: 500 }
      );
    }

    // Ensure bank exists
    await ensureBank();

    // Check if already seeded
    const existingMemories: any = await listMemories(1);
    // Hindsight SDK returns different response structures - check all possible fields
    const memoriesArray = existingMemories.items || existingMemories.memories || existingMemories.results || [];
    
    if (memoriesArray.length > 0) {
      return NextResponse.json({
        success: true,
        message: 'Memory bank already contains data. Skipping seed.',
        alreadySeeded: true,
        existingCount: memoriesArray.length,
      });
    }

    // Prepare batch content
    const contentItems = [];

    // 1. Retain brand profile
    contentItems.push({
      content: `Brand Profile: ${brandProfile.name}
Industry: ${brandProfile.industry}
Focus Areas: ${brandProfile.focusAreas.join(', ')}
Target Audience: ${brandProfile.targetAudience}
Brand Voice: ${brandProfile.brandVoice.tone} - ${brandProfile.brandVoice.style}
Key Characteristics: ${brandProfile.brandVoice.characteristics.join(', ')}
Content Goals: ${brandProfile.contentGoals.join('; ')}`,
      context: 'brand_profile',
      metadata: { type: 'brand', name: brandProfile.name },
    });

    // 2. Retain audience preferences
    contentItems.push({
      content: `Audience Preferences for ${brandProfile.name}:
Preferred Content Types: ${initialAudiencePreferences.preferredContentTypes.join(', ')}
Less Engaging Content: ${initialAudiencePreferences.lessEngagingContentTypes.join(', ')}
High-performing Topics: ${initialAudiencePreferences.topicPreferences.high.join(', ')}
Medium-performing Topics: ${initialAudiencePreferences.topicPreferences.medium.join(', ')}
Low-performing Topics: ${initialAudiencePreferences.topicPreferences.low.join(', ')}`,
      context: 'audience_preferences',
      metadata: { type: 'preferences' },
    });

    // 3. Retain high-performing content patterns
    const highPerformingPosts = historicalPosts.filter(p => p.outcome === 'high');
    const aiTutorials = highPerformingPosts.filter(p => p.topic === 'AI' && p.subtopic === 'Practical Tutorial');
    const pythonAutomation = highPerformingPosts.filter(p => p.topic === 'Python' && p.subtopic === 'Automation');
    const cyberSecurityDemos = highPerformingPosts.filter(p => p.topic === 'Cybersecurity' && p.subtopic === 'Practical Demo');
    
    contentItems.push({
      content: `Content Performance Pattern: AI Practical Tutorials perform exceptionally well.
Examples: ${aiTutorials.slice(0, 3).map(p => `"${p.title}" achieved ${p.engagementRate}% engagement with ${p.views} views`).join('; ')}
Pattern: Hands-on AI tutorials with code examples consistently achieve 9-14% engagement rates.`,
      context: 'performance_pattern',
      metadata: { type: 'pattern', topic: 'AI', subtopic: 'Practical Tutorial' },
    });

    contentItems.push({
      content: `Content Performance Pattern: Python Automation tutorials are highly successful.
Examples: ${pythonAutomation.slice(0, 3).map(p => `"${p.title}" achieved ${p.engagementRate}% engagement with ${p.views} views`).join('; ')}
Pattern: Practical Python automation scripts that solve real problems perform consistently well (10-16% engagement).`,
      context: 'performance_pattern',
      metadata: { type: 'pattern', topic: 'Python', subtopic: 'Automation' },
    });

    contentItems.push({
      content: `Content Performance Pattern: Practical Cybersecurity Demonstrations outperform awareness posts.
High performers: ${cyberSecurityDemos.slice(0, 2).map(p => `"${p.title}" achieved ${p.engagementRate}% engagement`).join('; ')}
Low performers: Generic cybersecurity awareness posts average only 3-5% engagement.
Pattern: Live demonstrations and attack/defense scenarios significantly outperform generic security tips.`,
      context: 'performance_pattern',
      metadata: { type: 'pattern', topic: 'Cybersecurity' },
    });

    // 4. Retain underperforming content patterns
    const lowPerformingPosts = historicalPosts.filter(p => p.outcome === 'low');
    contentItems.push({
      content: `Underperforming Content Pattern: Generic awareness posts and news summaries.
Examples: ${lowPerformingPosts.slice(0, 3).map(p => `"${p.title}" only achieved ${p.engagementRate}% engagement with ${p.views} views`).join('; ')}
Pattern: Content without practical examples or actionable insights performs poorly (3-6% engagement).`,
      context: 'performance_pattern',
      metadata: { type: 'pattern', outcome: 'low' },
    });

    // 5. Retain content gap analysis
    const topicCounts: Record<string, number> = {};
    historicalPosts.forEach(post => {
      topicCounts[post.topic] = (topicCounts[post.topic] || 0) + 1;
    });

    contentItems.push({
      content: `Content Gap Analysis:
Topic Distribution: ${Object.entries(topicCounts).map(([topic, count]) => `${topic}: ${count} posts`).join(', ')}
Underrepresented Topics: DevOps (only ${topicCounts['DevOps'] || 0} posts), Automation (limited coverage)
Well-covered Topics: AI (${topicCounts['AI'] || 0} posts), Python (${topicCounts['Python'] || 0} posts)
Opportunity: Increase DevOps, Cloud architecture, and automation content to balance portfolio.`,
      context: 'content_gaps',
      metadata: { type: 'gaps', analysis_date: new Date().toISOString() },
    });

    // 6. Retain sample historical posts (top 15 by engagement)
    const topPosts = [...historicalPosts]
      .sort((a, b) => b.engagementRate - a.engagementRate)
      .slice(0, 15);

    topPosts.forEach(post => {
      contentItems.push({
        content: `Historical Post: "${post.title}"
Topic: ${post.topic} - ${post.subtopic}
Format: ${post.format}
Platform: ${post.platform}
Date: ${post.date}
Performance: ${post.views} views, ${post.likes} likes, ${post.engagementRate}% engagement rate
Outcome: ${post.outcome}
Summary: ${post.summary}
Target Audience: ${post.targetAudience}`,
        context: 'historical_content',
        metadata: {
          type: 'historical_post',
          postId: post.postId,
          topic: post.topic,
          outcome: post.outcome,
          engagementRate: post.engagementRate,
        },
      });
    });

    // Retain all content in batch
    await retainBatch(contentItems);

    return NextResponse.json({
      success: true,
      message: `Successfully seeded ${contentItems.length} memories into Hindsight`,
      itemsSeeded: contentItems.length,
      breakdown: {
        brandProfile: 1,
        audiencePreferences: 1,
        performancePatterns: 4,
        contentGaps: 1,
        historicalPosts: topPosts.length,
      },
    });

  } catch (error: any) {
    console.error('Seed error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to seed data' },
      { status: 500 }
    );
  }
}
