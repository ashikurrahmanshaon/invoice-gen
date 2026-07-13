import React from 'react';
import { ContentPage } from '../components/layout/ContentPage';

export const AboutPage: React.FC = () => (
  <ContentPage title="About Invoice-Gen.net" description="Learn about the team and mission behind Invoice-Gen.net, the free privacy-first invoice generator." urlPath="/about">
    <p>Invoice-Gen.net was built with a simple mission: to provide freelancers and small businesses with the most professional, fastest, and most secure invoicing tool on the web.</p>
    <p>We believe that generating a basic business document shouldn't require a monthly subscription or forcing you to surrender your client's data to a third-party server.</p>
    <p>That's why Invoice-Gen.net runs entirely in your browser. Your data never leaves your device.</p>
  </ContentPage>
);

export const PrivacyPage: React.FC = () => (
  <ContentPage title="Privacy Policy" description="Read the privacy policy for Invoice-Gen.net. We believe your business data belongs to you." urlPath="/privacy">
    <h2>1. Data Storage</h2>
    <p>Invoice-Gen.net is designed to be privacy-first. All invoice data, business details, and client information you enter are processed locally in your web browser and stored in your browser's local storage.</p>
    <h2>2. Analytics</h2>
    <p>We use minimal, anonymized analytics (Google Analytics and Microsoft Clarity) to understand how the product is used and to improve the user experience. All session recording tools are configured to aggressively mask text inputs, ensuring your sensitive invoice data is never recorded or transmitted.</p>
    <h2>3. Third-Party Services</h2>
    <p>We do not sell, rent, or share your personal data with any third parties.</p>
  </ContentPage>
);

export const TermsPage: React.FC = () => (
  <ContentPage title="Terms of Service" description="Terms of service and usage guidelines for Invoice-Gen.net." urlPath="/terms">
    <h2>1. Acceptance of Terms</h2>
    <p>By accessing and using Invoice-Gen.net, you agree to be bound by these Terms of Service. This is a free utility provided "as is" without any warranties.</p>
    <h2>2. Usage Restrictions</h2>
    <p>You may use this tool to generate invoices for your legitimate business purposes. You may not attempt to reverse engineer, scrape, or abuse the service.</p>
    <h2>3. Limitation of Liability</h2>
    <p>We are not responsible for any financial discrepancies, tax issues, or legal disputes arising from the use of invoices generated on this platform. It is your responsibility to ensure your invoices comply with your local tax laws.</p>
  </ContentPage>
);

export const TrustPage: React.FC = () => (
  <ContentPage title="Trust Center" description="Security, compliance, and reliability information for Invoice-Gen.net." urlPath="/trust">
    <p>Security is the foundation of Invoice-Gen.net. Because our application is a 100% client-side application, the attack surface for data breaches is effectively zero.</p>
    <ul>
      <li><strong>No Database:</strong> We do not have a backend database storing your client details.</li>
      <li><strong>No Accounts:</strong> You do not need to create a password or link an identity provider.</li>
      <li><strong>Client-Side PDF Generation:</strong> PDF files are generated dynamically inside your browser memory.</li>
    </ul>
  </ContentPage>
);
