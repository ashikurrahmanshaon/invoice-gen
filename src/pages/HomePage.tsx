
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
      </AppLayout>
    </>
  );
}
