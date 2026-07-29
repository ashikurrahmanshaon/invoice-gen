import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import HomePage from './pages/HomePage';
import PurchaseOrderPage from './pages/PurchaseOrderPage';
import QuotePage from './pages/QuotePage';
import EstimatePage from './pages/EstimatePage';

import { AboutPage, PrivacyPage, TermsPage, TrustPage, ContactPage } from './pages/LegalPages';
import { BlogHomePage, CompareHomePage } from './pages/ContentDirectoryPages';
import CompareDetailPage from './pages/CompareDetailPage';
import { TemplateGalleryPage } from './pages/TemplateGalleryPage';
import GuidesPage from './pages/GuidesPage';
import PremiumSEOPage from './pages/PremiumSEOPage';

function GTMRouteTracker() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.dataLayer) {
      window.dataLayer.push({
        event: 'page_view',
        page_path: location.pathname + location.search
      });
    }
  }, [location]);

  return null;
}

export default function AppServer() {
  return (
    <Suspense fallback={null}>
      <GTMRouteTracker />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/invoice-generator" element={<HomePage canonicalUrl="https://invoice-gen.net/invoice-generator" />} />
        <Route path="/purchase-order-generator" element={<PurchaseOrderPage />} />
        <Route path="/quote-generator" element={<QuotePage />} />
        <Route path="/estimate-generator" element={<EstimatePage />} />
        <Route path="/tools" element={<HomePage />} />
        
        <Route path="/guides" element={<GuidesPage />} />
        <Route path="/blog" element={<BlogHomePage />} />
        <Route path="/blog/:slug" element={<PremiumSEOPage />} />
        
        <Route path="/templates" element={<TemplateGalleryPage />} />
        <Route path="/templates/:slug" element={<PremiumSEOPage />} />

        <Route path="/compare" element={<CompareHomePage />} />
        <Route path="/compare/:id" element={<CompareDetailPage />} />
        
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/trust-center" element={<PremiumSEOPage />} />
        <Route path="/trust" element={<TrustPage />} />
        <Route path="/contact" element={<ContactPage />} />

        <Route path="/resources/:slug" element={<PremiumSEOPage />} />
        <Route path="/invoice-types/:slug" element={<PremiumSEOPage />} />
        <Route path="/tools/:slug" element={<PremiumSEOPage />} />
        
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Suspense>
  );
}
