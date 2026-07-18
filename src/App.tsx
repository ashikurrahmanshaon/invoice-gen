import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import HomePage from './pages/HomePage';
const PurchaseOrderPage = lazy(() => import('./pages/PurchaseOrderPage'));
const QuotePage = lazy(() => import('./pages/QuotePage'));
const EstimatePage = lazy(() => import('./pages/EstimatePage'));

const AboutPage = lazy(() => import('./pages/LegalPages').then(module => ({ default: module.AboutPage })));
const PrivacyPage = lazy(() => import('./pages/LegalPages').then(module => ({ default: module.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/LegalPages').then(module => ({ default: module.TermsPage })));
const TrustPage = lazy(() => import('./pages/LegalPages').then(module => ({ default: module.TrustPage })));
const ContactPage = lazy(() => import('./pages/LegalPages').then(module => ({ default: module.ContactPage })));
const BlogHomePage = lazy(() => import('./pages/ContentDirectoryPages').then(module => ({ default: module.BlogHomePage })));
const CompareHomePage = lazy(() => import('./pages/ContentDirectoryPages').then(module => ({ default: module.CompareHomePage })));
const CompareDetailPage = lazy(() => import('./pages/CompareDetailPage'));
const TemplateGalleryPage = lazy(() => import('./pages/TemplateGalleryPage').then(module => ({ default: module.TemplateGalleryPage })));

const ContentPreviewPage = lazy(() => import('./pages/ContentPreviewPage'));

// Premium SEO Pages
const PremiumSEOPage = lazy(() => import('./pages/PremiumSEOPage'));

declare global {
  interface Window {
    dataLayer: any[];
  }
}

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

export default function App() {
  return (
    <Suspense fallback={null}>
      <GTMRouteTracker />
      <Routes>
        {/* Phase 1: Main Product */}
        <Route path="/" element={<HomePage />} />
        <Route path="/purchase-order-generator" element={<PurchaseOrderPage />} />
        <Route path="/quote-generator" element={<QuotePage />} />
        <Route path="/estimate-generator" element={<EstimatePage />} />
        {/* Redirects */}
        <Route path="/tools" element={<HomePage />} />
        
        {/* Phase 6 & 7: Content & Comparison */}
        <Route path="/blog" element={<BlogHomePage />} />
        <Route path="/blog/:slug" element={<PremiumSEOPage />} />
        
        {/* Templates */}
        <Route path="/templates" element={<TemplateGalleryPage />} />
        <Route path="/templates/:slug" element={<PremiumSEOPage />} />

        <Route path="/compare" element={<CompareHomePage />} />
        <Route path="/compare/:id" element={<CompareDetailPage />} />
        
        {/* Phase 9: E-E-A-T / Trust Pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/trust-center" element={<PremiumSEOPage />} />
        <Route path="/trust" element={<TrustPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Premium SEO Landing Pages */}
        <Route path="/resources/:slug" element={<PremiumSEOPage />} />
        <Route path="/invoice-types/:slug" element={<PremiumSEOPage />} />
        <Route path="/tools/:slug" element={<PremiumSEOPage />} />
        
        {/* Development Routes */}
        {import.meta.env.DEV && (
          <Route path="/content-preview" element={<ContentPreviewPage />} />
        )}
        
        {/* Fallback to home for anything else */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Suspense>
  );
}
