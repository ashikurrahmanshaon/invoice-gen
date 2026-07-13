const fs = require('fs');
const path = require('path');
const config = require('../config.cjs');

class JSONExporter {
  static export(data, filename) {
    if (!fs.existsSync(config.OUTPUT_DIR)) {
      fs.mkdirSync(config.OUTPUT_DIR, { recursive: true });
    }
    const filePath = path.join(config.OUTPUT_DIR, `${filename}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`[JSONExporter] Saved ${filePath}`);
    return filePath;
  }
}

class CSVExporter {
  static export(data, filename) {
    if (!fs.existsSync(config.OUTPUT_DIR)) {
      fs.mkdirSync(config.OUTPUT_DIR, { recursive: true });
    }
    const filePath = path.join(config.OUTPUT_DIR, `${filename}.csv`);
    
    // Quick and dirty CSV conversion for top queries as an example
    let csv = 'Query,Clicks,Impressions,Position\n';
    data.gsc.topQueries.forEach(q => {
      csv += `"${q.query}",${q.clicks},${q.impressions},${q.position}\n`;
    });

    fs.writeFileSync(filePath, csv);
    console.log(`[CSVExporter] Saved ${filePath}`);
    return filePath;
  }
}

class MarkdownExporter {
  static export(data, filename) {
    if (!fs.existsSync(config.OUTPUT_DIR)) {
      fs.mkdirSync(config.OUTPUT_DIR, { recursive: true });
    }
    const filePath = path.join(config.OUTPUT_DIR, `${filename}.md`);
    
    const md = `
# Analytics Report: ${data.dateRange}
*Generated on: ${new Date(data.timestamp).toLocaleString()}*

## 🧠 AI Insights & Recommendations
${data.insights.map(i => `- ${i}`).join('\n')}

---

## 🔍 SEO Performance (Search Console)
| Metric | Value |
|--------|-------|
| **Clicks** | ${data.gsc.seoMetrics.clicks.toLocaleString()} |
| **Impressions** | ${data.gsc.seoMetrics.impressions.toLocaleString()} |
| **CTR** | ${data.gsc.seoMetrics.ctr}% |
| **Avg Position** | ${data.gsc.seoMetrics.avgPosition} |
| **Indexed Pages** | ${data.gsc.seoMetrics.indexedPages} |
| **Coverage Issues**| ${data.gsc.seoMetrics.coverageIssues} |

### Top Queries
${data.gsc.topQueries.map(q => `- **${q.query}**: ${q.clicks} clicks (Pos ${q.position})`).join('\n')}

---

## 📈 Traffic & Engagement (GA4)
| Metric | Value |
|--------|-------|
| **Users** | ${data.ga4.traffic.users.toLocaleString()} |
| **Sessions** | ${data.ga4.traffic.sessions.toLocaleString()} |
| **Bounce Rate** | ${data.ga4.traffic.bounceRate}% |
| **Avg Session** | ${data.ga4.traffic.avgSessionDuration}s |

### Invoice Funnel
- **Downloads:** ${data.ga4.events.downloads}
- **Previews:** ${data.ga4.events.previewClicks}
- **Drafts Saved:** ${data.ga4.events.saveDraft}
- **Completion Rate:** ${data.ga4.events.funnelCompletion}%

---

## 🖱️ User Behavior (Clarity)
| Metric | Value |
|--------|-------|
| **Rage Clicks** | ${data.clarity.behavior.rageClicks} |
| **Dead Clicks** | ${data.clarity.behavior.deadClicks} |
| **Quick Backs** | ${data.clarity.behavior.quickBacks} |
| **Scroll Depth**| ${data.clarity.behavior.avgScrollDepth}% |

**Device Breakdown:** Desktop (${data.clarity.breakdown.desktop}%), Mobile (${data.clarity.breakdown.mobile}%), Tablet (${data.clarity.breakdown.tablet}%)
    `.trim();

    fs.writeFileSync(filePath, md);
    console.log(`[MarkdownExporter] Saved ${filePath}`);
    return filePath;
  }
}

module.exports = { JSONExporter, CSVExporter, MarkdownExporter };
