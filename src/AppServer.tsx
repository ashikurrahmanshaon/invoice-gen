import { Routes, Route, useLocation } from 'react-router-dom';
import { Suspense, useEffect } from 'react';
import HomePage from './pages/HomePage';
import { TemplateGalleryPage } from './pages/TemplateGalleryPage';
import { TemplateDetailPage } from './pages/TemplateDetailPage';
import { AboutPage, PrivacyPage, TermsPage, TrustPage } from './pages/LegalPages';
import { BlogHomePage, CompareHomePage } from './pages/ContentDirectoryPages';

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
      <Route path="/templates" element={<TemplateGalleryPage />} />
      <Route path="/templates/:id" element={<TemplateDetailPage />} />
      <Route path="/blog" element={<BlogHomePage />} />
      <Route path="/compare" element={<CompareHomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/trust" element={<TrustPage />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </Suspense>
  );
}
