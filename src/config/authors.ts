export interface AuthorProfile {
  id: string;
  name: string;
  bio: string;
  expertise: string[];
  experience: string;
  socialProfiles: {
    linkedin?: string;
    twitter?: string;
    website?: string;
  };
  articlesWritten: string[];
  reviewedArticles: string[];
  avatarUrl?: string;
}

export const editorialTeam: AuthorProfile = {
  id: "editorial-team",
  name: "Invoice-Gen Editorial Team",
  bio: "Invoice-Gen Editorial Team creates practical invoicing, billing, accounting, and small business resources based on industry best practices for freelancers, agencies, contractors, consultants, and businesses worldwide.",
  expertise: ["Invoicing", "Accounting", "Small Business Strategy", "Cash Flow Management"],
  experience: "Official Editorial Team",
  socialProfiles: {
    website: "https://invoice-gen.net"
  },
  articlesWritten: [],
  reviewedArticles: [],
  avatarUrl: "/logo.svg" // Using the official site logo
};

// Proxy to ensure ANY requested author ID returns the editorial team for backwards compatibility
export const authors: Record<string, AuthorProfile> = new Proxy({}, {
  get: function() {
    // We always return the editorial team, regardless of the requested key
    return editorialTeam;
  }
});

// Reviewers also fallback to the editorial team
export const reviewers: Record<string, AuthorProfile> = new Proxy({}, {
  get: function() {
    return editorialTeam;
  }
});
