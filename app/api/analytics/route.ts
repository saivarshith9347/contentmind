import { NextResponse } from 'next/server';
import { historicalPosts } from '@/lib/seed-data';

export async function GET() {
  try {
    // Calculate analytics from the demo dataset
    const totalPosts = historicalPosts.length;
    
    // Top performing topic
    const topicPerformance: Record<string, { total: number; avgEngagement: number }> = {};
    historicalPosts.forEach(post => {
      if (!topicPerformance[post.topic]) {
        topicPerformance[post.topic] = { total: 0, avgEngagement: 0 };
      }
      topicPerformance[post.topic].total += 1;
      topicPerformance[post.topic].avgEngagement += post.engagementRate;
    });
    
    Object.keys(topicPerformance).forEach(topic => {
      topicPerformance[topic].avgEngagement /= topicPerformance[topic].total;
    });
    
    const topTopic = Object.entries(topicPerformance)
      .sort((a, b) => b[1].avgEngagement - a[1].avgEngagement)[0];
    
    // Most successful format
    const formatPerformance: Record<string, { total: number; avgEngagement: number }> = {};
    historicalPosts.forEach(post => {
      if (!formatPerformance[post.format]) {
        formatPerformance[post.format] = { total: 0, avgEngagement: 0 };
      }
      formatPerformance[post.format].total += 1;
      formatPerformance[post.format].avgEngagement += post.engagementRate;
    });
    
    Object.keys(formatPerformance).forEach(format => {
      formatPerformance[format].avgEngagement /= formatPerformance[format].total;
    });
    
    const topFormat = Object.entries(formatPerformance)
      .sort((a, b) => b[1].avgEngagement - a[1].avgEngagement)[0];
    
    // Content gaps
    const topicCounts: Record<string, number> = {};
    historicalPosts.forEach(post => {
      topicCounts[post.topic] = (topicCounts[post.topic] || 0) + 1;
    });
    
    const allTopics = ['AI', 'Python', 'Cybersecurity', 'Cloud', 'DevOps', 'Automation'];
    const gaps = allTopics.map(topic => ({
      topic,
      count: topicCounts[topic] || 0,
      percentage: ((topicCounts[topic] || 0) / totalPosts) * 100,
    })).sort((a, b) => a.count - b.count);
    
    // Recent learning (mock timeline)
    const recentLearning = [
      {
        id: 1,
        event: 'Brand Profile Loaded',
        description: 'TechNova brand voice and guidelines imported',
        timestamp: '2026-09-20T10:00:00Z',
      },
      {
        id: 2,
        event: 'Historical Content Analyzed',
        description: `${totalPosts} historical posts imported and analyzed`,
        timestamp: '2026-09-20T10:01:00Z',
      },
      {
        id: 3,
        event: 'Performance Patterns Identified',
        description: 'Practical tutorials outperform generic news posts',
        timestamp: '2026-09-20T10:02:00Z',
      },
      {
        id: 4,
        event: 'Content Gaps Detected',
        description: 'DevOps and Automation identified as underrepresented',
        timestamp: '2026-09-20T10:03:00Z',
      },
    ];

    return NextResponse.json({
      success: true,
      analytics: {
        totalPosts,
        memoriesStored: totalPosts + 6, // Posts + patterns + brand info
        topPerformingTopic: {
          name: topTopic[0],
          avgEngagement: topTopic[1].avgEngagement.toFixed(1),
        },
        topFormat: {
          name: topFormat[0],
          avgEngagement: topFormat[1].avgEngagement.toFixed(1),
        },
        contentGaps: gaps.slice(0, 3),
        topicDistribution: Object.entries(topicCounts).map(([topic, count]) => ({
          topic,
          count,
          percentage: ((count / totalPosts) * 100).toFixed(1),
        })),
        recentLearning,
      },
    });

  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate analytics' },
      { status: 500 }
    );
  }
}
