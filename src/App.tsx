import { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
const TemplateGalleryPage = lazy(() => import('./pages/TemplateGalleryPage').then(module => ({ default: module.TemplateGalleryPage })));
const TemplateDetailPage = lazy(() => import('./pages/TemplateDetailPage').then(module => ({ default: module.TemplateDetailPage })));
const AboutPage = lazy(() => import('./pages/LegalPages').then(module => ({ default: module.AboutPage })));
const PrivacyPage = lazy(() => import('./pages/LegalPages').then(module => ({ default: module.PrivacyPage })));
const TermsPage = lazy(() => import('./pages/LegalPages').then(module => ({ default: module.TermsPage })));
const TrustPage = lazy(() => import('./pages/LegalPages').then(module => ({ default: module.TrustPage })));
const BlogHomePage = lazy(() => import('./pages/ContentDirectoryPages').then(module => ({ default: module.BlogHomePage })));
const CompareHomePage = lazy(() => import('./pages/ContentDirectoryPages').then(module => ({ default: module.CompareHomePage })));

export default function App() {
  return (
    <Suspense fallback={null}>
      <Routes>
        {/* Phase 1: Main Product */}
        <Route path="/" element={<HomePage />} />
        
        {/* Phase 3 & 4: Templates */}
        <Route path="/templates" element={<TemplateGalleryPage />} />
        <Route path="/templates/:id" element={<TemplateDetailPage />} />
        
        {/* Phase 6 & 7: Content & Comparison */}
        <Route path="/blog" element={<BlogHomePage />} />
        <Route path="/compare" element={<CompareHomePage />} />
        
        {/* Phase 9: E-E-A-T / Trust Pages */}
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/trust" element={<TrustPage />} />
        
        {/* Fallback to home for anything else */}
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Suspense>
  );
}
