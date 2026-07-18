import { SEO } from '../components/seo/SEO';
import { AppLayout } from '../components/layout/AppLayout';
import { PurchaseOrderGenerator } from '../components/generator/PurchaseOrderGenerator';

export default function PurchaseOrderPage() {
  return (
    <>
      <SEO 
        title="Free Purchase Order Generator & Maker | Invoice-Gen.net"
        description="Create professional PDF purchase orders instantly. 100% free, secure, browser-based purchase order generator with no signup required."
        canonicalUrl="https://invoice-gen.net/purchase-order-generator"
      />
      <AppLayout>
        <PurchaseOrderGenerator />
        
        {/* SEO Text Block */}
        <section style={{ maxWidth: '800px', margin: '60px auto 40px', padding: '0 24px', color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', textAlign: 'center' }}>
          <h1 className="sr-only">Free Online Purchase Order Generator & Maker</h1>
          <p style={{ marginBottom: '16px' }}>
            Looking for a fast, secure, and professional <strong>Purchase Order Maker</strong>? Invoice-Gen.net is the ultimate <strong>Online Purchase Order Generator</strong> designed for modern businesses. Streamline your procurement process, manage vendors, and create customized <strong>Purchase Order Templates</strong> for every need.
          </p>
          <p>
            Unlike complicated procurement software, our tool is 100% free and runs entirely in your browser. Create your document, preview it instantly, and download a high-quality <strong>PDF Purchase Order</strong> with a single click. Keep your ordering simple, secure, and professional.
          </p>
        </section>
      </AppLayout>
    </>
  );
}
