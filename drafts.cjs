/**
 * Invoice-Gen Article Database
 * Contains published articles and drafts.
 */

const ARTICLES = [
  // ── Published ──
  {
    slug: 'what-is-an-invoice-beginners-guide',
    title: 'What Is an Invoice? A Complete Beginner\'s Guide | Invoice-Gen',
    h1: 'What Is an Invoice? A Complete Beginner\'s Guide for 2026',
    description: 'Learn what an invoice is, why businesses use them, and how to create one. This beginner\'s guide covers invoice types, essential components, and common mistakes.',
    keywords: 'what is an invoice, invoice definition, invoice basics, invoice guide',
    category: 'Invoice Fundamentals',
    tags: ['Basics', 'Freelancing', 'Small Business'],
    author: 'Invoice-Gen Editorial Team',
    datePublished: '2026-07-13',
    dateModified: '2026-07-13',
    status: 'published',
    content: `
      <p>An invoice is a formal document that a seller sends to a buyer requesting payment for goods or services. It serves as a legal record of a business transaction, detailing what was provided, the agreed-upon price, and the payment terms.</p>
      
      <p>Whether you are a freelancer billing your first client or a growing business managing hundreds of transactions, understanding invoices is fundamental to running a professional operation.</p>

      <h2>Why Invoices Matter</h2>
      <p>Invoices are more than payment requests — they are critical business documents that serve multiple purposes:</p>
      <ul>
        <li><strong>Legal protection</strong> — An invoice creates a written record of the agreement between buyer and seller, which can be used as evidence in disputes.</li>
        <li><strong>Tax compliance</strong> — Tax authorities require businesses to maintain invoice records for auditing and reporting purposes.</li>
        <li><strong>Cash flow management</strong> — Tracking invoices helps you forecast revenue and identify late payments before they become problematic.</li>
        <li><strong>Professional credibility</strong> — Well-formatted invoices signal that you run a legitimate, organized business.</li>
      </ul>

      <h2>Types of Invoices</h2>
      <p>Different business situations call for different invoice types. Understanding when to use each one ensures compliance and clarity.</p>
      
      <h3>Standard Invoice</h3>
      <p>The most common type, used for straightforward transactions. A standard invoice lists the products or services delivered, quantities, prices, and payment terms. Most freelancers and small businesses use standard invoices for their day-to-day billing.</p>

      <h3>Proforma Invoice</h3>
      <p>A preliminary invoice sent before work begins or goods are shipped. It serves as a price estimate and is commonly used in international trade and project-based work. Learn more in our guide on <a href="/blog/what-is-a-proforma-invoice/">proforma invoices</a>.</p>

      <h3>Credit Note</h3>
      <p>Issued when you need to adjust a previously sent invoice — for example, after a return, discount, or billing error. Read our detailed guide on <a href="/blog/what-is-a-credit-note-and-how-to-issue/">how to issue credit notes</a>.</p>

      <h3>Recurring Invoice</h3>
      <p>Used for subscription services or retainer agreements where the same amount is billed at regular intervals. This is common for consultants and service providers with ongoing client relationships.</p>

      <h3>Tax Invoice</h3>
      <p>Required in many jurisdictions when selling taxable goods or services. A tax invoice includes the seller's tax identification number, tax rates, and tax amounts broken down by line item.</p>

      <h2>Essential Components of an Invoice</h2>
      <p>Every professional invoice should include these elements to ensure clarity and legal compliance:</p>
      <ol>
        <li><strong>Invoice number</strong> — A unique sequential identifier for tracking</li>
        <li><strong>Invoice date</strong> — The date the invoice was created</li>
        <li><strong>Due date</strong> — When payment is expected</li>
        <li><strong>Seller details</strong> — Business name, address, email, phone number</li>
        <li><strong>Buyer details</strong> — Client name and contact information</li>
        <li><strong>Line items</strong> — Description, quantity, unit price for each product or service</li>
        <li><strong>Subtotal</strong> — Total before tax and adjustments</li>
        <li><strong>Tax</strong> — Applicable tax rates and amounts</li>
        <li><strong>Total amount due</strong> — The final amount the client owes</li>
        <li><strong>Payment terms</strong> — How and when to pay (e.g., Net 30, bank transfer)</li>
      </ol>
      <p>For a complete breakdown, see our guide on <a href="/blog/essential-fields-to-include-on-invoice/">essential fields to include on an invoice</a>.</p>

      <h2>How to Create an Invoice</h2>
      <p>Creating an invoice is straightforward with the right tool. <a href="/">Invoice-Gen</a> lets you build professional PDF invoices in under 2 minutes — completely free, with no signup required.</p>
      <p>Here's the basic workflow:</p>
      <ol>
        <li>Enter your business details (name, address, logo)</li>
        <li>Add your client's information</li>
        <li>List your products or services with quantities and prices</li>
        <li>Set payment terms and due date</li>
        <li>Review and download your PDF invoice</li>
      </ol>
      <p>For step-by-step instructions, read our <a href="/blog/how-to-create-professional-invoice/">guide to creating professional invoices</a>.</p>

      <h2>Common Invoice Mistakes to Avoid</h2>
      <p>Even experienced business owners make invoicing errors that delay payments. The most common mistakes include:</p>
      <ul>
        <li>Forgetting to include a unique invoice number</li>
        <li>Using vague descriptions instead of specific line items</li>
        <li>Not specifying clear payment terms</li>
        <li>Sending invoices to the wrong contact or email</li>
        <li>Calculating totals incorrectly (especially with tax and discounts)</li>
      </ul>
      <p>Avoid these pitfalls with our full guide on <a href="/blog/common-invoice-mistakes-avoid/">common invoicing mistakes</a>.</p>

      <h2>Invoice vs Receipt vs Bill</h2>
      <p>These terms are often confused, but they serve different purposes:</p>
      <ul>
        <li><strong>Invoice</strong> — A request for payment sent <em>before</em> payment is made</li>
        <li><strong>Receipt</strong> — Proof of payment issued <em>after</em> payment is received</li>
        <li><strong>Bill</strong> — Essentially the same as an invoice, but typically used from the buyer's perspective</li>
      </ul>
      <p>Learn the full differences in our <a href="/blog/invoice-vs-receipt-key-differences/">invoice vs receipt comparison</a>.</p>
    `,
    faqs: [
      { q: 'What is an invoice in simple terms?', a: 'An invoice is a document that a seller sends to a buyer to request payment for goods or services. It includes details like what was sold, the price, and when payment is due.' },
      { q: 'Is an invoice the same as a bill?', a: 'Essentially yes. The terms refer to the same document. "Invoice" is typically used by the seller, while "bill" is used from the buyer\'s perspective.' },
      { q: 'Do freelancers need to send invoices?', a: 'Yes. Freelancers should always send invoices for professional documentation, tax compliance, and to establish clear payment expectations with clients.' },
      { q: 'What is the difference between an invoice and a receipt?', a: 'An invoice is a request for payment sent before payment is made. A receipt is proof of payment issued after payment has been received.' },
      { q: 'Can I create an invoice for free?', a: 'Yes. Invoice-Gen is a 100% free Invoice-Gen that lets you create, customize, and download professional PDF invoices with no signup required.' }
    ],
    relatedLinks: [
      { url: '/blog/how-to-create-professional-invoice/', text: 'How to Create a Professional Invoice' },
      { url: '/blog/essential-fields-to-include-on-invoice/', text: 'Essential Invoice Fields' },
      { url: '/blog/invoice-vs-receipt-key-differences/', text: 'Invoice vs Receipt Differences' },
      { url: '/blog/common-invoice-mistakes-avoid/', text: 'Common Invoice Mistakes' },
      { url: '/free-invoice-generator/', text: 'Free Invoice-Gen' }
    ]
  },
  {
    slug: 'invoice-number-best-practices',
    title: 'Invoice Number Best Practices for Small Businesses | Invoice-Gen',
    h1: 'Invoice Number Best Practices for Small Businesses in 2026',
    description: 'Learn how to format and manage invoice numbers correctly. Discover professional numbering systems, alphanumeric sequences, and why sequential numbering is critical for tax compliance.',
    keywords: 'invoice number, invoice numbering system, how to number invoices, invoice number format',
    category: 'Invoice Fundamentals',
    tags: ['Best Practices', 'Accounting'],
    author: 'Invoice-Gen Editorial Team',
    datePublished: '2026-07-14',
    dateModified: '2026-07-14',
    status: 'published',
    content: `
      <p>An invoice number is a unique, sequential identifier assigned to an invoice. While it might seem like a minor administrative detail, choosing the right invoice numbering system is crucial for tracking payments, organizing records, and staying compliant with tax authorities.</p>
      
      <p>In this guide, we will explore the best practices for structuring invoice numbers, common formatting methods, and how to avoid mistakes that could disrupt your accounting.</p>

      <h2>Why Are Invoice Numbers Important?</h2>
      <p>Invoice numbers serve as the backbone of your billing and accounting systems. Here is why you cannot ignore them:</p>
      <ul>
        <li><strong>Easy tracking and referencing:</strong> When a client has a question or makes a payment, referencing a unique invoice number (e.g., "INV-1042") is much faster than searching by date or amount.</li>
        <li><strong>Tax compliance:</strong> Many tax authorities (like the IRS in the US, HMRC in the UK, and the CRA in Canada) require businesses to use sequential invoice numbers. This creates an audit trail that proves you aren't hiding income.</li>
        <li><strong>Preventing duplicate payments:</strong> A unique identifier ensures a client doesn't accidentally pay the same invoice twice.</li>
        <li><strong>Professionalism:</strong> Sending an invoice without a number, or with a messy format like "Invoice 1," looks amateurish and may cause clients to question your organization.</li>
      </ul>

      <h2>Common Invoice Number Formats</h2>
      <p>There is no single "correct" way to format an invoice number, but it must be unique and sequential. Here are the most popular methods used by modern businesses:</p>
      
      <h3>1. Sequential Numbering (The Simplest Method)</h3>
      <p>This is the most straightforward approach. You simply start at a specific number and increase by one for each new invoice.</p>
      <ul>
        <li><em>Example:</em> 1001, 1002, 1003</li>
      </ul>
      <p><em>Pro Tip:</em> Never start at "1" or "001". It tells your clients that they are your very first customer, which might undermine your perceived experience. Start at 1001 or 10001 instead.</p>

      <h3>2. Chronological Numbering (Date-Based)</h3>
      <p>This method incorporates the date into the invoice number. It makes it instantly obvious when the invoice was created.</p>
      <ul>
        <li><em>Format:</em> YYYYMMDD-Sequence</li>
        <li><em>Example:</em> 20260714-001, 20260714-002</li>
      </ul>
      <p>This is excellent for high-volume businesses that issue multiple invoices per day.</p>

      <h3>3. Project-Based or Client-Based Numbering</h3>
      <p>If you work on large projects or have recurring clients, you can include a client code or project code.</p>
      <ul>
        <li><em>Format:</em> ClientCode-Sequence</li>
        <li><em>Example:</em> GOOG-1001, AMZN-1002</li>
      </ul>
      <p>This helps you quickly identify which client an invoice belongs to just by glancing at the number.</p>

      <h3>4. Alphanumeric Numbering</h3>
      <p>Combining letters and numbers is a great way to add context to your invoices. You can prefix invoices with "INV" or an abbreviation of your business name.</p>
      <ul>
        <li><em>Example:</em> INV-2026-1042</li>
      </ul>

      <h2>Best Practices for Invoice Numbering</h2>
      <p>To keep your accounting clean and error-free, follow these golden rules:</p>

      <h3>Always Be Sequential</h3>
      <p>Never skip numbers. If you issue invoice 1042, the next one must be 1043. Missing numbers can trigger red flags during a tax audit, as auditors might suspect you deleted an invoice to hide revenue.</p>

      <h3>Use a Consistent Format</h3>
      <p>Pick a numbering format and stick with it. Don't switch from <code>INV-1001</code> to <code>2026-1002</code> in the middle of the year. If you must change your system, wait until the start of a new financial year.</p>

      <h3>Keep It Short and Readable</h3>
      <p>Avoid excessively long numbers. <code>INV-1042</code> is much easier for a client to type into a bank transfer reference field than <code>INVOICE-2026-07-14-CLIENT-1042</code>.</p>

      <h3>Use Automation</h3>
      <p>Manually tracking invoice numbers in a spreadsheet is a recipe for disaster. It's incredibly easy to accidentally reuse a number. Instead, use an automated tool like <a href="/">Invoice-Gen</a>, which automatically generates and increments your invoice numbers for you.</p>

      <h2>How to Fix an Invoice Number Mistake</h2>
      <p>If you accidentally skip a number or issue a duplicate, don't panic, but do not just delete the invoice. Instead:</p>
      <ol>
        <li>If you issued a duplicate, void one of the invoices and issue a new one with the correct, sequential number.</li>
        <li>If you skipped a number, document the gap in your accounting records so that if you are audited, you have a written explanation.</li>
      </ol>
      <p>For more tips on avoiding errors, check out our guide on <a href="/blog/common-invoice-mistakes-avoid/">common invoice mistakes</a>.</p>

      <h2>Start Numbering Invoices the Right Way</h2>
      <p>The easiest way to guarantee perfect invoice numbering is to use software that handles it for you. With <a href="/">Invoice-Gen</a>, your invoice numbers are automatically tracked and incremented. You can customize the prefix and starting number, and the system ensures you never create a duplicate.</p>
    `,
    faqs: [
      { q: 'Should invoice numbers start at 1?', a: 'No, it is highly recommended not to start at 1. Starting at 1 or 001 signals to clients that they are your first customer. Instead, start at 1001 or 10001 to appear more established.' },
      { q: 'Can invoice numbers include letters?', a: 'Yes. Alphanumeric invoice numbers (like INV-1001) are very common and perfectly legal. They can help categorize invoices or identify specific clients.' },
      { q: 'What happens if I skip an invoice number?', a: 'Skipping an invoice number breaks the sequential chain, which can look suspicious during a tax audit. If you accidentally skip a number, you should document the error in your accounting records to explain the gap.' },
      { q: 'Do invoice numbers reset every year?', a: 'They can, but it is not required. Some businesses reset their numbering at the start of the financial year (e.g., 2026-001, then 2027-001 next year). This is perfectly fine as long as the format clearly distinguishes the years.' },
      { q: 'How do I avoid duplicate invoice numbers?', a: 'The best way to avoid duplicates is to use automated invoicing software like Invoice-Gen, which tracks your history and automatically assigns the next sequential number.' }
    ],
    relatedLinks: [
      { url: '/blog/what-is-an-invoice-beginners-guide/', text: 'What is an Invoice?' },
      { url: '/blog/essential-fields-to-include-on-invoice/', text: 'Essential Invoice Fields' },
      { url: '/blog/common-invoice-mistakes-avoid/', text: 'Common Invoice Mistakes' },
      { url: '/free-invoice-generator/', text: 'Free Invoice-Gen' },
      { url: '/invoice-creator/', text: 'Online Invoice Creator' }
    ]
  },
  {
    slug: 'invoice-date-vs-due-date-difference',
    title: 'Invoice Date vs Due Date: What Is the Difference? | Invoice-Gen',
    h1: 'Invoice Date vs Due Date: Understanding the Difference',
    description: 'Learn the critical differences between an invoice date and a due date. Understand how they impact payment terms, cash flow, and tax reporting for your business.',
    keywords: 'invoice date vs due date, invoice date meaning, due date meaning, payment terms, issue date',
    category: 'Invoice Fundamentals',
    tags: ['Payment Terms', 'Basics'],
    author: 'Invoice-Gen Editorial Team',
    datePublished: '2026-07-15',
    dateModified: '2026-07-15',
    status: 'published',
    content: `
      <p>When creating a professional invoice, two of the most critical fields are the <strong>Invoice Date</strong> and the <strong>Due Date</strong>. While they might seem self-explanatory, confusing the two or using them incorrectly can lead to delayed payments, accounting errors, and strained client relationships.</p>
      
      <p>In this guide, we will break down exactly what each date means, why they both need to be prominently displayed on your invoice, and how they interact with your payment terms.</p>

      <h2>What is an Invoice Date?</h2>
      <p>The <strong>Invoice Date</strong> (sometimes called the Issue Date or Billing Date) is the exact date that the invoice is officially created and billed to the client.</p>
      
      <p>This date is crucial for several reasons:</p>
      <ul>
        <li><strong>It starts the clock on payment terms:</strong> If your payment terms are "Net 30" (meaning payment is due in 30 days), those 30 days almost always start counting from the Invoice Date.</li>
        <li><strong>Tax and accounting periods:</strong> For businesses using accrual accounting, revenue is recognized on the Invoice Date, regardless of when the cash is actually received. This dictates which month, quarter, or year the revenue belongs to for tax purposes.</li>
        <li><strong>Legal record:</strong> It provides a concrete timeline of when a payment was officially requested.</li>
      </ul>
      <p><em>Best Practice:</em> Always set the Invoice Date to the day you actually send the invoice to the client. Do not backdate invoices, as this unfairly shortens the client's payment window.</p>

      <h2>What is a Due Date?</h2>
      <p>The <strong>Due Date</strong> is the exact date by which the client must pay the invoice in full. Once this date passes, the invoice becomes "overdue," and you may be entitled to charge late fees (if stipulated in your contract).</p>
      
      <p>The Due Date is usually calculated based on the Invoice Date and your agreed-upon payment terms. For example:</p>
      <ul>
        <li>If the Invoice Date is July 1st, and terms are <strong>Due on Receipt</strong>, the Due Date is July 1st.</li>
        <li>If the Invoice Date is July 1st, and terms are <strong>Net 15</strong>, the Due Date is July 16th.</li>
        <li>If the Invoice Date is July 1st, and terms are <strong>Net 30</strong>, the Due Date is July 31st.</li>
      </ul>
      <p>For more information on choosing the right terms, read our guide on <a href="/blog/best-payment-terms-freelancers/">the best payment terms for freelancers</a>.</p>

      <h2>Why You Need Both Dates on Your Invoice</h2>
      <p>You might wonder: <em>"If I have Net 30 terms listed on the invoice, do I really need to write out the specific Due Date?"</em></p>
      
      <p>Yes, absolutely. Here is why:</p>
      
      <h3>1. It Eliminates Ambiguity</h3>
      <p>Phrases like "Net 30" are standard business jargon, but not every client understands them. Even worse, clients might interpret the 30-day countdown differently. Do the 30 days start on the Invoice Date? Or the date they opened the email? Or the date they approved the work?</p>
      <p>Writing out a specific, concrete Due Date (e.g., "Due Date: August 14, 2026") removes all ambiguity. The client knows exactly when the money must be in your account.</p>

      <h3>2. It Increases Payment Speed</h3>
      <p>Studies consistently show that invoices with a specific, hard Due Date get paid faster than those that just list "Net 30" or "Due in 14 days." A specific date creates a sense of urgency.</p>

      <h3>3. It Gives You Leverage for Follow-Ups</h3>
      <p>If an invoice is unpaid, following up is much easier when you can reference a hard date. It is much more professional to say, <em>"This invoice was due on August 14th,"</em> rather than, <em>"It's been roughly 30 days since I sent this."</em></p>
      <p>Need help following up? Check out our <a href="/blog/friendly-late-payment-reminder-email-templates/">late payment reminder email templates</a>.</p>

      <h2>The Supply Date vs Invoice Date</h2>
      <p>In some regions (like the UK for VAT purposes), you may also need to be aware of the <strong>Supply Date</strong> (or Tax Point). This is the date the goods were delivered or the service was completed.</p>
      <p>While the Supply Date and the Invoice Date are often the same, they can be different. For example, you might finish a consulting project on Friday (Supply Date) but not generate and send the invoice until Monday (Invoice Date). Ensure you check your local tax regulations to see if the Supply Date needs to be explicitly listed on your invoices.</p>

      <h2>How to Set Dates Easily</h2>
      <p>Calculating due dates manually leaves room for error. When you use <a href="/">Invoice-Gen</a>, the Invoice Date defaults to today, and you can simply select your payment terms (like Net 15 or Net 30) from a dropdown. The system will automatically calculate and display the exact, concrete Due Date on your final PDF invoice.</p>
    `,
    faqs: [
      { q: 'What does invoice date mean?', a: 'The invoice date is the date the invoice was officially generated and billed to the client. It is used to determine accounting periods and serves as the starting point for calculating payment due dates.' },
      { q: 'Is the invoice date the day I send it?', a: 'Yes, best practice is that the invoice date should match the day you actually send the invoice to the client. Backdating an invoice unfairly reduces the time a client has to pay.' },
      { q: 'Should I use "Due on Receipt" or a specific date?', a: 'It is highly recommended to provide a specific due date, even if your terms are "Due on Receipt." Writing out a specific date (e.g., "Due Date: July 15, 2026") removes all ambiguity and helps you get paid faster.' },
      { q: 'How is a due date calculated?', a: 'A due date is calculated by adding your payment terms to the invoice date. For example, if the invoice date is July 1 and your terms are Net 30 (30 days), the due date is July 31.' },
      { q: 'What happens if a due date falls on a weekend?', a: 'If a due date falls on a weekend or a public holiday, standard business practice dictates that the payment is due on the next available business day. However, clients should ideally schedule transfers in advance to arrive on time.' }
    ],
    relatedLinks: [
      { url: '/blog/what-is-an-invoice-beginners-guide/', text: 'What is an Invoice?' },
      { url: '/blog/best-payment-terms-freelancers/', text: 'Best Payment Terms' },
      { url: '/blog/friendly-late-payment-reminder-email-templates/', text: 'Late Payment Email Templates' },
      { url: '/blog/how-to-get-paid-faster-invoices/', text: 'How to Get Paid Faster' },
      { url: '/invoice-maker/', text: 'Online Invoice Maker' }
    ]
  },
  
  // ── Drafts (Do Not Publish Automatically) ──
  
  {
    slug: 'net-15-vs-net-30-vs-net-60-payment-terms',
    title: 'Net 15 vs Net 30 vs Net 60: Which Payment Terms Are Best?',
    h1: 'Net 15 vs Net 30 vs Net 60: Choosing the Right Invoice Payment Terms',
    description: 'Confused by Net 15, Net 30, and Net 60? Learn what these standard invoice payment terms mean, the pros and cons of each, and how to choose the right one for your business.',
    keywords: 'net 15, net 30, net 60, invoice payment terms, net payment terms, billing terms',
    category: 'Payment Terms',
    tags: ['Cash Flow', 'Billing'],
    author: 'Invoice-Gen Editorial Team',
    datePublished: '2026-07-16',
    dateModified: '2026-07-16',
    status: 'draft',
    content: `
      <p>When you send an invoice to a client, you need to tell them exactly when payment is expected. This is where <strong>payment terms</strong> come in. The most common terms in B2B (business-to-business) invoicing are Net 15, Net 30, and Net 60.</p>
      
      <p>But what do these terms actually mean? And more importantly, which one should you use to optimize your cash flow without alienating your clients? Let's break it down.</p>

      <h2>What Does "Net" Mean on an Invoice?</h2>
      <p>The term "Net" (often written as "Net [number]") simply refers to the total number of days a client has to pay the invoice in full after the invoice date. The "Net" signifies that the total, net amount of the invoice is due.</p>
      
      <p>For example, if your invoice date is October 1st and your terms are Net 30, the client has exactly 30 days to pay you. The payment is due on October 31st.</p>

      <p><em>Expert Tip:</em> "Net" days are almost always calendar days, not business days. If a due date falls on a weekend, standard practice dictates the payment is due the following Monday.</p>

      <h2>Net 15: Fast Payments for Small Businesses</h2>
      <p><strong>Net 15</strong> means the payment is due 15 days after the invoice date.</p>
      
      <p><strong>Pros:</strong></p>
      <ul>
        <li><strong>Excellent cash flow:</strong> Getting paid in two weeks keeps your business highly liquid.</li>
        <li><strong>Sets clear expectations:</strong> It signals to clients that you expect prompt payment for your services.</li>
      </ul>
      
      <p><strong>Cons:</strong></p>
      <ul>
        <li><strong>Too tight for enterprise:</strong> Large corporations often have accounts payable departments that only cut checks twice a month. A 15-day window might be physically impossible for their internal bureaucracy.</li>
      </ul>
      
      <p><strong>Who should use it?</strong> Freelancers, small agencies, and consultants dealing directly with founders or other small businesses.</p>

      <h2>Net 30: The Global Standard</h2>
      <p><strong>Net 30</strong> means the payment is due 30 days after the invoice date. This is arguably the most common payment term globally.</p>
      
      <p><strong>Pros:</strong></p>
      <ul>
        <li><strong>Widely accepted:</strong> Every client, from solopreneurs to Fortune 500 companies, understands and can accommodate Net 30 terms.</li>
        <li><strong>Fair compromise:</strong> It gives the client a full month to process the payment while ensuring the vendor isn't waiting indefinitely.</li>
      </ul>
      
      <p><strong>Cons:</strong></p>
      <ul>
        <li><strong>Slower cash flow:</strong> You are essentially offering your client a 30-day interest-free loan. You have to wait a month to get paid for work you already completed.</li>
      </ul>
      
      <p><strong>Who should use it?</strong> Most B2B service providers, SaaS companies with manual billing, and wholesalers.</p>

      <h2>Net 60 and Net 90: Enterprise Territory</h2>
      <p><strong>Net 60</strong> (and its longer sibling, Net 90) means the payment is due 60 or 90 days after the invoice date.</p>
      
      <p><strong>Pros:</strong></p>
      <ul>
        <li><strong>Wins enterprise contracts:</strong> Massive retailers, government agencies, and manufacturing giants often dictate Net 60 or Net 90 terms to their vendors. Accepting these terms is sometimes the only way to land a massive contract.</li>
      </ul>
      
      <p><strong>Cons:</strong></p>
      <ul>
        <li><strong>Terrible for cash flow:</strong> Waiting two to three months to get paid can cripple a small business. You still have to pay your own team and overhead during that waiting period.</li>
        <li><strong>Higher risk:</strong> If a client goes bankrupt within those 90 days, you might never see that money.</li>
      </ul>
      
      <p><strong>Who should use it?</strong> Large vendors who have the capital reserves to float expenses for months, or businesses that use invoice factoring.</p>

      <h2>How to Enforce Your Terms (and Get Paid Faster)</h2>
      <p>Just putting "Net 30" on your invoice doesn't guarantee the client will pay on time. To ensure compliance:</p>
      <ol>
        <li><strong>Discuss terms upfront:</strong> Never surprise a client with payment terms. Put them in your initial contract or proposal.</li>
        <li><strong>Use specific due dates:</strong> Instead of just writing "Net 30," write "Net 30 - Due Date: October 31, 2026." This removes all ambiguity.</li>
        <li><strong>Offer early payment discounts:</strong> A common tactic is "2/10 Net 30". This means the client gets a 2% discount if they pay within 10 days; otherwise, the full amount is due in 30 days.</li>
        <li><strong>Charge late fees:</strong> Clearly state on your invoice that a late fee (e.g., 1.5% per month) applies to overdue balances.</li>
      </ol>
      <p>For more strategies on dealing with late payments, read our guide on <a href="/blog/how-to-handle-overdue-unpaid-invoices/">how to handle overdue invoices</a>.</p>

      <h2>Summary: Which Should You Choose?</h2>
      <p>If you are a freelancer or small agency, try to negotiate <strong>Net 15</strong> or even "Due on Receipt" for the healthiest cash flow. If you are dealing with mid-sized to large corporations, <strong>Net 30</strong> is the safest, most professional standard.</p>
      
      <p>Ready to bill your clients? Use <a href="/">Invoice-Gen</a> to instantly create professional invoices with automatically calculated Net 15, Net 30, or Net 60 due dates.</p>
    `,
    faqs: [
      { q: 'What does Net 30 mean on an invoice?', a: 'Net 30 means that the total, net amount of the invoice is due exactly 30 days from the invoice date.' },
      { q: 'Does Net 30 mean 30 business days or calendar days?', a: 'Net 30 always refers to calendar days. If the invoice date is July 1st, the payment is due on July 31st, regardless of weekends or holidays.' },
      { q: 'Can I charge late fees after Net 30?', a: 'Yes, you can charge late fees once the 30-day period expires, provided you clearly stated the late fee policy in your contract and on the invoice itself.' },
      { q: 'What does 2/10 Net 30 mean?', a: 'This is an early payment discount. It means the client can take a 2% discount if they pay within 10 days. If not, the full amount is due in 30 days.' },
      { q: 'Is "Due on Receipt" better than Net 15?', a: 'Due on Receipt means payment is expected immediately. It is better for your cash flow, but some corporate clients may push back because their accounting departments need time to process invoices.' }
    ],
    relatedLinks: [
      { url: '/blog/invoice-date-vs-due-date-difference/', text: 'Invoice Date vs Due Date' },
      { url: '/blog/how-to-handle-overdue-unpaid-invoices/', text: 'Handling Overdue Invoices' },
      { url: '/blog/best-payment-terms-freelancers/', text: 'Best Payment Terms for Freelancers' },
      { url: '/free-invoice-generator/', text: 'Free Invoice-Gen' },
      { url: '/templates/freelance/', text: 'Freelance Invoice Template' }
    ]
  },

  {
    slug: 'how-to-invoice-international-clients',
    title: 'How to Invoice International Clients: A Complete Guide | Invoice-Gen',
    h1: 'How to Invoice International Clients: Best Practices for Global Billing',
    description: 'Learn the best practices for invoicing international clients. Discover how to handle multiple currencies, exchange rates, cross-border taxes, and global payment methods.',
    keywords: 'how to invoice international clients, international invoice, foreign currency invoice, cross border invoicing, SWIFT, IBAN',
    category: 'International Invoicing',
    tags: ['Freelancing', 'Global Business'],
    author: 'Invoice-Gen Editorial Team',
    datePublished: '2026-07-17',
    dateModified: '2026-07-17',
    status: 'draft',
    content: `
      <p>The rise of remote work has made it easier than ever to build a global client base. However, when it comes time to get paid, crossing borders introduces a new layer of complexity. From fluctuating exchange rates to confusing tax laws and exorbitant bank fees, invoicing an international client requires careful planning.</p>
      
      <p>In this comprehensive guide, we will break down exactly how to structure an international invoice, choose the right currency, and ensure you get paid without losing a massive chunk of your revenue to hidden fees.</p>

      <h2>1. Choosing the Right Currency</h2>
      <p>The first major decision you must make is which currency to use on the invoice. You generally have two options:</p>

      <h3>Billing in Your Local Currency</h3>
      <p>This is the safest option for you. If you are in the UK and bill £5,000, you know you will receive exactly £5,000. The client takes on the <strong>exchange rate risk</strong> (if their local currency drops in value, the project costs them more).</p>
      <p><em>The downside:</em> It creates friction for the client, who has to figure out how to convert and send the funds.</p>

      <h3>Billing in the Client's Currency</h3>
      <p>This is highly professional and creates a frictionless experience for the client. If your client is in the US, billing in USD makes it easy for their accounts payable department to process the invoice.</p>
      <p><em>The downside:</em> You take on the exchange rate risk. If you bill $5,000 USD and the dollar weakens against your local currency before they pay, you effectively earn less money.</p>
      
      <p><strong>Expert Tip:</strong> Always agree on the billing currency in your initial contract. If you bill in a foreign currency, bake a small buffer (2-3%) into your pricing to account for potential exchange rate fluctuations.</p>

      <h2>2. Essential Fields for an International Invoice</h2>
      <p>An international invoice needs more detail than a domestic one to satisfy global banking regulations and tax authorities. Ensure you include:</p>
      
      <ul>
        <li><strong>Standard details:</strong> Unique invoice number, invoice date, due date, and detailed line items.</li>
        <li><strong>Country information:</strong> Explicitly state your country and the client's country in the address blocks.</li>
        <li><strong>International banking details:</strong> A domestic account number is useless abroad. You must provide your <strong>SWIFT/BIC code</strong> and your <strong>IBAN</strong> (International Bank Account Number) or routing number, depending on your region.</li>
        <li><strong>Currency symbol and ISO code:</strong> Don't just use "$", as that could mean US, Canadian, or Australian dollars. Use the ISO code (e.g., USD, CAD, AUD, GBP, EUR).</li>
      </ul>

      <h2>3. Handling Taxes (VAT, GST, and Sales Tax)</h2>
      <p>Cross-border taxation is notoriously complex, but here are the general rules of thumb for B2B (business-to-business) services:</p>
      
      <p>If you are exporting services (e.g., a UK designer building a website for a US client), the service is generally considered "outside the scope" of local VAT/GST, meaning you charge <strong>0% tax</strong> (often called zero-rated). However, you must keep evidence that your client is based abroad.</p>
      
      <p>If you are in the EU billing another EU business, you usually use the <strong>Reverse Charge Mechanism</strong>. You charge 0% VAT, but you must include both your VAT number and your client's VAT number on the invoice, along with a note stating "VAT Reverse Charge Applies."</p>
      
      <p><em>Disclaimer: Tax laws vary wildly by country and by physical goods vs digital services. Always consult a local tax professional regarding cross-border sales.</em></p>

      <h2>4. Choosing the Best Payment Method</h2>
      <p>International wire transfers through traditional banks are slow, expensive (often costing $25-$50 per wire), and hide terrible exchange rates. Instead, offer modern payment options:</p>
      
      <ul>
        <li><strong>Platforms like Wise (formerly TransferWise) or Payoneer:</strong> These give you local bank details in multiple countries (e.g., a US routing number even if you live in Europe), allowing clients to pay via a cheap local transfer. The exchange rates are also mid-market.</li>
        <li><strong>Stripe or PayPal:</strong> Extremely easy for the client (they can just use a credit card), but the fees are high. Expect to lose 3-5% in cross-border and currency conversion fees.</li>
        <li><strong>Cryptocurrency:</strong> Fast and borderless, but introduces massive volatility risk and complicates accounting. Only use this if both you and the client are highly comfortable with crypto bookkeeping.</li>
      </ul>

      <h2>Summary</h2>
      <p>Invoicing internationally doesn't have to be daunting. Agree on the currency upfront, provide your SWIFT/IBAN details clearly, and use a modern fintech platform to avoid exorbitant bank fees.</p>
      
      <p>Ready to bill your global clients? Use <a href="/">Invoice-Gen</a> to instantly create multi-currency invoices. You can customize the currency symbol, add your international wire details, and download a pristine PDF in seconds.</p>
    `,
    faqs: [
      { q: 'Should I invoice international clients in my currency or theirs?', a: 'Billing in your client\'s currency is more professional and creates less friction, but you assume the exchange rate risk. Billing in your local currency is safer for you but harder for the client.' },
      { q: 'Do I charge VAT to international clients?', a: 'Generally, B2B services exported outside your country are zero-rated for VAT/GST (you charge 0%). If billing within the EU, the reverse charge mechanism usually applies. Always consult an accountant for specific regulations.' },
      { q: 'What is a SWIFT code and do I need it?', a: 'A SWIFT (or BIC) code is a unique identifier for your specific bank branch. You absolutely need to include it on your invoice if you expect an international wire transfer.' },
      { q: 'What is an IBAN?', a: 'IBAN stands for International Bank Account Number. It is an internationally agreed system of identifying bank accounts across borders to reduce errors in cross-border transactions.' },
      { q: 'Can I use Invoice-Gen for international invoices?', a: 'Yes! Invoice-Gen allows you to type any currency symbol (like €, £, or CAD) and includes a flexible notes section where you can clearly list your SWIFT code and IBAN.' }
    ],
    relatedLinks: [
      { url: '/blog/vat-invoice-requirements-guide/', text: 'VAT Invoice Guide' },
      { url: '/blog/gst-invoice-rules-and-formats/', text: 'GST Invoice Guide' },
      { url: '/blog/best-payment-terms-freelancers/', text: 'Best Payment Terms' },
      { url: '/free-invoice-generator/', text: 'Free Invoice-Gen' },
      { url: '/templates/freelance/', text: 'Freelance Invoice Template' }
    ]
  },

  {
    slug: 'vat-invoice-requirements-guide',
    title: 'VAT Invoice Guide: Requirements and Best Practices | Invoice-Gen',
    h1: 'VAT Invoice Guide: Requirements, Formats, and Best Practices',
    description: 'Everything you need to know about issuing a valid VAT invoice. Learn the mandatory fields, when to use simplified VAT invoices, and how to stay compliant in the UK and EU.',
    keywords: 'VAT invoice, VAT invoice requirements, valid VAT invoice, simplified VAT invoice, reverse charge VAT',
    category: 'Taxes',
    tags: ['Accounting', 'UK Business', 'EU Business'],
    author: 'Invoice-Gen Editorial Team',
    datePublished: '2026-07-18',
    dateModified: '2026-07-18',
    status: 'draft',
    content: `
      <p>If your business is registered for Value Added Tax (VAT), generating a standard invoice is no longer enough. You are legally required to issue a <strong>VAT invoice</strong>. A VAT invoice acts as primary evidence that allows your registered B2B clients to reclaim the VAT they paid you from the tax authorities.</p>
      
      <p>If you fail to include the mandatory legal fields, your client's tax reclaim will be rejected, leading to delayed payments and a damaged professional reputation. In this guide, we break down exactly what makes a VAT invoice valid.</p>

      <h2>When is a VAT Invoice Required?</h2>
      <p>If you are VAT-registered, you must issue a VAT invoice whenever you supply standard-rated or reduced-rated goods or services to another VAT-registered business. You typically do <em>not</em> need to issue a full VAT invoice for B2C (business-to-consumer) retail sales, though consumers can request one.</p>
      
      <p><em>Important:</em> If you are NOT VAT registered, it is illegal to issue a VAT invoice or charge VAT. You must issue a standard commercial invoice instead.</p>

      <h2>Mandatory Fields for a Full VAT Invoice</h2>
      <p>To be legally valid (particularly under UK HMRC and EU guidelines), a full VAT invoice must include all of the following information:</p>
      
      <ol>
        <li><strong>A unique, sequential invoice number:</strong> It must follow on from the previous invoice without gaps.</li>
        <li><strong>The date of issue:</strong> The date the invoice was generated.</li>
        <li><strong>The tax point (time of supply):</strong> The date the transaction took place (if this is different from the invoice issue date).</li>
        <li><strong>Your business details:</strong> Your business name, address, and contact information.</li>
        <li><strong>Your VAT Registration Number (VRN):</strong> This is critical.</li>
        <li><strong>The customer's details:</strong> Their business name and address.</li>
        <li><strong>Line item descriptions:</strong> A clear description of the goods or services supplied.</li>
        <li><strong>Quantities and unit prices:</strong> Exclude VAT at this stage.</li>
        <li><strong>The rate of VAT charged per item:</strong> e.g., 20%, 5%, or 0%.</li>
        <li><strong>The total amount excluding VAT:</strong> The net total.</li>
        <li><strong>The total amount of VAT:</strong> The actual tax amount.</li>
        <li><strong>The total amount including VAT:</strong> The gross total the customer must pay.</li>
      </ol>

      <h2>What is a Simplified VAT Invoice?</h2>
      <p>For smaller transactions, tax authorities often allow you to issue a <strong>Simplified VAT Invoice</strong>. In the UK, you can use a simplified invoice for retail supplies totaling under £250 (including VAT).</p>
      
      <p>A simplified VAT invoice only requires:</p>
      <ul>
        <li>Your business name, address, and VAT number.</li>
        <li>The tax point (time of supply).</li>
        <li>A description of the goods/services.</li>
        <li>The total amount payable (including VAT).</li>
        <li>The VAT rate charged.</li>
      </ul>
      <p>You do not need to list the net amount or the exact VAT amount, nor do you need to include the customer's name and address.</p>

      <h2>Zero-Rated, Exempt, and Reverse Charge Supplies</h2>
      <p>Not all invoices feature standard 20% VAT. Here is how to handle exceptions:</p>
      
      <h3>Zero-Rated vs Exempt</h3>
      <p>Some goods (like books or children's clothing in the UK) are <strong>Zero-Rated (0%)</strong>. You still record them on a VAT invoice, but list the VAT rate as 0%. <strong>Exempt</strong> supplies (like insurance or education) are outside the VAT system entirely, but should still be clearly noted if included on a mixed invoice.</p>
      
      <h3>The Reverse Charge Mechanism</h3>
      <p>If you are supplying B2B services across borders within the EU (or dealing with specific industries like construction in the UK), the Reverse Charge mechanism may apply. This means you do not charge VAT. Instead, the buyer accounts for the VAT on their own tax return.</p>
      <p>If this applies, you must:</p>
      <ul>
        <li>Include the buyer's VAT number on the invoice.</li>
        <li>Clearly state: <em>"Reverse charge: Customer to account for VAT to [Tax Authority]."</em></li>
      </ul>

      <h2>Correcting Mistakes on a VAT Invoice</h2>
      <p>If you make a mistake on a VAT invoice, <strong>never just delete it or overwrite it</strong>. This breaks the sequential numbering rule and looks like tax evasion to auditors.</p>
      <p>Instead, you must issue a <strong>Credit Note</strong> to cancel out the incorrect invoice, and then issue a brand new VAT invoice with the correct details and a new sequential number.</p>

      <h2>Summary</h2>
      <p>VAT compliance relies heavily on flawless invoicing. Ensure your VAT number, the net amounts, and the tax rates are crystal clear on every document you send to a B2B client.</p>
      
      <p>With <a href="/">Invoice-Gen</a>, you can easily create compliant VAT invoices. Simply add your VAT number to the business details section, add a "Tax" field in the totals section, and clearly describe your goods in the line items.</p>
    `,
    faqs: [
      { q: 'Do I need to issue a VAT invoice if I am not VAT registered?', a: 'No, and doing so is illegal. If you are not VAT registered, you cannot charge VAT and must issue a standard commercial invoice instead.' },
      { q: 'What happens if I make a mistake on a VAT invoice?', a: 'You cannot simply delete or alter a VAT invoice once it has been issued. You must issue a credit note to cancel the original invoice and then generate a new, correct VAT invoice with a new invoice number.' },
      { q: 'What is a reverse charge VAT invoice?', a: 'A reverse charge invoice is used primarily for cross-border B2B sales (and some domestic industries like construction). You charge 0% VAT, and the buyer is responsible for accounting for the VAT on their own tax return.' },
      { q: 'What is a tax point?', a: 'The tax point, or time of supply, is the date the transaction is considered to have taken place for VAT purposes. This dictates which VAT return period the transaction falls into.' },
      { q: 'Can I use Invoice-Gen to make a VAT invoice?', a: 'Yes. Invoice-Gen allows you to add custom fields (like your VAT Registration Number), apply tax percentages, and include specific notes (like "Reverse Charge Applies") to ensure full compliance.' }
    ],
    relatedLinks: [
      { url: '/blog/how-to-invoice-international-clients/', text: 'Invoicing International Clients' },
      { url: '/blog/invoice-number-best-practices/', text: 'Invoice Numbering Rules' },
      { url: '/blog/essential-fields-to-include-on-invoice/', text: 'Essential Invoice Fields' },
      { url: '/free-invoice-generator/', text: 'Free Invoice-Gen' },
      { url: '/invoice-creator/', text: 'Online Invoice Creator' }
    ]
  },

  {
    slug: 'gst-invoice-rules-and-formats',
    title: 'Complete Guide to GST Invoices: Rules, Formats, and Requirements | Invoice-Gen',
    h1: 'Complete Guide to GST Invoices: Rules, Formats, and Requirements',
    description: 'A comprehensive guide to Goods and Services Tax (GST) invoices. Understand the mandatory components, HSN/SAC codes, and compliance rules for businesses.',
    keywords: 'GST invoice, what is a GST invoice, GST rules, tax invoice format, HSN code, SAC code',
    category: 'Taxes',
    tags: ['Accounting', 'Business Taxes'],
    author: 'Invoice-Gen Editorial Team',
    datePublished: '2026-07-19',
    dateModified: '2026-07-19',
    status: 'draft',
    content: `
      <p>If your business operates in a country that uses a Goods and Services Tax (GST) system—such as India, Australia, Canada, or New Zealand—understanding how to issue a compliant GST invoice is not optional; it is a legal requirement.</p>
      
      <p>A GST invoice (often legally termed a "Tax Invoice") is the essential document that allows your B2B customers to claim Input Tax Credits (ITC). If your invoice is formatted incorrectly, your client loses money, and you could face severe tax penalties.</p>

      <h2>What is a GST Invoice?</h2>
      <p>A GST invoice is a commercial document issued by a registered seller to a buyer, displaying the details of the goods or services provided, the total amount due, and the exact amount of GST charged.</p>
      
      <p>It differs from a standard invoice because it must adhere to strict formatting and data requirements set by the national tax authority.</p>

      <h2>Mandatory Components of a GST Invoice</h2>
      <p>While specific requirements vary slightly by country (for instance, India requires HSN/SAC codes, while Australia requires an ABN), a globally compliant GST Tax Invoice generally must include:</p>

      <ul>
        <li><strong>The words "Tax Invoice":</strong> This must be stated prominently at the top of the document.</li>
        <li><strong>Supplier Details:</strong> Your business name, registered address, and your GST Identification Number (GSTIN, ABN, or GST Number).</li>
        <li><strong>Buyer Details:</strong> The customer's name, address, and their GST Number (crucial for B2B transactions so the buyer can claim input tax credits).</li>
        <li><strong>Invoice Number:</strong> A unique, sequential serial number.</li>
        <li><strong>Date of Issue:</strong> The date the invoice was generated.</li>
        <li><strong>Description of Goods/Services:</strong> A clear itemized list. (In India, this must include the HSN code for goods or the SAC code for services).</li>
        <li><strong>Quantity and Unit Price:</strong> The amount and price before tax.</li>
        <li><strong>Taxable Value (Net Amount):</strong> The total amount subject to GST after any discounts.</li>
        <li><strong>GST Rate and Amount:</strong> The exact percentage of tax applied (e.g., 5%, 10%, 18%) and the calculated tax amount. (In federated systems like India, this must be broken down into CGST, SGST, or IGST).</li>
        <li><strong>Gross Total:</strong> The final amount payable, including GST.</li>
      </ul>

      <h2>Tax Invoice vs. Bill of Supply</h2>
      <p>A common point of confusion is the difference between a Tax Invoice and a Bill of Supply.</p>
      
      <p>You issue a <strong>Tax Invoice</strong> when you are a GST-registered business selling taxable goods/services to another entity, and you are charging GST.</p>
      
      <p>You issue a <strong>Bill of Supply</strong> (or standard commercial invoice) when you are selling <em>exempt</em> goods/services, or if you are operating under a specific tax-exempt scheme (like the Composition Scheme in India). A Bill of Supply does not include any tax amounts, and the buyer cannot use it to claim input tax credits.</p>

      <h2>Time of Supply: When to Issue the Invoice</h2>
      <p>Tax authorities are very strict about <em>when</em> a GST invoice must be issued, as this determines which tax period the revenue falls into.</p>
      
      <ul>
        <li><strong>For Goods:</strong> The invoice must generally be issued on or before the date the goods are removed/shipped to the buyer.</li>
        <li><strong>For Services:</strong> The invoice must typically be issued within a set timeframe (e.g., 30 days) of the provision of the service.</li>
      </ul>

      <h2>Common GST Invoicing Mistakes</h2>
      <p>Avoid these frequent errors that can trigger audits or upset clients:</p>
      <ol>
        <li><strong>Omitting the buyer's GST number:</strong> Without this, your B2B client cannot claim their tax credit.</li>
        <li><strong>Incorrect math:</strong> Applying the tax percentage to the gross amount instead of the net amount.</li>
        <li><strong>Failing to use sequential numbering:</strong> Gaps in your invoice numbers suggest hidden revenue to tax auditors.</li>
      </ol>

      <h2>Summary</h2>
      <p>Staying compliant with GST regulations requires diligence. Always ensure your GST number, the buyer's GST number, and the exact tax breakdown are clearly visible on every tax invoice you issue.</p>
      
      <p><a href="/">Invoice-Gen</a> makes creating GST-compliant invoices easy. You can change the main title to "TAX INVOICE," add custom fields for GSTIN/ABN numbers, and apply precise tax percentages to your subtotals in seconds.</p>
    `,
    faqs: [
      { q: 'What is the difference between a GST invoice and a bill of supply?', a: 'A GST Tax Invoice includes charged tax and allows the buyer to claim Input Tax Credits. A Bill of Supply is used for tax-exempt goods or by businesses under special exemption schemes, and does not include tax amounts.' },
      { q: 'Do freelancers need to charge GST?', a: 'It depends on your country\'s revenue threshold. For example, in Australia, you must register and charge GST if your turnover exceeds $75,000 AUD. In Canada, the threshold is $30,000 CAD. If you are under the threshold, you generally do not charge GST.' },
      { q: 'What is an HSN or SAC code?', a: 'In the Indian GST system, HSN (Harmonized System of Nomenclature) codes classify goods, while SAC (Services Accounting Code) classify services. They are mandatory on tax invoices for businesses above certain turnover thresholds.' },
      { q: 'Can I generate a GST invoice for free?', a: 'Yes. You can use Invoice-Gen to create a free, GST-compliant invoice. Just ensure you manually add your GST registration number and apply the correct tax percentage.' },
      { q: 'What happens if I forget to put the client\'s GST number on the invoice?', a: 'If you omit the client\'s GST number on a B2B invoice, they will likely reject the invoice and ask for a revision, because without their number on the document, they cannot legally claim their Input Tax Credit.' }
    ],
    relatedLinks: [
      { url: '/blog/vat-invoice-requirements-guide/', text: 'VAT Invoice Guide' },
      { url: '/blog/essential-fields-to-include-on-invoice/', text: 'Essential Invoice Fields' },
      { url: '/blog/invoice-date-vs-due-date-difference/', text: 'Invoice Date vs Due Date' },
      { url: '/free-invoice-generator/', text: 'Free Invoice-Gen' },
      { url: '/templates/freelance/', text: 'Freelance Invoice Template' }
    ]
  },

  {
    slug: 'invoice-payment-terms-explained',
    title: 'Invoice Payment Terms Explained: Get Paid Faster in 2026 | Invoice-Gen',
    h1: 'Invoice Payment Terms Explained: How to Get Paid Faster',
    description: 'Discover the most common invoice payment terms, what they mean, and how to use them strategically to improve your cash flow and get paid on time.',
    keywords: 'invoice payment terms, payment terms explained, PIA, CIA, net 30, early payment discount',
    category: 'Payment Terms',
    tags: ['Cash Flow', 'Business Strategy'],
    author: 'Invoice-Gen Editorial Team',
    datePublished: '2026-07-20',
    dateModified: '2026-07-20',
    status: 'draft',
    content: `
      <p>One of the biggest mistakes new freelancers and small business owners make is sending an invoice with the payment terms listed as "whenever you get a chance." Without clear, enforceable payment terms, your invoice goes to the bottom of the client's priority list, suffocating your cash flow.</p>
      
      <p>Invoice payment terms dictate exactly when and how a client is expected to pay you. In this guide, we will decode the standard jargon and show you how to leverage terms to get paid faster.</p>

      <h2>The Most Common Payment Terms Glossary</h2>
      <p>If you are staring at a client's vendor agreement and feel like you are reading a foreign language, here is what those acronyms actually mean:</p>

      <h3>PIA (Payment in Advance) / CIA (Cash in Advance)</h3>
      <p>This means the client must pay the full amount <em>before</em> any work begins or goods are shipped. This is common for custom manufacturing, high-risk clients, or standard e-commerce retail.</p>

      <h3>Due on Receipt / COD (Cash on Delivery)</h3>
      <p>Payment is expected immediately upon receiving the invoice or the goods. For digital services, "Due on Receipt" is standard for independent freelancers. It creates a sense of urgency, though in reality, it usually means payment within 24 to 72 hours.</p>

      <h3>Net 15 / Net 30 / Net 60</h3>
      <p>The "Net" refers to the total amount due, and the number refers to the days the client has to pay after the invoice date. Net 30 is the global B2B standard. Read our deep dive into <a href="/blog/net-15-vs-net-30-vs-net-60-payment-terms/">Net 15 vs Net 30 vs Net 60</a> to see which is best for you.</p>

      <h3>EOM (End of Month)</h3>
      <p>This means the payment is due at the end of the month in which the invoice was issued. If you send an invoice on May 10th with EOM terms, it is due May 31st.</p>

      <h3>MFI (Month Following Invoice)</h3>
      <p>Often written as "15 MFI", meaning the payment is due on the 15th of the month <em>following</em> the invoice date. If you invoice on May 10th, payment is due June 15th.</p>

      <h2>Using Discount Terms to Speed Up Cash Flow</h2>
      <p>If you are stuck on Net 30 or Net 60 contracts but desperately need cash flow, you can offer Early Payment Discounts. These are written as a ratio.</p>
      
      <p><strong>"2/10 Net 30"</strong></p>
      <p>This translates to: <em>"The client can take a 2% discount on the total bill if they pay within 10 days. Otherwise, the full Net amount is due in 30 days."</em></p>
      
      <p>Enterprise accounts payable teams are heavily incentivized to take advantage of these discounts, meaning your invoice jumps to the front of the line.</p>

      <h2>How to Enforce Your Terms</h2>
      <p>Having great terms on paper is useless if clients ignore them. Here is how to make them stick:</p>
      
      <h3>1. Agree Before You Start</h3>
      <p>Never surprise a client with Net 15 terms on the final invoice if they were expecting Net 30. Payment terms must be negotiated and signed in the initial proposal or contract.</p>

      <h3>2. Be Explicit on the Invoice</h3>
      <p>Don't just write "Net 30." Write the exact due date. <em>"Terms: Net 30. Due Date: October 31st, 2026."</em> Ambiguity is the enemy of fast payments.</p>

      <h3>3. Implement Late Fees</h3>
      <p>Add a clear penalty clause to your invoices. For example: <em>"A late fee of 1.5% per month will be added to balances past due."</em> Even if you never actually charge the fee, its presence on the invoice acts as a powerful deterrent against late payments.</p>

      <h2>Summary</h2>
      <p>Your payment terms are the steering wheel for your business's cash flow. Be explicit, be professional, and don't be afraid to enforce the rules you set.</p>
      
      <p>When you use <a href="/">Invoice-Gen</a>, you can select standard terms from a dropdown, and the system will automatically calculate and display the exact, unambiguous due date for your client.</p>
    `,
    faqs: [
      { q: 'What is the best payment term for freelancers?', a: 'For most freelancers, "Due on Receipt" or "Net 15" are the best terms. They ensure healthy cash flow and set expectations for prompt payment without being overly aggressive.' },
      { q: 'Is "Due on Receipt" too aggressive?', a: 'Not for independent contractors or small services. However, if you are billing a mid-to-large corporation, their accounts payable department simply cannot process a payment same-day. In those cases, Net 15 or Net 30 is more realistic.' },
      { q: 'How do I change payment terms with an existing client?', a: 'To change terms, send a formal email explaining the change (e.g., transitioning from Net 30 to Net 15 to streamline accounting). Provide at least 30 days notice before the new terms take effect on future invoices.' },
      { q: 'What does 1/10 Net 30 mean?', a: 'It means the client can deduct 1% from the total invoice amount if they pay within 10 days; otherwise, the full balance is due in 30 days.' },
      { q: 'Can I refuse to work if an invoice is past its payment terms?', a: 'Yes. It is standard practice to halt all ongoing work for a client if they have invoices that are significantly past due. This is one of your strongest leverage points.' }
    ],
    relatedLinks: [
      { url: '/blog/net-15-vs-net-30-vs-net-60-payment-terms/', text: 'Net 15 vs Net 30 vs Net 60' },
      { url: '/blog/how-to-handle-overdue-unpaid-invoices/', text: 'Handling Overdue Invoices' },
      { url: '/blog/how-to-get-paid-faster-invoices/', text: 'How to Get Paid Faster' },
      { url: '/free-invoice-generator/', text: 'Free Invoice-Gen' },
      { url: '/invoice-creator/', text: 'Online Invoice Creator' }
    ]
  },

  {
    slug: 'how-to-handle-overdue-unpaid-invoices',
    title: 'How to Handle Overdue Invoices Without Losing the Client | Invoice-Gen',
    h1: 'How to Handle Overdue Invoices Without Losing the Client',
    description: 'A step-by-step guide to recovering unpaid invoices. Learn how to write effective payment reminders, enforce late fees, and know when to take legal action.',
    keywords: 'overdue invoice, unpaid invoice, late payment, late invoice email, charge late fees, debt collection',
    category: 'Payment Terms',
    tags: ['Collections', 'Client Management'],
    author: 'Invoice-Gen Editorial Team',
    datePublished: '2026-07-21',
    dateModified: '2026-07-21',
    status: 'draft',
    content: `
      <p>Every freelancer and business owner will eventually experience the sinking feeling of an unpaid invoice. The due date comes and goes, your bank account remains empty, and the client goes radio silent.</p>
      
      <p>Handling overdue invoices is a delicate art. You need the money you earned, but you also don't want to destroy a client relationship over what might be an honest administrative mistake. In this guide, we walk through the step-by-step escalation process to get paid professionally and firmly.</p>

      <h2>Step 1: The Day After (The Friendly Check-in)</h2>
      <p>If an invoice is one or two days late, <strong>assume positive intent</strong>. The invoice may have gone to spam, the accountant might be on vacation, or the client simply forgot.</p>
      
      <p>Send a polite, friendly email. Do not sound accusatory.</p>
      <blockquote>
        <p><em>"Hi [Name], I hope you're having a great week! I'm just checking in to see if you received Invoice #1042 for [Project], which was due yesterday. I've attached it here again for convenience. Let me know if you need anything else to process it!"</em></p>
      </blockquote>

      <h2>Step 2: One Week Late (The Firm Reminder)</h2>
      <p>At 7 days past due, the tone shifts from a casual check-in to a formal administrative reminder. You are no longer asking if they received it; you are asking for a payment status.</p>
      
      <blockquote>
        <p><em>"Hi [Name], this is a reminder that Invoice #1042 is now one week overdue. The outstanding balance is $X,XXX. Could you please provide an update on when this will be paid? A link to pay online is included in the attached PDF."</em></p>
      </blockquote>
      <p>For more templates, see our guide on <a href="/blog/friendly-late-payment-reminder-email-templates/">late payment reminder emails</a>.</p>

      <h2>Step 3: Two to Three Weeks Late (Consequences)</h2>
      <p>If 14 to 21 days have passed, it is time to enforce boundaries. At this stage, you must take two actions:</p>
      <ol>
        <li><strong>Halt all ongoing work:</strong> Do not deliver new assets or perform new services for a client who is severely delinquent. Inform them politely that work will resume once the account is current.</li>
        <li><strong>Apply late fees:</strong> If your contract states you charge a 1.5% late fee per month, calculate the fee, generate a new invoice, and send it to the client.</li>
      </ol>

      <h2>Step 4: The Final Notice & Legal Escalation</h2>
      <p>If the invoice is 30 to 60 days past due and the client is dodging your calls, the relationship is likely over. Your goal now is purely asset recovery.</p>
      
      <p>Send a <strong>Final Demand Letter</strong>. This is a formal document (often sent via certified mail) stating that if the invoice is not paid within 7 days, you will pursue legal action.</p>
      
      <p>If they still do not pay, your options are:</p>
      <ul>
        <li><strong>Small Claims Court:</strong> Effective for smaller amounts, and you usually don't need a lawyer.</li>
        <li><strong>Collections Agency:</strong> They will hound the client for the money, but they will take a massive cut (often 20% to 50%) of whatever they recover.</li>
        <li><strong>Hire a Lawyer:</strong> Have a lawyer draft a demand letter on their letterhead. A letter from a law firm often scares bad clients into paying immediately.</li>
      </ul>

      <h2>How to Prevent Overdue Invoices in the Future</h2>
      <p>The best way to handle overdue invoices is to prevent them from happening in the first place. Follow this checklist:</p>
      <ul>
        <li><strong>Require upfront deposits:</strong> Never do 100% of the work on credit. Always require 25% to 50% upfront.</li>
        <li><strong>Set clear payment terms:</strong> Make sure the client signs off on your terms before work begins. Read our guide on <a href="/blog/invoice-payment-terms-explained/">payment terms explained</a>.</li>
        <li><strong>Use automated reminders:</strong> Take the emotion out of it by using software that automatically sends reminder emails 3 days before, on the day of, and 3 days after the due date.</li>
        <li><strong>Offer easy payment methods:</strong> If a client has to physically mail a check, payment will take weeks. Allow them to pay instantly via credit card or ACH transfer.</li>
      </ul>

      <h2>Summary</h2>
      <p>Don't let unpaid invoices slide. Establish a strict 1-day, 7-day, and 14-day follow-up cadence, and never continue working for a client who refuses to pay for past deliverables.</p>
    `,
    faqs: [
      { q: 'Can I legally charge late fees on an invoice?', a: 'Yes, but only if the late fee policy was clearly stated in the contract or agreement signed by the client before the work commenced. You cannot retroactively invent a late fee.' },
      { q: 'How long should I wait before sending a reminder?', a: 'Send a gentle, friendly reminder the day after the due date. Send a firmer reminder at 7 days past due.' },
      { q: 'What do I do if a client simply ignores my emails?', a: 'If emails are ignored, pick up the phone. A direct phone call is much harder to ignore than an email. If they still dodge you, send a physical certified letter.' },
      { q: 'Is it worth sending a client to collections?', a: 'Only as a last resort. Collections agencies take a large percentage of the recovered funds (often 30-50%). For smaller amounts, small claims court might be more cost-effective.' },
      { q: 'Can I withhold deliverables until I am paid?', a: 'Yes. Unless your contract explicitly states otherwise, withholding final high-resolution files, source code, or launch credentials until the final invoice is paid is standard industry practice.' }
    ],
    relatedLinks: [
      { url: '/blog/friendly-late-payment-reminder-email-templates/', text: 'Late Payment Email Templates' },
      { url: '/blog/legal-options-when-client-refuses-to-pay/', text: 'Legal Options for Unpaid Invoices' },
      { url: '/blog/charging-late-fees-terms-and-best-practices/', text: 'Charging Late Fees' },
      { url: '/blog/invoice-payment-terms-explained/', text: 'Payment Terms Explained' },
      { url: '/templates/consultant/', text: 'Consultant Invoice Template' }
    ]
  },

  {
    slug: 'freelance-invoice-checklist-before-sending',
    title: 'The Ultimate Freelance Invoice Checklist: 10 Things to Verify | Invoice-Gen',
    h1: 'The Ultimate Freelance Invoice Checklist: 10 Things to Verify Before Sending',
    description: 'Don\'t send that invoice yet! Use this 10-point freelance invoice checklist to ensure accuracy, professionalism, and rapid payment.',
    keywords: 'freelance invoice checklist, invoice checklist, what to include on invoice, invoice review, freelance billing',
    category: 'Freelancer Invoicing',
    tags: ['Freelancing', 'Best Practices'],
    author: 'Invoice-Gen Editorial Team',
    datePublished: '2026-07-22',
    dateModified: '2026-07-22',
    status: 'draft',
    content: `
      <p>Hitting "send" on an invoice is the most satisfying part of a freelance project. But if you rush the process, a single typo or missing detail can cause your invoice to be rejected by the client's accounting department, delaying your payment by weeks.</p>
      
      <p>Before you email your next bill, run it through this 10-point freelance invoice checklist to guarantee it is processed quickly and without friction.</p>

      <h2>The 10-Point Invoice Checklist</h2>

      <h3>1. Is the Invoice Number Unique and Sequential?</h3>
      <p>Ensure this invoice number follows directly from your last one (e.g., if the last was 1042, this must be 1043). Never repeat a number, and never leave this field blank. Read more on <a href="/blog/invoice-number-best-practices/">invoice number best practices</a>.</p>

      <h3>2. Are Both the Invoice Date and Due Date Clear?</h3>
      <p>Don't just write "Net 30." Explicitly write out both dates. <em>"Invoice Date: Oct 1, 2026. Due Date: Oct 31, 2026."</em> This removes all ambiguity regarding when you expect the funds.</p>

      <h3>3. Is the Client's Billing Info 100% Correct?</h3>
      <p>Address the invoice to the correct legal entity, not just the brand name. Include the specific contact person's name (or the Accounts Payable department) and their physical address. A wrong company name will get your invoice instantly rejected.</p>

      <h3>4. Are the Line Items Detailed?</h3>
      <p>Avoid vague descriptions like "Services rendered" or "Web Design." Break the project down. <em>"Homepage UI Design - 10 hours at $50/hr."</em> If the client has to ask what they are paying for, your payment will be delayed.</p>

      <h3>5. Is the Math Flawless?</h3>
      <p>Double-check your subtotals, applied discounts, and tax percentages. Even a one-cent rounding error can cause an automated enterprise accounting system to reject the document.</p>

      <h3>6. Are Your Payment Terms Stated?</h3>
      <p>Reiterate your late fee policy at the bottom of the invoice. <em>"Note: A 1.5% monthly late fee applies to balances past due."</em></p>

      <h3>7. Are Your Payment Details Easy to Find?</h3>
      <p>Tell the client exactly how to pay you. If you want a bank transfer, list your Account Number and Routing Number (or IBAN/SWIFT for <a href="/blog/how-to-invoice-international-clients/">international clients</a>). If you want them to pay by credit card, ensure the payment link is highly visible and clickable in the PDF.</p>

      <h3>8. Did You Include a Purchase Order (PO) Number?</h3>
      <p>If your client provided a Purchase Order number before the project started, you <strong>must</strong> include it on the invoice. Corporate accounting departments will simply refuse to pay invoices that lack a matching PO number.</p>

      <h3>9. Did You Include a Polite "Thank You"?</h3>
      <p>Professionalism matters. A simple <em>"Thank you for your business!"</em> in the notes section leaves a positive final impression and increases the likelihood of repeat work.</p>

      <h3>10. Is It Saved as a Non-Editable PDF?</h3>
      <p>Never send an invoice as a Word document (.docx) or an Excel spreadsheet (.xlsx). These can be easily altered, accidentally or maliciously. Always export your invoice as a locked PDF document.</p>

      <h2>Summary</h2>
      <p>Taking 60 seconds to review this checklist before sending can save you weeks of frustrating email chains and delayed cash flow. Treat your invoices with the same attention to detail that you give your actual client work.</p>
      
      <p>Want to skip the manual checks? Use <a href="/">Invoice-Gen</a>. Our free tool automatically calculates the math, formats the dates, and generates a pristine, locked PDF ready for your client.</p>
    `,
    faqs: [
      { q: 'What format should I send my invoice in?', a: 'Always send your invoice as a PDF file. PDFs ensure your formatting looks exactly the same on the client\'s computer and prevents accidental edits to amounts or banking details.' },
      { q: 'Should I attach the invoice or link to it?', a: 'It is best practice to attach the PDF directly to the email. Links to cloud storage or invoicing portals can expire, require logins, or get flagged by corporate spam filters.' },
      { q: 'What should my email subject line be?', a: 'Keep it clear and searchable. Standard format: "Invoice #[Number] from [Your Name/Company] for [Project Name]". For example: "Invoice #1043 from Jane Doe for Q3 Copywriting".' },
      { q: 'Can I use a free tool to generate invoices?', a: 'Yes! You do not need expensive accounting software to generate professional invoices. Free tools like Invoice-Gen allow you to create compliant, beautifully formatted PDF invoices instantly.' },
      { q: 'Do I need to include my address if I work from home?', a: 'Yes. An invoice is a formal business document, and both the supplier\'s and buyer\'s addresses are required for it to be valid for tax and accounting purposes.' }
    ],
    relatedLinks: [
      { url: '/blog/essential-fields-to-include-on-invoice/', text: 'Essential Invoice Fields' },
      { url: '/blog/common-invoice-mistakes-avoid/', text: 'Common Invoice Mistakes' },
      { url: '/blog/how-to-write-freelance-invoice/', text: 'How to Write a Freelance Invoice' },
      { url: '/blog/invoice-number-best-practices/', text: 'Invoice Numbering Rules' },
      { url: '/templates/freelance/', text: 'Freelance Invoice Template' }
    ]
  }
  ,
  {
    slug: 'how-to-create-your-first-invoice',
    title: 'How to Create Your First Invoice (Step-by-Step) | Invoice-Gen',
    h1: 'How to Create Your First Invoice (Step-by-Step)',
    description: 'Sending your first invoice? Follow this step-by-step guide to create a professional invoice that guarantees you get paid on time.',
    keywords: 'how to create an invoice, first invoice, make an invoice, freelance invoice',
    category: 'Invoice Fundamentals',
    tags: ['Beginner', 'Freelancing'],
    author: 'Invoice-Gen Editorial Team',
    datePublished: '2026-07-13',
    dateModified: '2026-07-13',
    status: 'published',
    content: `
      <p>Creating your first invoice can feel intimidating, but it is a vital step in establishing your business. A clear, professional invoice ensures you get paid quickly and sets a standard for your client relationships.</p>
      <h2>Step 1: Choose Your Tool</h2>
      <p>While you can use Word or Excel, a dedicated tool like Invoice-Gen ensures your math is perfect and the formatting is professional.</p>
      <h2>Step 2: Add Your Information</h2>
      <p>Include your business name, address, and contact information. Your client needs to know exactly who is billing them.</p>
      <h2>Step 3: Add Client Details</h2>
      <p>Clearly state who you are billing. Include the contact person's name if dealing with a larger company.</p>
      <h2>Step 4: Itemize Your Services</h2>
      <p>Don't just write "Web Design". Break down your services into line items with quantities and hourly rates so the client understands the value.</p>
      <h2>Step 5: Define Payment Terms</h2>
      <p>Specify exactly when payment is due (e.g., Net 30) and how they should pay you.</p>
    `,
    faqs: [
      { q: 'What is the best way to send an invoice?', a: 'Always send it as a non-editable PDF via email.' }
    ],
    relatedLinks: []
  },
  {
    slug: 'anatomy-of-a-perfect-invoice',
    title: 'The Anatomy of a Perfect Invoice | Invoice-Gen',
    h1: 'The Anatomy of a Perfect Invoice',
    description: 'Discover the exact elements that make up a perfect invoice, reducing payment delays and improving professional credibility.',
    keywords: 'perfect invoice, invoice layout, invoice anatomy, professional invoice',
    category: 'Invoice Fundamentals',
    tags: ['Design', 'Best Practices'],
    author: 'Invoice-Gen Editorial Team',
    datePublished: '2026-07-13',
    dateModified: '2026-07-13',
    status: 'draft',
    content: `
      <p>A perfect invoice leaves no room for questions. When a client receives it, they should immediately know what it is for, how much is owed, and how to pay.</p>
      <h2>1. The Header</h2>
      <p>Your logo, the word "INVOICE", and the unique Invoice Number should be prominent.</p>
      <h2>2. The Dates</h2>
      <p>Always include the Issue Date and the Due Date. Highlighting the due date in bold can speed up payments.</p>
      <h2>3. The Itemized Table</h2>
      <p>A clear table structure with Description, Quantity, Rate, and Amount.</p>
      <h2>4. The Totals Section</h2>
      <p>Clearly separate the Subtotal, Taxes, Discounts, and the Final Total Due.</p>
    `,
    faqs: [
      { q: 'Should I include a logo on my invoice?', a: 'Yes, a logo adds credibility and reinforces your brand.' }
    ],
    relatedLinks: []
  },
  {
    slug: 'how-to-write-thank-you-note-on-invoice',
    title: 'How to Write a Thank You Note on an Invoice | Invoice-Gen',
    h1: 'How to Write a Thank You Note on an Invoice',
    description: 'Learn why adding a thank you note to your invoice increases on-time payments and builds stronger client relationships.',
    keywords: 'invoice thank you note, invoice message, what to write on an invoice',
    category: 'Invoice Fundamentals',
    tags: ['Client Relations', 'Best Practices'],
    author: 'Invoice-Gen Editorial Team',
    datePublished: '2026-07-13',
    dateModified: '2026-07-13',
    status: 'draft',
    content: `
      <p>A simple "Thank you for your business" can go a long way. Studies show that polite invoices get paid faster.</p>
      <h2>Keep It Professional</h2>
      <p>Avoid being overly casual unless you have a close relationship with the client. "It was a pleasure working with your team on this project" is universally acceptable.</p>
      <h2>Where to Put It</h2>
      <p>The best place is in the "Notes" section at the bottom of the invoice, just below the totals.</p>
    `,
    faqs: [
      { q: 'Does a polite note really help get paid faster?', a: 'Yes, psychological studies have shown that adding "Thank You" or "Please pay within 30 days" can increase payment speed.' }
    ],
    relatedLinks: []
  },
  {
    slug: 'invoice-vs-bill-vs-statement-differences',
    title: 'Invoice vs Bill vs Statement: Key Differences Explained | Invoice-Gen',
    h1: 'Invoice vs Bill vs Statement: Key Differences Explained',
    description: 'Confused about the difference between an invoice, a bill, and a statement? We break down the terminology so you can bill correctly.',
    keywords: 'invoice vs bill, invoice vs statement, difference between bill and invoice',
    category: 'Invoice Fundamentals',
    tags: ['Terminology', 'Accounting'],
    author: 'Invoice-Gen Editorial Team',
    datePublished: '2026-07-13',
    dateModified: '2026-07-13',
    status: 'draft',
    content: `
      <p>While often used interchangeably in casual conversation, these three financial documents serve distinct legal and accounting purposes.</p>
      <h2>The Invoice</h2>
      <p>Sent by a seller to a buyer to request payment. It itemizes the transaction.</p>
      <h2>The Bill</h2>
      <p>A bill is just an invoice viewed from the buyer's perspective. When you receive an invoice, it becomes a bill you have to pay.</p>
      <h2>The Statement</h2>
      <p>A statement of account is a summary of all transactions (invoices, payments, credits) over a specific period, usually sent monthly to clients with ongoing accounts.</p>
    `,
    faqs: [
      { q: 'Can I use the word "Bill" instead of "Invoice"?', a: 'Legally yes, but "Invoice" is the professional standard for B2B transactions.' }
    ],
    relatedLinks: []
  },
  {
    slug: 'how-to-include-discounts-on-invoice',
    title: 'How to Include Discounts on an Invoice | Invoice-Gen',
    h1: 'How to Include Discounts on an Invoice',
    description: 'Learn the proper accounting methods for applying discounts to your invoices without confusing your clients or messing up your tax reporting.',
    keywords: 'invoice discount, how to discount an invoice, early payment discount',
    category: 'Invoice Fundamentals',
    tags: ['Pricing', 'Best Practices'],
    author: 'Invoice-Gen Editorial Team',
    datePublished: '2026-07-13',
    dateModified: '2026-07-13',
    status: 'draft',
    content: `
      <p>Offering a discount can be a great way to reward loyalty or incentivize early payment. However, it must be documented correctly.</p>
      <h2>Line-Item Discounts vs Subtotal Discounts</h2>
      <p>You can apply a discount to a specific line item, or to the entire subtotal. Make sure the discount is applied BEFORE tax is calculated in most jurisdictions.</p>
      <h2>Early Payment Discounts (e.g., 2/10 Net 30)</h2>
      <p>This means the client gets a 2% discount if they pay within 10 days; otherwise, the full amount is due in 30 days. Clearly state these terms in the Notes section.</p>
    `,
    faqs: [
      { q: 'Should discounts be applied before or after tax?', a: 'In almost all jurisdictions, discounts must be applied to the subtotal before sales tax is calculated.' }
    ],
    relatedLinks: []
  }
];

module.exports = ARTICLES;
