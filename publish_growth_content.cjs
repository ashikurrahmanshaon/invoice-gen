const fs = require('fs');
const path = require('path');

function cleanText(str) {
  const clean = str.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  if (clean.length > 155) {
    return clean.substring(0, 152) + '...';
  }
  return clean;
}

// 20 High-Value Templates
const templates = [
  {
    slug: 'translator',
    title: 'Free Translator Invoice Template',
    subtitle: 'Generate professional translator invoices with word count billing, language pairings, and multi-currency options.',
    roleText: 'independent translators, localization specialists, and proofreaders',
    nicheList: [
      'Document Translation: Billing per word or hourly proofreading rates.',
      'Localization Specialists: Adjusting app string layouts and content pairing.',
      'Simultaneous Interpreters: Invoicing for event sessions, half-day, or full-day rates.'
    ],
    nicheTips: [
      'Specify Language Pairings: List source and target language columns clearly.',
      'Show Word Counts: Include exact word counts next to unit prices to make rates transparent.',
      'List CAT Tool Deductions: Clearly detail matches or fuzzy-match rate scales.'
    ]
  },
  {
    slug: 'editor-proofreader',
    title: 'Free Editor & Proofreader Invoice Template',
    subtitle: 'Professional billing for manuscript editors, academic proofreaders, and content polishers.',
    roleText: 'manuscript editors, technical proofreaders, and copyeditors',
    nicheList: [
      'Developmental Editing: Structuring story outline stages and chapter flow feedback.',
      'Proofreading: Fixing grammar, typos, and formatting errors.',
      'Academic Editing: Checking citations, bibliography structures, and style guides.'
    ],
    nicheTips: [
      'Itemize Page or Word Counts: Specify if billing is per page, per word, or hourly.',
      'Note Revision Limits: State clearly how many post-edit revision rounds are included.',
      'Cite Style Guide: Note the style guide utilized (APA, Chicago, MLA) for client clarity.'
    ]
  },
  {
    slug: 'voiceover-artist',
    title: 'Free Voiceover Artist Invoice Template',
    subtitle: 'Streamlined invoicing for voice actors, audio narrators, and audio book creators.',
    roleText: 'voice actors, commercial announcers, and audiobook narrators',
    nicheList: [
      'Commercial Voiceover: Invoicing for regional, national, or digital broadcast runs.',
      'Audiobook Narration: Billing per finished hour (PFH) or royalty share setups.',
      'E-Learning Narrators: Providing training script reads and presentation voiceovers.'
    ],
    nicheTips: [
      'Detail Broadcast Usage Rights: List buyout durations and regional run limits.',
      'Define Pick-Up Rates: Outline fees for correction reads versus script edits.',
      'Audio Specs: Mention delivery formats (WAV, MP3, sample rates) on the description.'
    ]
  },
  {
    slug: 'event-planner',
    title: 'Free Event Planner Invoice Template',
    subtitle: 'Professional billing for wedding planners, corporate event coordinators, and party hosts.',
    roleText: 'wedding coordinators, corporate event managers, and logistics planners',
    nicheList: [
      'Day-of Coordination: Managing vendor deliveries and itinerary stages.',
      'Full-Service Planning: Handling venue contracts, styling choices, and budget metrics.',
      'Corporate Gatherings: Invoicing for seminars, conferences, and stakeholder dinners.'
    ],
    nicheTips: [
      'Outline Payment Milestones: Set upfront deposits and day-of final balance terms.',
      'List Reimbursable Costs: Separate vendor management hours from direct product purchases.',
      'Add Guest Count Limits: State if fees adjust based on final attendee quantities.'
    ]
  },
  {
    slug: 'business-coach',
    title: 'Free Business Coach Invoice Template',
    subtitle: 'Clean invoicing templates for executive coaches, startup mentors, and career guides.',
    roleText: 'executive coaches, leadership mentors, and career growth advisors',
    nicheList: [
      'Executive Coaching: Weekly leadership assessments and strategy sessions.',
      'Startup Mentoring: Product roadmap reviews and pitch deck guidance.',
      'Group Workshops: Invoicing for team strategy days or corporate retreats.'
    ],
    nicheTips: [
      'Standardize Retainers: Set upfront monthly retainer billing due on the 1st.',
      'Define Session Policies: State cancellation limits (e.g., 24-hour notice) clearly.',
      'Track Included Materials: Note if tools or workbooks are included in the package.'
    ]
  },
  {
    slug: 'project-manager',
    title: 'Free Project Manager Invoice Template',
    subtitle: 'Professional PM invoicing templates for agile coordinators, construction managers, and Scrum masters.',
    roleText: 'freelance project managers, Scrum masters, and delivery coordinators',
    nicheList: [
      'Agile Coordination: Organizing sprint pipelines and Scrum ceremonies.',
      'Construction PM: Coordinating sub-contractors, site permits, and resource timelines.',
      'Digital Delivery: Overseeing design handoffs and code deployment sprint stages.'
    ],
    nicheTips: [
      'State Billing Period: List the specific weeks or sprint numbers in the description.',
      'List Key Deliverables: Note main milestones hit (e.g., Sprint 4 Completed).',
      'Detail Expenses: Itemize travel, SaaS subscription costs, or tool integrations.'
    ]
  },
  {
    slug: 'it-support',
    title: 'Free IT Support Invoice Template',
    subtitle: 'Easy invoicing templates for network engineers, tech consultants, and systems administrators.',
    roleText: 'systems administrators, IT consultants, and computer repair technicians',
    nicheList: [
      'Network Setup: Invoicing for router installs, security firewalls, and server racks.',
      'Managed IT Services: Monthly support hours and remote system updates.',
      'Device Troubleshooting: Invoicing hardware swap-outs and data recovery runs.'
    ],
    nicheTips: [
      'List Hourly Increments: Show hours worked, network ports configured, or devices fixed.',
      'Detail Third-Party Software: Separate software license charges from service fees.',
      'Define SLA Response: Mention emergency call-out premiums if applicable.'
    ]
  },
  {
    slug: 'data-analyst',
    title: 'Free Data Analyst Invoice Template',
    subtitle: 'Elegant data analyst invoicing templates for BI developers, dashboard designers, and SQL query writers.',
    roleText: 'data analysts, business intelligence consultants, and database query builders',
    nicheList: [
      'Dashboard Creation: Building visual PowerBI, Tableau, or Looker reports.',
      'Database Optimization: Tuning SQL queries and index layouts for performance.',
      'Predictive Modeling: Structuring data cleanup pipelines and forecasting models.'
    ],
    nicheTips: [
      'Itemize Pipelines Created: Detail distinct connectors, feeds, or dashboards built.',
      'Specify Data Formats: State the source systems accessed (BigQuery, Redshift, Snowflake).',
      'Add NDA Notes: Reassure the client of data confidentiality in the notes area.'
    ]
  },
  {
    slug: 'architect',
    title: 'Free Architect Invoice Template',
    subtitle: 'Professional billing templates for architectural designers, draftspersons, and building consultants.',
    roleText: 'architects, blueprint draftspersons, and building engineers',
    nicheList: [
      'Schematic Design: Invoicing initial site reviews, floorplans, and layout elevations.',
      'Permit Drawings: Creating technical code drawings for local municipal boards.',
      'Construction Overseer: On-site compliance checks and builder status reviews.'
    ],
    nicheTips: [
      'Bill by Project Stage: Use standard architectural stages (SD, DD, CD, CA).',
      'Separate Square Footage: Clearly state square footage ranges and per-meter fees.',
      'Itemize Printing/Courier: Show architectural blueprint printing fees separately.'
    ]
  },
  {
    slug: 'interior-designer',
    title: 'Free Interior Designer Invoice Template',
    subtitle: 'Streamlined invoicing templates for space planners, home stagers, and decor decorators.',
    roleText: 'interior designers, space layout consultants, and staging professionals',
    nicheList: [
      'Room Layout Design: Providing 3D CAD renders and material boards.',
      'Furniture Procurement: Managing client decor orders, deliveries, and installs.',
      'Home Staging: Staging properties for real estate sales and photoshoots.'
    ],
    nicheTips: [
      'Detail Markup Rules: List furniture procurement markups and designer discounts.',
      'Separate Design vs Purchase: Keep design fee hours separate from direct product purchase bills.',
      'Specify Room Names: Detail line items by room (e.g., Living Room Decor).'
    ]
  },
  {
    slug: 'handyman',
    title: 'Free Handyman Invoice Template',
    subtitle: 'Easy handyman billing templates for local repairers, assembly services, and home maintenance.',
    roleText: 'handymen, assembly workers, and home repair technicians',
    nicheList: [
      'Furniture Assembly: Putting together flatpack desks, shelving, and beds.',
      'Small Home Repairs: Patching drywall, fixing hinges, and hanging doors.',
      'Fixture Installs: Mounting televisions, hanging mirrors, and swapping faucets.'
    ],
    nicheTips: [
      'Separate Labor from Parts: List parts purchased (drywall anchors, paint) separately.',
      'Note Minimum Fees: List call-out or minimum hours charges.',
      'Job Safety: Reassure customers that licensing and insurance coverage are active.'
    ]
  },
  {
    slug: 'plumber',
    title: 'Free Plumber Invoice Template',
    subtitle: 'Professional plumbing billing templates for local drain clearers, piping repairers, and water heaters.',
    roleText: 'plumbing technicians, pipe repairers, and drainage specialists',
    nicheList: [
      'Emergency Leak Repairs: Swapping broken copper pipes or shut-off valves.',
      'Drain Clearing: Rooter snaking and high-pressure jetting of sewer mains.',
      'Appliance Swaps: Installing new water heaters, garbage disposals, and toilet units.'
    ],
    nicheTips: [
      'Specify Materials: List pipe lengths, seals, and valves used.',
      'Emergency Charges: Show standard call-out fees separate from hourly rates.',
      'Provide Warranty Info: State terms for labor and part guarantees in the terms section.'
    ]
  },
  {
    slug: 'electrician',
    title: 'Free Electrician Invoice Template',
    subtitle: 'Streamlined billing templates for licensed electricians, panel upgraders, and fixture installers.',
    roleText: 'licensed electricians, panel installers, and commercial wiremen',
    nicheList: [
      'Panel Upgrades: Swapping out legacy fuse boxes for 200A breaker panels.',
      'Rewiring Services: Installing Romex lines, outlets, and GFCIs.',
      'Lighting Installs: Hanging ceiling fans, recessed cans, and outdoor floods.'
    ],
    nicheTips: [
      'List Certification Number: Always write your active electrical license number.',
      'Itemize Permit Costs: Show local municipal inspection permits separately.',
      'Detail Safety Checks: Document that compliance tests passed.'
    ]
  },
  {
    slug: 'hvac-technician',
    title: 'Free HVAC Technician Invoice Template',
    subtitle: 'Professional invoice templates for AC repairers, furnace installers, and duct cleaners.',
    roleText: 'HVAC repair techs, AC installers, and furnace system technicians',
    nicheList: [
      'AC Maintenance: Charging system coolants and swapping air filters.',
      'Furnace Installs: Setting up energy-efficient heat pump systems.',
      'Duct Cleaning: Removing debris from home supply vents and registers.'
    ],
    nicheTips: [
      'List System Model Numbers: Write down the furnace/AC brand and model worked on.',
      'Specify Coolant Quantities: List exact pounds of R410A or R22 coolant added.',
      'Note Filter Specs: Detail sizing of replacement filters.'
    ]
  },
  {
    slug: 'painter-contractor',
    title: 'Free Painting Contractor Invoice Template',
    subtitle: 'Elegant billing templates for house painters, dry-wall finishers, and commercial paint crews.',
    roleText: 'house painters, deck stainers, and commercial paint contractors',
    nicheList: [
      'Exterior Painting: Scraping, priming, and painting siding and trim.',
      'Interior Painting: Masking, painting walls, ceilings, and baseboard trims.',
      'Deck Staining: Pressure washing and sealing outdoor wood decks.'
    ],
    nicheTips: [
      'List Paint Brand/Color: Write the exact paint brand, sheen, and color code used.',
      'State Prep Work Hours: Separate masking and priming labor from final coat hours.',
      'Gallons Used: Itemize number of gallons supplied to the job.'
    ]
  },
  {
    slug: 'carpenter',
    title: 'Free Carpenter Invoice Template',
    subtitle: 'Streamlined carpenter billing templates for trim installers, deck builders, and furniture makers.',
    roleText: 'trim carpenters, framers, and custom cabinet makers',
    nicheList: [
      'Trim Installation: Hanging crown molding, baseboards, and door casings.',
      'Custom Cabinetry: Building bespoke kitchen pantries and bookshelf units.',
      'Deck Framing: Constructing load-bearing joists and posts.'
    ],
    nicheTips: [
      'Detail Wood Species: Note material grades (e.g., Select Pine, Walnut, Oak).',
      'List Fasteners & Hardware: Itemize premium hinges, pulls, or specialty screws.',
      'Milestones: Detail deposits for material purchases before starting.'
    ]
  },
  {
    slug: 'roofer',
    title: 'Free Roofer Invoice Template',
    subtitle: 'Professional roofing invoice templates for shingle installers, leak patchers, and gutter crews.',
    roleText: 'roofing contractors, shingle repairers, and gutter installers',
    nicheList: [
      'Full Roof Replacement: Tearing off legacy shingles and installing architectural felt.',
      'Leak Repairs: Fixing flashing around chimneys, vents, and valleys.',
      'Gutter Installation: Setting up seamless aluminum gutters and leaf guards.'
    ],
    nicheTips: [
      'Squares Replaced: List quantity of roofing squares (100 sq ft) supplied.',
      'Shingle Details: Specify shingle brand, warranty, and color choice.',
      'Debris Disposal: List dumpster rental or yard cleanup fees as separate line items.'
    ]
  },
  {
    slug: 'landscaping',
    title: 'Free Landscaping Invoice Template',
    subtitle: 'Elegant billing templates for sod installers, garden designers, and hardscaping crews.',
    roleText: 'landscape contractors, garden designers, and sod installers',
    nicheList: [
      'Lawn Installation: Grading soil, laying sod rolls, and seeding grass.',
      'Hardscaping Services: Installing paver patios, retaining walls, and pathways.',
      'Irrigation Systems: Laying drip lines and configuring sprinkler controllers.'
    ],
    nicheTips: [
      'Itemize Plant Material: List trees, shrubs, and mulch quantities individually.',
      'Specify Machine Rentals: Separate excavator or bobcat rental hours.',
      'Detail Seasonality: Note seasonal cleanup dates (Fall/Spring).'
    ]
  },
  {
    slug: 'gardener',
    title: 'Free Gardener Invoice Template',
    subtitle: 'Easy invoicing templates for local weeding, lawn mowing, and yard cleanup.',
    roleText: 'gardeners, lawn care workers, and weeding services',
    nicheList: [
      'Lawn Mowing: Invoicing for weekly mowing, trimming, and blowing driveways.',
      'Flowerbed Maintenance: Weeding, pruning roses, and applying topsoil.',
      'Hedge Trimming: Shaping privacy hedges and shrub borders.'
    ],
    nicheTips: [
      'Define Visit Cadence: State the specific visit dates (e.g., Weekly Mowing June 4, 11, 18).',
      'Green Waste Fees: List municipal composting dump fees separately.',
      'Supply List: Itemize granular fertilizer, seeds, or organic insecticides.'
    ]
  },
  {
    slug: 'pet-sitter',
    title: 'Free Pet Sitter Invoice Template',
    subtitle: 'Clean invoicing templates for dog walkers, cat sitters, and overnight pet hosts.',
    roleText: 'dog sitters, cat boarding hosts, and pet care technicians',
    nicheList: [
      'Overnight Pet Sitting: House sitting and caring for pets in-home.',
      'Dog Walking: Providing scheduled 30-minute or hourly exercise runs.',
      'Drop-In Feeding Visits: Replenishing food, water, and cleaning litterboxes.'
    ],
    nicheTips: [
      'Detail Number of Pets: State client pet names clearly on description lines.',
      'Holiday Premiums: Separate holiday surge fees from standard rates.',
      'Track Mileage: Add transport costs if picking up or dropping off pets.'
    ]
  }
];

