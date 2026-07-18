const fs = require('fs');
const path = require('path');

const graph = {};

function createNode(options) {
  const {
    slug,
    category,
    primaryEntity,
    secondaryEntities = [],
    relatedEntities = [],
    searchIntent,
    targetAudience = ["Small Business Owners", "Freelancers"],
    difficulty = "medium",
    priority = "medium",
    estimatedSearchVolume = 5000,
    contentStatus = "planned",
    contentType = "spoke",
    wordCountTarget = 1500,
    primaryKeyword,
    secondaryKeywords = [],
    longTailKeywords = [],
    lsiKeywords = [],
    featuredSnippetOpportunity = null,
    peopleAlsoAsk = [],
    schemaTypes = ["Article", "BreadcrumbList"],
    internalLinkScore = 50,
    externalLinkOpportunity = [],
    parentPage = null,
    childPages = [],
    relatedPages = []
  } = options;

  graph[slug] = {
    slug,
    category,
    primaryEntity,
    secondaryEntities,
    relatedEntities,
    searchIntent,
    targetAudience,
    difficulty,
    priority,
    estimatedSearchVolume,
    contentStatus,
    contentType,
    wordCountTarget,
    lastUpdated: new Date().toISOString().split('T')[0],
    reviewFrequency: "quarterly",
    primaryKeyword,
    secondaryKeywords,
    longTailKeywords,
    lsiKeywords,
    featuredSnippetOpportunity,
    peopleAlsoAsk,
    schemaTypes,
    internalLinkScore,
    externalLinkOpportunity,
    parentPage,
    childPages,
    relatedPages
  };
}

// 1. Root Pillar
createNode({
  slug: "invoice",
  category: "core",
  primaryEntity: "Invoice",
  secondaryEntities: ["Billing", "Payments"],
  searchIntent: "informational",
  contentType: "hub",
  primaryKeyword: "what is an invoice",
  childPages: [
    "invoice-generator", 
    "invoice-templates", 
    "invoice-types", 
    "accounting", 
    "taxes", 
    "receipts", 
    "purchase-orders", 
    "estimates"
  ]
});

// 2. Invoice Generator Branch
const generatorChildren = [
  { slug: "free-invoice-generator", kw: "free invoice generator" },
  { slug: "online-invoice-generator", kw: "online invoice generator" },
  { slug: "mobile-invoice-generator", kw: "mobile invoice generator" },
  { slug: "invoice-maker", kw: "invoice maker" },
  { slug: "invoice-creator", kw: "invoice creator" },
  { slug: "invoice-app", kw: "invoice app" },
  { slug: "invoice-software", kw: "invoice software" },
  { slug: "professional-invoice", kw: "professional invoice generator" },
  { slug: "simple-invoice", kw: "simple invoice generator" },
  { slug: "small-business-invoice", kw: "small business invoice generator" },
  { slug: "digital-invoice", kw: "digital invoice maker" },
  { slug: "pdf-invoice", kw: "pdf invoice generator" },
  { slug: "invoice-builder", kw: "invoice builder" },
  { slug: "custom-invoice", kw: "custom invoice generator" },
  { slug: "best-invoice-generator", kw: "best invoice generator" }
];

createNode({
  slug: "invoice-generator",
  category: "core",
  primaryEntity: "Invoice Generator",
  searchIntent: "tool",
  contentType: "hub",
  priority: "critical",
  primaryKeyword: "invoice generator",
  parentPage: "invoice",
  childPages: generatorChildren.map(c => c.slug)
});

generatorChildren.forEach(child => {
  createNode({
    slug: child.slug,
    category: "tools",
    primaryEntity: "Invoice Generator",
    secondaryEntities: [child.kw],
    searchIntent: child.slug.includes("best") ? "comparison" : "tool",
    contentType: "tool",
    primaryKeyword: child.kw,
    parentPage: "invoice-generator"
  });
});

// 3. Templates Branch
const templateChildren = [
  { slug: "freelance-invoice-template", kw: "freelance invoice template" },
  { slug: "contractor-invoice-template", kw: "contractor invoice template" },
  { slug: "plumber-invoice-template", kw: "plumber invoice template" }
];

createNode({
  slug: "invoice-templates",
  category: "templates",
  primaryEntity: "Invoice Templates",
  searchIntent: "template",
  contentType: "hub",
  priority: "critical",
  primaryKeyword: "invoice templates",
  parentPage: "invoice",
  childPages: templateChildren.map(c => c.slug)
});

templateChildren.forEach(child => {
  createNode({
    slug: child.slug,
    category: "templates",
    primaryEntity: "Invoice Template",
    secondaryEntities: [child.kw],
    searchIntent: "template",
    contentType: "template",
    primaryKeyword: child.kw,
    parentPage: "invoice-templates"
  });
});

// 4. Other Pillars
const otherPillars = [
  { slug: "invoice-types", kw: "types of invoices", intent: "informational" },
  { slug: "accounting", kw: "small business accounting", intent: "informational" },
  { slug: "taxes", kw: "small business taxes", intent: "informational" },
  { slug: "receipts", kw: "receipt maker", intent: "tool" },
  { slug: "purchase-orders", kw: "purchase order template", intent: "template" },
  { slug: "estimates", kw: "estimate maker", intent: "tool" }
];

otherPillars.forEach(pillar => {
  createNode({
    slug: pillar.slug,
    category: "resources",
    primaryEntity: pillar.kw,
    searchIntent: pillar.intent,
    contentType: "hub",
    primaryKeyword: pillar.kw,
    parentPage: "invoice"
  });
});

fs.writeFileSync(
  path.join(__dirname, '../src/data/seoEntityGraph.json'),
  JSON.stringify(graph, null, 2)
);

console.log("seoEntityGraph.json generated successfully with " + Object.keys(graph).length + " nodes.");
