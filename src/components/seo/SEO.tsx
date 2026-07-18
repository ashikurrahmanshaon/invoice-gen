import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogType?: 'website' | 'article';
  ogImage?: string;
  twitterCard?: 'summary_large_image' | 'summary';
  schema?: Record<string, any> | Record<string, any>[];
  keywords?: string[];
  noindex?: boolean;
}

export const SEO: React.FC<SEOProps> = ({
  title,
  description,
  canonicalUrl,
  ogType = 'website',
  ogImage = 'https://invoice-gen.net/og-image.webp',
  twitterCard = 'summary_large_image',
  schema,
  keywords = [],
  noindex = false
}) => {
  const fullTitle = title.includes('Invoice-Gen.net') ? title : `${title} | Invoice-Gen.net`;
  
  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {keywords && keywords.length > 0 && (
        <meta name="keywords" content={keywords.join(', ')} />
      )}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {!noindex && <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />}
      
      {/* OpenGraph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      {canonicalUrl && <meta property="og:url" content={canonicalUrl} />}
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Invoice-Gen.net" />
      
      {/* Twitter */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content="@invoice_gen" />
      
      {/* Schema */}
      {schema && (
        <script type="application/ld+json">
          {JSON.stringify(
            Array.isArray(schema) 
              ? { "@context": "https://schema.org", "@graph": schema }
              : { "@context": "https://schema.org", ...schema }
          )}
        </script>
      )}
    </Helmet>
  );
};
