
import { SEO } from '../components/seo/SEO';
import { AppLayout } from '../components/layout/AppLayout';
import { InvoiceGenerator } from '../components/generator/InvoiceGenerator';

export default function HomePage() {
  return (
    <>
      <SEO 
        title="Free Professional Invoice Generator | Invoice-Gen.net"
        description="Create professional PDF invoices instantly with Invoice-Gen.net. 100% free, secure, browser-based invoice creator with no signup required."
        canonicalUrl="https://invoice-gen.net/"
      />
      <AppLayout>
        <InvoiceGenerator />
        
        {/* SEO Text Block */}
        <section style={{ maxWidth: '800px', margin: '60px auto 40px', padding: '0 24px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', textAlign: 'center' }}>
          <h1 className="sr-only">Free Online Invoice Generator & Maker</h1>
          <p style={{ marginBottom: '16px' }}>
            Looking for a fast, secure, and professional <strong>Invoice Maker</strong>? Invoice-Gen.net is the ultimate <strong>Online Invoice Generator</strong> designed for modern professionals. Whether you need a <strong>Business Invoice</strong> for corporate clients, a <strong>Freelancer Invoice</strong> for gig work, or a customized <strong>Consultant Invoice</strong>, our platform offers the perfect <strong>Invoice Template</strong> for every need.
          </p>
          <p>
            Unlike complicated <strong>Invoice Software</strong> or expensive <strong>Invoice Apps</strong>, our tool is 100% free and runs entirely in your browser. Create your document, preview it instantly, and download a high-quality <strong>PDF Invoice</strong> with a single click. Keep your billing simple, secure, and professional.
          </p>
        </section>
      </AppLayout>
    </>
  );
}
