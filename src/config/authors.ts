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
    avatarUrl: "/avatars/jane-doe.webp"
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
    avatarUrl: "/avatars/john-smith.webp"
  }
};
