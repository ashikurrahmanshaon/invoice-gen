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

export const authors: Record<string, AuthorProfile> = {
  "jane-doe": {
    id: "jane-doe",
    name: "Jane Doe",
    bio: "Jane is a certified CPA with over 15 years of experience in small business accounting.",
    expertise: ["Accounting", "Tax Law", "Invoicing Standards"],
    experience: "15+ Years as CPA",
    socialProfiles: {
      linkedin: "https://linkedin.com/in/janedoe",
      twitter: "https://twitter.com/janedoe"
    },
    articlesWritten: ["/how-to-create-an-invoice", "/invoice-types"],
    reviewedArticles: [],
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=80"
  },
  "alex-rivera": {
    id: "alex-rivera",
    name: "Alex Rivera",
    bio: "Alex is a freelance operations consultant helping independent professionals optimize client contracts and cash flow.",
    expertise: ["Freelancing", "Client Contracts", "Payment Terms"],
    experience: "8+ Years Consulting",
    socialProfiles: {
      linkedin: "https://linkedin.com/in/alexrivera"
    },
    articlesWritten: ["/payment-terms-explained"],
    reviewedArticles: [],
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80"
  },
  "elena-rostova": {
    id: "elena-rostova",
    name: "Elena Rostova",
    bio: "Elena is a senior tax strategy specialist focusing on sole proprietorships and LLC tax optimizations.",
    expertise: ["Taxes", "Deductions", "Compliance"],
    experience: "12+ Years Tax Planning",
    socialProfiles: {
      linkedin: "https://linkedin.com/in/elenarostova"
    },
    articlesWritten: ["/tax-invoice"],
    reviewedArticles: [],
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
  }
};

export const reviewers: Record<string, AuthorProfile> = {
  "john-smith": {
    id: "john-smith",
    name: "John Smith, Esq.",
    bio: "John is a business compliance attorney specializing in digital commerce and tax compliance.",
    expertise: ["Legal Compliance", "Business Law", "Tax Audits"],
    experience: "10 Years Corporate Law",
    socialProfiles: {
      linkedin: "https://linkedin.com/in/johnsmith"
    },
    articlesWritten: [],
    reviewedArticles: ["/how-to-create-an-invoice"],
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=80"
  }
};
