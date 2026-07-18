import { Suspense, lazy, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import HomePage from './pages/HomePage';

const AboutPage = lazy(() => import('./pages/LegalPages').then(module => ({ default: module.AboutPage })));
const PrivacyPage = lazy(() => import('./pages/LegalPages').then(module => ({ default: module.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/LegalPages').then(module => ({ default: module.TermsPage })));
const TrustPage = lazy(() => import('./pages/LegalPages').then(module => ({ default: module.TrustPage })));
const ContactPage = lazy(() => import('./pages/LegalPages').then(module => ({ default: module.ContactPage })));
const BlogHomePage = lazy(() => import('./pages/ContentDirectoryPages').then(module => ({ default: module.BlogHomePage })));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const CompareHomePage = lazy(() => import('./pages/ContentDirectoryPages').then(module => ({ default: module.CompareHomePage })));
const CompareDetailPage = lazy(() => import('./pages/CompareDetailPage'));
const TemplateGalleryPage = lazy(() => import('./pages/TemplateGalleryPage').then(module => ({ default: module.TemplateGalleryPage })));
const TemplateDetailPage = lazy(() => import('./pages/TemplateDetailPage').then(module => ({ default: module.TemplateDetailPage })));

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
        {/* Redirects */}
        <Route path="/tools" element={<HomePage />} />
        
        {/* Phase 6 & 7: Content & Comparison */}
        <Route path="/blog" element={<BlogHomePage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        
        {/* Templates */}
        <Route path="/templates" element={<TemplateGalleryPage />} />
        <Route path="/templates/:id" element={<TemplateDetailPage />} />

        <Route path="/compare" element={<CompareHomePage />} />
        <Route path="/compare/:id" element={<CompareDetailPage />} />
        
        {/* Phase 9: E-E-A-T / Trust Pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/trust-center" element={<PremiumSEOPage category="company" />} />
        <Route path="/trust" element={<TrustPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Premium SEO Landing Pages */}
        <Route path="/resources/:slug" element={<PremiumSEOPage category="resources" />} />
        <Route path="/invoice-types/:slug" element={<PremiumSEOPage category="invoice-types" />} />
        <Route path="/tools/:slug" element={<PremiumSEOPage category="tools" />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Fallback to home for anything else */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Suspense>
  );
}
