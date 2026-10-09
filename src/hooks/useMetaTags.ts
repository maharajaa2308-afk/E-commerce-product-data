import { useEffect } from 'react';

interface MetaOptions {
  title?: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
}

export function useMetaTags({ title, description, ogTitle, ogDescription, ogImage }: MetaOptions) {
  useEffect(() => {
    // Update Title
    const defaultTitle = 'AURA — Premium Tech & Lifestyle Catalog';
    document.title = title ? `${title} | AURA` : defaultTitle;

    // Helper function to set meta tag
    const setMetaTag = (nameAttr: string, valueAttr: string, content?: string) => {
      if (!content) return;
      let element = document.querySelector(`meta[${nameAttr}="${valueAttr}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, valueAttr);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('name', 'description', description || 'Curated collection of high-performance tech and luxury lifestyle essentials.');
    setMetaTag('property', 'og:title', ogTitle || title || defaultTitle);
    setMetaTag('property', 'og:description', ogDescription || description || 'Curated collection of high-performance tech and luxury lifestyle essentials.');
    if (ogImage) {
      setMetaTag('property', 'og:image', ogImage);
    }
  }, [title, description, ogTitle, ogDescription, ogImage]);
}