// 20 High-Intent Blog Articles
const blogs = [
  {
    slug: 'how-to-write-a-professional-invoice',
    title: 'How to Write a Professional Invoice: Step-by-Step Guide',
    date: 'July 12, 2026',
    sections: [
      {
        h2: '1. Why a Professional Invoice Matters',
        p: 'Your invoice is the final touchpoint of a client transaction. If it is messy, vague, or missing key parameters, your payment will be delayed. Standardizing on clear, professional billing fields establishes trust and coordinates clean business records.'
      },
      {
        h2: '2. Six Core Fields You Must Include',
        p: 'Every commercial invoice must clearly display: (1) A header with your legal business name, contact info, and logo. (2) Your client\'s corporate billing address and billing contact. (3) A unique, sequential invoice number. (4) The invoice date and due date. (5) Clear, itemized line items with descriptions. (6) Balance due totals and bank transfer payment instructions.'
      },
      {
        h2: '3. Standardizing Invoicing Workflows',
        p: 'Never send editable Word files. Export your billing to a clean PDF format. This ensures formatting remains identical across devices and prevents tampering.'
      }
    ],
    faq: [
      { q: 'What is the most important field on an invoice?', a: 'The unique invoice number. This is critical for matching bank ledger payments and is required by tax regulators for business tax audits.' },
      { q: 'Should I send invoices in Word or Excel?', a: 'No. Word and Excel templates are easily altered. Always export your invoices as uneditable PDFs to maintain document security.' }
    ]
  },
  {
    slug: 'essential-fields-to-include-on-invoice',
    title: 'Essential Fields to Include on Your Invoices',
    date: 'July 12, 2026',
    sections: [
      {
        h2: '1. Detailed Contact Coordinates',
        p: 'Ensure both your billing details and the client\'s corporate name match official tax filings. Include email address, active phone number, and physical mailing coordinates.'
      },
      {
        h2: '2. The Critical Dates',
        p: 'Show the invoice issue date and the exact due date. Do not write vague terms like "Pay within 2 weeks." State "Due Date: July 27, 2026" to eliminate timeline confusion.'
      },
      {
        h2: '3. Line Item Formatting',
        p: 'For each row in your items grid, state the service name, brief description, quantity/hours, unit price, and total line amount.'
      }
    ],
    faq: [
      { q: 'What is a sequential invoice number?', a: 'A sequential numbering system (e.g. INV-001, INV-002) ensures your bookkeeping stays organized and prevents clients from skipping bills.' }
    ]
  },
  {
    slug: 'invoice-vs-receipt-key-differences',
    title: 'Invoice vs. Receipt: Key Differences Explained',
    date: 'July 12, 2026',
    sections: [
      {
        h2: '1. What is an Invoice?',
        p: 'An invoice is a request for payment sent by a service provider to a client. It details the services provided, rates, and terms, indicating that a payment obligation exists.'
      },
      {
        h2: '2. What is a Receipt?',
        p: 'A receipt is proof of payment issued after the invoice balance has been settled. It details the amount paid, payment method, and confirms that the outstanding balance is now zero.'
      },
      {
        h2: '3. Accounting Implications',
        p: 'Invoices help track accounts receivable (money owed to you), while receipts track actual cash flow and are used for tax write-off logs.'
      }
    ],
    faq: [
      { q: 'Can an invoice act as a receipt?', a: 'No. An invoice is a bill, whereas a receipt is a payment confirmation. A paid invoice marked "Paid" can serve as an informal confirmation, but a formal receipt is always preferred.' }
    ]
  },
  {
    slug: 'choosing-the-best-payment-terms-for-freelancers',
    title: 'Choosing the Best Invoicing Payment Terms',
    date: 'July 12, 2026',
    sections: [
      {
        h2: '1. What are Payment Terms?',
        p: 'Payment terms define when your client must pay. They are typically indicated using code abbreviations like Net 15, Net 30, or COD (Cash on Delivery).'
      },
      {
        h2: '2. Net 15 vs. Net 30',
        p: 'Net 15 means payment is due within 15 days; Net 30 allows 30 days. For freelancers, Net 15 is standard to prevent long unpaid gaps.'
      },
      {
        h2: '3. Implementing Upfront Deposits',
        p: 'For large contracts, always charge a 50% upfront deposit. This protects your cash flow and ensures the client has skin in the game.'
      }
    ],
    faq: [
      { q: 'Should I charge late fees?', a: 'Yes, outline late payment terms in your initial contract. A standard 1.5% to 2% monthly interest fee motivates clients to process payments on time.' }
    ]
  },
  {
    slug: 'how-to-invoice-clients-internationally',
    title: 'How to Invoice Clients Internationally: A Practical Guide',
    date: 'July 12, 2026',
    sections: [
      {
        h2: '1. Specify the Currency Clearly',
        p: 'When billing international clients, specify the target currency (e.g. USD, EUR, GBP) using standard three-letter ISO codes next to all amounts.'
      },
      {
        h2: '2. Provide Global Banking Details',
        p: 'Include complete global wire details: IBAN, BIC/SWIFT code, bank name, bank address, and routing coordinates.'
      },
      {
        h2: '3. Handling Exchange Rates',
        p: 'Agree on exchange rate terms in your contract. Typically, the client pays the equivalent rate in your home currency on the day the invoice is issued.'
      }
    ],
    faq: [
      { q: 'What is a SWIFT code?', a: 'A SWIFT or BIC code is a unique identifier used by banks globally to route wire transfers safely between different countries.' }
    ]
  },
  {
    slug: 'what-is-a-proforma-invoice',
    title: 'What is a Proforma Invoice and When Do You Need One?',
    date: 'July 12, 2026',
    sections: [
      {
        h2: '1. Definition of a Proforma Invoice',
        p: 'A proforma invoice is a preliminary bill sent before goods or services are delivered. It estimates cost, shipping, and customs details.'
      },
      {
        h2: '2. Proforma vs. Commercial Invoice',
        p: 'Unlike a commercial invoice, a proforma is not a formal payment request and is not logged in accounts receivable. It is used to get importing approval or advance deposits.'
      },
      {
        h2: '3. When to Use Proforma',
        p: 'Use a proforma invoice for international trade, customs declarations, or when the client requires a budget invoice for purchase order approval.'
      }
    ],
    faq: [
      { q: 'Can a client pay using a proforma invoice?', a: 'No, they pay after receiving a formal tax invoice. The proforma is an informational document used for internal corporate approvals.' }
    ]
  },
  {
    slug: 'when-to-use-a-commercial-invoice',
    title: 'When to Use a Commercial Invoice for Global Trade',
    date: 'July 12, 2026',
    sections: [
      {
        h2: '1. What is a Commercial Invoice?',
        p: 'A commercial invoice is a custom document used for importing and exporting goods. Customs agents use it to calculate duties and taxes.'
      },
      {
        h2: '2. Required Customs Fields',
        p: 'You must list: country of origin, product descriptions, HS (Harmonized System) tariff codes, and shipping weight/dimensions.'
      },
      {
        h2: '3. Regulatory Compliance',
        p: 'Failing to attach a commercial invoice can result in customs seizures, delays, and penalties. Ensure all package values are logged accurately.'
      }
    ],
    faq: [
      { q: 'What is an HS code?', a: 'An HS (Harmonized System) code is a standardized classification number used by global customs to identify imported products.' }
    ]
  },
  {
    slug: 'how-to-invoice-for-hourly-work',
    title: 'How to Invoice for Hourly Work and Consulting Hours',
    date: 'July 12, 2026',
    sections: [
      {
        h2: '1. Track Your Hours Rigorously',
        p: 'When billing hourly, use a time-tracker app to capture work increments down to the minute. Log detailed notes for each session.'
      },
      {
        h2: '2. Format Hourly Line Items',
        p: 'In your invoice grid, specify the task name, date, hours worked, hourly rate, and the total line cost.'
      },
      {
        h2: '3. Attach Time Sheets',
        p: 'Attach your detailed time log sheet to the back of the invoice to reassure the client of the billing\'s accuracy.'
      }
    ],
    faq: [
      { q: 'How should I round my hours?', a: 'Most freelancers round time to the nearest 15-minute increment (0.25 hours) for billing simplicity.' }
    ]
  },
  {
    slug: 'writing-an-invoice-under-a-retainer',
    title: 'How to Write an Invoice for Retainer Agreements',
    date: 'July 12, 2026',
    sections: [
      {
        h2: '1. What is a Retainer?',
        p: 'A retainer is an advance payment made by a client to secure a freelancer\'s availability for a specific number of monthly hours.'
      },
      {
        h2: '2. Invoicing Upfront vs. Post-Work',
        p: 'Retainers are typically billed upfront at the start of the month (e.g. invoiced on the 1st, due upon receipt) to secure resource reserves.'
      },
      {
        h2: '3. Reconciling Rollover Hours',
        p: 'Clearly state if unused hours roll over to the next month or expire. Most freelancers write contracts where hours expire to ensure predictable schedules.'
      }
    ],
    faq: [
      { q: 'Do retainers require contracts?', a: 'Absolutely. Never invoice a retainer without a signed service level agreement outlining monthly hour allocations and rollover parameters.' }
    ]
  },
  {
    slug: 'how-to-invoice-for-mileage-reimbursement',
    title: 'How to Invoice for Mileage and Expense Reimbursements',
    date: 'July 12, 2026',
    sections: [
      {
        h2: '1. Expense Invoicing Basics',
        p: 'When a client agrees to reimburse you for project expenses (travel, software, assets), list them as separate line items on your invoice.'
      },
      {
        h2: '2. Billing for Mileage',
        p: 'Use the standard IRS mileage rate (or regional equivalents). List total miles driven, the approved rate per mile, and attach route maps.'
      },
      {
        h2: '3. Attaching Receipts',
        p: 'Attach clear photos of all expense receipts to the invoice. This is critical for client auditing and your tax record documentation.'
      }
    ],
    faq: [
      { q: 'Should I markup expenses?', a: 'Only if agreed upon. Some agencies charge a 10% to 15% handling markup to cover the admin costs of sourcing materials.' }
    ]
  },
  {
    slug: 'invoicing-for-creative-licenses-and-royalties',
    title: 'Invoicing for Creative Licenses, Assets, and Royalties',
    date: 'July 12, 2026',
    sections: [
      {
        h2: '1. Separating Services from Licenses',
        p: 'If you are a designer, photographer, or voice artist, separate your labor creation fee from the asset licensing fee on the invoice.'
      },
      {
        h2: '2. Defining Usage Parameters',
        p: 'Specify usage limits on the invoice: target platforms, regional runs, and license duration (e.g., "1-Year Digital Broadcast Use").'
      },
      {
        h2: '3. Royalty Milestone Billing',
        p: 'For sales-based royalties, list the calculation period, units sold, royalty percentage, and the resulting invoice total.'
      }
    ],
    faq: [
      { q: 'Why should I list license terms on the invoice?', a: 'Listing terms on the invoice binds the payment to the usage rights. If they fail to pay the invoice, they have no legal right to use your creative work.' }
    ]
  },
  {
    slug: 'handling-down-payments-and-deposits',
    title: 'How to Handle Down Payments and Upfront Deposits',
    date: 'July 12, 2026',
    sections: [
      {
        h2: '1. The Safety of Upfront Deposits',
        p: 'For new clients or large projects, demanding a down payment is essential. This guarantees that you can allocate dedicated schedule blocks without risk.'
      },
      {
        h2: '2. Structuring Deposit Invoices',
        p: 'Label the invoice clearly as "Deposit Invoice: 50% Upfront." Once paid, issue a second invoice at project completion showing the deposit deducted.'
      },
      {
        h2: '3. Standard Deposit Ratios',
        p: 'Standard ratios are: (a) 50% deposit / 50% completion. (b) 33% deposit / 33% mid-point / 34% completion for long contracts.'
      }
    ],
    faq: [
      { q: 'Are deposits refundable?', a: 'Specify this in your contract. Typically, deposits are non-refundable to cover initial project setup costs and reserved schedule slots.' }
    ]
  },
  {
    slug: 'how-to-request-milestone-payments',
    title: 'How to Request and Invoice Milestone Payments',
    date: 'July 12, 2026',
    sections: [
      {
        h2: '1. What is Milestone Billing?',
        p: 'Milestone billing involves dividing a large project into smaller, deliverable-based payment blocks (e.g., Wireframes, Beta Version, Final Code Release).'
      },
      {
        h2: '2. Benefits of Milestone Invoicing',
        p: 'It keeps cash flowing and ensures that work doesn\'t proceed if a client falls behind on payments.'
      },
      {
        h2: '3. Invoicing for Milestone Approval',
        p: 'When a milestone is reached, get written client approval before issuing the milestone invoice.'
      }
    ],
    faq: [
      { q: 'How do I handle delayed milestones?', a: 'State in your agreement that work stops if a milestone invoice remains unpaid for more than 5 business days.' }
    ]
  },
  {
    slug: 'what-is-net-30-and-how-to-use-it',
    title: 'What is Net 30 and How to Use It in Billing',
    date: 'July 12, 2026',
    sections: [
      {
        h2: '1. Net 30 Term Definition',
        p: 'Net 30 means the client must settle the invoice within 30 calendar days from the invoice date. This is common in enterprise client billing.'
      },
      {
        h2: '2. Impact on Small Businesses',
        p: 'Net 30 can strain freelance cash flow. Make sure you have enough cash reserves to cover your expenses during the 30-day waiting period.'
      },
      {
        h2: '3. Incentives for Early Payment',
        p: 'Offer a discount (e.g., 2% 10 Net 30) where the client gets a 2% discount if they pay within 10 days instead of 30.'
      }
    ],
    faq: [
      { q: 'Does Net 30 include weekends?', a: 'Yes. Net 30 counts consecutive calendar days, not business days.' }
    ]
  },
  {
    slug: 'what-is-a-credit-note-and-how-to-issue',
    title: 'What is a Credit Note and How to Issue One?',
    date: 'July 12, 2026',
    sections: [
      {
        h2: '1. What is a Credit Note?',
        p: 'A credit note (or credit memo) is a legal document issued to reduce the amount owed on a previously sent invoice.'
      },
      {
        h2: '2. Common Reasons to Issue Credit',
        p: 'Issue credit notes for billing errors, overcharges, product returns, or goodwill discounts on disputed work.'
      },
      {
        h2: '3. Accounting Compliance',
        p: 'Do not delete or alter sent invoices. Issue a corresponding credit note to keep your accounting audits clean and compliant.'
      }
    ],
    faq: [
      { q: 'Can a credit note be exchanged for cash?', a: 'Typically, credit notes are applied to reduce future invoice balances, but they can be refunded as cash if no further work is planned.' }
    ]
  },
  {
    slug: 'what-is-a-debit-note-differences-explained',
    title: 'What is a Debit Note? Differences Explained',
    date: 'July 12, 2026',
    sections: [
      {
        h2: '1. What is a Debit Note?',
        p: 'A debit note is a document issued by a seller to increase the amount owed on a previously sent invoice.'
      },
      {
        h2: '2. Common Reasons to Issue Debit Notes',
        p: 'Use debit notes for undercharged fees, scope extensions, or added material costs on active projects.'
      },
      {
        h2: '3. Keep Accounting Audit Trails Clean',
        p: 'Like credit notes, debit notes adjust existing invoices without altering the original document, preserving your financial audit trail.'
      }
    ],
    faq: [
      { q: 'Is a debit note the same as an invoice?', a: 'No. An invoice is a primary billing request, whereas a debit note is an adjustment to an existing invoice.' }
    ]
  },
  {
    slug: 'how-to-follow-up-on-unpaid-invoices',
    title: 'How to Follow Up on Unpaid Invoices Professionally',
    date: 'July 12, 2026',
    sections: [
      {
        h2: '1. Establish a Polite Follow-Up Schedule',
        p: 'Send polite follow-ups: (a) 1 day after the due date. (b) 7 days late. (c) 14 days late. (d) Call at 30 days late.'
      },
      {
        h2: '2. Keeping the Tone Professional',
        p: 'Assume it was an oversight. Write: "Just checking in to ensure our invoice [Number] was received. Let me know if you need another copy."'
      },
      {
        h2: '3. Stop Work Immediately',
        p: 'If an invoice is late, pause all active work until it is resolved. Notify the client politely that scheduling holds are active.'
      }
    ],
    faq: [
      { q: 'Should I follow up by phone?', a: 'Yes. If an email is ignored for a week, a quick phone call to their billing department often resolves the issue.' }
    ]
  },
  {
    slug: 'friendly-late-payment-reminder-email-templates',
    title: 'Late Payment Reminder Email Templates for Freelancers',
    date: 'July 12, 2026',
    sections: [
      {
        h2: '1. Day-After Reminder Template',
        p: '"Hi [Name], just a friendly reminder that invoice [Num] for [Project] was due yesterday. Let me know if you have any payment questions."'
      },
      {
        h2: '2. One-Week Late Template',
        p: '"Hi [Name], our invoice [Num] is now one week past due. Could you please confirm when payment will be processed? Updated copy attached."'
      },
      {
        h2: '3. 30-Day Late Urgent Template',
        p: '"Hi [Name], invoice [Num] is now 30 days overdue. Please submit payment today to avoid late fees. All active project timelines are on hold."'
      }
    ],
    faq: [
      { q: 'Should I attach the invoice again?', a: 'Yes. Always attach a PDF copy of the invoice to your reminder email so they don\'t have to search for it.' }
    ]
  },
  {
    slug: 'legal-options-when-client-refuses-to-pay',
    title: 'Legal Options When a Client Refuses to Pay Your Invoice',
    date: 'July 12, 2026',
    sections: [
      {
        h2: '1. Send a Formal Demand Letter',
        p: 'Before taking legal action, mail a certified demand letter stating the outstanding amount, terms, and the deadline before escalation.'
      },
      {
        h2: '2. Small Claims Court',
        p: 'For small balances, you can file a case in small claims court without hiring a lawyer. It is a cost-effective way to get a judgment.'
      },
      {
        h2: '3. Hiring a Collection Agency',
        p: 'If a client is unresponsive, you can sell the debt to a collection agency, though they typically take a percentage of the recovered funds.'
      }
    ],
    faq: [
      { q: 'Is small claims court worth it?', a: 'Compare the filing fees and lost time against the invoice amount to ensure it is worth the effort.' }
    ]
  },
  {
    slug: 'charging-late-fees-terms-and-best-practices',
    title: 'Charging Late Fees: Terms and Best Practices',
    date: 'July 12, 2026',
    sections: [
      {
        h2: '1. Legally Declaring Late Fees',
        p: 'You cannot charge late fees unless they were agreed to in writing in your initial contract. Outline late fee percentages clearly.'
      },
      {
        h2: '2. Standard Late Fee Calculations',
        p: 'The standard late fee is 1.5% to 2% monthly interest, or a flat fee (e.g. $25 per week late).'
      },
      {
        h2: '3. Enforcing and Waiving Fees',
        p: 'Use late fees as leverage. You can offer to waive the late fee if they submit the base invoice balance immediately.'
      }
    ],
    faq: [
      { q: 'What is the maximum late fee I can legally charge?', a: 'Check your local state or country usury laws, as charging excessive interest is illegal.' }
    ]
  }
];

