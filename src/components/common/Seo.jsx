import { useEffect } from 'react';

// Dependency-free per-page SEO. Sets <title>, meta description/keywords,
// canonical, Open Graph + Twitter cards, and optional JSON-LD structured data.
// Google renders client-side React, so these are picked up on each route.

export const SITE_URL = 'https://menler.in';
export const SITE_NAME = 'Menler';
const DEFAULT_DESC =
  "India's Claude-native AI fellowship. Learn AI, ship real projects, and get placement support — Generalist, Engineering, and the Gen AI Kickstarter.";

function upsertMeta(selectorAttr, key, content) {
  const selector = `meta[${selectorAttr}="${key}"]`;
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(selectorAttr, key);
    el.setAttribute('data-seo', '');
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

export default function Seo({ title, description, keywords, path, image, jsonLd }) {
  const ldString = jsonLd ? JSON.stringify(jsonLd) : '';
  useEffect(() => {
    const fullTitle = title || `${SITE_NAME} — AI Learning India`;
    const desc = description || DEFAULT_DESC;
    const url = SITE_URL + (path != null ? path : window.location.pathname);
    const img = image || `${SITE_URL}/favicon.svg`;

    document.title = fullTitle;
    upsertMeta('name', 'description', desc);
    if (keywords) upsertMeta('name', 'keywords', keywords);
    upsertLink('canonical', url);

    // Open Graph
    upsertMeta('property', 'og:title', fullTitle);
    upsertMeta('property', 'og:description', desc);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:url', url);
    upsertMeta('property', 'og:site_name', SITE_NAME);
    upsertMeta('property', 'og:image', img);

    // Twitter
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', fullTitle);
    upsertMeta('name', 'twitter:description', desc);
    upsertMeta('name', 'twitter:image', img);

    // JSON-LD structured data (page-specific)
    let ld;
    if (ldString) {
      ld = document.createElement('script');
      ld.type = 'application/ld+json';
      ld.setAttribute('data-seo-ld', '');
      ld.text = ldString;
      document.head.appendChild(ld);
    }
    return () => { if (ld) ld.remove(); };
  }, [title, description, keywords, path, image, ldString]);

  return null;
}
