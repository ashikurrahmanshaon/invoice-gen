/**
 * Analyzes normalized analytics data to generate actionable insights automatically.
 */
function generateInsights(data) {
  const insights = [];
  const { gsc, ga4, clarity } = data;

  // SEO Insights
  if (gsc.seoMetrics.ctr < 4.0) {
    insights.push('🔴 **CTR dropped:** Overall CTR is below 4.0%. Recommend reviewing meta descriptions for top high-impression queries.');
  }

  const keywordOpportunities = gsc.topQueries.filter(q => q.position > 10 && q.position < 20 && q.impressions > 1000);
  if (keywordOpportunities.length > 0) {
    const kws = keywordOpportunities.map(q => `"${q.query}" (Pos ${q.position})`).join(', ');
    insights.push(`🟢 **Keyword opportunities:** ${kws} are on page 2 with high impressions. Add internal links and improve on-page content.`);
  }

  const lowCtrPages = gsc.topQueries.filter(q => q.position < 5 && (q.clicks / q.impressions) < 0.05);
  if (lowCtrPages.length > 0) {
    insights.push(`🟡 **Pages needing better titles:** ${lowCtrPages[0].query} has a high position but low CTR. Rewrite the title tag.`);
  }

  // Analytics Insights
  if (ga4.events.funnelCompletion < 70) {
    insights.push(`🟡 **Funnel Drop-off:** Invoice completion rate is ${ga4.events.funnelCompletion}%. Consider reducing the number of required fields or improving the UI for adding items.`);
  }

  if (ga4.traffic.bounceRate > 60) {
    insights.push(`🔴 **High Bounce Rate:** At ${ga4.traffic.bounceRate}%, users are leaving without engaging. Check mobile formatting.`);
  }

  // Clarity Insights
  if (clarity.behavior.rageClicks > 30) {
    insights.push(`🔴 **UX Friction:** Detected ${clarity.behavior.rageClicks} rage clicks. Check Clarity session recordings to see where users are getting frustrated.`);
  }
  
  if (clarity.behavior.quickBacks > 200) {
    insights.push(`🟡 **Search Intent Mismatch:** High number of quick backs (${clarity.behavior.quickBacks}) detected. Users are landing from Google and immediately leaving.`);
  }

  if (insights.length === 0) {
    insights.push('✅ All core metrics are healthy this week.');
  }

  return insights;
}

module.exports = { generateInsights };
