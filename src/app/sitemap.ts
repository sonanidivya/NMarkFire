import { MetadataRoute } from 'next';
import { PRODUCT_CATALOG } from '@/data/mockData';

const BASE_URL = 'https://nmarkfire.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    '',
    '/products',
    '/contact',
    '/about',
    '/services',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const productRoutes = [];
  
  for (const cat of PRODUCT_CATALOG) {
      if (cat.subcategories) {
          for (const sub of cat.subcategories) {
              productRoutes.push({
                  url: `${BASE_URL}/products/${sub.slug}`,
                  lastModified: new Date(),
                  changeFrequency: 'weekly' as const,
                  priority: 0.7,
              });
              if (sub.products) {
                  for (const prod of sub.products) {
                      productRoutes.push({
                        url: `${BASE_URL}/products/${prod.slug}`,
                        lastModified: new Date(),
                        changeFrequency: 'weekly' as const,
                        priority: 0.6,
                      });
                  }
              }
          }
      }
  }

  return [...routes, ...productRoutes];
}
