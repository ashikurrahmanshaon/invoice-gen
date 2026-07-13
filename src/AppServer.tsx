import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { TemplateGalleryPage } from './pages/TemplateGalleryPage';
import { TemplateDetailPage } from './pages/TemplateDetailPage';
import { AboutPage, PrivacyPage, TermsPage, TrustPage } from './pages/LegalPages';
import { BlogHomePage, CompareHomePage } from './pages/ContentDirectoryPages';

export default function AppServer() {
  return (
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
  );
}