// 1. GENERATE TEMPLATE PAGES
templates.forEach(t => {
  const dir = path.join(__dirname, 'public', 'templates', t.slug);
  fs.mkdirSync(dir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${t.title} | Invoice-Gen.net</title>
  <meta name="description" content="${cleanText(t.subtitle)}" />
  <link rel="canonical" href="https://invoice-gen.net/templates/${t.slug}/" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin />
  <style>
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('/fonts/inter-latin.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: url('/fonts/inter-latin.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 600;
      font-display: swap;
      src: url('/fonts/inter-latin.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: url('/fonts/inter-latin.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
  </style>
  <meta property="og:title" content="${t.title} | Invoice-Gen.net" />
  <meta property="og:description" content="${cleanText(t.subtitle)}" />
  <meta property="og:url" content="https://invoice-gen.net/templates/${t.slug}/" />
  <meta property="og:type" content="website" />
  <style>
    :root {
      --color-primary: #4F46E5;
      --color-primary-hover: #4338CA;
      --color-text-main: #0F172A;
      --color-text-secondary: #475569;
      --color-border: #E2E8F0;
      --color-bg: #FAFCFF;
      --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      color: var(--color-text-main);
      background-color: var(--color-bg);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    header {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 100;
      height: 72px;
      display: flex;
      align-items: center;
    }
    .nav-container {
      max-width: 1000px;
      width: 100%;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo-link {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      font-weight: 700;
      font-size: 20px;
      color: var(--color-text-main);
    }
    .logo-svg {
      width: 20px;
      height: 20px;
    }
    .btn-cta {
      background: var(--color-primary);
      color: white;
      text-decoration: none;
      padding: 12px 24px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      transition: all 180ms ease;
      display: inline-block;
      border: none;
    }
    .btn-cta:hover {
      transform: translateY(-1px);
      background: var(--color-primary-hover);
    }
    .trust-bullets {
      font-size: 12px;
      color: var(--color-text-secondary);
      margin-top: 8px;
      display: flex;
      justify-content: center;
      gap: 12px;
      flex-wrap: wrap;
    }
    main {
      max-width: 720px;
      margin: 80px auto;
      padding: 0 24px;
    }
    .hero {
      text-align: center;
      margin-bottom: 64px;
    }
    h1 { font-size: 40px; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 16px; color: #0F172A; line-height: 1.15; }
    .subtitle { font-size: 18px; color: #334155; margin-bottom: 32px; line-height: 1.8; letter-spacing: -0.01em; }
    h2 { font-size: 30px; font-weight: 700; margin-top: 56px; margin-bottom: 24px; border-bottom: 1px solid var(--color-border); padding-bottom: 8px; color: #0F172A; letter-spacing: -0.02em; }
    h3 { font-size: 24px; font-weight: 600; margin-top: 40px; margin-bottom: 16px; color: #0F172A; letter-spacing: -0.01em; }
    p { color: #334155; font-size: 18px; margin-bottom: 24px; line-height: 1.8; letter-spacing: -0.01em; }
    ul { margin-left: 24px; margin-bottom: 20px; color: var(--color-text-secondary); }
    li { margin-bottom: 8px; }
    .highlight-card {
      background: white;
      border: 1px solid var(--color-border);
      border-radius: 16px;
      padding: 32px;
      margin: 40px 0;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
      text-align: center;
    }
    .highlight-card p { margin-bottom: 24px; }
    
    .related-templates {
      background: white;
      border: 1px solid var(--color-border);
      border-radius: 16px;
      padding: 24px;
      margin-top: 48px;
    }
    .related-templates h3 { margin-top: 0; margin-bottom: 16px; }
    .related-links {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }
    .related-links a {
      color: var(--color-primary);
      text-decoration: none;
      font-size: 14px;
      font-weight: 500;
      background: #F0F4FE;
      padding: 8px 16px;
      border-radius: 20px;
      transition: all 150ms ease;
    }
    .related-links a:hover {
      background: #E1E9FD;
    }
    footer {
      background: #0F172A;
      padding: 40px 0;
      text-align: center;
      color: #94A3B8;
      font-size: 14px;
    }
    .footer-links { margin-bottom: 16px; }
    .footer-links a { color: #94A3B8; text-decoration: none; margin: 0 12px; }
    .footer-links a:hover { color: white; }
  </style>
</head>
<body>

  <header>
    <div class="nav-container">
      <a href="/" class="logo-link">
        <svg class="logo-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 4H20L26 10V28H6V4Z" fill="#4F46E5" />
          <path d="M20 4V10H26L20 4Z" fill="#06B6D4" />
        </svg>
        <span>Invoice-Gen.net</span>
      </a>
      <a href="/" class="btn-cta">Start Invoicing</a>
    </div>
  </header>

  <main>
    <div class="hero">
      <h1>${t.title}</h1>
      <p class="subtitle">${t.subtitle}</p>
      <div style="margin-top: 24px;">
        <a href="/?niche=${t.slug}" class="btn-cta">Create Invoice Now</a>
        <div class="trust-bullets">
          <span>✓ 100% Free</span>
          <span>✓ No Sign Up</span>
          <span>✓ No Watermark</span>
          <span>✓ Runs in Your Browser</span>
        </div>
      </div>
    </div>

    <h2>Who is this template for?</h2>
    <p>This invoice template is built specifically for ${t.roleText} managing direct client billing pipelines, including:</p>
    <ul>
      ${t.nicheList.map(item => `<li><strong>${item.split(':')[0]}:</strong>${item.split(':')[1]}</li>`).join('\n')}
    </ul>

    <h2>Industry Invoicing Best Practices</h2>
    <p>Following industry best practices prevents invoicing friction and late payments:</p>
    <ul>
      ${t.nicheTips.map(item => `<li><strong>${item.split(':')[0]}:</strong>${item.split(':')[1]}</li>`).join('\n')}
    </ul>

    <div class="highlight-card">
      <h3>100% Free Sandbox. Local Storage Protection.</h3>
      <p>Invoice-Gen.net runs entirely inside your browser. No external databases can read or harvest your clients' addresses or billing numbers.</p>
      <a href="/?niche=${t.slug}" class="btn-cta">Generate PDF Invoice</a>
    </div>

    <h2>Frequently Asked Questions</h2>
    <div style="margin-top: 24px;">
      <h3>Do I need to sign up to download my invoice?</h3>
      <p>No. Invoice-Gen.net is a 100% open tool. You can input your details and export a clean PDF without ever sharing your email or creating an account.</p>
      
      <h3>Can I save my client details for future invoices?</h3>
      <p>Yes. The app automatically caches your business profile parameters securely inside your browser's local sandbox storage, saving you from re-entering details next time.</p>
    </div>
  </main>

  <footer>
    <div class="footer-links">
      <a href="/">Home</a>
      <a href="/about/">About</a>
      <a href="/privacy/">Privacy Policy</a>
      <a href="/terms/">Terms of Service</a>
      <a href="/contact/">Contact</a>
    </div>
    <p>&copy; 2026 Invoice-Gen.net. All rights reserved.</p>
  </footer>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Do I need to sign up to download my invoice?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. Invoice-Gen.net is a 100% open tool. You can input your details and export a clean PDF without ever sharing your email or creating an account."
        }
      },
      {
        "@type": "Question",
        "name": "Can I save my client details for future invoices?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. The app automatically caches your business profile parameters securely inside your browser's local sandbox storage, saving you from re-entering details next time."
        }
      }
    ]
  }
  </script>

  <div style="background: #F8FAFC; padding: 40px 24px; border-top: 1px solid #E2E8F0; margin-top: 60px;"><div style="max-width: 1000px; margin: 0 auto;"><h4 style="font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 16px;">Invoice-Gen.net Directory</h4><div style="display: flex; flex-wrap: wrap; gap: 12px 24px; font-size: 13px;"><a href="/blog/charging-late-fees-terms-and-best-practices/" style="color: #64748b; text-decoration: none;">Charging Late Fees</a><a href="/blog/choosing-the-best-payment-terms-for-freelancers/" style="color: #64748b; text-decoration: none;">Best Payment Terms</a><a href="/blog/handling-down-payments-and-deposits/" style="color: #64748b; text-decoration: none;">Down Payments</a><a href="/blog/how-to-create-your-first-invoice/" style="color: #64748b; text-decoration: none;">First Invoice Guide</a><a href="/blog/how-to-follow-up-on-unpaid-invoices/" style="color: #64748b; text-decoration: none;">Follow Up Unpaid Invoices</a><a href="/blog/how-to-invoice-clients-internationally/" style="color: #64748b; text-decoration: none;">Invoice Internationally</a><a href="/blog/how-to-invoice-for-hourly-work/" style="color: #64748b; text-decoration: none;">Hourly Work Invoicing</a><a href="/blog/how-to-invoice-for-mileage-reimbursement/" style="color: #64748b; text-decoration: none;">Mileage Reimbursement</a><a href="/blog/how-to-request-milestone-payments/" style="color: #64748b; text-decoration: none;">Milestone Payments</a><a href="/blog/how-to-write-a-professional-invoice/" style="color: #64748b; text-decoration: none;">Professional Invoice</a><a href="/blog/invoice-date-vs-due-date-difference/" style="color: #64748b; text-decoration: none;">Invoice Date vs Due Date</a><a href="/blog/invoicing-for-creative-licenses-and-royalties/" style="color: #64748b; text-decoration: none;">Creative Licenses</a><a href="/blog/legal-options-when-client-refuses-to-pay/" style="color: #64748b; text-decoration: none;">Legal Options for Unpaid</a><a href="/blog/what-is-a-debit-note-differences-explained/" style="color: #64748b; text-decoration: none;">Debit Note Explained</a><a href="/blog/what-is-net-30-and-how-to-use-it/" style="color: #64748b; text-decoration: none;">Net 30 Terms</a><a href="/blog/when-to-use-a-commercial-invoice/" style="color: #64748b; text-decoration: none;">Commercial Invoice</a><a href="/blog/writing-an-invoice-under-a-retainer/" style="color: #64748b; text-decoration: none;">Retainer Invoice</a><a href="/compare/adobe-express-invoice-alternative/" style="color: #64748b; text-decoration: none;">Adobe Express Alternative</a><a href="/compare/invoice-generator-alternative/" style="color: #64748b; text-decoration: none;">Invoice Generator Alternative</a><a href="/compare/invoice-simple-alternative/" style="color: #64748b; text-decoration: none;">Invoice Simple Alternative</a><a href="/invoice-app/" style="color: #64748b; text-decoration: none;">Invoice App</a><a href="/invoice-pdf-generator/" style="color: #64748b; text-decoration: none;">Invoice PDF Generator</a><a href="/invoice-software/" style="color: #64748b; text-decoration: none;">Invoice Software</a><a href="/invoice-template/" style="color: #64748b; text-decoration: none;">Invoice Template</a><a href="/online-invoice-generator/" style="color: #64748b; text-decoration: none;">Online Invoice Generator</a><a href="/professional-invoice-generator/" style="color: #64748b; text-decoration: none;">Professional Invoice Generator</a><a href="/templates/architect/" style="color: #64748b; text-decoration: none;">Architect Template</a><a href="/templates/business-coach/" style="color: #64748b; text-decoration: none;">Business Coach Template</a><a href="/templates/carpenter/" style="color: #64748b; text-decoration: none;">Carpenter Template</a><a href="/templates/data-analyst/" style="color: #64748b; text-decoration: none;">Data Analyst Template</a><a href="/templates/editor-proofreader/" style="color: #64748b; text-decoration: none;">Editor Template</a><a href="/templates/electrician/" style="color: #64748b; text-decoration: none;">Electrician Template</a><a href="/templates/event-planner/" style="color: #64748b; text-decoration: none;">Event Planner Template</a><a href="/templates/gardener/" style="color: #64748b; text-decoration: none;">Gardener Template</a><a href="/templates/handyman/" style="color: #64748b; text-decoration: none;">Handyman Template</a><a href="/templates/hvac-technician/" style="color: #64748b; text-decoration: none;">HVAC Template</a><a href="/templates/interior-designer/" style="color: #64748b; text-decoration: none;">Interior Designer Template</a><a href="/templates/it-support/" style="color: #64748b; text-decoration: none;">IT Support Template</a><a href="/templates/landscaping/" style="color: #64748b; text-decoration: none;">Landscaping Template</a><a href="/templates/painter-contractor/" style="color: #64748b; text-decoration: none;">Painter Template</a><a href="/templates/pet-sitter/" style="color: #64748b; text-decoration: none;">Pet Sitter Template</a><a href="/templates/plumber/" style="color: #64748b; text-decoration: none;">Plumber Template</a><a href="/templates/project-manager/" style="color: #64748b; text-decoration: none;">Project Manager Template</a><a href="/templates/roofer/" style="color: #64748b; text-decoration: none;">Roofer Template</a><a href="/templates/translator/" style="color: #64748b; text-decoration: none;">Translator Template</a><a href="/templates/voiceover-artist/" style="color: #64748b; text-decoration: none;">Voiceover Template</a></div></div></div>
</body>
</html>`;

  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`Generated template page: templates/${t.slug}`);
});

// 2. GENERATE BLOG ARTICLES
blogs.forEach(b => {
  const dir = path.join(__dirname, 'public', 'blog', b.slug);
  fs.mkdirSync(dir, { recursive: true });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${b.title} | Invoice-Gen.net</title>
  <meta name="description" content="${cleanText(b.sections[0].p)}" />
  <link rel="canonical" href="https://invoice-gen.net/blog/${b.slug}/" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="preload" href="/fonts/inter-latin.woff2" as="font" type="font/woff2" crossorigin />
  <style>
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 400;
      font-display: swap;
      src: url('/fonts/inter-latin.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 500;
      font-display: swap;
      src: url('/fonts/inter-latin.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 600;
      font-display: swap;
      src: url('/fonts/inter-latin.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
    @font-face {
      font-family: 'Inter';
      font-style: normal;
      font-weight: 700;
      font-display: swap;
      src: url('/fonts/inter-latin.woff2') format('woff2');
      unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+0304, U+0308, U+0329, U+2000-206F, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD;
    }
  </style>
  <meta property="og:title" content="${b.title} | Invoice-Gen.net" />
  <meta property="og:description" content="${cleanText(b.sections[0].p)}" />
  <meta property="og:url" content="https://invoice-gen.net/blog/${b.slug}/" />
  <meta property="og:type" content="article" />
  <style>
    :root {
      --color-primary: #4F46E5;
      --color-primary-hover: #4338CA;
      --color-text-main: #0F172A;
      --color-text-secondary: #475569;
      --color-border: #E2E8F0;
      --color-bg: #FAFCFF;
      --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: var(--font-sans);
      color: var(--color-text-main);
      background-color: var(--color-bg);
      line-height: 1.6;
      -webkit-font-smoothing: antialiased;
    }
    header {
      background: rgba(255, 255, 255, 0.8);
      backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--color-border);
      position: sticky;
      top: 0;
      z-index: 100;
      height: 72px;
      display: flex;
      align-items: center;
    }
    .nav-container {
      max-width: 1000px;
      width: 100%;
      margin: 0 auto;
      padding: 0 24px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .logo-link {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      font-weight: 700;
      font-size: 20px;
      color: var(--color-text-main);
    }
    .logo-svg {
      width: 20px;
      height: 20px;
    }
    .btn-cta {
      background: var(--color-primary);
      color: white;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      transition: all 180ms ease;
      display: inline-block;
      border: none;
    }
    .btn-cta:hover {
      transform: translateY(-1px);
      background: var(--color-primary-hover);
    }
    main {
      max-width: 720px;
      margin: 60px auto;
      padding: 0 24px;
    }
    .article-header {
      margin-bottom: 40px;
    }
    .meta-date {
      font-size: 14px;
      color: var(--color-text-secondary);
      margin-bottom: 8px;
      display: block;
    }
    h1 { font-size: 40px; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 24px; line-height: 1.15; color: #0F172A; }
    h2 { font-size: 30px; font-weight: 700; letter-spacing: -0.02em; margin-top: 56px; margin-bottom: 24px; border-bottom: 1px solid var(--color-border); padding-bottom: 8px; color: #0F172A; }
    h3 { font-size: 24px; font-weight: 600; margin-top: 40px; margin-bottom: 16px; color: #0F172A; letter-spacing: -0.01em; }
    p { color: #334155; font-size: 18px; margin-bottom: 24px; line-height: 1.8; text-align: left; letter-spacing: -0.01em; }
    .cta-box {
      background: white;
      border: 1px solid var(--color-border);
      border-radius: 16px;
      padding: 32px;
      margin: 40px 0;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.02);
    }
    .cta-box p { text-align: center; margin-bottom: 24px; }
    footer {
      background: #0F172A;
      padding: 40px 0;
      text-align: center;
      color: #94A3B8;
      font-size: 14px;
      margin-top: 80px;
    }
    .footer-links { margin-bottom: 16px; }
    .footer-links a { color: #94A3B8; text-decoration: none; margin: 0 12px; }
    .footer-links a:hover { color: white; }
  </style>
</head>
<body>

  <header>
    <div class="nav-container">
      <a href="/" class="logo-link">
        <svg class="logo-svg" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 4H20L26 10V28H6V4Z" fill="#4F46E5" />
          <path d="M20 4V10H26L20 4Z" fill="#06B6D4" />
        </svg>
        <span>Invoice-Gen.net</span>
      </a>
      <a href="/" class="btn-cta">Free Invoice-Gen.net</a>
    </div>
  </header>

  <main>
    <article>
      <div class="article-header">
        <span class="meta-date">Published on ${b.date}</span>
        <h1>${b.title}</h1>
      </div>

      ${b.sections.map(s => `<h2>${s.h2}</h2>\n<p>${s.p}</p>`).join('\n')}

      <div class="cta-box">
        <h3>Create Your Professional Invoice Now</h3>
        <p>100% free, browser-native security, and watermark-free PDF exports in 30 seconds.</p>
        <a href="/" class="btn-cta">Start Invoicing</a>
      </div>
    </article>
  </main>

  <footer>
    <div class="footer-links">
      <a href="/">Home</a>
      <a href="/about/">About</a>
      <a href="/privacy/">Privacy Policy</a>
      <a href="/terms/">Terms of Service</a>
      <a href="/contact/">Contact</a>
    </div>
    <p>&copy; 2026 Invoice-Gen.net. All rights reserved.</p>
  </footer>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      ${b.faq.map(f => `{
        "@type": "Question",
        "name": ${JSON.stringify(f.q)},
        "acceptedAnswer": {
          "@type": "Answer",
          "text": ${JSON.stringify(f.a)}
        }
      }`).join(',\n')}
    ]
  }
  </script>

  <div style="background: #F8FAFC; padding: 40px 24px; border-top: 1px solid #E2E8F0; margin-top: 60px;"><div style="max-width: 1000px; margin: 0 auto;"><h4 style="font-size: 14px; font-weight: 600; color: #475569; margin-bottom: 16px;">Invoice-Gen.net Directory</h4><div style="display: flex; flex-wrap: wrap; gap: 12px 24px; font-size: 13px;"><a href="/blog/charging-late-fees-terms-and-best-practices/" style="color: #64748b; text-decoration: none;">Charging Late Fees</a><a href="/blog/choosing-the-best-payment-terms-for-freelancers/" style="color: #64748b; text-decoration: none;">Best Payment Terms</a><a href="/blog/handling-down-payments-and-deposits/" style="color: #64748b; text-decoration: none;">Down Payments</a><a href="/blog/how-to-create-your-first-invoice/" style="color: #64748b; text-decoration: none;">First Invoice Guide</a><a href="/blog/how-to-follow-up-on-unpaid-invoices/" style="color: #64748b; text-decoration: none;">Follow Up Unpaid Invoices</a><a href="/blog/how-to-invoice-clients-internationally/" style="color: #64748b; text-decoration: none;">Invoice Internationally</a><a href="/blog/how-to-invoice-for-hourly-work/" style="color: #64748b; text-decoration: none;">Hourly Work Invoicing</a><a href="/blog/how-to-invoice-for-mileage-reimbursement/" style="color: #64748b; text-decoration: none;">Mileage Reimbursement</a><a href="/blog/how-to-request-milestone-payments/" style="color: #64748b; text-decoration: none;">Milestone Payments</a><a href="/blog/how-to-write-a-professional-invoice/" style="color: #64748b; text-decoration: none;">Professional Invoice</a><a href="/blog/invoice-date-vs-due-date-difference/" style="color: #64748b; text-decoration: none;">Invoice Date vs Due Date</a><a href="/blog/invoicing-for-creative-licenses-and-royalties/" style="color: #64748b; text-decoration: none;">Creative Licenses</a><a href="/blog/legal-options-when-client-refuses-to-pay/" style="color: #64748b; text-decoration: none;">Legal Options for Unpaid</a><a href="/blog/what-is-a-debit-note-differences-explained/" style="color: #64748b; text-decoration: none;">Debit Note Explained</a><a href="/blog/what-is-net-30-and-how-to-use-it/" style="color: #64748b; text-decoration: none;">Net 30 Terms</a><a href="/blog/when-to-use-a-commercial-invoice/" style="color: #64748b; text-decoration: none;">Commercial Invoice</a><a href="/blog/writing-an-invoice-under-a-retainer/" style="color: #64748b; text-decoration: none;">Retainer Invoice</a><a href="/compare/adobe-express-invoice-alternative/" style="color: #64748b; text-decoration: none;">Adobe Express Alternative</a><a href="/compare/invoice-generator-alternative/" style="color: #64748b; text-decoration: none;">Invoice Generator Alternative</a><a href="/compare/invoice-simple-alternative/" style="color: #64748b; text-decoration: none;">Invoice Simple Alternative</a><a href="/invoice-app/" style="color: #64748b; text-decoration: none;">Invoice App</a><a href="/invoice-pdf-generator/" style="color: #64748b; text-decoration: none;">Invoice PDF Generator</a><a href="/invoice-software/" style="color: #64748b; text-decoration: none;">Invoice Software</a><a href="/invoice-template/" style="color: #64748b; text-decoration: none;">Invoice Template</a><a href="/online-invoice-generator/" style="color: #64748b; text-decoration: none;">Online Invoice Generator</a><a href="/professional-invoice-generator/" style="color: #64748b; text-decoration: none;">Professional Invoice Generator</a><a href="/templates/architect/" style="color: #64748b; text-decoration: none;">Architect Template</a><a href="/templates/business-coach/" style="color: #64748b; text-decoration: none;">Business Coach Template</a><a href="/templates/carpenter/" style="color: #64748b; text-decoration: none;">Carpenter Template</a><a href="/templates/data-analyst/" style="color: #64748b; text-decoration: none;">Data Analyst Template</a><a href="/templates/editor-proofreader/" style="color: #64748b; text-decoration: none;">Editor Template</a><a href="/templates/electrician/" style="color: #64748b; text-decoration: none;">Electrician Template</a><a href="/templates/event-planner/" style="color: #64748b; text-decoration: none;">Event Planner Template</a><a href="/templates/gardener/" style="color: #64748b; text-decoration: none;">Gardener Template</a><a href="/templates/handyman/" style="color: #64748b; text-decoration: none;">Handyman Template</a><a href="/templates/hvac-technician/" style="color: #64748b; text-decoration: none;">HVAC Template</a><a href="/templates/interior-designer/" style="color: #64748b; text-decoration: none;">Interior Designer Template</a><a href="/templates/it-support/" style="color: #64748b; text-decoration: none;">IT Support Template</a><a href="/templates/landscaping/" style="color: #64748b; text-decoration: none;">Landscaping Template</a><a href="/templates/painter-contractor/" style="color: #64748b; text-decoration: none;">Painter Template</a><a href="/templates/pet-sitter/" style="color: #64748b; text-decoration: none;">Pet Sitter Template</a><a href="/templates/plumber/" style="color: #64748b; text-decoration: none;">Plumber Template</a><a href="/templates/project-manager/" style="color: #64748b; text-decoration: none;">Project Manager Template</a><a href="/templates/roofer/" style="color: #64748b; text-decoration: none;">Roofer Template</a><a href="/templates/translator/" style="color: #64748b; text-decoration: none;">Translator Template</a><a href="/templates/voiceover-artist/" style="color: #64748b; text-decoration: none;">Voiceover Template</a></div></div></div>
</body>
</html>`;

  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`Generated blog post: blog/${b.slug}`);
});

// 3. GENERATE SITEMAP.XML WITH ALL CORES, 35 TEMPLATES & 30 BLOGS
const existingTemplates = [
  'cleaning-service', 'consultant', 'content-creator', 'contractor', 'copywriter',
  'digital-marketing', 'freelance', 'graphic-designer', 'marketing-consultant', 'photographer',
  'seo-consultant', 'social-media-manager', 'video-editor', 'virtual-assistant', 'web-developer'
];
const allTemplates = [...existingTemplates, ...templates.map(t => t.slug)];

const existingBlogs = [
  'best-payment-terms-freelancers', 'common-invoice-mistakes-avoid', 'hourly-vs-fixed-price-invoices',
  'how-to-create-professional-invoice', 'how-to-get-paid-faster-invoices', 'how-to-invoice-as-consultant',
  'how-to-write-freelance-invoice', 'invoice-vs-receipt-difference', 'what-to-include-in-invoice',
  'when-to-send-invoice'
];
const allBlogs = [...existingBlogs, ...blogs.map(b => b.slug)];

let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://invoice-gen.net/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://invoice-gen.net/about/</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>
  <url><loc>https://invoice-gen.net/contact/</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>
  <url><loc>https://invoice-gen.net/trust/</loc><changefreq>weekly</changefreq><priority>0.5</priority></url>
  <url><loc>https://invoice-gen.net/privacy/</loc><changefreq>weekly</changefreq><priority>0.3</priority></url>
  <url><loc>https://invoice-gen.net/terms/</loc><changefreq>weekly</changefreq><priority>0.3</priority></url>
`;

allTemplates.forEach(slug => {
  xml += `  <url><loc>https://invoice-gen.net/templates/${slug}/</loc><changefreq>weekly</changefreq><priority>0.8</priority></url>\n`;
});

allBlogs.forEach(slug => {
  xml += `  <url><loc>https://invoice-gen.net/blog/${slug}/</loc><changefreq>weekly</changefreq><priority>0.7</priority></url>\n`;
});

xml += `</urlset>`;

fs.writeFileSync(path.join(__dirname, 'public', 'sitemap.xml'), xml);
console.log('Successfully updated public/sitemap.xml with 65+ URLs.');
