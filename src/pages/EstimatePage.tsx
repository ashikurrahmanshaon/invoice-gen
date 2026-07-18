import { SEO } from '../components/seo/SEO';
import { AppLayout } from '../components/layout/AppLayout';
import { EstimateGenerator } from '../components/generator/EstimateGenerator';

export default function EstimatePage() {
  return (
    <>
      <SEO 
        title="Free Estimate Generator & Maker | Invoice-Gen.net"
        description="Create professional PDF estimates instantly. 100% free, secure, browser-based estimate generator with no signup required."
        canonicalUrl="https://invoice-gen.net/estimate-generator"
      />
      <AppLayout>
        <EstimateGenerator />
        
        {/* SEO Text Block */}
        <section style={{ maxWidth: '800px', margin: '60px auto 40px', padding: '0 24px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', textAlign: 'center' }}>
          <h1 className="sr-only">Free Online Estimate Generator & Maker</h1>
          <p style={{ marginBottom: '16px' }}>
            Looking for a fast, secure, and professional <strong>Estimate Maker</strong>? Invoice-Gen.net is the ultimate <strong>Online Estimate Generator</strong> designed for modern businesses. Streamline your sales process, pitch clients effectively, and create customized <strong>Estimate Templates</strong> for every project.
          </p>
          <p>
            Unlike complicated accounting software, our tool is 100% free and runs entirely in your browser. Create your document, preview it instantly, and download a high-quality <strong>PDF Estimate</strong> with a single click. Keep your proposals simple, secure, and professional.
          </p>
        </section>
      </AppLayout>
    </>
  );
}
