import type { InvoiceTemplate } from '../types/invoice';

export const INVOICE_TEMPLATES: InvoiceTemplate[] = [
  {
    id: 'freelancer',
    name: 'Freelancer',
    description: 'Perfect for independent professionals.',
    useCase: 'Best for independent freelancers and contractors.',
    icon: 'User',
    tags: ['freelance', 'independent', 'contractor', 'services'],
    themeColor: '#155EEF', // Blue
    content: {
      notes: 'Thank you for your business. It is a pleasure working with you.',
      terms: 'Payment is due within 14 days. Please include the invoice number on your check or transfer.',
      paymentInstructions: 'Bank Transfer:\nBank: \nAccount No: \nRouting No: ',
      items: [
        { name: 'Professional Services', description: 'Hourly rate for services rendered', rate: 75, quantity: 10 }
      ]
    }
  },
  {
    id: 'software-agency',
    name: 'Software Agency',
    description: 'Best for software companies.',
    useCase: 'Agencies building software, web apps, or digital products.',
    icon: 'Code',
    tags: ['software', 'agency', 'development', 'web', 'app', 'design'],
    themeColor: '#0B1221', // Dark Navy
    content: {
      notes: 'We appreciate your partnership. Let us know if you need any further assistance with your project.',
      terms: 'Net 30. A 1.5% late fee applies per month for overdue payments.',
      paymentInstructions: 'Please remit payment via wire transfer or ACH:\nBank Name:\nAccount:\nRouting:',
      items: [
        { name: 'Web Development', description: 'Frontend and backend development services', rate: 120, quantity: 40 },
        { name: 'UI/UX Design', description: 'Interface design and prototyping', rate: 100, quantity: 20 }
      ]
    }
  },
  {
    id: 'restaurant',
    name: 'Restaurant',
    description: 'Food & beverage businesses.',
    useCase: 'Catering, private dining, or wholesale food orders.',
    icon: 'Utensils',
    tags: ['food', 'beverage', 'catering', 'restaurant', 'dining'],
    themeColor: '#F97316', // Orange
    content: {
      notes: 'Thank you for dining with us or choosing our catering services! We hope you enjoyed the food.',
      terms: 'Payment due upon receipt.',
      paymentInstructions: 'Payable via Credit Card, Check, or Cash upon delivery.',
      items: [
        { name: 'Catering Service', description: 'Assorted appetizers and main courses', rate: 25, quantity: 50 },
        { name: 'Event Staff', description: 'Waitstaff for 4 hours', rate: 30, quantity: 2 }
      ]
    }
  },
  {
    id: 'medical',
    name: 'Medical',
    description: 'Clinics and healthcare.',
    useCase: 'Medical clinics, therapy practices, and healthcare providers.',
    icon: 'Activity',
    tags: ['medical', 'health', 'clinic', 'doctor', 'therapy'],
    themeColor: '#10B981', // Green
    content: {
      notes: 'Wishing you good health. Please contact our billing department for any questions.',
      terms: 'Payment is due within 30 days of the service date. Insurance co-pays are due at the time of visit.',
      paymentInstructions: 'Please make checks payable to the clinic or pay online via our patient portal.',
      items: [
        { name: 'Consultation', description: 'Standard office visit', rate: 150, quantity: 1 },
        { name: 'Diagnostic Testing', description: 'Lab panel', rate: 85, quantity: 1 }
      ]
    }
  },
  {
    id: 'legal',
    name: 'Legal',
    description: 'Law firms.',
    useCase: 'Attorneys, legal consultants, and law practices.',
    icon: 'Scale',
    tags: ['legal', 'law', 'attorney', 'lawyer', 'consulting'],
    themeColor: '#475569', // Slate
    content: {
      notes: 'Thank you for trusting us with your legal matters.',
      terms: 'Retainer balance must be replenished within 15 days. Unpaid balances accrue interest at 1% monthly.',
      paymentInstructions: 'Wire transfer to Trust Account:\nBank:\nAccount:\nRouting:',
      items: [
        { name: 'Legal Consultation', description: 'Review of documents and strategy session', rate: 350, quantity: 2 },
        { name: 'Document Drafting', description: 'Contract preparation', rate: 250, quantity: 3 }
      ]
    }
  },
  {
    id: 'architecture',
    name: 'Architecture',
    description: 'Architects and engineers.',
    useCase: 'Architectural design, drafting, and engineering consulting.',
    icon: 'Building2',
    tags: ['architecture', 'design', 'engineering', 'drafting'],
    themeColor: '#374151', // Charcoal
    content: {
      notes: 'It has been a pleasure designing your space.',
      terms: 'Payment for this phase is required before moving to the next project phase. Net 15.',
      paymentInstructions: 'Please send checks or wire transfer to our main office.',
      items: [
        { name: 'Schematic Design', description: 'Initial concepts and layout planning', rate: 200, quantity: 15 },
        { name: 'Site Visit', description: 'Project assessment and measurements', rate: 150, quantity: 1 }
      ]
    }
  },
  {
    id: 'construction',
    name: 'Construction',
    description: 'Contractors.',
    useCase: 'General contractors, builders, and tradesmen.',
    icon: 'HardHat',
    tags: ['construction', 'contractor', 'building', 'trades', 'repair'],
    themeColor: '#F59E0B', // Amber
    content: {
      notes: 'Thank you for choosing us for your construction needs.',
      terms: '50% deposit required to begin work. Remaining balance due upon project completion.',
      paymentInstructions: 'Checks should be made payable to the company name.',
      items: [
        { name: 'Labor', description: 'General construction labor', rate: 65, quantity: 40 },
        { name: 'Materials', description: 'Lumber, concrete, and hardware', rate: 1200, quantity: 1 }
      ]
    }
  },
  {
    id: 'photography',
    name: 'Photography',
    description: 'Creative professionals.',
    useCase: 'Photographers, videographers, and creative studios.',
    icon: 'Camera',
    tags: ['photography', 'creative', 'video', 'design', 'art'],
    themeColor: '#8B5CF6', // Purple
    content: {
      notes: 'Thank you for letting me capture these moments for you!',
      terms: 'A non-refundable 30% retainer is required to secure the date. Final payment due before gallery delivery.',
      paymentInstructions: 'Accepting Venmo, Zelle, or Bank Transfer.',
      items: [
        { name: 'Event Coverage', description: 'On-site photography (hourly)', rate: 150, quantity: 8 },
        { name: 'Post-Processing', description: 'Editing and retouching', rate: 50, quantity: 10 }
      ]
    }
  },
  {
    id: 'consulting',
    name: 'Consulting',
    description: 'Business consultants.',
    useCase: 'Management, financial, or specialized consulting services.',
    icon: 'Briefcase',
    tags: ['consulting', 'business', 'management', 'strategy'],
    themeColor: '#14B8A6', // Teal
    content: {
      notes: 'Thank you for your business. We look forward to seeing your continued growth.',
      terms: 'Net 30 days. Please include the invoice number on your payment.',
      paymentInstructions: 'ACH or Wire Transfer preferred:\nBank:\nAccount:\nRouting:',
      items: [
        { name: 'Strategic Advisory', description: 'Monthly retainer for business strategy', rate: 250, quantity: 10 }
      ]
    }
  },
  {
    id: 'education',
    name: 'Education',
    description: 'Tutors and trainers.',
    useCase: 'Private tutors, online courses, and corporate training.',
    icon: 'GraduationCap',
    tags: ['education', 'tutor', 'training', 'school', 'course'],
    themeColor: '#6366F1', // Indigo
    content: {
      notes: 'Thank you for investing in education and growth!',
      terms: 'Payment is due at the start of the billing cycle or prior to the first session.',
      paymentInstructions: 'Please pay via the online student portal or via direct bank transfer.',
      items: [
        { name: 'Private Tutoring', description: '1-on-1 session', rate: 60, quantity: 4 },
        { name: 'Course Materials', description: 'Textbooks and digital access', rate: 120, quantity: 1 }
      ]
    }
  },
  {
    id: 'cleaning',
    name: 'Cleaning',
    description: 'Cleaning services.',
    useCase: 'Residential, commercial, and specialized cleaning.',
    icon: 'Sparkles',
    tags: ['cleaning', 'maintenance', 'janitorial', 'home'],
    themeColor: '#06B6D4', // Cyan
    content: {
      notes: 'We hope you enjoy your sparkling clean space!',
      terms: 'Payment due upon completion of service.',
      paymentInstructions: 'Cash, Check, or Zelle accepted at the time of service.',
      items: [
        { name: 'Deep Clean', description: 'Full house deep cleaning service', rate: 250, quantity: 1 }
      ]
    }
  },
  {
    id: 'marketing',
    name: 'Marketing',
    description: 'Marketing agencies.',
    useCase: 'SEO, social media, and digital marketing services.',
    icon: 'Megaphone',
    tags: ['marketing', 'seo', 'social media', 'advertising', 'agency'],
    themeColor: '#E11D48', // Rose
    content: {
      notes: 'Excited to see your campaigns drive results this month!',
      terms: 'Net 15. Recurring retainer invoices are sent on the 1st of each month.',
      paymentInstructions: 'Please pay via ACH or Credit Card via the link provided in the email.',
      items: [
        { name: 'Social Media Management', description: 'Monthly retainer for content creation and posting', rate: 1500, quantity: 1 },
        { name: 'Ad Spend Management', description: 'PPC campaign optimization', rate: 500, quantity: 1 }
      ]
    }
  },
  {
    id: 'interior-design',
    name: 'Interior Design',
    description: 'Interior designers.',
    useCase: 'Home styling, staging, and interior architecture.',
    icon: 'Paintbrush',
    tags: ['design', 'interior', 'staging', 'decor'],
    themeColor: '#78716C', // Stone
    content: {
      notes: 'It has been wonderful helping bring your vision to life.',
      terms: 'Furniture and material deposits are non-refundable. Final design fee due Net 15.',
      paymentInstructions: 'Wire transfer or check payable to the studio.',
      items: [
        { name: 'Design Concept', description: 'Mood boards and spatial planning', rate: 125, quantity: 15 },
        { name: 'Procurement Fee', description: 'Purchasing and logistics management', rate: 500, quantity: 1 }
      ]
    }
  },
  {
    id: 'creator',
    name: 'Creator',
    description: 'Content creators.',
    useCase: 'Influencers, YouTubers, and content sponsorships.',
    icon: 'Video',
    tags: ['creator', 'influencer', 'youtube', 'tiktok', 'social'],
    themeColor: '#7C3AED', // Violet
    content: {
      notes: 'Thanks for sponsoring the content! Excited for our audience to see it.',
      terms: 'Payment is required within 30 days of the video going live.',
      paymentInstructions: 'Direct deposit or PayPal.',
      items: [
        { name: 'Dedicated Video Integration', description: '60-second ad spot on YouTube', rate: 2500, quantity: 1 },
        { name: 'Social Media Shoutout', description: 'Instagram Story and Feed Post', rate: 500, quantity: 2 }
      ]
    }
  },
  {
    id: 'agency',
    name: 'Agency',
    description: 'Creative and ad agencies.',
    useCase: 'Full-service creative, branding, and advertising agencies.',
    icon: 'Layers',
    tags: ['agency', 'creative', 'branding', 'advertising'],
    themeColor: '#111827', // Gray 900
    content: {
      notes: 'Thank you for trusting our agency with your brand.',
      terms: 'Net 30 terms. Late payments subject to a 2% fee.',
      paymentInstructions: 'ACH or Wire transfer to our corporate account.',
      items: [
        { name: 'Brand Strategy', description: 'Brand identity and positioning', rate: 5000, quantity: 1 },
        { name: 'Campaign Execution', description: 'Asset creation and delivery', rate: 2500, quantity: 1 }
      ]
    }
  }
];
