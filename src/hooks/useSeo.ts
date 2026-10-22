import { useEffect } from 'react';
import { useCMS } from '../context/CMSContext';

const SITE_URL = 'https://digitara.id';

const setMeta = (selector: string, attr: 'name' | 'property', key: string, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

const setLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
};

/**
 * Keeps the document head in sync with the live CMS content so crawlers,
 * social previews and the browser tab always reflect what is published.
 */
export const useSeo = () => {
  const { data } = useCMS();
  const { config, portfolio, theme } = data;

  const siteName = config.name || 'DIGITARA';
  const title = `${siteName} - ${config.tagline || 'High-End Digital Agency'}`;
  const description =
    config.tagline ||
    'High-end digital agency portfolio and landing page featuring interactive showcases and a real-time headless CMS.';
  const url = SITE_URL;
  const image = `${SITE_URL}/og-image.png`;

  useEffect(() => {
    document.title = title;

    setMeta('meta[name="description"]', 'name', 'description', description);
    setMeta('meta[property="og:title"]', 'property', 'og:title', title);
    setMeta('meta[property="og:description"]', 'property', 'og:description', description);
    setMeta('meta[property="og:url"]', 'property', 'og:url', url);
    setMeta('meta[property="og:image"]', 'property', 'og:image', image);
    setMeta('meta[property="og:site_name"]', 'property', 'og:site_name', siteName);
    setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
    setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
    setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);
    setLink('canonical', `${url}/`);

    const themeColor =
      theme.bgMode === 'light-minimal'
        ? '#FFFFFF'
        : theme.bgMode === 'midnight'
        ? '#060814'
        : theme.bgMode === 'custom' && theme.customColors
        ? theme.customColors.primary
        : '#0A0A0A';
    setMeta('meta[name="theme-color"]', 'name', 'theme-color', themeColor);

    // --- Structured data ---
    const socials = Object.values(config.socials || {}).filter(Boolean);
    const jsonLd = {
      '@context': 'https://schema.org',
      '@graph': [
        {
          '@type': 'Organization',
          '@id': `${url}/#organization`,
          name: siteName,
          alternateName: config.subtext,
          url,
          logo: `${url}/favicon.svg`,
          image: image,
          description,
          email: config.email,
          telephone: config.phone,
          slogan: config.tagline,
          sameAs: socials,
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Jakarta',
            addressCountry: 'ID',
          },
        },
        {
          '@type': 'LocalBusiness',
          '@id': `${url}/#localbusiness`,
          name: siteName,
          url,
          image: image,
          description,
          email: config.email,
          telephone: config.phone,
          priceRange: '$$$',
          address: {
            '@type': 'PostalAddress',
            addressLocality: 'Jakarta',
            addressCountry: 'ID',
          },
          openingHours: 'Mo-Fr 09:00-18:00',
          areaServed: 'Worldwide',
          sameAs: socials,
          parentOrganization: { '@id': `${url}/#organization` },
        },
        {
          '@type': 'WebSite',
          '@id': `${url}/#website`,
          url,
          name: siteName,
          description,
          inLanguage: 'en',
          publisher: { '@id': `${url}/#organization` },
        },
        {
          '@type': 'ItemList',
          '@id': `${url}/#portfolio`,
          name: 'Selected Works',
          numberOfItems: portfolio.items.length,
          itemListElement: portfolio.items.map((item, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            name: item.title,
            url: `${url}/#portfolio`,
            image: item.imageUrl?.startsWith('http') ? item.imageUrl : `${url}${item.imageUrl}`,
          })),
        },
      ],
    };

    let script = document.getElementById('jsonld-digitara') as HTMLScriptElement | null;
    if (!script) {
      script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = 'jsonld-digitara';
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(jsonLd);
  }, [config, portfolio.items, theme]);
};
