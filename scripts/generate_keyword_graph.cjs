const fs = require('fs');
const path = require('path');

const graph = {};

function createCluster(options) {
  const {
    slug,
    primaryKeyword,
    secondaryKeywords = [],
    longTailKeywords = [],
    semanticKeywords = [],
    entityKeywords = [],
    questionKeywords = [],
    commercialKeywords = [],
    searchIntent = "informational",
    priority = "medium",
    businessValue = "medium",
    topicalAuthorityScore = 50,
    internalLinkPriority = 50
  } = options;

  graph[slug] = {
    slug,
    primaryKeyword,
    secondaryKeywords,
    longTailKeywords,
    semanticKeywords,
    entityKeywords,
    questionKeywords,
    commercialKeywords,
    searchIntent,
    priority,
    businessValue,
    topicalAuthorityScore,
    internalLinkPriority
  };
}

// 1. Core Generator
createCluster({
  slug: "invoice-generator",
  primaryKeyword: "invoice generator",
  secondaryKeywords: ["free invoice generator", "online invoice maker", "invoice creator"],
  longTailKeywords: ["how to make an invoice online for free", "create a professional invoice pdf"],
  semanticKeywords: ["billing software", "payment terms", "due date", "tax calculator"],
  entityKeywords: ["Invoice", "Receipt", "SaaS", "Billing"],
  questionKeywords: ["What is the best free invoice generator?", "How do I make my own invoice?"],
  commercialKeywords: ["invoice software", "buy invoice app", "best invoice tool"],
  searchIntent: "tool",
  priority: "critical",
  businessValue: "high",
  topicalAuthorityScore: 100,
  internalLinkPriority: 100
});

// 2. Freelance Templates
createCluster({
  slug: "freelance",
  primaryKeyword: "freelance invoice template",
  secondaryKeywords: ["invoice for freelancers", "independent contractor invoice"],
  longTailKeywords: ["how to write an invoice for freelance work", "freelance invoice template free download"],
  semanticKeywords: ["hourly rate", "services rendered", "project milestone"],
  entityKeywords: ["Freelancer", "Independent Contractor", "Gig Economy"],
  questionKeywords: ["How do I invoice as a freelancer?", "What should a freelancer put on an invoice?"],
  commercialKeywords: ["freelance billing software", "freelance invoice app"],
  searchIntent: "template",
  priority: "high",
  businessValue: "medium",
  topicalAuthorityScore: 85,
  internalLinkPriority: 80
});

// 3. Create Invoice Guide
createCluster({
  slug: "how-to-create-professional-invoice",
  primaryKeyword: "how to create a professional invoice",
  secondaryKeywords: ["how to make an invoice", "writing a professional invoice"],
  longTailKeywords: ["step by step guide to creating an invoice", "what to include in a professional invoice"],
  semanticKeywords: ["invoice number", "itemized list", "payment instructions", "net 30"],
  entityKeywords: ["Professional", "Business Management", "Accounting"],
  questionKeywords: ["What makes an invoice professional?", "How do you structure an invoice?"],
  commercialKeywords: [],
  searchIntent: "informational",
  priority: "high",
  businessValue: "medium",
  topicalAuthorityScore: 90,
  internalLinkPriority: 95
});

fs.writeFileSync(
  path.join(__dirname, '../src/data/keywordGraph.json'),
  JSON.stringify(graph, null, 2)
);

console.log("keywordGraph.json generated successfully.");
