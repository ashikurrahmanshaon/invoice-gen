import { SEO } from '../components/seo/SEO';
import { AppLayout } from '../components/layout/AppLayout';
import { QuoteGenerator } from '../components/generator/QuoteGenerator';

export default function QuotePage() {
  return (
    <>
      <SEO 
        title="Free Quote Generator & Maker | Invoice-Gen.net"
        description="Create professional PDF quotes instantly. 100% free, secure, browser-based quote generator with no signup required."
        canonicalUrl="https://invoice-gen.net/quote-generator"
      />
      <AppLayout>
        <QuoteGenerator />
        
        {/* SEO Text Block */}
        <section style={{ maxWidth: '800px', margin: '60px auto 40px', padding: '0 24px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', textAlign: 'center' }}>
          <h1 className="sr-only">Free Online Quote Generator & Maker</h1>
          <p style={{ marginBottom: '16px' }}>
            Looking for a fast, secure, and professional <strong>Quote Maker</strong>? Invoice-Gen.net is the ultimate <strong>Online Quote Generator</strong> designed for modern businesses. Streamline your sales process, pitch clients effectively, and create customized <strong>Quote Templates</strong> for every project.
          </p>
          <p>
            Unlike complicated accounting software, our tool is 100% free and runs entirely in your browser. Create your document, preview it instantly, and download a high-quality <strong>PDF Quote</strong> with a single click. Keep your proposals simple, secure, and professional.
          </p>
        </section>
      </AppLayout>
    </>
  );
}
